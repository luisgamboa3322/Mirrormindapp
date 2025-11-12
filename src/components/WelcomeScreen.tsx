import { Button } from "./ui/button";
import { Brain, Heart, MessageCircle } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-md">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl">MirrorMind</h1>
          <p className="text-muted-foreground">
            Tu compañero de bienestar emocional impulsado por IA
          </p>
          <p className="text-sm text-purple-600">
            Parte del Portafolio de Bienestar Digital
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 w-full">
          <FeatureItem
            icon={<Brain className="w-5 h-5" />}
            title="Análisis Inteligente"
            description="IA que comprende tus emociones"
          />
          <FeatureItem
            icon={<Heart className="w-5 h-5" />}
            title="Bienestar Personal"
            description="Retroalimentación personalizada"
          />
          <FeatureItem
            icon={<MessageCircle className="w-5 h-5" />}
            title="Seguimiento Continuo"
            description="Monitorea tu progreso emocional"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-md space-y-3">
        <Button 
          onClick={onStart} 
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Comenzar
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Versión Prototipo - Proyecto PMBOK
        </p>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/70 backdrop-blur-sm border border-purple-100">
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4>{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
