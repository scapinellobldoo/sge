import { 
  LayoutDashboard, 
  MapPin, 
  Building2, 
  Users, 
  UserCheck, 
  Badge, 
  Calendar,
  Trophy,
  ClipboardList,
  Target,
  FileText,
  Settings
} from 'lucide-react';
import { cn } from './ui/utils';
import type { ActiveModule, User } from '../App';

interface SidebarProps {
  activeModule: ActiveModule;
  onModuleChange: (module: ActiveModule) => void;
  currentUser: User;
}

const menuItems = [
  {
    id: 'dashboard' as ActiveModule,
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['gestor', 'dirigente', 'arbitro', 'atleta', 'leitor', 'operador']
  },
  {
    id: 'municipalities' as ActiveModule,
    label: 'Municípios',
    icon: MapPin,
    roles: ['gestor', 'operador']
  },
  {
    id: 'delegations' as ActiveModule,
    label: 'Delegações',
    icon: Building2,
    roles: ['gestor', 'dirigente', 'operador']
  },
  {
    id: 'teams' as ActiveModule,
    label: 'Equipes',
    icon: Users,
    roles: ['gestor', 'dirigente', 'operador']
  },
  {
    id: 'athletes' as ActiveModule,
    label: 'Atletas',
    icon: UserCheck,
    roles: ['gestor', 'dirigente', 'atleta', 'operador']
  },
  {
    id: 'officials' as ActiveModule,
    label: 'Oficiais',
    icon: Badge,
    roles: ['gestor', 'arbitro', 'operador']
  },
  {
    id: 'events' as ActiveModule,
    label: 'Eventos',
    icon: Calendar,
    roles: ['gestor', 'dirigente', 'arbitro', 'atleta', 'leitor', 'operador']
  },
  {
    id: 'competitions' as ActiveModule,
    label: 'Competições',
    icon: Trophy,
    roles: ['gestor', 'dirigente', 'arbitro', 'atleta', 'leitor', 'operador']
  },
  {
    id: 'registrations' as ActiveModule,
    label: 'Inscrições',
    icon: ClipboardList,
    roles: ['gestor', 'dirigente', 'atleta', 'operador']
  },
  {
    id: 'results' as ActiveModule,
    label: 'Resultados',
    icon: Target,
    roles: ['gestor', 'dirigente', 'arbitro', 'atleta', 'leitor', 'operador']
  },
  {
    id: 'reports' as ActiveModule,
    label: 'Relatórios',
    icon: FileText,
    roles: ['gestor', 'dirigente', 'arbitro', 'leitor', 'operador']
  },
  {
    id: 'users' as ActiveModule,
    label: 'Usuários',
    icon: Settings,
    roles: ['gestor', 'operador']
  },
  {
    id: 'approvals' as ActiveModule,
    label: 'Aprovações',
    icon: UserCheck,
    roles: ['gestor']
  }
];

export function Sidebar({ activeModule, onModuleChange, currentUser }: SidebarProps) {
  const availableItems = menuItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold text-primary">SGE</h1>
        <p className="text-sm text-muted-foreground">
          Sistema de Gerenciamento Esportivo
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {availableItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">Usuário</p>
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {currentUser.role}
          </p>
        </div>
      </div>
    </div>
  );
}