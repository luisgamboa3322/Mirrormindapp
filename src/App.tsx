import React, { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { OnboardingScreen, UserProfile } from "./components/OnboardingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { AnalysisScreen } from "./components/AnalysisScreen";
import { VoiceRecordingScreen } from "./components/VoiceRecordingScreen";
import { FaceRecordingScreen } from "./components/FaceRecordingScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { PortfolioScreen } from "./components/PortfolioScreen";
import { AppComingSoon } from "./components/AppComingSoon";
import { IncidentManagementScreen } from "./components/IncidentManagementScreen";
import { LowFidelityScreen } from "./components/LowFidelityScreen";
import { BottomNav } from "./components/BottomNav";
import { AudioAnalysisResult } from "./hooks/useAudioAnalysis";
import { FaceAnalysisResult } from "./hooks/useFaceAnalysis";

type Screen = 'welcome' | 'onboarding' | 'home' | 'voice-recording' | 'face-recording' | 'analysis' | 'progress' | 'profile' | 'portfolio' | 'coming-soon' | 'incidents' | 'wireframes';
type AnalysisType = 'voice' | 'face' | 'text';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'profile' | 'portfolio'>('home');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('voice');
  const [comingSoonApp, setComingSoonApp] = useState<'BioTune' | 'Silencio'>('BioTune');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [voiceAnalysisResult, setVoiceAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [faceAnalysisResult, setFaceAnalysisResult] = useState<FaceAnalysisResult | null>(null);

  const handleStart = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (userData: UserProfile) => {
    setUserProfile(userData);
    setCurrentScreen('home');
  };

  const handleAnalyze = (type: AnalysisType) => {
    setAnalysisType(type);
    if (type === 'voice') {
      setCurrentScreen('voice-recording');
    } else if (type === 'face') {
      setCurrentScreen('face-recording');
    } else {
      setCurrentScreen('analysis');
    }
  };

  const handleVoiceAnalysisComplete = (result: AudioAnalysisResult) => {
    setVoiceAnalysisResult(result);
    setCurrentScreen('analysis');
  };

  const handleFaceAnalysisComplete = (result: FaceAnalysisResult) => {
    setFaceAnalysisResult(result);
    setCurrentScreen('analysis');
  };

  const handleBackFromVoiceRecording = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const handleBackFromFaceRecording = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const handleBackFromAnalysis = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    setVoiceAnalysisResult(null);
    setFaceAnalysisResult(null);
  };

  const handleTabChange = (tab: 'home' | 'progress' | 'profile' | 'portfolio') => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    if (tab === 'progress') setCurrentScreen('progress');
    if (tab === 'profile') setCurrentScreen('profile');
    if (tab === 'portfolio') setCurrentScreen('portfolio');
  };

  const handleOpenApp = (app: 'mirrormind' | 'biotune' | 'silencio') => {
    if (app === 'mirrormind') {
      setCurrentScreen('home');
      setActiveTab('home');
    } else if (app === 'biotune') {
      setComingSoonApp('BioTune');
      setCurrentScreen('coming-soon');
    } else if (app === 'silencio') {
      setComingSoonApp('Silencio');
      setCurrentScreen('coming-soon');
    }
  };

  const handleBackFromComingSoon = () => {
    setCurrentScreen('portfolio');
    setActiveTab('portfolio');
  };

  const handleNavigateToIncidents = () => {
    setCurrentScreen('incidents');
  };

  const handleBackFromIncidents = () => {
    setCurrentScreen('profile');
    setActiveTab('profile');
  };

  const handleNavigateToWireframes = () => {
    setCurrentScreen('wireframes');
  };

  const handleBackFromWireframes = () => {
    setCurrentScreen('profile');
    setActiveTab('profile');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full max-w-md mx-auto bg-white shadow-xl">
          {currentScreen === 'welcome' && (
            <WelcomeScreen onStart={handleStart} />
          )}
          
          {currentScreen === 'onboarding' && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}
          
          {currentScreen === 'home' && (
            <HomeScreen onAnalyze={handleAnalyze} userName={userProfile?.name} />
          )}
          
          {currentScreen === 'voice-recording' && (
            <VoiceRecordingScreen 
              onBack={handleBackFromVoiceRecording}
              onAnalysisComplete={handleVoiceAnalysisComplete}
            />
          )}
          
          {currentScreen === 'face-recording' && (
            <FaceRecordingScreen 
              onBack={handleBackFromFaceRecording}
              onAnalysisComplete={handleFaceAnalysisComplete}
            />
          )}
          
          {currentScreen === 'analysis' && (
            <AnalysisScreen 
              type={analysisType} 
              onBack={handleBackFromAnalysis}
              voiceAnalysisResult={analysisType === 'voice' ? voiceAnalysisResult : undefined}
              faceAnalysisResult={analysisType === 'face' ? faceAnalysisResult : undefined}
            />
          )}
          
          {currentScreen === 'progress' && (
            <ProgressScreen />
          )}
          
          {currentScreen === 'profile' && (
            <ProfileScreen 
              onNavigateToIncidents={handleNavigateToIncidents}
              onNavigateToWireframes={handleNavigateToWireframes}
              userProfile={userProfile}
            />
          )}
          
          {currentScreen === 'portfolio' && (
            <PortfolioScreen onOpenApp={handleOpenApp} />
          )}
          
          {currentScreen === 'coming-soon' && (
            <AppComingSoon appName={comingSoonApp} onBack={handleBackFromComingSoon} />
          )}
          
          {currentScreen === 'incidents' && (
            <IncidentManagementScreen onBack={handleBackFromIncidents} />
          )}
          
          {currentScreen === 'wireframes' && (
            <LowFidelityScreen onBack={handleBackFromWireframes} />
          )}
        </div>
      </div>

      {/* Bottom Navigation - Only show when not on welcome, onboarding, voice-recording, face-recording, analysis, coming-soon, incidents, or wireframes screen */}
      {currentScreen !== 'welcome' && 
       currentScreen !== 'onboarding' && 
       currentScreen !== 'voice-recording' && 
       currentScreen !== 'face-recording' && 
       currentScreen !== 'analysis' && 
       currentScreen !== 'coming-soon' && 
       currentScreen !== 'incidents' && 
       currentScreen !== 'wireframes' && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}
