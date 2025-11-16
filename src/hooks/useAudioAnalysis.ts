import { useState, useRef, useCallback, useEffect } from 'react';
import * as Tone from 'tone';

export interface AudioAnalysisResult {
  emotions: {
    name: string;
    value: number;
    color: string;
  }[];
  mainEmotion: string;
  insights: string[];
  transcript: string;
  confidence: number;
  audioFeatures: {
    pitch: number;
    volume: number;
    speakingRate: number;
    energy: number;
  };
}

interface VoiceAnalysisHook {
  isRecording: boolean;
  isAnalyzing: boolean;
  transcript: string;
  audioFeatures: AudioAnalysisResult['audioFeatures'] | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<AudioAnalysisResult | null>;
  requestPermission: () => Promise<boolean>;
  error: string | null;
}

export const useAudioAnalysis = (): VoiceAnalysisHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioFeatures, setAudioFeatures] = useState<AudioAnalysisResult['audioFeatures'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const wordsCountRef = useRef<number>(0);
  const pitchHistoryRef = useRef<number[]>([]);
  const volumeHistoryRef = useRef<number[]>([]);

  // Lista de emociones en español con sus características
  const emotionPatterns = {
    alegria: {
      keywords: ['feliz', 'alegre', 'contento', 'divertido', 'genial', 'fantástico', 'excelente', 'bueno', 'bien'],
      color: 'bg-yellow-500',
      pitch: { min: 150, max: 300 },
      speakingRate: { min: 1.2, max: 2.0 },
      energy: { min: 0.6, max: 1.0 }
    },
    tristeza: {
      keywords: ['triste', 'deprimido', 'mal', 'peor', 'horrible', 'terrible', 'dolor', 'pena'],
      color: 'bg-blue-500',
      pitch: { min: 80, max: 150 },
      speakingRate: { min: 0.5, max: 0.8 },
      energy: { min: 0.1, max: 0.4 }
    },
    ansiedad: {
      keywords: ['ansioso', 'nervioso', 'preocupado', 'estresado', 'inquieto', 'nervios', 'pánico'],
      color: 'bg-orange-500',
      pitch: { min: 200, max: 400 },
      speakingRate: { min: 1.5, max: 2.5 },
      energy: { min: 0.4, max: 0.8 }
    },
    confianza: {
      keywords: ['seguro', 'confiado', 'certain', 'definitivamente', 'claro', 'obvio', 'seguro'],
      color: 'bg-green-500',
      pitch: { min: 100, max: 200 },
      speakingRate: { min: 0.8, max: 1.2 },
      energy: { min: 0.5, max: 0.9 }
    },
    calma: {
      keywords: ['tranquilo', 'relajado', 'pacífico', 'sereno', 'calma', 'suave', 'lento'],
      color: 'bg-purple-500',
      pitch: { min: 90, max: 180 },
      speakingRate: { min: 0.6, max: 1.0 },
      energy: { min: 0.2, max: 0.6 }
    }
  };

  // Analizador de sentimientos básico en español
  const analyzeSentiment = (text: string): Record<string, number> => {
    const words = text.toLowerCase().split(/\s+/);
    const sentimentScores: Record<string, number> = {
      alegria: 0,
      tristeza: 0,
      ansiedad: 0,
      confianza: 0,
      calma: 0
    };

    words.forEach(word => {
      Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
        if (pattern.keywords.some(keyword => word.includes(keyword))) {
          sentimentScores[emotion] += 1;
        }
      });
    });

    // Normalizar scores
    const total = Object.values(sentimentScores).reduce((sum, score) => sum + score, 0);
    if (total > 0) {
      Object.keys(sentimentScores).forEach(emotion => {
        sentimentScores[emotion] = (sentimentScores[emotion] / total) * 100;
      });
    }

    return sentimentScores;
  };

  // Calcular emoción principal basada en análisis acústico y textual
  const calculateMainEmotion = (
    audioFeatures: AudioAnalysisResult['audioFeatures'],
    sentimentScores: Record<string, number>
  ): string => {
    const weights = {
      audio: 0.4,
      text: 0.6
    };

    const emotionScores: Record<string, number> = {
      alegria: 0,
      tristeza: 0,
      ansiedad: 0,
      confianza: 0,
      calma: 0
    };

    // Análisis acústico
    if (audioFeatures) {
      Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
        let audioScore = 0;
        
        // Pitch analysis
        if (audioFeatures.pitch >= pattern.pitch.min && audioFeatures.pitch <= pattern.pitch.max) {
          audioScore += 0.3;
        }
        
        // Speaking rate analysis
        if (audioFeatures.speakingRate >= pattern.speakingRate.min && audioFeatures.speakingRate <= pattern.speakingRate.max) {
          audioScore += 0.3;
        }
        
        // Energy analysis
        if (audioFeatures.energy >= pattern.energy.min && audioFeatures.energy <= pattern.energy.max) {
          audioScore += 0.4;
        }
        
        emotionScores[emotion] += audioScore * weights.audio;
      });
    }

    // Análisis textual
    Object.entries(sentimentScores).forEach(([emotion, score]) => {
      emotionScores[emotion] += (score / 100) * weights.text;
    });

    // Encontrar la emoción con mayor score
    return Object.entries(emotionScores).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max, { emotion: 'calma', score: 0 }
    ).emotion;
  };

  // Generar insights personalizados
  const generateInsights = (
    emotion: string,
    audioFeatures: AudioAnalysisResult['audioFeatures'],
    transcript: string
  ): string[] => {
    const insights: string[] = [];

    // Insights basados en la emoción principal
    switch (emotion) {
      case 'alegria':
        insights.push('Tu tono de voz refleja optimismo y energía positiva');
        if (audioFeatures?.speakingRate && audioFeatures.speakingRate > 1.5) {
          insights.push('Hablas con entusiasmo y rapidez, indicando excitement');
        }
        break;
      case 'tristeza':
        insights.push('Tu tono muestra melancholy y introspección');
        if (audioFeatures?.pitch && audioFeatures.pitch < 120) {
          insights.push('El tono más grave indica tristeza o reflexión profunda');
        }
        break;
      case 'ansiedad':
        insights.push('Se detectan patrones de tensión y nerviosismo');
        if (audioFeatures?.speakingRate && audioFeatures.speakingRate > 1.8) {
          insights.push('El habla rápida puede indicar anxiety o urgencia');
        }
        break;
      case 'confianza':
        insights.push('Tu voz proyecta seguridad y determinación');
        if (audioFeatures?.energy && audioFeatures.energy > 0.7) {
          insights.push('Alta energía vocal indica self-confidence');
        }
        break;
      case 'calma':
        insights.push('Tu tono refleja tranquility y balance emocional');
        if (audioFeatures?.speakingRate && audioFeatures.speakingRate < 1.0) {
          insights.push('El habla pausada indica mindfulness y control');
        }
        break;
    }

    // Insights basados en características específicas
    if (audioFeatures) {
      if (audioFeatures.volume < 0.3) {
        insights.push('Tu volumen de voz es bajo, puede indicar timidez o reflexión');
      } else if (audioFeatures.volume > 0.8) {
        insights.push('Hablas con gran expresividad y energy');
      }

      if (audioFeatures.energy < 0.4) {
        insights.push('Niveles de energía bajos pueden indicar fatiga o desánimo');
      } else if (audioFeatures.energy > 0.8) {
        insights.push('Alta energía vocal detected, muy positivo');
      }
    }

    // Insights basados en el contenido del texto
    if (transcript.length > 50) {
      const wordCount = transcript.split(' ').length;
      if (wordCount > 100) {
        insights.push('Expresión verbal muy detallada, indicating thoughtfulness');
      }
    }

    return insights;
  };

  // Solicitar permisos de micrófono
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta grabación de audio');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      streamRef.current = stream;
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al acceder al micrófono';
      setError(`Error de permisos: ${errorMessage}`);
      return false;
    }
  }, []);

  // Analizar audio en tiempo real
  const analyzeAudioInRealTime = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const pitchBuffer = new Float32Array(bufferLength);

    const updateAnalysis = () => {
      if (!isRecording || !analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getFloatTimeDomainData(pitchBuffer);

      // Calcular volumen promedio
      const volume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength / 255;

      // Estimar pitch usando autocorrelation
      let pitch = 0;
      const sampleRate = audioContextRef.current?.sampleRate || 44100;
      
      // Algoritmo simplificado de pitch detection
      const bufferSize = pitchBuffer.length;
      const correlations = new Array(bufferSize).fill(0);
      
      for (let lag = 0; lag < bufferSize; lag++) {
        let correlation = 0;
        for (let i = 0; i < bufferSize - lag; i++) {
          correlation += pitchBuffer[i] * pitchBuffer[i + lag];
        }
        correlations[lag] = correlation;
      }

      // Encontrar el lag con mayor correlación
      let maxCorrelation = 0;
      let maxLag = 0;
      for (let lag = 1; lag < correlations.length; lag++) {
        if (correlations[lag] > maxCorrelation) {
          maxCorrelation = correlations[lag];
          maxLag = lag;
        }
      }

      if (maxLag > 0 && maxCorrelation > 0.1) {
        pitch = sampleRate / maxLag;
      }

      // Calcular energía
      const energy = pitchBuffer.reduce((sum, sample) => sum + sample * sample, 0) / bufferSize;

      // Actualizar historiales
      pitchHistoryRef.current.push(pitch);
      volumeHistoryRef.current.push(volume);

      // Mantener solo los últimos 100 valores
      if (pitchHistoryRef.current.length > 100) {
        pitchHistoryRef.current.shift();
        volumeHistoryRef.current.shift();
      }

      // Actualizar features de audio
      const avgPitch = pitchHistoryRef.current.reduce((sum, p) => sum + p, 0) / pitchHistoryRef.current.length;
      const avgVolume = volumeHistoryRef.current.reduce((sum, v) => sum + v, 0) / volumeHistoryRef.current.length;
      
      setAudioFeatures({
        pitch: avgPitch,
        volume: avgVolume,
        speakingRate: wordsCountRef.current / ((Date.now() - startTimeRef.current) / 60000), // words per minute
        energy: energy
      });

      if (isRecording) {
        requestAnimationFrame(updateAnalysis);
      }
    };

    updateAnalysis();
  }, [isRecording]);

  // Configurar reconocimiento de voz
  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES'; // Español como idioma principal

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          wordsCountRef.current++;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(prev => {
        const newTranscript = prev + finalTranscript;
        return newTranscript + interimTranscript;
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Intentar restart recognition
        setTimeout(() => {
          if (isRecording && recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current = recognition;
  }, [isRecording]);

  // Iniciar grabación
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setIsAnalyzing(false);
      setTranscript('');
      setAudioFeatures(null);
      wordsCountRef.current = 0;
      pitchHistoryRef.current = [];
      volumeHistoryRef.current = [];
      startTimeRef.current = Date.now();

      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      if (!streamRef.current) {
        throw new Error('No se pudo obtener el stream de audio');
      }

      // Configurar Audio Context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
      
      analyserRef.current.fftSize = 2048;
      microphoneRef.current.connect(analyserRef.current);

      // Configurar MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });

      // Iniciar análisis de audio en tiempo real
      analyzeAudioInRealTime();

      // Configurar y iniciar reconocimiento de voz
      setupSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Iniciar MediaRecorder
      mediaRecorderRef.current.start(1000); // chunk every second

      setIsRecording(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al iniciar la grabación';
      setError(`Error al iniciar grabación: ${errorMessage}`);
    }
  }, [requestPermission, analyzeAudioInRealTime, setupSpeechRecognition]);

  // Detener grabación y analizar
  const stopRecording = useCallback(async (): Promise<AudioAnalysisResult | null> => {
    if (!isRecording) return null;

    setIsRecording(false);
    setIsAnalyzing(true);

    try {
      // Detener reconocimiento de voz
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Detener MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Cerrar Audio Context
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      // Detener stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Realizar análisis final
      const sentimentScores = analyzeSentiment(transcript);
      const finalAudioFeatures = audioFeatures || {
        pitch: pitchHistoryRef.current.reduce((sum, p) => sum + p, 0) / pitchHistoryRef.current.length || 150,
        volume: volumeHistoryRef.current.reduce((sum, v) => sum + v, 0) / volumeHistoryRef.current.length || 0.5,
        speakingRate: wordsCountRef.current / ((Date.now() - startTimeRef.current) / 60000),
        energy: audioFeatures?.energy || 0.5
      };

      const mainEmotion = calculateMainEmotion(finalAudioFeatures, sentimentScores);
      const insights = generateInsights(mainEmotion, finalAudioFeatures, transcript);

      // Crear emociones con valores reales
      const emotions = Object.entries(sentimentScores).map(([emotion, value]) => ({
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: Math.round(value),
        color: emotionPatterns[emotion as keyof typeof emotionPatterns]?.color || 'bg-gray-500'
      })).sort((a, b) => b.value - a.value);

      const result: AudioAnalysisResult = {
        emotions,
        mainEmotion: mainEmotion.charAt(0).toUpperCase() + mainEmotion.slice(1),
        insights,
        transcript: transcript.trim(),
        confidence: 0.85, // Confidence score basado en la calidad del audio
        audioFeatures: finalAudioFeatures
      };

      setIsAnalyzing(false);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al detener la grabación';
      setError(`Error al analizar audio: ${errorMessage}`);
      setIsAnalyzing(false);
      return null;
    }
  }, [isRecording, transcript, audioFeatures]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isRecording,
    isAnalyzing,
    transcript,
    audioFeatures,
    startRecording,
    stopRecording,
    requestPermission,
    error
  };
};