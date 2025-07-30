import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import ScenarioModal from "@/components/scenario-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Clock, Signal, Star } from "lucide-react";
import { Link } from "wouter";
import type { Scenario, UserProgress } from "@shared/schema";

const frameworkColors = {
  scrum: "bg-green-100 text-green-800",
  kanban: "bg-blue-100 text-blue-800", 
  safe: "bg-purple-100 text-purple-800",
};

const difficultyColors = {
  beginner: "text-green-600",
  intermediate: "text-yellow-600",
  advanced: "text-orange-600", 
  expert: "text-red-600",
};

export default function ScenarioPage() {
  const [match, params] = useRoute("/scenarios/:id");
  const [showModal, setShowModal] = useState(false);
  const scenarioId = params?.id ? parseInt(params.id) : null;

  const { data: scenario, isLoading } = useQuery<Scenario>({
    queryKey: [`/api/scenarios/${scenarioId}`],
    enabled: !!scenarioId,
  });

  const { data: progress } = useQuery<UserProgress | null>({
    queryKey: [`/api/user/progress/${scenarioId}`],
    enabled: !!scenarioId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Scenario Not Found</h1>
            <p className="text-gray-600 mb-6">The scenario you're looking for doesn't exist.</p>
            <Link href="/scenarios">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scenarios
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const progressPercentage = progress 
    ? Math.round(((progress.currentStep || 0) / progress.totalSteps) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Scenario Details */}
        <Card className="overflow-hidden">
          <div className="relative">
            <img
              src={scenario.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
              alt={scenario.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={frameworkColors[scenario.framework as keyof typeof frameworkColors]}>
                {scenario.framework.toUpperCase()}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex items-center bg-white rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{((scenario.rating || 0) / 10).toFixed(1)}</span>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{scenario.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{scenario.description}</p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{scenario.duration} minutes</span>
                </div>
                <div className={`flex items-center ${difficultyColors[scenario.difficulty as keyof typeof difficultyColors]}`}>
                  <Signal className="h-5 w-5 mr-2" />
                  <span className="capitalize">{scenario.difficulty}</span>
                </div>
              </div>

              {/* Learning Objectives */}
              {scenario.learningObjectives && scenario.learningObjectives.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
                  <div className="flex flex-wrap gap-2">
                    {scenario.learningObjectives.map((objective, index) => (
                      <Badge key={index} variant="secondary">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Section */}
              {progress && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{progress.completed ? "Completed" : "In Progress"}</span>
                      <span>{progressPercentage}% Complete</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Step {progress.currentStep} of {progress.totalSteps}</span>
                      {progress.score && (
                        <span>Score: {progress.score}/100</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                onClick={() => setShowModal(true)}
                className="flex-1 md:flex-none"
              >
                <Play className="mr-2 h-5 w-5" />
                {progress && !progress.completed ? "Continue Scenario" : "Start Scenario"}
              </Button>
              
              {progress && !progress.completed && (
                <Button variant="outline" size="lg">
                  Reset Progress
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scenario Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What You'll Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Signal className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Decision Making</h4>
                <p className="text-sm text-gray-600">Practice making informed decisions under pressure with incomplete information.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Stakeholder Management</h4>
                <p className="text-sm text-gray-600">Navigate complex relationships and competing priorities effectively.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Real-time Feedback</h4>
                <p className="text-sm text-gray-600">Receive immediate AI-powered insights on your choices and approach.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Scenario Modal */}
      <ScenarioModal
        scenarioId={scenario.id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
