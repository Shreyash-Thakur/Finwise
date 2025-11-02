import React from 'react';
import { NewspaperIcon, ClockIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
interface NewsCardProps {
  article: {
    id: string;
    title: string;
    source: string;
    time: string;
    category: string;
  };
}
export function NewsCard({
  article
}: NewsCardProps) {
  return <Card padding="md" className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <NewspaperIcon className="w-5 h-5 text-secondary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-2">{article.title}</h3>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>{article.source}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>{article.time}</span>
            </div>
            <Badge variant="default" className="ml-auto">
              {article.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>;
}