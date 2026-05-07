import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  delay?: number;
}

export function KPICard({ title, value, icon: Icon, trend, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Card className="border-2 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
              {trend && (
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-medium ${
                      trend.isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                    }`}
                  >
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{trend.label ?? 'vs previous'}</span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-orange-600 dark:text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
