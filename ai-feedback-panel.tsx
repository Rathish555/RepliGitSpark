import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, X, Lightbulb, ThumbsUp, TrendingUp, ArrowRight } from "lucide-react";
import type { AiInsight } from "@shared/schema";

interface AIFeedbackPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

const insightIcons = {
  insight: Lightbulb,
  strength: ThumbsUp,
  improvement: TrendingUp,
  recommendation: ArrowRight,
};

const insightColors = {
  insight: "bg-blue-50 text-blue-800 border-blue-200",
  strength: "bg-green-50 text-green-800 border-green-200",
  improvement: "bg-amber-50 text-amber-800 border-amber-200",
  recommendation: "bg-purple-50 text-purple-800 border-purple-200",
};

export default function AIFeedbackPanel({ isVisible, onToggle }: AIFeedbackPanelProps) {
  const [recentInsights, setRecentInsights] = useState<AiInsight[]>([]);

  const { data: insights = [] } = useQuery<AiInsight[]>({
    queryKey: ["/api/user/insights"],
    enabled: isVisible,
  });

  useEffect(() => {
    if (insights.length > 0) {
      // Show the 3 most recent insights
      setRecentInsights(insights.slice(0, 3));
    }
  }, [insights]);

  if (!isVisible) return null;

  const formatTimeAgo = (date: Date | string | null) => {
    if (!date) return "Just now";
    const now = new Date();
    const then = new Date(date);
    const diffMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="fixed right-4 bottom-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="text-primary mr-2 h-5 w-5" />
            <CardTitle className="text-lg">AI Coach</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {recentInsights.length > 0 ? (
          <div className="space-y-3">
            {recentInsights.map((insight) => {
              const Icon = insightIcons[insight.type as keyof typeof insightIcons] || Lightbulb;
              const colorClass = insightColors[insight.type as keyof typeof insightColors] || insightColors.insight;
              
              return (
                <div key={insight.id} className={`rounded-lg p-3 border ${colorClass}`}>
                  <div className="flex items-start space-x-2">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{insight.title}</p>
                      <p className="text-sm mt-1 leading-tight">{insight.description}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {formatTimeAgo(insight.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Complete scenarios to receive personalized AI insights
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button variant="ghost" className="w-full text-sm text-primary hover:text-blue-700 font-medium">
            View All Insights
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
