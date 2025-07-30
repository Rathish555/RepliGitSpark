import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/navigation";
import ScenarioModal from "@/components/scenario-modal";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle, 
  Target,
  Award,
  Users,
  Lightbulb
} from "lucide-react";
import type { Scenario, LearningPath } from "@shared/schema";

export default function CertificationPage() {
  const { certType } = useParams<{ certType: string }>();
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);

  const { data: scenarios = [] } = useQuery<Scenario[]>({
    queryKey: ["/api/scenarios"],
  });

  const { data: learningPaths = [] } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
  });

  const certificationData = {
    "pmi-acp": {
      title: "PMI-ACP Agile Certified Practitioner",
      description: "Master multiple agile frameworks and prepare for the PMI-ACP certification with comprehensive scenario-based training",
      domains: [
        { name: "Agile Principles & Mindset", scenarios: ["Lean Value Stream Mapping", "Daily Standup Facilitation"] },
        { name: "Value-driven Delivery", scenarios: ["DSDM MoSCoW Prioritization", "Program Increment Planning"] },
        { name: "Stakeholder Engagement", scenarios: ["Stakeholder Conflict Resolution", "Executive Pressure Crisis"] },
        { name: "Team Performance", scenarios: ["XP Pair Programming Introduction", "FDD Feature Team Scaling Challenge"] },
        { name: "Adaptive Planning", scenarios: ["DSDM Timeboxing Crisis", "Sprint Planning Crisis"] },
        { name: "Problem Detection & Resolution", scenarios: ["Lean Manufacturing Crisis in Software", "XP Test-Driven Development Crisis"] },
        { name: "Continuous Improvement", scenarios: ["Feature-Driven Development Modeling", "Enterprise Transformation Crisis"] }
      ],
      frameworks: ["Scrum", "Kanban", "Lean", "XP", "DSDM", "FDD", "SAFe"],
      badge: "text-orange-500",
      color: "bg-orange-50 border-orange-200"
    },
    "psm-1": {
      title: "Professional Scrum Master I",
      description: "Develop deep Scrum mastery and prepare for the PSM-I certification with hands-on scenario practice",
      domains: [
        { name: "Scrum Theory & Principles", scenarios: ["Daily Standup Facilitation"] },
        { name: "Scrum Master Accountabilities", scenarios: ["Stakeholder Conflict Resolution"] },
        { name: "Events & Artifacts", scenarios: ["Sprint Planning Crisis"] }
      ],
      frameworks: ["Scrum"],
      badge: "text-blue-500", 
      color: "bg-blue-50 border-blue-200"
    }
  };

  const cert = certificationData[certType as keyof typeof certificationData];
  
  if (!cert) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Certification Not Found</h1>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Get relevant scenarios for this certification
  const certScenarios = scenarios.filter(scenario => 
    cert.frameworks.map(f => f.toLowerCase()).includes(scenario.framework)
  );

  // Calculate progress
  const totalScenarios = certScenarios.length;
  const completedScenarios = 0; // This would come from user progress
  const progressPercent = totalScenarios > 0 ? (completedScenarios / totalScenarios) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className={`p-6 rounded-lg border ${cert.color} mb-6`}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{cert.title}</h1>
                <p className="text-gray-600 mb-4 max-w-2xl">{cert.description}</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Award className={`w-5 h-5 ${cert.badge}`} />
                    <span className="text-sm font-medium">Professional Certification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{cert.frameworks.length} Frameworks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{totalScenarios} Scenarios</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercent)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
                <Progress value={progressPercent} className="w-24 mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Domain Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Domains & Practice Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cert.domains.map((domain, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{domain.name}</h3>
                      <div className="space-y-2">
                        {domain.scenarios.map((scenarioTitle, scenarioIndex) => {
                          const scenario = scenarios.find(s => s.title === scenarioTitle);
                          return (
                            <div key={scenarioIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm font-medium">{scenarioTitle}</span>
                                {scenario && (
                                  <Badge variant="outline" className="text-xs">
                                    {scenario.framework.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              {scenario && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setSelectedScenarioId(scenario.id)}
                                >
                                  Practice
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Certification Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scenarios Completed</span>
                    <span className="font-semibold">{completedScenarios}/{totalScenarios}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Practice Hours</span>
                    <span className="font-semibold">0h 0m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-semibold">--</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-4 h-4 mt-1 text-yellow-500" />
                    <p className="text-sm text-gray-600">Practice scenarios from all frameworks to understand their interconnections</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="w-4 h-4 mt-1 text-blue-500" />
                    <p className="text-sm text-gray-600">Focus on principles and values rather than specific practices</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                    <p className="text-sm text-gray-600">Complete at least one scenario daily to maintain momentum</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Framework Coverage */}
            <Card>
              <CardHeader>
                <CardTitle>Covered Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cert.frameworks.map((framework) => (
                    <Badge key={framework} variant="secondary">
                      {framework}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certScenarios.map((scenario) => (
                <Card key={scenario.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedScenarioId(scenario.id)}>
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100"></div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="mb-2">
                        {scenario.framework.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs ml-1">{((scenario.rating || 0) / 10).toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{scenario.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {scenario.duration} min
                      </div>
                      <div className="capitalize">{scenario.difficulty}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Scenario Modal */}
      {selectedScenarioId && (
        <ScenarioModal
          scenarioId={selectedScenarioId}
          isOpen={!!selectedScenarioId}
          onClose={() => setSelectedScenarioId(null)}
        />
      )}
    </div>
  );
}