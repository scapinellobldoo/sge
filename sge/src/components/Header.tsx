import { Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import type { User as UserType } from '../App';

interface HeaderProps {
  currentUser: UserType;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  const notifications = [
    { id: 1, title: 'Nova inscrição pendente', type: 'warning' },
    { id: 2, title: 'Resultado homologado', type: 'success' },
    { id: 3, title: 'Evento cancelado', type: 'error' }
  ];

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      'gestor': 'Administrador',
      'dirigente': 'Dirigente Esportivo',
      'arbitro': 'Árbitro/Oficial',
      'atleta': 'Atleta Master 60+',
      'operador': 'Operador',
      'leitor': 'Consultor'
    };
    return roleLabels[role] || role;
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar atletas, equipes, eventos..." 
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Offline Mode Indicator */}
        {typeof window !== 'undefined' && localStorage.getItem('sge_mode') === 'offline' && (
          <div className="px-2 py-1 bg-orange-100 border border-orange-300 rounded text-xs text-orange-800">
            Modo Demo
          </div>
        )}
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
                <Badge variant={notification.type === 'warning' ? 'secondary' : notification.type === 'success' ? 'default' : 'destructive'} className="text-xs">
                  {notification.type === 'warning' ? 'Pendente' : notification.type === 'success' ? 'Sucesso' : 'Alerta'}
                </Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">{currentUser.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground">{getRoleLabel(currentUser.role)}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}