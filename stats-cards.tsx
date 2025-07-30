import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Trophy, Brain, Clock } from "lucide-react";

export default function StatsCards() {
  const { data: user } = useQuery<{ completedScenarios?: number; successRate?: number; aiInsights?: number; timeInvested?: number }>({
    queryKey: ["/api/user/current"],
  });

  const stats = [
    {
      icon: TrendingUp,
      label: "Scenarios Completed",
      value: user?.completedScenarios || 0,
      color: "text-primary",
    },
    {
      icon: Trophy,
      label: "Success Rate",
      value: `${user?.successRate || 0}%`,
      color: "text-accent",
    },
    {
      icon: Brain,
      label: "AI Insights",
      value: user?.aiInsights || 0,
      color: "text-secondary",
    },
    {
      icon: Clock,
      label: "Time Invested",
      value: `${Math.floor((user?.timeInvested || 0) / 60)}h`,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
