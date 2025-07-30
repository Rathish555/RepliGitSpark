import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserProgressSchema, insertAiInsightSchema } from "@shared/schema";
import { generateScenario, generateAIFeedback, generateNextScenarioStep } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current user (for demo, always return user ID 1)
  app.get("/api/user/current", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get all scenarios
  app.get("/api/scenarios", async (req, res) => {
    try {
      const { framework } = req.query;
      let scenarios;
      
      if (framework && framework !== 'all') {
        scenarios = await storage.getScenariosByFramework(framework as string);
      } else {
        scenarios = await storage.getScenarios();
      }
      
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scenarios" });
    }
  });

  // Get specific scenario
  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scenario = await storage.getScenario(id);
      
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scenario" });
    }
  });

  // Generate new scenario with AI
  app.post("/api/scenarios/generate", async (req, res) => {
    try {
      const { framework, difficulty, topic } = req.body;
      
      if (!framework || !difficulty) {
        return res.status(400).json({ message: "Framework and difficulty are required" });
      }

      const generatedScenario = await generateScenario(framework, difficulty, topic);
      
      // Save the generated scenario
      const scenario = await storage.createScenario({
        ...generatedScenario,
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
      });
      
      res.json(scenario);
    } catch (error) {
      console.error("Error generating scenario:", error);
      res.status(500).json({ message: "Failed to generate scenario" });
    }
  });

  // Get user progress for all scenarios
  app.get("/api/user/progress", async (req, res) => {
    try {
      const userId = 1; // For demo, always use user ID 1
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  // Get user progress for specific scenario
  app.get("/api/user/progress/:scenarioId", async (req, res) => {
    try {
      const userId = 1; // For demo, always use user ID 1
      const scenarioId = parseInt(req.params.scenarioId);
      const progress = await storage.getUserProgressForScenario(userId, scenarioId);
      
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scenario progress" });
    }
  });

  // Start or continue scenario
  app.post("/api/scenarios/:id/start", async (req, res) => {
    try {
      const userId = 1; // For demo, always use user ID 1
      const scenarioId = parseInt(req.params.id);
      
      // Check if progress already exists
      let progress = await storage.getUserProgressForScenario(userId, scenarioId);
      
      if (!progress) {
        // Get scenario to determine total steps
        const scenario = await storage.getScenario(scenarioId);
        if (!scenario) {
          return res.status(404).json({ message: "Scenario not found" });
        }
        
        // Create new progress
        progress = await storage.createUserProgress({
          userId,
          scenarioId,
          currentStep: 0,
          totalSteps: (scenario.content as any)?.steps?.length || 1,
          decisions: [],
          completed: false,
          score: 0,
          timeSpent: 0
        });
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error starting scenario:", error);
      res.status(500).json({ message: "Failed to start scenario" });
    }
  });

  // Submit decision for scenario step
  app.post("/api/scenarios/:id/decision", async (req, res) => {
    try {
      const userId = 1; // For demo, always use user ID 1
      const scenarioId = parseInt(req.params.id);
      const { stepId, decisionId, points } = req.body;
      
      if (!stepId || !decisionId || points === undefined) {
        return res.status(400).json({ message: "stepId, decisionId, and points are required" });
      }
      
      // Get current progress
      const progress = await storage.getUserProgressForScenario(userId, scenarioId);
      if (!progress) {
        return res.status(404).json({ message: "Scenario progress not found" });
      }
      
      // Update decisions
      const decisions = progress.decisions as any[] || [];
      decisions.push({ stepId, decisionId, points, timestamp: new Date() });
      
      // Update progress
      const updatedProgress = await storage.updateUserProgress(progress.id, {
        decisions,
        currentStep: stepId + 1,
        score: (progress.score || 0) + points
      });
      
      // Generate AI feedback for this decision
      try {
        const user = await storage.getUser(userId);
        if (user) {
          const feedback = await generateAIFeedback(
            scenarioId,
            decisions,
            {
              completedScenarios: user.completedScenarios || 0,
              successRate: user.successRate || 0
            }
          );
          
          // Save insights
          for (const insight of feedback) {
            await storage.createAiInsight({
              userId,
              scenarioId,
              type: insight.type,
              title: insight.title,
              description: insight.description
            });
          }
        }
      } catch (aiError) {
        console.error("Error generating AI feedback:", aiError);
        // Continue without AI feedback if it fails
      }
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error submitting decision:", error);
      res.status(500).json({ message: "Failed to submit decision" });
    }
  });

  // Complete scenario
  app.post("/api/scenarios/:id/complete", async (req, res) => {
    try {
      const userId = 1; // For demo, always use user ID 1
      const scenarioId = parseInt(req.params.id);
      
      const progress = await storage.getUserProgressForScenario(userId, scenarioId);
      if (!progress) {
        return res.status(404).json({ message: "Scenario progress not found" });
      }
      
      // Mark as completed
      const updatedProgress = await storage.updateUserProgress(progress.id, {
        completed: true,
      });
      
      // Update user stats
      const user = await storage.getUser(userId);
      if (user) {
        const completedScenarios = (user.completedScenarios || 0) + 1;
        const newSuccessRate = Math.round(((progress.score || 0) / 100) * 100);
        
        await storage.updateUser(userId, {
          completedScenarios,
          successRate: Math.round(((user.successRate || 0) * (user.completedScenarios || 0) + newSuccessRate) / completedScenarios),
          aiInsights: (user.aiInsights || 0) + 1
        });
      }
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error completing scenario:", error);
      res.status(500).json({ message: "Failed to complete scenario" });
    }
  });

  // Get AI insights for user
  app.get("/api/user/insights", async (req, res) => {
    try {
      const userId = 1; // For demo, always use user ID 1
      const insights = await storage.getAiInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI insights" });
    }
  });

  // Get learning paths
  app.get("/api/learning-paths", async (req, res) => {
    try {
      const paths = await storage.getLearningPaths();
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning paths" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
