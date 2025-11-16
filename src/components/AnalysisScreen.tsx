import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Smile, 
  Frown, 
  Meh,
  Heart,
  Brain,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Mic,
  Volume2,
  Clock,
  Camera,
  Eye
} from "lucide-react";
import { AudioAnalysisResult } from "../hooks/useAudioAnalysis";
import { FaceAnalysisResult } from "../hooks/useFaceAnalysis";

interface AnalysisScreenProps {
  type: 'voice' | 'face' | 'text';
  onBack: () => void;
  voiceAnalysisResult?: AudioAnalysisResult | null;
  faceAnalysisResult?: FaceAnalysisResult | null;
}

const analysisData = {
  voice: {
    title: "Análisis de Voz",
    emoji: "🎤",
    emotions: [
      { name: "Alegría", value: 65, color: "bg-yellow-500" },
      { name: "Confianza", value: 45, color: "bg-blue-500" },
      { name: "Ansiedad", value: 20, color: "bg-orange-500" },
      { name: "Tristeza", value: 10, color: "bg-gray-500" }
    ],
    mainEmotion: "Alegría",
    insights: [
      "Tu tono de voz refleja optimismo y energía positiva",
      "Se detectan ligeros patrones de ansiedad en momentos específicos",
      "Tu ritmo de habla es estable y confiado"
    ]
  },
  face: {
    title: "Análisis Facial",
    emoji: "😊",
    emotions: [
      { name: "Felicidad", value: 70, color: "bg-yellow-500" },
      { name: "Sorpresa", value: 30, color: "bg-purple-500" },
      { name: "Neutralidad", value: 25, color: "bg-gray-400" },
      { name: "Preocupación", value: 15, color: "bg-orange-500" }
    ],
    mainEmotion: "Felicidad",
    insights: [
      "Tus expresiones faciales muestran autenticidad emocional",
      "Microexpresiones indican estado de ánimo positivo",
      "Contacto visual y sonrisa genuina detectados"
    ]
  },
  text: {
    title: "Análisis de Texto",
    emoji: "✍️",
    emotions: [
      { name: "Optimismo", value: 55, color: "bg-green-500" },
      { name: "Reflexión", value: 50, color: "bg-blue-500" },
      { name: "Determinación", value: 40, color: "bg-indigo-500" },
      { name: "Frustración", value: 15, color: "bg-red-500" }
    ],
    mainEmotion: "Optimismo",
    insights: [
      "Tu escritura refleja un estado mental equilibrado",
      "Uso de palabras positivas y constructivas predominante",
      "Se observa capacidad de introspección saludable"
    ]
  }
};

export function AnalysisScreen({ type, onBack, voiceAnalysisResult, faceAnalysisResult }: AnalysisScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  // Usar datos reales si están disponibles, sino usar datos simulados
  const actualData = (() => {
    if (type === 'voice' && voiceAnalysisResult) {
      return {
        title: "Análisis de Voz - Real",
        emoji: "🎤",
        emotions: voiceAnalysisResult.emotions,
        mainEmotion: voiceAnalysisResult.mainEmotion,
        insights: voiceAnalysisResult.insights
      };
    }
    if (type === 'face' && faceAnalysisResult) {
      return {
        title: "Análisis Facial - Real",
        emoji: "😊",
        emotions: faceAnalysisResult.emotions,
        mainEmotion: faceAnalysisResult.mainEmotion,
        insights: faceAnalysisResult.insights
      };
    }
    return analysisData[type];
  })();

  const data = actualData;

  useEffect(() => {
    // Si tenemos resultados reales, no mostrar la simulación
    if ((type === 'voice' && voiceAnalysisResult) || (type === 'face' && faceAnalysisResult)) {
      setIsAnalyzing(false);
      setProgress(100);
      return;
    }

    // Simulate analysis process para datos simulados
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsAnalyzing(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [voiceAnalysisResult, faceAnalysisResult, type]);

  if (isAnalyzing) {
    const isReal = (type === 'voice' && voiceAnalysisResult) || (type === 'face' && faceAnalysisResult);
    
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2>Analizando {data.title.toLowerCase()}</h2>
            <p className="text-muted-foreground">
              {isReal 
                ? `Procesando análisis ${type === 'voice' ? 'de voz' : 'facial'} real...` 
                : 'La IA está procesando tus datos emocionales...'
              }
            </p>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  const isReal = (type === 'voice' && voiceAnalysisResult) || (type === 'face' && faceAnalysisResult);
  const currentResult = type === 'voice' ? voiceAnalysisResult : faceAnalysisResult;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-white hover:bg-white/20 mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">{data.emoji}</div>
          <h2>{data.title}</h2>
          <Badge className="bg-white/20 text-white border-0">
            {isReal ? 'Análisis Real completado' : 'Análisis completado'}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Emotion */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <h3>Emoción Principal</h3>
            {isReal && (
              <Badge variant="secondary" className="ml-auto">
                Real
              </Badge>
            )}
          </div>
          <p className="text-3xl mb-1">{data.mainEmotion}</p>
          <p className="text-sm text-muted-foreground">
            {currentResult 
              ? `Detectada con ${Math.round(currentResult.confidence * 100)}% de confianza`
              : 'Detectada con alta confianza'
            }
          </p>
        </Card>

        {/* Características de audio (solo para análisis de voz real) */}
        {type === 'voice' && voiceAnalysisResult && voiceAnalysisResult.audioFeatures && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-green-600" />
              <h3>Características de Tu Voz</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tono (Hz)</span>
                  <span className="font-medium">{Math.round(voiceAnalysisResult.audioFeatures.pitch)}</span>
                </div>
                <Progress value={Math.min((voiceAnalysisResult.audioFeatures.pitch / 400) * 100, 100)} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Volumen</span>
                  <span className="font-medium">{Math.round(voiceAnalysisResult.audioFeatures.volume * 100)}%</span>
                </div>
                <Progress value={voiceAnalysisResult.audioFeatures.volume * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Velocidad</span>
                  <span className="font-medium">{voiceAnalysisResult.audioFeatures.speakingRate.toFixed(1)}x</span>
                </div>
                <Progress value={Math.min(voiceAnalysisResult.audioFeatures.speakingRate * 50, 100)} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energía</span>
                  <span className="font-medium">{Math.round(voiceAnalysisResult.audioFeatures.energy * 100)}%</span>
                </div>
                <Progress value={voiceAnalysisResult.audioFeatures.energy * 100} className="h-2" />
              </div>
            </div>
          </Card>
        )}

        {/* Características faciales (solo para análisis facial real) */}
        {type === 'face' && faceAnalysisResult && faceAnalysisResult.faceFeatures && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3>Características de Tu Rostro</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Simetría</span>
                  <span className="font-medium">{Math.round(faceAnalysisResult.faceFeatures.symmetryScore * 100)}%</span>
                </div>
                <Progress value={faceAnalysisResult.faceFeatures.symmetryScore * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Apertura ojos</span>
                  <span className="font-medium">{Math.round(faceAnalysisResult.faceFeatures.eyeOpenness)}%</span>
                </div>
                <Progress value={Math.min(faceAnalysisResult.faceFeatures.eyeOpenness, 100)} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Apertura boca</span>
                  <span className="font-medium">{Math.round(faceAnalysisResult.faceFeatures.mouthOpenness)}%</span>
                </div>
                <Progress value={Math.min(faceAnalysisResult.faceFeatures.mouthOpenness, 100)} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confianza</span>
                  <span className="font-medium">{Math.round(faceAnalysisResult.faceFeatures.confidence * 100)}%</span>
                </div>
                <Progress value={faceAnalysisResult.faceFeatures.confidence * 100} className="h-2" />
              </div>
            </div>
          </Card>
        )}

        {/* Transcripción (solo para análisis de voz real) */}
        {type === 'voice' && voiceAnalysisResult && voiceAnalysisResult.transcript && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-blue-600" />
              <h3>Lo que dijiste</h3>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm leading-relaxed italic">
                "{voiceAnalysisResult.transcript}"
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Transcripción en tiempo real</span>
            </div>
          </Card>
        )}

        {/* Emotion Breakdown */}
        <div>
          <h3 className="mb-4">Desglose Emocional</h3>
          <div className="space-y-4">
            {data.emotions.map((emotion) => 
              React.createElement(EmotionBar, {
                key: emotion.name,
                name: emotion.name,
                value: emotion.value,
                color: emotion.color
              })
            )}
          </div>
        </div>

        {/* Insights */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <h3>Insights Personalizados</h3>
          </div>
          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <Card key={index} className="p-4">
                <p className="text-sm">{insight}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4>Recomendación</h4>
              <p className="text-sm text-muted-foreground mt-2">
                {currentResult
                  ? `Basado en tu análisis real de ${type === 'voice' ? 'voz' : 'rostro'}, continua manteniendo tus hábitos positivos. Los patrones detectados muestran un estado emocional ${type === 'voice' ? 'equilibrado' : 'auténtico'}.`
                  : "Continúa manteniendo tus hábitos positivos. Considera practicar ejercicios de respiración para reducir los niveles de ansiedad detectados."
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Ver mi progreso
        </Button>
      </div>
    </div>
  );
}

interface EmotionBarProps {
  name: string;
  value: number;
  color: string;
}

function EmotionBar({ name, value, color }: EmotionBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{name}</span>
        <span className="text-sm">{value}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
