import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Mic, 
  Camera, 
  MessageSquare, 
  TrendingUp, 
  Sparkles,
  Activity
} from "lucide-react";

interface HomeScreenProps {
  onAnalyze: (type: 'voice' | 'face' | 'text') => void;
  userName?: string;
}

export function HomeScreen({ onAnalyze, userName }: HomeScreenProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-100">Hola{userName ? `, ${userName}` : ''}</p>
            <h2 className="text-2xl">¿Cómo te sientes hoy usuario?</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Daily Insight */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm">Estado emocional promedio hoy</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-400/90 text-white border-0">Positivo</Badge>
                <span className="text-sm text-purple-100">+15% vs ayer</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Options */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="mb-4">Analiza tus emociones</h3>
          <div className="grid gap-4">
            <AnalysisCard
              icon={<Mic className="w-6 h-6" />}
              title="Análisis de Voz"
              description="Analiza el tono y contenido emocional de tu voz"
              color="from-pink-500 to-rose-500"
              onClick={() => onAnalyze('voice')}
            />
            <AnalysisCard
              icon={<Camera className="w-6 h-6" />}
              title="Análisis Facial"
              description="Detecta emociones a través de tus expresiones"
              color="from-blue-500 to-cyan-500"
              onClick={() => onAnalyze('face')}
            />
            <AnalysisCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Análisis de Texto"
              description="Evalúa el contenido emocional de tu escritura"
              color="from-purple-500 to-indigo-500"
              onClick={() => onAnalyze('text')}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Tu progreso</h3>
            <Button variant="ghost" className="h-auto p-0 text-purple-600">
              Ver todo
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              value="12"
              label="Días consecutivos"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <StatCard
              value="87%"
              label="Estado positivo"
              icon={<Activity className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnalysisCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

function AnalysisCard({ icon, title, description, color, onClick }: AnalysisCardProps) {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4>{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-purple-600 mb-2">
        {icon}
      </div>
      <p className="text-2xl">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}
