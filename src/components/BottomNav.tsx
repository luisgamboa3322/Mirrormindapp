import { Home, TrendingUp, User, Briefcase } from "lucide-react";

interface BottomNavProps {
  activeTab: 'home' | 'progress' | 'profile' | 'portfolio';
  onTabChange: (tab: 'home' | 'progress' | 'profile' | 'portfolio') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        <NavItem
          icon={<Home className="w-5 h-5" />}
          label="Inicio"
          active={activeTab === 'home'}
          onClick={() => onTabChange('home')}
        />
        <NavItem
          icon={<Briefcase className="w-5 h-5" />}
          label="Portafolio"
          active={activeTab === 'portfolio'}
          onClick={() => onTabChange('portfolio')}
        />
        <NavItem
          icon={<TrendingUp className="w-5 h-5" />}
          label="Progreso"
          active={activeTab === 'progress'}
          onClick={() => onTabChange('progress')}
        />
        <NavItem
          icon={<User className="w-5 h-5" />}
          label="Perfil"
          active={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
        active 
          ? 'text-purple-600' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <div className={active ? 'scale-110' : ''}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
}
