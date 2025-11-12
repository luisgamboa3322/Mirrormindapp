import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { UserProfile } from "./OnboardingScreen";
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText,
  LogOut,
  ChevronRight,
  Brain,
  Mail,
  Calendar,
  AlertTriangle,
  Layout,
  Cake,
  Users as UsersIcon
} from "lucide-react";

interface ProfileScreenProps {
  onNavigateToIncidents?: () => void;
  onNavigateToWireframes?: () => void;
  userProfile?: UserProfile | null;
}

export function ProfileScreen({ onNavigateToIncidents, onNavigateToWireframes, userProfile }: ProfileScreenProps) {
  const getGenderLabel = (gender?: string) => {
    if (!gender) return "No especificado";
    switch (gender) {
      case "femenino": return "Femenino";
      case "masculino": return "Masculino";
      case "otro": return "Otro / Prefiero no decir";
      default: return "No especificado";
    }
  };
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6">
        <h2 className="mb-2">Perfil</h2>
        <p className="text-purple-100">
          Configuración y preferencias
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* User Info */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3>{userProfile?.name || "Usuario Demo"}</h3>
              <p className="text-sm text-muted-foreground">
                {userProfile?.age ? `${userProfile.age} años` : "demo@mirrormind.app"}
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            {userProfile?.age && (
              <InfoRow icon={<Cake className="w-4 h-4" />} label="Edad" value={`${userProfile.age} años`} />
            )}
            {userProfile?.gender && (
              <InfoRow icon={<UsersIcon className="w-4 h-4" />} label="Género" value={getGenderLabel(userProfile.gender)} />
            )}
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Miembro desde" value="Noviembre 2025" />
            <InfoRow icon={<Brain className="w-4 h-4" />} label="Análisis realizados" value="24" />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Plan" value="Prototipo Beta" />
          </div>
        </Card>

        {/* Account Section */}
        <div>
          <h4 className="mb-3 px-2">Cuenta</h4>
          <Card className="divide-y">
            <MenuItem
              icon={<User className="w-5 h-5" />}
              label="Información Personal"
              onClick={() => {}}
            />
            <MenuItem
              icon={<Bell className="w-5 h-5" />}
              label="Notificaciones"
              badge="3"
              onClick={() => {}}
            />
            <MenuItem
              icon={<Shield className="w-5 h-5" />}
              label="Privacidad y Seguridad"
              onClick={() => {}}
            />
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h4 className="mb-3 px-2">Preferencias</h4>
          <Card className="p-4 space-y-4">
            <ToggleOption
              label="Recordatorios diarios"
              description="Recibe notificaciones para analizar tu estado emocional"
              defaultChecked={true}
            />
            <Separator />
            <ToggleOption
              label="Análisis automático"
              description="Permite que la IA analice patrones de forma continua"
              defaultChecked={false}
            />
            <Separator />
            <ToggleOption
              label="Compartir datos anónimos"
              description="Ayuda a mejorar el modelo de IA (datos encriptados)"
              defaultChecked={true}
            />
          </Card>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="mb-3 px-2">Soporte y Documentación</h4>
          <Card className="divide-y">
            <MenuItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="Centro de Ayuda"
              onClick={() => {}}
            />
            <MenuItem
              icon={<FileText className="w-5 h-5" />}
              label="Documentación del Proyecto"
              onClick={() => {}}
            />
            <MenuItem
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Gestión de Incidencias"
              onClick={() => onNavigateToIncidents?.()}
            />
            <MenuItem
              icon={<Layout className="w-5 h-5" />}
              label="Wireframes - Baja Fidelidad"
              onClick={() => onNavigateToWireframes?.()}
            />
          </Card>
        </div>

        {/* Project Info */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4>Proyecto PMBOK</h4>
              <p className="text-sm text-muted-foreground mt-1">
                MirrorMind es un prototipo desarrollado siguiendo la metodología PMBOK, 
                como parte del portafolio de Innovación en Bienestar Digital.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">Equipo: 7 miembros</Badge>
                <Badge variant="secondary">Fase: Prototipo</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Credits */}
        <Card className="p-4">
          <h4 className="mb-3">Equipo de Desarrollo</h4>
          <div className="space-y-2 text-sm">
            <TeamMember role="Líder del Proyecto" name="Yo" />
            <TeamMember role="Analista de Requerimientos" name="Francisco Peláez" />
            <TeamMember role="Diseñador UX-UI" name="Gamboa" />
            <TeamMember role="Desarrollador del Prototipo" name="Alejandro Magno" />
            <TeamMember role="Tester" name="Adrián" />
            <TeamMember role="Documentador" name="Chopitea" />
            <TeamMember role="Especialista en IA" name="Jair Vásquez" />
          </div>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pb-4">
          <p>MirrorMind v1.0.0 (Prototipo)</p>
          <p className="mt-1">© 2025 - Proyecto PMBOK</p>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span>{value}</span>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick: () => void;
}

function MenuItem({ icon, label, badge, onClick }: MenuItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && <Badge variant="secondary">{badge}</Badge>}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </button>
  );
}

interface ToggleOptionProps {
  label: string;
  description: string;
  defaultChecked: boolean;
}

function ToggleOption({ label, description, defaultChecked }: ToggleOptionProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h4 className="text-sm mb-1">{label}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

interface TeamMemberProps {
  role: string;
  name: string;
}

function TeamMember({ role, name }: TeamMemberProps) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{role}:</span>
      <span>{name}</span>
    </div>
  );
}
