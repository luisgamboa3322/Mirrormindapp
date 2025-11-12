import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Brain, 
  Heart, 
  Volume2, 
  Activity,
  Zap,
  Pause,
  ChevronRight,
  Users,
  TrendingUp,
  Target
} from "lucide-react";

interface PortfolioScreenProps {
  onOpenApp: (app: 'mirrormind' | 'biotune' | 'silencio') => void;
}

const portfolioApps = [
  {
    id: 'mirrormind',
    name: 'MirrorMind',
    description: 'Análisis emocional con IA para autoconocimiento y bienestar',
    icon: <Brain className="w-8 h-8" />,
    color: 'from-purple-500 to-blue-500',
    status: 'active',
    features: ['Análisis de voz', 'Reconocimiento facial', 'Análisis de texto'],
    users: '1,200+',
    satisfaction: '94%'
  },
  {
    id: 'biotune',
    name: 'BioTune',
    description: 'Optimización de ritmos biológicos y sincronización circadiana',
    icon: <Activity className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    status: 'development',
    features: ['Monitoreo de sueño', 'Optimización lumínica', 'Rutinas personalizadas'],
    users: '450+',
    satisfaction: '91%'
  },
  {
    id: 'silencio',
    name: 'Silencio',
    description: 'Espacios de calma digital y desconexión consciente',
    icon: <Pause className="w-8 h-8" />,
    color: 'from-indigo-500 to-cyan-500',
    status: 'beta',
    features: ['Bloqueo inteligente', 'Meditación guiada', 'Análisis de uso'],
    users: '850+',
    satisfaction: '89%'
  }
];

const portfolioStats = [
  { label: 'Apps Activas', value: '3', icon: <Zap className="w-4 h-4" /> },
  { label: 'Usuarios Totales', value: '2.5K+', icon: <Users className="w-4 h-4" /> },
  { label: 'Satisfacción Promedio', value: '91%', icon: <Heart className="w-4 h-4" /> },
  { label: 'Crecimiento Mensual', value: '+23%', icon: <TrendingUp className="w-4 h-4" /> }
];

export function PortfolioScreen({ onOpenApp }: PortfolioScreenProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2>Portafolio de Bienestar Digital</h2>
              <p className="text-purple-200">Innovación en equilibrio mente-tecnología</p>
            </div>
          </div>

          {/* Portfolio Description */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
            <p className="text-sm text-purple-100">
              Iniciativas tecnológicas integradas que promueven el equilibrio entre la mente y la tecnología, 
              reduciendo el estrés digital y fomentando la salud emocional en nuestra sociedad actual.
            </p>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Portfolio Stats */}
        <div>
          <h3 className="mb-4">Métricas del Portafolio</h3>
          <div className="grid grid-cols-2 gap-4">
            {portfolioStats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  {stat.icon}
                </div>
                <p className="text-2xl mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div>
          <h3 className="mb-4">Aplicaciones del Portafolio</h3>
          <div className="space-y-4">
            {portfolioApps.map((app) => (
              <AppCard 
                key={app.id} 
                app={app} 
                onOpen={() => onOpenApp(app.id as 'mirrormind' | 'biotune' | 'silencio')} 
              />
            ))}
          </div>
        </div>

        {/* Program Integration */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <h4>Integración del Programa</h4>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Estas aplicaciones forman parte del programa coordinado "MirrorMind", 
                donde cada proyecto complementa a los otros para lograr un beneficio integral 
                en el bienestar emocional y digital.
              </p>
              <div className="space-y-2">
                <IntegrationPoint text="Datos compartidos para análisis más profundo" />
                <IntegrationPoint text="Recomendaciones cruzadas entre aplicaciones" />
                <IntegrationPoint text="Experiencia de usuario unificada" />
              </div>
            </div>
          </div>
        </Card>

        {/* PMBOK Methodology */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <h4>Metodología PMBOK</h4>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Este portafolio sigue los estándares PMBOK para gestión estratégica, 
                coordinando proyectos relacionados bajo una visión común de bienestar digital.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Nivel: Portafolio</Badge>
                <Badge variant="secondary">Programa: MirrorMind</Badge>
                <Badge variant="secondary">Proyectos: 3 activos</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface AppCardProps {
  app: typeof portfolioApps[0];
  onOpen: () => void;
}

function AppCard({ app, onOpen }: AppCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'development': return 'bg-yellow-500';
      case 'beta': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'development': return 'En desarrollo';
      case 'beta': return 'Beta';
      default: return 'Estado desconocido';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onOpen}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white flex-shrink-0`}>
              {app.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4>{app.name}</h4>
                <Badge className={`${getStatusColor(app.status)} text-white border-0 text-xs`}>
                  {getStatusLabel(app.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Features */}
        <div>
          <p className="text-sm mb-2">Características principales:</p>
          <div className="flex flex-wrap gap-2">
            {app.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {app.users} usuarios
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {app.satisfaction} satisfacción
            </span>
          </div>
          <Button variant="ghost" className="h-auto p-0 text-purple-600">
            {app.id === 'mirrormind' ? 'Abrir' : 'Próximamente'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface IntegrationPointProps {
  text: string;
}

function IntegrationPoint({ text }: IntegrationPointProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
      <span>{text}</span>
    </div>
  );
}