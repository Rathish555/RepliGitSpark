import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  completedScenarios: integer("completed_scenarios").default(0),
  successRate: integer("success_rate").default(0),
  aiInsights: integer("ai_insights").default(0),
  timeInvested: integer("time_invested").default(0), // in minutes
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  framework: text("framework").notNull(), // scrum, kanban, safe
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced, expert
  duration: integer("duration").notNull(), // in minutes
  rating: integer("rating").default(0), // 1-5 stars * 10 (so 50 = 5.0 stars)
  imageUrl: text("image_url"),
  content: jsonb("content").notNull(), // scenario steps, characters, decisions
  learningObjectives: text("learning_objectives").array(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scenarioId: integer("scenario_id").notNull(),
  currentStep: integer("current_step").default(0),
  totalSteps: integer("total_steps").notNull(),
  decisions: jsonb("decisions"), // array of decision objects
  completed: boolean("completed").default(false),
  score: integer("score"), // 0-100
  timeSpent: integer("time_spent").default(0), // in minutes
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scenarioId: integer("scenario_id"),
  type: text("type").notNull(), // improvement, strength, recommendation
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  framework: text("framework").notNull(),
  scenarios: integer("scenarios").array(),
  order: integer("order").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  currentStreak: true,
  completedScenarios: true,
  successRate: true,
  aiInsights: true,
  timeInvested: true,
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
  rating: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
