import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Mic, 
  Square, 
  Pause, 
  Play,
  Volume2,
  Activity,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAudioAnalysis, AudioAnalysisResult } from '../hooks/useAudioAnalysis';

interface VoiceRecordingScreenProps {
  onBack: () => void;
  onAnalysisComplete: (result: AudioAnalysisResult) => void;
}

export function VoiceRecordingScreen({ onBack, onAnalysisComplete }: VoiceRecordingScreenProps) {
  const {
    isRecording,
    isAnalyzing,
    transcript,
    audioFeatures,
    startRecording,
    stopRecording,
    requestPermission,
    error
  } = useAudioAnalysis();

  const [recordingTime, setRecordingTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const timerRef = useRef<number | null>(null);

  // Timer para el tiempo de grabación
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Solicitar permisos al montar el componente
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestPermission();
      setHasPermission(granted);
    };
    checkPermission();
  }, [requestPermission]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
    }
  };

  const handleStopRecording = async () => {
    const result = await stopRecording();
    if (result) {
      onAnalysisComplete(result);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionFromFeatures = (features: typeof audioFeatures) => {
    if (!features) return { color: 'bg-gray-400', label: 'Analizando...' };
    
    // Lógica simple para determinar el estado emocional basado en características
    if (features.energy > 0.7 && features.speakingRate > 1.2) {
      return { color: 'bg-green-500', label: 'Energético' };
    } else if (features.energy < 0.3 && features.speakingRate < 0.8) {
      return { color: 'bg-blue-500', label: 'Calmado' };
    } else if (features.speakingRate > 1.8) {
      return { color: 'bg-orange-500', label: 'Excitado' };
    }
    return { color: 'bg-purple-500', label: 'Neutral' };
  };

  if (hasPermission === null) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3>Solicitando permisos de micrófono</h3>
            <p className="text-sm text-muted-foreground">
              MirrorMind necesita acceso a tu micrófono para analizar tu voz
            </p>
            <Progress value={100} className="h-2" />
          </div>
        </Card>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h3>Permisos denegados</h3>
            <p className="text-sm text-muted-foreground">
              MirrorMind necesita acceso a tu micrófono para funcionar. 
              Por favor, habilita los permisos en la configuración de tu navegador.
            </p>
            <Button 
              onClick={async () => {
                const granted = await requestPermission();
                setHasPermission(granted);
              }}
              className="w-full"
            >
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h3>Analizando tu voz...</h3>
              <p className="text-sm text-muted-foreground">
                Procesando tono, emoción y contenido emocional
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Transcripción</span>
                <span>Análisis de tono</span>
                <span>Detección emocional</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentEmotion = audioFeatures ? getEmotionFromFeatures(audioFeatures) : null;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-purple-50 to-blue-50">
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
          <div className="text-5xl mb-2">🎤</div>
          <h2>Grabación de Voz</h2>
          <Badge className="bg-white/20 text-white border-0">
            {isRecording ? 'Grabando...' : 'Listo para grabar'}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Control de grabación principal */}
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Visualizador de ondas simulado */}
            <div className="relative">
              <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? 'border-red-500 bg-red-50 animate-pulse shadow-lg shadow-red-200' 
                  : 'border-purple-500 bg-purple-50 hover:bg-purple-100'
              }`}>
                <div className="text-center">
                  {isRecording ? (
                    <Square className="w-8 h-8 text-red-500 mx-auto" />
                  ) : (
                    <Mic className="w-8 h-8 text-purple-500 mx-auto" />
                  )}
                </div>
              </div>
              
              {/* Indicadores de actividad */}
              {isRecording && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>

            {/* Tiempo de grabación */}
            {isRecording && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
              </div>
            )}

            {/* Estado emocional en tiempo real */}
            {audioFeatures && currentEmotion && (
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentEmotion.color}`}></div>
                <span className="text-sm text-muted-foreground">{currentEmotion.label}</span>
              </div>
            )}

            {/* Controles */}
            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Grabación
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  size="lg"
                  variant="destructive"
                  className="px-8"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Detener y Analizar
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Transcripción en tiempo real */}
        {showTranscript && transcript && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3>Transcripción en Tiempo Real</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranscript(false)}
              >
                Ocultar
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto">
              <p className="text-sm leading-relaxed">
                {transcript || (isRecording ? 'Escuchando...' : 'Inicia la grabación para ver la transcripción')}
              </p>
            </div>
            
            {isRecording && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Transcripción activa</span>
              </div>
            )}
          </Card>
        )}

        {/* Características de audio en tiempo real */}
        {audioFeatures && isRecording && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-purple-600" />
              <h3>Análisis en Tiempo Real</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Volumen</span>
                  <span>{Math.round(audioFeatures.volume * 100)}%</span>
                </div>
                <Progress value={audioFeatures.volume * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energía</span>
                  <span>{Math.round(audioFeatures.energy * 100)}%</span>
                </div>
                <Progress value={audioFeatures.energy * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tono (Hz)</span>
                  <span>{Math.round(audioFeatures.pitch)}</span>
                </div>
                <Progress value={(audioFeatures.pitch / 400) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Velocidad</span>
                  <span>{audioFeatures.speakingRate.toFixed(1)}x</span>
                </div>
                <Progress value={Math.min(audioFeatures.speakingRate * 50, 100)} className="h-2" />
              </div>
            </div>
          </Card>
        )}

        {/* Botón para mostrar transcripción */}
        {!showTranscript && transcript && (
          <Button
            onClick={() => setShowTranscript(true)}
            variant="outline"
            className="w-full"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ver Transcripción ({transcript.length} caracteres)
          </Button>
        )}

        {/* Error */}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error de grabación</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Instrucciones */}
        {!isRecording && !transcript && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Cómo usar el análisis de voz</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Haz clic en "Iniciar Grabación" para comenzar</li>
                  <li>• Habla con naturalidad durante 30 segundos a 2 minutos</li>
                  <li>• Ve la transcripción y análisis en tiempo real</li>
                  <li>• Haz clic en "Detener y Analizar" cuando termines</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}