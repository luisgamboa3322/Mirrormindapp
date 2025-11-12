import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Square, Circle, Menu, Home, TrendingUp, User, Target } from "lucide-react";

interface LowFidelityScreenProps {
  onBack: () => void;
}

export function LowFidelityScreen({ onBack }: LowFidelityScreenProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-800 p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 -ml-2 border border-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h2 className="mb-2">Wireframes - Baja Fidelidad</h2>
        <p className="text-sm text-gray-600">
          Mockups esquemáticos de MirrorMind
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Welcome Screen Wireframe */}
        <WireframeSection title="1. Pantalla de Bienvenida">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 border-4 border-gray-800 rounded-full flex items-center justify-center mb-6">
              <Circle className="w-12 h-12" />
            </div>
            <div className="w-48 h-6 bg-gray-800 mb-3"></div>
            <div className="w-40 h-4 bg-gray-400 mb-8"></div>
            <div className="space-y-2 w-full">
              <div className="w-full h-3 bg-gray-300"></div>
              <div className="w-full h-3 bg-gray-300"></div>
              <div className="w-3/4 h-3 bg-gray-300"></div>
            </div>
            <div className="mt-auto w-48 h-12 border-4 border-gray-800 flex items-center justify-center">
              COMENZAR
            </div>
          </div>
        </WireframeSection>

        {/* Home Screen Wireframe */}
        <WireframeSection title="2. Pantalla Principal">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
              <div className="w-32 h-5 bg-white mb-2"></div>
              <div className="w-24 h-3 bg-gray-400"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-4">
              {/* Welcome Card */}
              <div className="border-2 border-gray-800 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 border-2 border-gray-800 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-800 mb-1"></div>
                    <div className="w-32 h-3 bg-gray-400"></div>
                  </div>
                </div>
              </div>

              {/* Analysis Options */}
              <div>
                <div className="w-32 h-4 bg-gray-800 mb-3"></div>
                <div className="space-y-3">
                  <AnalysisCard icon="🎤" label="Voz" />
                  <AnalysisCard icon="😊" label="Expresión" />
                  <AnalysisCard icon="📝" label="Texto" />
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <BottomNavWireframe active="home" />
          </div>
        </WireframeSection>

        {/* Analysis Screen Wireframe */}
        <WireframeSection title="3. Pantalla de Análisis">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 border-2 border-white"></div>
                <div className="w-32 h-5 bg-white"></div>
              </div>
              <div className="w-40 h-3 bg-gray-400"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-4">
              {/* Recording Area */}
              <div className="border-2 border-gray-800 p-8 flex flex-col items-center justify-center" style={{ height: '200px' }}>
                <div className="w-20 h-20 border-4 border-gray-800 rounded-full mb-4"></div>
                <div className="w-32 h-4 bg-gray-800"></div>
              </div>

              {/* Instructions */}
              <div className="border-2 border-gray-800 p-4">
                <div className="w-24 h-4 bg-gray-800 mb-2"></div>
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-300"></div>
                  <div className="w-full h-2 bg-gray-300"></div>
                  <div className="w-3/4 h-2 bg-gray-300"></div>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full h-14 border-4 border-gray-800 flex items-center justify-center">
                INICIAR ANÁLISIS
              </div>
            </div>
          </div>
        </WireframeSection>

        {/* Progress Screen Wireframe */}
        <WireframeSection title="4. Pantalla de Progreso">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
              <div className="w-32 h-5 bg-white mb-2"></div>
              <div className="w-40 h-3 bg-gray-400"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard value="24" />
                <StatCard value="7" />
                <StatCard value="85%" />
                <StatCard value="12" />
              </div>

              {/* Chart */}
              <div className="border-2 border-gray-800 p-4">
                <div className="w-24 h-4 bg-gray-800 mb-4"></div>
                <div className="h-32 border-2 border-gray-400 relative">
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around gap-2 p-2">
                    <div className="w-8 bg-gray-800" style={{ height: '60%' }}></div>
                    <div className="w-8 bg-gray-800" style={{ height: '40%' }}></div>
                    <div className="w-8 bg-gray-800" style={{ height: '80%' }}></div>
                    <div className="w-8 bg-gray-800" style={{ height: '50%' }}></div>
                    <div className="w-8 bg-gray-800" style={{ height: '70%' }}></div>
                  </div>
                </div>
              </div>

              {/* History List */}
              <div className="border-2 border-gray-800 p-4">
                <div className="w-24 h-4 bg-gray-800 mb-3"></div>
                <div className="space-y-2">
                  <HistoryItem />
                  <HistoryItem />
                  <HistoryItem />
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <BottomNavWireframe active="progress" />
          </div>
        </WireframeSection>

        {/* Profile Screen Wireframe */}
        <WireframeSection title="5. Pantalla de Perfil">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
              <div className="w-24 h-5 bg-white mb-2"></div>
              <div className="w-40 h-3 bg-gray-400"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* User Info */}
              <div className="border-2 border-gray-800 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 border-2 border-gray-800 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-800 mb-1"></div>
                    <div className="w-40 h-3 bg-gray-400"></div>
                  </div>
                </div>
                <div className="border-t-2 border-gray-400 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between">
                    <div className="w-24 h-3 bg-gray-400"></div>
                    <div className="w-16 h-3 bg-gray-800"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-24 h-3 bg-gray-400"></div>
                    <div className="w-16 h-3 bg-gray-800"></div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div>
                <div className="w-16 h-4 bg-gray-800 mb-2"></div>
                <div className="border-2 border-gray-800">
                  <MenuItem />
                  <div className="border-t-2 border-gray-800">
                    <MenuItem />
                  </div>
                  <div className="border-t-2 border-gray-800">
                    <MenuItem />
                  </div>
                </div>
              </div>

              {/* Team Section */}
              <div className="border-2 border-gray-800 p-4">
                <div className="w-32 h-4 bg-gray-800 mb-3"></div>
                <div className="space-y-2">
                  <TeamMemberWireframe />
                  <TeamMemberWireframe />
                  <TeamMemberWireframe />
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <BottomNavWireframe active="profile" />
          </div>
        </WireframeSection>

        {/* Portfolio Screen Wireframe */}
        <WireframeSection title="6. Pantalla de Portafolio">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                <div className="w-40 h-5 bg-white"></div>
              </div>
              <div className="w-48 h-3 bg-gray-400"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <StatCard value="3" />
                <StatCard value="2.5K" />
              </div>

              {/* Apps */}
              <div>
                <div className="w-32 h-4 bg-gray-800 mb-3"></div>
                <div className="space-y-3">
                  <AppCardWireframe name="MirrorMind" status="●" />
                  <AppCardWireframe name="BioTune" status="●" />
                  <AppCardWireframe name="Silencio" status="●" />
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <BottomNavWireframe active="portfolio" />
          </div>
        </WireframeSection>

        {/* Incidents Screen Wireframe */}
        <WireframeSection title="7. Pantalla de Gestión de Incidencias">
          <div className="aspect-[9/16] border-4 border-gray-800 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 border-2 border-white"></div>
                <div className="w-48 h-5 bg-white"></div>
              </div>
              <div className="w-40 h-3 bg-gray-400"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Method Steps */}
              <div className="border-2 border-gray-800 p-4">
                <div className="w-40 h-4 bg-gray-800 mb-3"></div>
                <div className="space-y-2">
                  <MethodStepWireframe number="1" />
                  <MethodStepWireframe number="2" />
                  <MethodStepWireframe number="3" />
                  <MethodStepWireframe number="4" />
                </div>
              </div>

              {/* Tool Section */}
              <div className="border-2 border-gray-800">
                <div className="bg-gray-800 text-white p-3 flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-white"></div>
                  <div className="w-24 h-4 bg-white"></div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="w-full h-3 bg-gray-300"></div>
                  <div className="w-full h-3 bg-gray-300"></div>
                  <div className="w-3/4 h-3 bg-gray-300"></div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <FeatureWireframe />
                <FeatureWireframe />
                <FeatureWireframe />
              </div>
            </div>
          </div>
        </WireframeSection>

        {/* Legend */}
        <Card className="p-6 bg-white border-2 border-gray-800">
          <h3 className="mb-4">Convenciones de Wireframe</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-gray-800"></div>
              <span>Texto principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-gray-400"></div>
              <span>Texto secundario</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-gray-800"></div>
              <span>Botón/Acción</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-full"></div>
              <span>Ícono/Avatar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-gray-300"></div>
              <span>Contenido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-gray-400"></div>
              <span>Área de gráfico</span>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pb-4">
          <p>MirrorMind - Wireframes de Baja Fidelidad</p>
          <p className="mt-1">Proyecto PMBOK • Fase de Prototipo</p>
        </div>
      </div>
    </div>
  );
}

interface WireframeSectionProps {
  title: string;
  children: React.ReactNode;
}

function WireframeSection({ title, children }: WireframeSectionProps) {
  return (
    <div>
      <h3 className="mb-4 text-gray-800">{title}</h3>
      <div className="bg-gray-200 p-6 rounded-lg">
        {children}
      </div>
    </div>
  );
}

interface AnalysisCardProps {
  icon: string;
  label: string;
}

function AnalysisCard({ icon, label }: AnalysisCardProps) {
  return (
    <div className="border-2 border-gray-800 p-4 flex items-center gap-3">
      <div className="w-10 h-10 border-2 border-gray-800 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="flex-1">
        <div className="w-24 h-4 bg-gray-800 mb-1"></div>
        <div className="w-32 h-3 bg-gray-400"></div>
      </div>
      <div className="w-6 h-6 border-2 border-gray-800"></div>
    </div>
  );
}

interface BottomNavWireframeProps {
  active: string;
}

function BottomNavWireframe({ active }: BottomNavWireframeProps) {
  const tabs = ['home', 'progress', 'profile', 'portfolio'];
  
  return (
    <div className="border-t-4 border-gray-800 bg-white grid grid-cols-4">
      {tabs.map((tab) => (
        <div 
          key={tab}
          className={`p-3 flex flex-col items-center justify-center border-r-2 last:border-r-0 ${
            active === tab ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className={`w-6 h-6 border-2 ${active === tab ? 'border-white' : 'border-gray-800'} mb-1`}></div>
          <div className={`w-8 h-2 ${active === tab ? 'bg-white' : 'bg-gray-800'}`}></div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ value }: { value: string }) {
  return (
    <div className="border-2 border-gray-800 p-3">
      <div className="w-5 h-5 border-2 border-gray-800 mb-2"></div>
      <div className="w-16 h-5 bg-gray-800 mb-1"></div>
      <div className="w-12 h-3 bg-gray-400"></div>
    </div>
  );
}

function HistoryItem() {
  return (
    <div className="flex items-center gap-2 p-2 border border-gray-400">
      <div className="w-8 h-8 border-2 border-gray-800 rounded-full"></div>
      <div className="flex-1">
        <div className="w-24 h-3 bg-gray-800 mb-1"></div>
        <div className="w-16 h-2 bg-gray-400"></div>
      </div>
    </div>
  );
}

function MenuItem() {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-gray-800"></div>
        <div className="w-32 h-3 bg-gray-800"></div>
      </div>
      <div className="w-4 h-4 border-2 border-gray-800"></div>
    </div>
  );
}

function TeamMemberWireframe() {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="w-24 h-3 bg-gray-400"></div>
      <div className="w-20 h-3 bg-gray-800"></div>
    </div>
  );
}

interface AppCardWireframeProps {
  name: string;
  status: string;
}

function AppCardWireframe({ name, status }: AppCardWireframeProps) {
  return (
    <div className="border-2 border-gray-800 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 border-2 border-gray-800"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-24 h-4 bg-gray-800"></div>
            <span className="text-xs">{status}</span>
          </div>
          <div className="w-full h-3 bg-gray-400"></div>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="w-16 h-5 border border-gray-400"></div>
        <div className="w-16 h-5 border border-gray-400"></div>
        <div className="w-16 h-5 border border-gray-400"></div>
      </div>
      <div className="flex justify-between border-t-2 border-gray-400 pt-2">
        <div className="w-20 h-3 bg-gray-400"></div>
        <div className="w-16 h-3 bg-gray-800"></div>
      </div>
    </div>
  );
}

function MethodStepWireframe({ number }: { number: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
        {number}
      </div>
      <div className="flex-1">
        <div className="w-32 h-3 bg-gray-800 mb-1"></div>
        <div className="w-full h-2 bg-gray-300"></div>
      </div>
    </div>
  );
}

function FeatureWireframe() {
  return (
    <div className="border border-gray-400 p-2 flex items-start gap-2">
      <div className="w-5 h-5 border-2 border-gray-800 flex-shrink-0"></div>
      <div className="flex-1">
        <div className="w-24 h-3 bg-gray-800 mb-1"></div>
        <div className="w-full h-2 bg-gray-300"></div>
      </div>
    </div>
  );
}
