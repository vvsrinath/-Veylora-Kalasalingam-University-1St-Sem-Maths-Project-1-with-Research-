import React from 'react';
import { LightbulbIcon } from 'lucide-react';

interface RecommendationListProps {
  recommendations: string[];
  theme?: 'dark' | 'light';
}

export function RecommendationList({ recommendations, theme = 'light' }: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  const cardClass = theme === 'light' ? 'border-lightborder bg-white' : 'border-white/10 bg-surface/60';
  const textClass = theme === 'light' ? 'text-lighttext' : 'text-soft';

  return (
    <ul className="space-y-2.5">
      {recommendations.map((rec) =>
      <li key={rec} className={`flex gap-3 rounded-xl border p-3.5 text-sm leading-relaxed ${cardClass} ${textClass}`}>
          <LightbulbIcon size={16} className="mt-0.5 shrink-0 text-accent" />
          {rec}
        </li>
      )}
    </ul>);

}