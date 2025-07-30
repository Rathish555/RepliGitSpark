import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import StatsCards from "@/components/stats-cards";
import ScenarioLibrary from "@/components/scenario-library";
import ScenarioModal from "@/components/scenario-modal";
import AIFeedbackPanel from "@/components/ai-feedback-panel";
import {
  Play,
  RotateCcw,
  CheckCircle,
  Target,
  Star,
  Shuffle,
  Tag,
  BarChart3,
  ArrowRight,
  Lock,
} from "lucide-react";
import type { User, UserProgress, AiInsight, LearningPath } from "@shared/schema";

export default function Dashboard() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const [showAIFeedback, setShowAIFeedback] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/user/progress"],
  });

  const { data: insights = [] } = useQuery<AiInsight[]>({
    queryKey: ["/api/user/insights"],
  });

  const { data: learningPaths = [] } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
  });

  // Get current scenario in progress
  const currentScenario = userProgress.find(p => !p.completed);

  const recentInsights = insights.slice(0, 2);

  const formatTimeAgo = (date: Date | string | null) => {
    if (!date) return "Just now";
    const now = new Date();
    const then = new Date(date);
    const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "User"}!
          </h2>
          <p className="text-gray-600">Continue your Agile mastery journey with AI-powered simulations</p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Scenario Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle>Continue Your Journey</CardTitle>
                  {currentScenario && (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {currentScenario ? (
                  <div>
                    <div className="mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
                        alt="Team collaboration"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        Stakeholder Conflict Resolution
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Navigate a heated disagreement between product owner and development team about feature priorities.
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <Badge variant="outline">Scrum Framework</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          Intermediate • 15-20 min
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(((currentScenario.currentStep || 0) / currentScenario.totalSteps) * 100)}% Complete</span>
                        </div>
                        <Progress 
                          value={((currentScenario.currentStep || 0) / currentScenario.totalSteps) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1"
                        onClick={() => setSelectedScenarioId(currentScenario.scenarioId)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Continue Scenario
                      </Button>
                      <Button variant="outline">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restart
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
                        alt="Start your journey"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Ready to Start Your Next Challenge?
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Choose from our library of AI-powered scenarios to continue your Agile learning journey.
                    </p>
                    <Link href="/scenarios">
                      <Button>
                        Explore Scenarios
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent AI Insights */}
            <Card className="mt-8">
              <CardHeader className="border-b border-gray-200">
                <CardTitle>Recent AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentInsights.length > 0 ? (
                  <div className="space-y-4">
                    {recentInsights.map((insight) => (
                      <div key={insight.id} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {insight.type === 'strength' ? (
                            <CheckCircle className="text-green-500 h-5 w-5" />
                          ) : (
                            <Target className="text-blue-500 h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(insight.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Complete scenarios to receive personalized AI insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Learning Path Progress */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle>Learning Path</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Scrum Fundamentals</p>
                      <p className="text-xs text-gray-500">8/8 scenarios completed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">3</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Stakeholder Management</p>
                      <p className="text-xs text-gray-500">3/5 scenarios completed</p>
                      <Progress value={60} className="h-1.5 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Lock className="text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Crisis Management</p>
                      <p className="text-xs text-gray-400">Unlocks at 80% completion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowAIFeedback(true)}
                  >
                    <Shuffle className="text-primary mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Random Scenario</p>
                      <p className="text-xs text-gray-500">Practice with AI-generated situation</p>
                    </div>
                  </Button>
                  
                  <div className="space-y-2">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center mb-3">
                        <Tag className="text-accent mr-3 h-4 w-4" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Certification Prep</p>
                          <p className="text-xs text-gray-500">Practice for professional certifications</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 ml-6">
                        <Link href="/certification/psm-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs py-1 h-auto">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                            <span className="truncate">PSM-I</span>
                          </Button>
                        </Link>
                        
                        <Link href="/certification/pmi-acp">
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs py-1 h-auto">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                            <span className="truncate">PMI-ACP</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="text-secondary mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Performance Analytics</p>
                      <p className="text-xs text-gray-500">Detailed progress reports</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-2">
                      <Star className="text-amber-500 mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Daily Practice</p>
                        <p className="text-xs text-amber-700">Complete one scenario to maintain your streak</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Target className="text-blue-500 mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Focus Area</p>
                        <p className="text-xs text-blue-700">Work on conflict resolution scenarios</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scenario Library */}
        <ScenarioLibrary />
      </main>

      {/* Modals */}
      {selectedScenarioId && (
        <ScenarioModal
          scenarioId={selectedScenarioId}
          isOpen={!!selectedScenarioId}
          onClose={() => setSelectedScenarioId(null)}
        />
      )}

      <AIFeedbackPanel 
        isVisible={showAIFeedback}
        onToggle={() => setShowAIFeedback(!showAIFeedback)}
      />
    </div>
  );
}
