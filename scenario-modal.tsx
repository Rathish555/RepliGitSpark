import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowLeft, ArrowRight, FastForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Scenario, UserProgress } from "@shared/schema";

interface ScenarioModalProps {
  scenarioId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface DecisionOption {
  id: number;
  text: string;
  description: string;
  points: number;
  feedback: string;
}

interface ScenarioStep {
  id: number;
  title: string;
  situation: string;
  characters: Array<{
    name: string;
    role: string;
    personality: string;
    avatar: string;
  }>;
  decisions: DecisionOption[];
}

export default function ScenarioModal({ scenarioId, isOpen, onClose }: ScenarioModalProps) {
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: scenario } = useQuery<Scenario>({
    queryKey: [`/api/scenarios/${scenarioId}`],
    enabled: isOpen && !!scenarioId,
  });

  const { data: progress } = useQuery<UserProgress | null>({
    queryKey: [`/api/user/progress/${scenarioId}`],
    enabled: isOpen && !!scenarioId,
  });

  const startScenarioMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/scenarios/${scenarioId}/start`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/user/progress/${scenarioId}`],
      });
    },
  });

  const submitDecisionMutation = useMutation({
    mutationFn: (data: { stepId: number; decisionId: number; points: number }) =>
      apiRequest("POST", `/api/scenarios/${scenarioId}/decision`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/user/progress/${scenarioId}`],
      });
      setSelectedDecision(null);
      setCurrentStepIndex(prev => prev + 1);
      toast({
        title: "Decision Submitted",
        description: "Your choice has been recorded and analyzed.",
      });
    },
  });

  const completeScenarioMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/scenarios/${scenarioId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/user/current"],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/user/progress/${scenarioId}`],
      });
      toast({
        title: "Scenario Completed!",
        description: "Congratulations! Check your insights for personalized feedback.",
      });
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen && scenarioId && !progress) {
      startScenarioMutation.mutate();
    }
  }, [isOpen, scenarioId, progress]);

  useEffect(() => {
    if (progress) {
      setCurrentStepIndex(progress.currentStep || 0);
    }
  }, [progress]);

  if (!isOpen || !scenario) return null;

  const steps = (scenario.content as any)?.steps || [];
  const currentStep: ScenarioStep | undefined = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDecisionSelect = (decisionId: number) => {
    setSelectedDecision(decisionId);
  };

  const handleSubmitDecision = () => {
    if (!selectedDecision || !currentStep) return;

    const selectedOption = currentStep.decisions.find(d => d.id === selectedDecision);
    if (!selectedOption) return;

    submitDecisionMutation.mutate({
      stepId: currentStep.id,
      decisionId: selectedDecision,
      points: selectedOption.points,
    });
  };

  const handleComplete = () => {
    completeScenarioMutation.mutate();
  };

  const isLastStep = currentStepIndex >= steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{scenario.title}</h3>
              <p className="text-gray-600">
                {currentStep?.title || "Loading..."} - Step {currentStepIndex + 1}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario Progress</span>
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep ? (
            <>
              {/* Situation */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Current Situation</h4>
                  <p className="text-gray-700">{currentStep.situation}</p>
                </CardContent>
              </Card>

              {/* Characters */}
              {currentStep.characters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentStep.characters.map((character, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-3">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {character.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{character.name}</p>
                            <p className="text-sm text-gray-600">{character.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{character.personality}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Decision Point */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  As the Scrum Master, how do you handle this situation?
                </h4>

                <div className="space-y-3">
                  {currentStep.decisions.map((decision) => (
                    <button
                      key={decision.id}
                      onClick={() => handleDecisionSelect(decision.id)}
                      className={`w-full text-left p-4 border rounded-lg transition-colors ${
                        selectedDecision === decision.id
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-6 h-6 border-2 rounded-full mr-3 mt-0.5 ${
                            selectedDecision === decision.id
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedDecision === decision.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{decision.text}</p>
                          <p className="text-sm text-gray-600 mt-1">{decision.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="ghost" onClick={onClose}>
                  <FastForward className="mr-2 h-4 w-4" />
                  Skip This Step
                </Button>
                <div className="space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  {isLastStep ? (
                    <Button
                      onClick={handleComplete}
                      disabled={!selectedDecision || completeScenarioMutation.isPending}
                    >
                      Complete Scenario
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitDecision}
                      disabled={!selectedDecision || submitDecisionMutation.isPending}
                    >
                      Submit Decision
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading scenario content...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
