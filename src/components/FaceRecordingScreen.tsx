import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Camera, 
  Square, 
  Play,
  Eye,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle2,
  Activity,
  User
} from 'lucide-react';
import { useFaceAnalysis, FaceAnalysisResult } from '../hooks/useFaceAnalysis';

interface FaceRecordingScreenProps {
  onBack: () => void;
  onAnalysisComplete: (result: FaceAnalysisResult) => void;
}

export function FaceRecordingScreen({ onBack, onAnalysisComplete }: FaceRecordingScreenProps) {
  const {
    isAnalyzing,
    isCameraReady,
    faceFeatures,
    currentEmotions,
    startAnalysis,
    stopAnalysis,
    requestCameraPermission,
    error,
    videoRef
  } = useFaceAnalysis();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analysisTime, setAnalysisTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Timer para el tiempo de análisis
  useEffect(() => {
    if (isAnalyzing) {
      timerRef.current = window.setInterval(() => {
        setAnalysisTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setAnalysisTime(0);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isAnalyzing]);

  // Solicitar permisos al montar el componente
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
    };
    checkPermission();
  }, [requestCameraPermission]);

  const handleStartAnalysis = async () => {
    try {
      await startAnalysis();
    } catch (err) {
      console.error('Error al iniciar análisis:', err);
    }
  };

  const handleStopAnalysis = async () => {
    const result = await stopAnalysis();
    if (result) {
      onAnalysisComplete(result);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentEmotionDisplay = () => {
    if (!currentEmotions.length) return { color: 'bg-gray-400', label: 'Esperando...' };
    
    const primaryEmotion = currentEmotions[0];
    const emotionColors = {
      'happy': { color: 'bg-yellow-500', label: '😊 Feliz' },
      'sad': { color: 'bg-blue-500', label: '😢 Triste' },
      'angry': { color: 'bg-red-500', label: '😠 Enojado' },
      'surprised': { color: 'bg-purple-500', label: '😮 Sorprendido' },
      'neutral': { color: 'bg-gray-500', label: '😐 Neutral' },
      'fearful': { color: 'bg-orange-500', label: '😨 Miedo' },
      'disgusted': { color: 'bg-green-500', label: '🤢 Disgusto' }
    };

    return emotionColors[primaryEmotion.emotion as keyof typeof emotionColors] || { 
      color: 'bg-gray-400', 
      label: primaryEmotion.emotion 
    };
  };

  const currentEmotionDisplay = getCurrentEmotionDisplay();

  if (hasPermission === null) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center animate-pulse">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3>Solicitando permisos de cámara</h3>
            <p className="text-sm text-muted-foreground">
              MirrorMind necesita acceso a tu cámara para analizar tus expresiones faciales
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
            <h3>Permisos de cámara denegados</h3>
            <p className="text-sm text-muted-foreground">
              MirrorMind necesita acceso a tu cámara para analizar tus expresiones faciales. 
              Por favor, habilita los permisos en la configuración de tu navegador.
            </p>
            <Button 
              onClick={async () => {
                const granted = await requestCameraPermission();
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
      <div className="h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6">
          <div className="text-center space-y-2">
            <div className="text-5xl mb-2">📷</div>
            <h2>Análisis Facial en Progreso</h2>
            <Badge className="bg-white/20 text-white border-0">
              Analizando...
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Vista de cámara durante análisis */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  style={{ transform: 'scaleX(-1)' }}
                />

                {/* Overlay de detección */}
                {faceFeatures?.faceDetected && (
                  <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                    <div className="absolute top-2 left-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Indicador de estado */}
                <div className="absolute bottom-2 left-2">
                  <Badge
                    variant={faceFeatures?.faceDetected ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {faceFeatures?.faceDetected ? "Rostro detectado" : "Buscando rostro"}
                  </Badge>
                </div>
              </div>

              {/* Tiempo de análisis */}
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Activity className="w-4 h-4" />
                <span className="text-lg font-mono">{formatTime(analysisTime)}</span>
              </div>

              {/* Emoción actual en tiempo real */}
              {currentEmotions.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getCurrentEmotionDisplay().color}`}></div>
                  <span className="text-sm text-muted-foreground">{getCurrentEmotionDisplay().label}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(currentEmotions[0].confidence * 100)}%)
                  </span>
                </div>
              )}

              {/* Barra de progreso */}
              <div className="space-y-2">
                <Progress value={100} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Detección facial</span>
                  <span>Análisis emocional</span>
                  <span>Características</span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleStopAnalysis}
                  size="lg"
                  variant="destructive"
                  className="px-8"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Detener y Analizar
                </Button>
              </div>
            </div>
          </Card>

          {/* Emociones detectadas en tiempo real */}
          {currentEmotions.length > 0 && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Smile className="w-5 h-5 text-blue-600" />
                <h3>Emociones en Tiempo Real</h3>
              </div>

              <div className="space-y-3">
                {currentEmotions.slice(0, 4).map(({ emotion, confidence }, index) => (
                  <div key={emotion} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20">
                      {emotion === 'happy' && '😊 Feliz'}
                      {emotion === 'sad' && '😢 Triste'}
                      {emotion === 'angry' && '😠 Enojo'}
                      {emotion === 'surprised' && '😮 Sorpresa'}
                      {emotion === 'neutral' && '😐 Neutral'}
                      {emotion === 'fearful' && '😨 Miedo'}
                      {emotion === 'disgusted' && '🤢 Disgusto'}
                      {!['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted'].includes(emotion) && emotion}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Características faciales en tiempo real */}
          {faceFeatures && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3>Características Faciales</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Simetría</span>
                    <span className="font-medium">{Math.round(faceFeatures.symmetryScore * 100)}%</span>
                  </div>
                  <Progress value={faceFeatures.symmetryScore * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Apertura ojos</span>
                    <span className="font-medium">{Math.round(faceFeatures.eyeOpenness)}%</span>
                  </div>
                  <Progress value={Math.min(faceFeatures.eyeOpenness, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Apertura boca</span>
                    <span className="font-medium">{Math.round(faceFeatures.mouthOpenness)}%</span>
                  </div>
                  <Progress value={Math.min(faceFeatures.mouthOpenness, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confianza</span>
                    <span className="font-medium">{Math.round(faceFeatures.confidence * 100)}%</span>
                  </div>
                  <Progress value={faceFeatures.confidence * 100} className="h-2" />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-white hover:bg-white/20 mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">📷</div>
          <h2>Análisis Facial</h2>
          <Badge className="bg-white/20 text-white border-0">
            {isAnalyzing ? 'Analizando...' : 'Listo para analizar'}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Vista de cámara */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                style={{ transform: 'scaleX(-1)' }} // Mirror effect
              />
              
              {/* Overlay de detección */}
              {faceFeatures?.faceDetected && (
                <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              {/* Indicador de estado */}
              <div className="absolute bottom-2 left-2">
                <Badge 
                  variant={faceFeatures?.faceDetected ? "default" : "secondary"}
                  className="text-xs"
                >
                  {faceFeatures?.faceDetected ? "Rostro detectado" : "Buscando rostro"}
                </Badge>
              </div>
            </div>

            {/* Tiempo de análisis */}
            {isAnalyzing && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Activity className="w-4 h-4" />
                <span className="text-lg font-mono">{formatTime(analysisTime)}</span>
              </div>
            )}

            {/* Emoción actual en tiempo real */}
            {currentEmotions.length > 0 && (
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentEmotionDisplay.color}`}></div>
                <span className="text-sm text-muted-foreground">{currentEmotionDisplay.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(currentEmotions[0].confidence * 100)}%)
                </span>
              </div>
            )}

            {/* Controles */}
            <div className="flex justify-center gap-4">
              {!isAnalyzing ? (
                <Button
                  onClick={handleStartAnalysis}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Análisis
                </Button>
              ) : (
                <Button
                  onClick={handleStopAnalysis}
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

        {/* Emociones detectadas en tiempo real */}
        {currentEmotions.length > 0 && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-5 h-5 text-blue-600" />
              <h3>Emociones en Tiempo Real</h3>
            </div>
            
            <div className="space-y-3">
              {currentEmotions.slice(0, 4).map(({ emotion, confidence }, index) => (
                <div key={emotion} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-20">
                    {emotion === 'happy' && '😊 Feliz'}
                    {emotion === 'sad' && '😢 Triste'}
                    {emotion === 'angry' && '😠 Enojo'}
                    {emotion === 'surprised' && '😮 Sorpresa'}
                    {emotion === 'neutral' && '😐 Neutral'}
                    {emotion === 'fearful' && '😨 Miedo'}
                    {emotion === 'disgusted' && '🤢 Disgusto'}
                    {!['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted'].includes(emotion) && emotion}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Características faciales en tiempo real */}
        {faceFeatures && isAnalyzing && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3>Características Faciales</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Simetría</span>
                  <span className="font-medium">{Math.round(faceFeatures.symmetryScore * 100)}%</span>
                </div>
                <Progress value={faceFeatures.symmetryScore * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Apertura ojos</span>
                  <span className="font-medium">{Math.round(faceFeatures.eyeOpenness)}%</span>
                </div>
                <Progress value={Math.min(faceFeatures.eyeOpenness, 100)} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Apertura boca</span>
                  <span className="font-medium">{Math.round(faceFeatures.mouthOpenness)}%</span>
                </div>
                <Progress value={Math.min(faceFeatures.mouthOpenness, 100)} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confianza</span>
                  <span className="font-medium">{Math.round(faceFeatures.confidence * 100)}%</span>
                </div>
                <Progress value={faceFeatures.confidence * 100} className="h-2" />
              </div>
            </div>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error de análisis</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Instrucciones */}
        {!isAnalyzing && !error && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Cómo usar el análisis facial</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Haz clic en "Iniciar Análisis" para comenzar</li>
                  <li>• Mira directamente a la cámara con buena iluminación</li>
                  <li>• Expresa tus emociones de forma natural</li>
                  <li>• Mantén tu rostro visible durante 10-30 segundos</li>
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