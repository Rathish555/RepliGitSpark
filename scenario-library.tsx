import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Signal, Star, ArrowRight } from "lucide-react";
import type { Scenario } from "@shared/schema";

const frameworkColors = {
  scrum: "bg-green-100 text-green-800",
  kanban: "bg-blue-100 text-blue-800",
  safe: "bg-purple-100 text-purple-800",
  dsdm: "bg-orange-100 text-orange-800",
  fdd: "bg-pink-100 text-pink-800",
  lean: "bg-teal-100 text-teal-800",
  xp: "bg-indigo-100 text-indigo-800",
};

const difficultyColors = {
  beginner: "text-green-600",
  intermediate: "text-yellow-600", 
  advanced: "text-orange-600",
  expert: "text-red-600",
};

export default function ScenarioLibrary() {
  const [activeFramework, setActiveFramework] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");

  const { data: allScenarios = [], isLoading } = useQuery<Scenario[]>({
    queryKey: [`/api/scenarios?framework=${activeFramework}`],
  });

  // Filter scenarios by difficulty
  const scenarios = activeDifficulty === "all" 
    ? allScenarios 
    : allScenarios.filter(scenario => scenario.difficulty === activeDifficulty);

  const frameworks = [
    { id: "all", label: "All Frameworks" },
    { id: "scrum", label: "Scrum" },
    { id: "kanban", label: "Kanban" },
    { id: "safe", label: "SAFe" },
    { id: "dsdm", label: "DSDM" },
    { id: "fdd", label: "FDD" },
    { id: "lean", label: "Lean" },
    { id: "xp", label: "XP" },
  ];

  const difficulties = [
    { id: "all", label: "All Levels", description: "Show all difficulty levels" },
    { id: "beginner", label: "Basic", description: "Foundation concepts and simple scenarios" },
    { id: "intermediate", label: "Intermediate", description: "Common challenges and stakeholder conflicts" },
    { id: "advanced", label: "Advanced", description: "Complex multi-team situations" },
    { id: "expert", label: "Expert", description: "High-stakes crisis management" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-32 bg-gray-300 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-3"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Scenario Library</h3>
        <Link href="/scenarios">
          <Button variant="ghost" className="text-primary font-medium hover:text-blue-700">
            View All Scenarios <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Framework Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() => setActiveFramework(framework.id)}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeFramework === framework.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {framework.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Difficulty Level Selector */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Challenge Level</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => setActiveDifficulty(difficulty.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                activeDifficulty === difficulty.id
                  ? "border-primary bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  difficulty.id === "beginner" ? "bg-green-500" :
                  difficulty.id === "intermediate" ? "bg-yellow-500" :
                  difficulty.id === "advanced" ? "bg-orange-500" :
                  difficulty.id === "expert" ? "bg-red-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  activeDifficulty === difficulty.id ? "text-primary" : "text-gray-900"
                }`}>
                  {difficulty.label}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-tight">
                {difficulty.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Showing {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} 
          {activeDifficulty !== "all" && ` • ${difficulties.find(d => d.id === activeDifficulty)?.label} level`}
          {activeFramework !== "all" && ` • ${frameworks.find(f => f.id === activeFramework)?.label} framework`}
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.slice(0, 6).map((scenario) => (
          <Card key={scenario.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <img
              src={scenario.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
              alt={scenario.title}
              className="w-full h-32 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={frameworkColors[scenario.framework as keyof typeof frameworkColors]}>
                  {scenario.framework.toUpperCase()}
                </Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {((scenario.rating || 0) / 10).toFixed(1)}
                  </span>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {scenario.title}
              </h4>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {scenario.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {scenario.duration} min
                </span>
                <span className={`flex items-center ${difficultyColors[scenario.difficulty as keyof typeof difficultyColors]}`}>
                  <Signal className="h-4 w-4 mr-1" />
                  {scenario.difficulty}
                </span>
              </div>
              
              <Link href={`/scenarios/${scenario.id}`}>
                <Button className="w-full">
                  Start Scenario
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
