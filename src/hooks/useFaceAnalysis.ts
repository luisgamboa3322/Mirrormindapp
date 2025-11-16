import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export interface FaceAnalysisResult {
  emotions: {
    name: string;
    value: number;
    color: string;
  }[];
  mainEmotion: string;
  insights: string[];
  confidence: number;
  faceFeatures: {
    faceDetected: boolean;
    landmarks: any;
    confidence: number;
    symmetryScore: number;
    eyeOpenness: number;
    mouthOpenness: number;
  };
}

interface FaceAnalysisHook {
  isAnalyzing: boolean;
  isCameraReady: boolean;
  faceFeatures: FaceAnalysisResult['faceFeatures'] | null;
  currentEmotions: Array<{ emotion: string; confidence: number }>;
  startAnalysis: () => Promise<void>;
  stopAnalysis: () => Promise<FaceAnalysisResult | null>;
  requestCameraPermission: () => Promise<boolean>;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useFaceAnalysis = (): FaceAnalysisHook => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [faceFeatures, setFaceFeatures] = useState<FaceAnalysisResult['faceFeatures'] | null>(null);
  const [currentEmotions, setCurrentEmotions] = useState<Array<{ emotion: string; confidence: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const emotionsHistoryRef = useRef<Array<Array<{ emotion: string; confidence: number }>>>([]);
  const landmarksHistoryRef = useRef<any[]>([]);

  // Mapeo de emociones a colores
  const emotionColors = {
    'happy': 'bg-yellow-500',
    'sad': 'bg-blue-500',
    'angry': 'bg-red-500',
    'surprised': 'bg-purple-500',
    'neutral': 'bg-gray-500',
    'fearful': 'bg-orange-500',
    'disgusted': 'bg-green-500'
  };

  // Mapeo de emociones a español
  const emotionLabels = {
    'happy': 'Felicidad',
    'sad': 'Tristeza',
    'angry': 'Enojo',
    'surprised': 'Sorpresa',
    'neutral': 'Neutralidad',
    'fearful': 'Miedo',
    'disgusted': 'Disgusto'
  };

  // Cargar modelos de face-api.js
  const loadModels = async () => {
    try {
      setError(null);
      
      const MODEL_URL = '/models'; // Los modelos estarán en public/models
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);

      console.log('Modelos de face-api.js cargados correctamente');
    } catch (err) {
      console.error('Error cargando modelos:', err);
      // Usar modelos por defecto si no se pueden cargar desde /models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/'
        ),
        faceapi.nets.faceLandmark68Net.loadFromUri(
          'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/'
        ),
        faceapi.nets.faceExpressionNet.loadFromUri(
          'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/'
        )
      ]);
      console.log('Modelos cargados desde CDN');
    }
  };

  // Solicitar permisos de cámara
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a cámara');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Cámara frontal
        } 
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsCameraReady(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al acceder a la cámara';
      setError(`Error de permisos: ${errorMessage}`);
      return false;
    }
  }, []);

  // Analizar características faciales
  const analyzeFaceFeatures = useCallback((landmarks: any) => {
    if (!landmarks || !landmarks.positions) return null;

    const positions = landmarks.positions;
    
    // Calcular simetría facial
    const jawline = positions.slice(0, 17);
    const leftEye = positions.slice(36, 42);
    const rightEye = positions.slice(42, 48);
    const nose = positions.slice(27, 36);
    const leftMouth = positions.slice(48, 55);
    const rightMouth = positions.slice(55, 68);

    // Calcular apertura de ojos
    const leftEyeOpenness = Math.abs(leftEye[3].y - leftEye[1].y);
    const rightEyeOpenness = Math.abs(rightEye[3].y - rightEye[1].y);
    const avgEyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;

    // Calcular apertura de boca
    const mouthOpenness = Math.abs(rightMouth[5].y - rightMouth[1].y);

    // Calcular simetría básica
    const centerX = jawline.reduce((sum: number, p: any) => sum + p.x, 0) / jawline.length;
    const symmetryScore = jawline.reduce((score: number, p: any) => {
      const mirroredX = 2 * centerX - p.x;
      const closestPoint = jawline.find((point: any) => Math.abs(point.x - mirroredX) < 10);
      return score + (closestPoint ? 1 : 0);
    }, 0) / jawline.length;

    return {
      faceDetected: true,
      landmarks: landmarks,
      symmetryScore: symmetryScore,
      eyeOpenness: avgEyeOpenness,
      mouthOpenness: mouthOpenness,
      confidence: 0.8 // Face-api.js confidence base
    };
  }, []);

  // Detectar emociones en tiempo real
  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !faceapi.nets.tinyFaceDetector || !faceapi.nets.faceExpressionNet) {
      return;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        const detection = detections[0];
        const expressions = detection.expressions;
        const landmarks = detection.landmarks;

        // Convertir expresiones a array de objetos
        const emotionsArray = Object.entries(expressions).map(([emotion, confidence]) => ({
          emotion,
          confidence: confidence as number
        }));

        // Ordenar por confianza
        emotionsArray.sort((a, b) => b.confidence - a.confidence);
        setCurrentEmotions(emotionsArray);

        // Actualizar características faciales
        const features = analyzeFaceFeatures(landmarks);
        if (features) {
          setFaceFeatures(features);
        }

        // Guardar en historial
        emotionsHistoryRef.current.push(emotionsArray);
        landmarksHistoryRef.current.push(features);

        // Mantener solo los últimos 10 valores
        if (emotionsHistoryRef.current.length > 10) {
          emotionsHistoryRef.current.shift();
          landmarksHistoryRef.current.shift();
        }
      } else {
        // No se detectó rostro
        setCurrentEmotions([]);
        setFaceFeatures(prev => prev ? { ...prev, faceDetected: false } : null);
      }
    } catch (err) {
      console.error('Error en detección de emociones:', err);
    }
  }, [analyzeFaceFeatures]);

  // Generar insights basados en las emociones detectadas
  const generateInsights = (
    emotions: Array<{ emotion: string; confidence: number }>,
    features: FaceAnalysisResult['faceFeatures']
  ): string[] => {
    const insights: string[] = [];

    if (!emotions.length) {
      insights.push('No se detectó rostro. Por favor, asegúrate de estar frente a la cámara.');
      return insights;
    }

    const primaryEmotion = emotions[0];
    const emotionName = emotionLabels[primaryEmotion.emotion as keyof typeof emotionLabels] || primaryEmotion.emotion;

    // Insights basados en emoción principal
    switch (primaryEmotion.emotion) {
      case 'happy':
        insights.push('Tu expresión facial refleja happiness y positividad');
        if (features && features.symmetryScore > 0.8) {
          insights.push('Alta simetría facial detected, indicando autenticidad emocional');
        }
        break;
      case 'sad':
        insights.push('Tus expresiones muestran tristeza y introspección');
        if (features && features.eyeOpenness < 10) {
          insights.push('Ojos ligeramente cerrados pueden indicar tristeza profunda');
        }
        break;
      case 'angry':
        insights.push('Se detectan expresiones de enojo o frustración');
        insights.push('La tensión facial puede estar relacionada con estrés');
        break;
      case 'surprised':
        insights.push('Tu rostro muestra sorpresa o asombro');
        insights.push('Las cejas elevadas indican curiosidad o sorpresa');
        break;
      case 'neutral':
        insights.push('Tu expresión es calm y equilibrada');
        insights.push('Estado emocional neutro, buena base para el análisis');
        break;
      case 'fearful':
        insights.push('Se detectan señales de miedo o ansiedad');
        insights.push('Considera técnicas de relajación si esto persiste');
        break;
      case 'disgusted':
        insights.push('Expresiones de disgusto o desaprobación');
        insights.push('Puede estar relacionado con estímulos externos negativos');
        break;
    }

    // Insights basados en características faciales
    if (features) {
      if (features.symmetryScore < 0.6) {
        insights.push('Asimetría facial detectada, posible tensión muscular');
      }

      if (features.mouthOpenness > 20) {
        insights.push('Boca abierta sugiere sorpresa o expresiones de stress');
      }

      if (features.eyeOpenness < 5) {
        insights.push('Ojos entrecerrados pueden indicar fatiga o tristeza');
      }
    }

    // Insights basados en patrones históricos
    if (emotionsHistoryRef.current.length > 3) {
      const emotionVariations = emotionsHistoryRef.current.reduce((acc, emotions) => {
        const topEmotion = emotions[0]?.emotion;
        acc[topEmotion] = (acc[topEmotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonEmotion = Object.entries(emotionVariations)
        .sort(([, a], [, b]) => b - a)[0];

      if (mostCommonEmotion && mostCommonEmotion[1] > emotionsHistoryRef.current.length * 0.6) {
        insights.push(`Tu estado emocional predominante es ${emotionLabels[mostCommonEmotion[0] as keyof typeof emotionLabels] || mostCommonEmotion[0]}`);
      }
    }

    return insights;
  };

  // Calcular emoción principal y valores finales
  const calculateFinalEmotions = (emotionsHistory: Array<Array<{ emotion: string; confidence: number }>>) => {
    if (emotionsHistory.length === 0) {
      return [
        { name: 'Neutralidad', value: 70, color: 'bg-gray-500' },
        { name: 'Felicidad', value: 30, color: 'bg-yellow-500' }
      ];
    }

    // Promedio de emociones en el historial
    const emotionTotals: Record<string, { total: number; count: number }> = {};
    
    emotionsHistory.forEach(emotions => {
      emotions.forEach(({ emotion, confidence }) => {
        if (!emotionTotals[emotion]) {
          emotionTotals[emotion] = { total: 0, count: 0 };
        }
        emotionTotals[emotion].total += confidence;
        emotionTotals[emotion].count += 1;
      });
    });

    // Convertir a porcentajes
    const emotionAverages = Object.entries(emotionTotals).map(([emotion, { total, count }]) => ({
      emotion,
      average: total / count
    }));

    const total = emotionAverages.reduce((sum, { average }) => sum + average, 0);
    
    const finalEmotions = emotionAverages
      .map(({ emotion, average }) => ({
        name: emotionLabels[emotion as keyof typeof emotionLabels] || emotion,
        value: Math.round((average / total) * 100),
        color: emotionColors[emotion as keyof typeof emotionColors] || 'bg-gray-500'
      }))
      .sort((a, b) => b.value - a.value);

    return finalEmotions;
  };

  // Iniciar análisis
  const startAnalysis = useCallback(async () => {
    try {
      setError(null);
      setIsAnalyzing(true);
      emotionsHistoryRef.current = [];
      landmarksHistoryRef.current = [];

      // Cargar modelos si no están cargados
      if (!faceapi.nets.tinyFaceDetector) {
        console.log('Cargando modelos de face-api.js...');
        await loadModels();
        console.log('Modelos cargados exitosamente');
      }

      // Solicitar permisos de cámara si no están listos
      if (!isCameraReady) {
        console.log('Solicitando permisos de cámara...');
        const granted = await requestCameraPermission();
        if (!granted) {
          setIsAnalyzing(false);
          return;
        }
      }

      // Asegurar que el stream esté asignado al video
      if (streamRef.current && videoRef.current) {
        console.log('Asignando stream al video element...');
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();
        console.log('Stream asignado y reproduciendo');
      }

      // Iniciar detección cada 500ms
      console.log('Iniciando detección de emociones...');
      intervalRef.current = setInterval(detectEmotions, 500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al iniciar análisis';
      console.error('Error al iniciar análisis:', err);
      setError(`Error al iniciar análisis: ${errorMessage}`);
      setIsAnalyzing(false);
    }
  }, [isCameraReady, requestCameraPermission, detectEmotions]);

  // Detener análisis
  const stopAnalysis = useCallback(async (): Promise<FaceAnalysisResult | null> => {
    if (!isAnalyzing) return null;

    setIsAnalyzing(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      // Calcular resultados finales
      const finalEmotions = calculateFinalEmotions(emotionsHistoryRef.current);
      const primaryEmotion = finalEmotions[0];
      const finalFeatures = landmarksHistoryRef.current[landmarksHistoryRef.current.length - 1];
      const insights = generateInsights(currentEmotions, finalFeatures);

      const result: FaceAnalysisResult = {
        emotions: finalEmotions,
        mainEmotion: primaryEmotion?.name || 'Neutralidad',
        insights,
        confidence: currentEmotions.length > 0 ? currentEmotions[0].confidence : 0.5,
        faceFeatures: finalFeatures || {
          faceDetected: false,
          landmarks: null,
          confidence: 0,
          symmetryScore: 0,
          eyeOpenness: 0,
          mouthOpenness: 0
        }
      };

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al detener análisis';
      setError(`Error al analizar rostro: ${errorMessage}`);
      return null;
    }
  }, [isAnalyzing, currentEmotions]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isAnalyzing,
    isCameraReady,
    faceFeatures,
    currentEmotions,
    startAnalysis,
    stopAnalysis,
    requestCameraPermission,
    error,
    videoRef
  };
};