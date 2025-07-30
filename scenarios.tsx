import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Signal, Star, Play } from "lucide-react";
import { Link } from "wouter";
import type { Scenario } from "@shared/schema";

const frameworkColors = {
  scrum: "bg-green-100 text-green-800",
  kanban: "bg-blue-100 text-blue-800", 
  safe: "bg-purple-100 text-purple-800",
  dsdm: "bg-orange-100 text-orange-800",
  fdd: "bg-red-100 text-red-800",
  lean: "bg-yellow-100 text-yellow-800",
  xp: "bg-indigo-100 text-indigo-800",
};

const difficultyColors = {
  beginner: "text-green-600",
  intermediate: "text-yellow-600", 
  advanced: "text-orange-600",
  expert: "text-red-600",
};

export default function ScenariosPage() {
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const { data: scenarios = [], isLoading } = useQuery<Scenario[]>({
    queryKey: ["/api/scenarios"],
  });

  const filteredScenarios = scenarios.filter(scenario => {
    const frameworkMatch = selectedFramework === "all" || scenario.framework === selectedFramework;
    const difficultyMatch = selectedDifficulty === "all" || scenario.difficulty === selectedDifficulty;
    return frameworkMatch && difficultyMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 bg-white rounded-b-lg">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Training Scenarios</h1>
          <p className="text-lg text-gray-600 mb-6">
            Practice real-world Agile scenarios with AI-powered feedback and insights
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Frameworks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="scrum">Scrum</SelectItem>
                <SelectItem value="kanban">Kanban</SelectItem>
                <SelectItem value="safe">SAFe</SelectItem>
                <SelectItem value="dsdm">DSDM</SelectItem>
                <SelectItem value="fdd">FDD</SelectItem>
                <SelectItem value="lean">Lean</SelectItem>
                <SelectItem value="xp">XP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredScenarios.length} scenarios found
            </div>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <Card key={scenario.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={scenario.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"}
                  alt={scenario.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={frameworkColors[scenario.framework as keyof typeof frameworkColors]}>
                    {scenario.framework.toUpperCase()}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 flex items-center bg-white/90 rounded-full px-2 py-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                  <span className="text-xs font-medium">{((scenario.rating || 0) / 10).toFixed(1)}</span>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{scenario.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{scenario.duration}min</span>
                  </div>
                  <div className={`flex items-center text-sm ${difficultyColors[scenario.difficulty as keyof typeof difficultyColors]}`}>
                    <Signal className="h-4 w-4 mr-1" />
                    <span className="capitalize">{scenario.difficulty}</span>
                  </div>
                </div>

                <Link href={`/scenarios/${scenario.id}`}>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Scenario
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Signal className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more scenarios</p>
          </div>
        )}
      </main>
    </div>
  );
}