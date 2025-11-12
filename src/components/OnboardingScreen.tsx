import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { 
  User, 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Angry,
  Laugh,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface OnboardingScreenProps {
  onComplete: (userData: UserProfile) => void;
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  initialEmotion: string;
  emotionalGoal: string;
}

const emotions = [
  { id: "muy-feliz", label: "Muy Feliz", icon: <Laugh className="w-6 h-6" />, color: "text-yellow-500" },
  { id: "feliz", label: "Feliz", icon: <Smile className="w-6 h-6" />, color: "text-green-500" },
  { id: "neutral", label: "Neutral", icon: <Meh className="w-6 h-6" />, color: "text-blue-500" },
  { id: "triste", label: "Triste", icon: <Frown className="w-6 h-6" />, color: "text-orange-500" },
  { id: "ansioso", label: "Ansioso/a", icon: <Angry className="w-6 h-6" />, color: "text-red-500" },
];

const goals = [
  { id: "autoconocimiento", label: "Mejorar mi autoconocimiento emocional", icon: "🧠" },
  { id: "estres", label: "Reducir estrés y ansiedad", icon: "😌" },
  { id: "bienestar", label: "Aumentar mi bienestar general", icon: "✨" },
  { id: "seguimiento", label: "Hacer seguimiento de mis emociones", icon: "📊" },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    age: "",
    gender: "",
    initialEmotion: "",
    emotionalGoal: ""
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return formData.age.trim() !== "" && formData.gender !== "";
      case 3:
        return formData.initialEmotion !== "";
      case 4:
        return formData.emotionalGoal !== "";
      default:
        return false;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header with Progress */}
      <div className="bg-white border-b p-6 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h3>Configuración Inicial</h3>
            <span className="text-sm text-muted-foreground">Paso {step} de {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2>¡Bienvenido/a a MirrorMind!</h2>
              <p className="text-muted-foreground">
                Comencemos conociendo un poco sobre ti para personalizar tu experiencia
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">¿Cómo te llamas?</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Usaremos tu nombre para personalizar tu experiencia
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Age & Gender */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2>Datos básicos</h2>
              <p className="text-muted-foreground">
                Esta información nos ayuda a entender mejor tu contexto
              </p>
            </div>

            <Card className="p-6 space-y-6">
              <div>
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ej: 25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-2"
                  min="13"
                  max="120"
                />
              </div>

              <div>
                <Label>Género (opcional)</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="femenino" id="femenino" />
                    <Label htmlFor="femenino" className="cursor-pointer">Femenino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="masculino" />
                    <Label htmlFor="masculino" className="cursor-pointer">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="otro" id="otro" />
                    <Label htmlFor="otro" className="cursor-pointer">Otro / Prefiero no decir</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-900">
                🔒 Tus datos están protegidos y solo se usan para personalizar tu experiencia en MirrorMind.
              </p>
            </Card>
          </div>
        )}

        {/* Step 3: Initial Emotional State */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2>¿Cómo te sientes hoy?</h2>
              <p className="text-muted-foreground">
                Esta será tu autoevaluación emocional inicial
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => setFormData({ ...formData, initialEmotion: emotion.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      formData.initialEmotion === emotion.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={emotion.color}>
                      {emotion.icon}
                    </div>
                    <span className="flex-1 text-left">{emotion.label}</span>
                    {formData.initialEmotion === emotion.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <p className="text-sm text-purple-900">
                💡 No hay respuestas correctas o incorrectas. Sé honesto/a contigo mismo/a.
              </p>
            </Card>
          </div>
        )}

        {/* Step 4: Goals */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2>Tu objetivo principal</h2>
              <p className="text-muted-foreground">
                ¿Qué te gustaría lograr con MirrorMind?
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, emotionalGoal: goal.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      formData.emotionalGoal === goal.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl">
                      {goal.icon}
                    </div>
                    <span className="flex-1 text-left text-sm">{goal.label}</span>
                    {formData.emotionalGoal === goal.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-green-900">
                ✨ Adaptaremos las recomendaciones según tu objetivo personal.
              </p>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Atrás
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {step === totalSteps ? 'Comenzar' : 'Siguiente'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Privacy Notice */}
        {step === 1 && (
          <p className="text-xs text-center text-muted-foreground">
            Al continuar, aceptas que MirrorMind es un prototipo educativo.
            <br />
            No está diseñado para diagnóstico médico profesional.
          </p>
        )}
      </div>
    </div>
  );
}
