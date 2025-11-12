import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Clock, Users, Target } from "lucide-react";

interface AppComingSoonProps {
  appName: 'BioTune' | 'Silencio';
  onBack: () => void;
}

const appDetails = {
  BioTune: {
    description: 'Optimización de ritmos biológicos y sincronización circadiana',
    emoji: '🌊',
    color: 'from-green-500 to-emerald-500',
    features: [
      'Monitoreo inteligente del sueño',
      'Optimización de exposición lumínica',
      'Rutinas personalizadas de energía',
      'Sincronización con dispositivos wearables'
    ],
    expectedLaunch: 'T1 2026',
    currentPhase: 'Investigación y Desarrollo'
  },
  Silencio: {
    description: 'Espacios de calma digital y desconexión consciente',
    emoji: '🧘‍♀️',
    color: 'from-indigo-500 to-cyan-500',
    features: [
      'Bloqueo inteligente de aplicaciones',
      'Meditación guiada personalizada',
      'Análisis de patrones de uso digital',
      'Espacios de silencio programables'
    ],
    expectedLaunch: 'T2 2026',
    currentPhase: 'Diseño UX/UI'
  }
};

export function AppComingSoon({ appName, onBack }: AppComingSoonProps) {
  const app = appDetails[appName];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className={`bg-gradient-to-br ${app.color} text-white p-6`}>
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-white hover:bg-white/20 mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Portafolio
        </Button>
        <div className="text-center space-y-3">
          <div className="text-6xl mb-2">{app.emoji}</div>
          <h2>{appName}</h2>
          <p className="text-white/90">{app.description}</p>
          <Badge className="bg-white/20 text-white border-0">
            Próximamente
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h4>Estado del Proyecto</h4>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Fase actual:</strong> {app.currentPhase}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Lanzamiento estimado:</strong> {app.expectedLaunch}
              </p>
            </div>
          </div>
        </Card>

        {/* Features Preview */}
        <div>
          <h3 className="mb-4">Características Planificadas</h3>
          <div className="space-y-3">
            {app.features.map((feature, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                  <p className="text-sm">{feature}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Program Integration */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <h4>Integración con el Programa</h4>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                {appName} se integrará con MirrorMind para ofrecer una experiencia 
                completa de bienestar digital, compartiendo datos y insights para 
                recomendaciones más precisas.
              </p>
              <div className="space-y-2 text-sm">
                <IntegrationPoint text="Sincronización de datos emocionales con MirrorMind" />
                <IntegrationPoint text="Recomendaciones cruzadas basadas en patrones" />
                <IntegrationPoint text="Panel unificado de bienestar integral" />
              </div>
            </div>
          </div>
        </Card>

        {/* Team & Methodology */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <h4>Desarrollo siguiendo PMBOK</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Este proyecto sigue la metodología PMBOK como parte del programa 
                coordinado de bienestar digital, con gestión integrada de recursos, 
                cronograma y calidad.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">Metodología PMBOK</Badge>
                <Badge variant="secondary">Equipo multidisciplinario</Badge>
                <Badge variant="secondary">Desarrollo ágil</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Newsletter Signup Mockup */}
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="text-center space-y-3">
            <h4>¿Quieres ser notificado del lanzamiento?</h4>
            <p className="text-sm text-muted-foreground">
              Únete a nuestra lista de espera para recibir actualizaciones del desarrollo
            </p>
            <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
              Unirse a la Lista de Espera
            </Button>
            <p className="text-xs text-muted-foreground">
              * Funcionalidad de demostración para el prototipo
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface IntegrationPointProps {
  text: string;
}

function IntegrationPoint({ text }: IntegrationPointProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
      <span>{text}</span>
    </div>
  );
}