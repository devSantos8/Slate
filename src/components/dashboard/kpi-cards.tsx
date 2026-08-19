"use client"

import * as React from "react"
import { DollarSign, Users, CreditCard, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Metric } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
};

interface KPICardsProps {
  metrics: Metric[];
}

export function KPICards({ metrics }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const IconComponent = ICON_MAP[metric.iconName] || DollarSign;
        return (
          <Card
            key={metric.id}
            className="relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-2xs">
                  <IconComponent className="size-4.5" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-foreground tracking-tight">
                  {metric.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      metric.isPositive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    )}
                  >
                    {metric.isPositive ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {metric.change}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{metric.period}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
