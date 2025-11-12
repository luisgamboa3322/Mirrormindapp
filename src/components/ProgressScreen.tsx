import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar,
  TrendingUp,
  Award,
  Activity,
  Smile,
  Heart,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const weeklyData = [
  { day: "Lun", score: 65 },
  { day: "Mar", score: 72 },
  { day: "Mié", score: 68 },
  { day: "Jue", score: 80 },
  { day: "Vie", score: 75 },
  { day: "Sáb", score: 85 },
  { day: "Dom", score: 78 }
];

const emotionalProfile = [
  { emotion: "Alegría", value: 85 },
  { emotion: "Confianza", value: 75 },
  { emotion: "Energía", value: 70 },
  { emotion: "Calma", value: 80 },
  { emotion: "Optimismo", value: 78 }
];

const achievements = [
  { id: 1, title: "Primera Semana", icon: "🎯", unlocked: true },
  { id: 2, title: "Racha de 7 días", icon: "🔥", unlocked: true },
  { id: 3, title: "Analista Constante", icon: "📊", unlocked: true },
  { id: 4, title: "Mes Completo", icon: "🌟", unlocked: false }
];

export function ProgressScreen() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6">
        <h2 className="mb-2">Tu Progreso</h2>
        <p className="text-purple-100">
          Seguimiento de tu bienestar emocional
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatBox
            icon={<Activity className="w-5 h-5" />}
            value="12"
            label="Días activos"
            color="text-purple-600"
          />
          <StatBox
            icon={<TrendingUp className="w-5 h-5" />}
            value="+18%"
            label="Mejora"
            color="text-green-600"
          />
          <StatBox
            icon={<Award className="w-5 h-5" />}
            value="3"
            label="Logros"
            color="text-yellow-600"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
          </TabsList>

          {/* Weekly Tab */}
          <TabsContent value="weekly" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3>Estado Emocional Semanal</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h4 className="mb-3">Análisis de la Semana</h4>
              <div className="space-y-3">
                <InsightItem
                  icon={<TrendingUp className="w-4 h-4" />}
                  text="Tu estado emocional mejoró 15% esta semana"
                  positive
                />
                <InsightItem
                  icon={<Calendar className="w-4 h-4" />}
                  text="Sábado fue tu día más positivo"
                  positive
                />
                <InsightItem
                  icon={<Activity className="w-4 h-4" />}
                  text="Mantén esta consistencia para mejores resultados"
                  neutral
                />
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-purple-600" />
                <h3>Perfil Emocional</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={emotionalProfile}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="emotion" stroke="#9ca3af" />
                  <PolarRadiusAxis stroke="#9ca3af" />
                  <Radar 
                    name="Tu Perfil" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h4 className="mb-3">Fortalezas Emocionales</h4>
              <div className="space-y-2">
                <EmotionTag label="Alta capacidad de alegría" value="85%" />
                <EmotionTag label="Gran nivel de calma" value="80%" />
                <EmotionTag label="Optimismo sostenido" value="78%" />
              </div>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4>3 de 4 Logros Desbloqueados</h4>
                  <p className="text-sm text-muted-foreground">¡Sigue así!</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} {...achievement} />
              ))}
            </div>

            <Card className="p-4 border-2 border-dashed border-purple-300">
              <div className="text-center space-y-2">
                <div className="text-3xl">🎁</div>
                <h4>Próximo Logro</h4>
                <p className="text-sm text-muted-foreground">
                  Completa 30 días consecutivos para desbloquear "Mes Completo"
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>12/30 días</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface StatBoxProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

function StatBox({ icon, value, label, color }: StatBoxProps) {
  return (
    <Card className="p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-xl mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

interface InsightItemProps {
  icon: React.ReactNode;
  text: string;
  positive?: boolean;
  neutral?: boolean;
}

function InsightItem({ icon, text, positive, neutral }: InsightItemProps) {
  const bgColor = positive ? "bg-green-50" : neutral ? "bg-blue-50" : "bg-gray-50";
  const iconColor = positive ? "text-green-600" : neutral ? "text-blue-600" : "text-gray-600";

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${bgColor}`}>
      <div className={`${iconColor} mt-0.5`}>{icon}</div>
      <p className="text-sm flex-1">{text}</p>
    </div>
  );
}

interface EmotionTagProps {
  label: string;
  value: string;
}

function EmotionTag({ label, value }: EmotionTagProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
      <span className="text-sm">{label}</span>
      <Badge className="bg-purple-600">{value}</Badge>
    </div>
  );
}

interface AchievementCardProps {
  title: string;
  icon: string;
  unlocked: boolean;
}

function AchievementCard({ title, icon, unlocked }: AchievementCardProps) {
  return (
    <Card className={`p-4 text-center ${unlocked ? 'bg-gradient-to-br from-purple-50 to-blue-50' : 'opacity-50'}`}>
      <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>{icon}</div>
      <h4 className="text-sm">{title}</h4>
      {unlocked && (
        <Badge className="mt-2 bg-green-500">Desbloqueado</Badge>
      )}
    </Card>
  );
}
