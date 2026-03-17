import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Calendar } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  sort_order: number;
}

interface ProjectTimelineProps {
  milestones: Milestone[];
}

const ProjectTimeline = ({ milestones }: ProjectTimelineProps) => {
  if (milestones.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Timeline du projet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative flex gap-4">
                {/* Dot */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                  milestone.completed 
                    ? "bg-emerald-500/10 text-emerald-600" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {milestone.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm font-semibold ${
                      milestone.completed ? "text-emerald-600" : "text-foreground"
                    }`}>
                      {milestone.title}
                    </h4>
                    {milestone.completed && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0 text-xs">
                        Termine
                      </Badge>
                    )}
                  </div>
                  {milestone.description && (
                    <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                  )}
                  {milestone.due_date && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Echeance : {new Date(milestone.due_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
