import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Shield, Settings, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { User, UserRole } from '../App';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  municipality: string;
  delegation?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface UserManagementProps {
  currentUser: User;
}

const mockUsers: SystemUser[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@sge.gov.br',
    role: 'gestor',
    permissions: ['all'],
    municipality: 'Sistema',
    status: 'active',
    lastLogin: '2024-01-10T09:00:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    isActive: true
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@delegacao.gov.br',
    role: 'dirigente',
    permissions: ['delegations', 'teams', 'athletes', 'registrations'],
    municipality: 'São Paulo',
    delegation: 'Delegação SP Centro',
    status: 'active',
    lastLogin: '2024-01-09T14:30:00',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-09',
    isActive: true
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria@arbitros.org.br',
    role: 'arbitro',
    permissions: ['officials', 'results', 'competitions'],
    municipality: 'Rio de Janeiro',
    status: 'active',
    lastLogin: '2024-01-08T16:45:00',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08',
    isActive: true
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro@atleta.com',
    role: 'atleta',
    permissions: ['view_own_data'],
    municipality: 'Brasília',
    delegation: 'Delegação DF',
    status: 'active',
    lastLogin: '2024-01-07T10:15:00',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-07',
    isActive: true
  },
  {
    id: '5',
    name: 'Ana Oliveira',
    email: 'ana@usuario.com',
    role: 'leitor',
    permissions: ['view_public_data'],
    municipality: 'Salvador',
    status: 'active',
    lastLogin: '2024-01-06T08:20:00',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-06',
    isActive: true
  },
  {
    id: '6',
    name: 'Carlos Tech',
    email: 'carlos@tech.com',
    role: 'operador',
    permissions: ['system_operations', 'data_management'],
    municipality: 'Sistema',
    status: 'active',
    lastLogin: '2024-01-05T11:30:00',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-05',
    isActive: true
  }
];

const rolePermissions = {
  gestor: ['all'],
  dirigente: ['delegations', 'teams', 'athletes', 'registrations', 'events'],
  arbitro: ['officials', 'results', 'competitions'],
  atleta: ['view_own_data', 'registrations'],
  leitor: ['view_public_data'],
  operador: ['system_operations', 'data_management', 'users']
};

export function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'leitor' as UserRole,
    municipality: '',
    delegation: '',
    status: 'active' as const,
    isActive: true
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'leitor',
      municipality: '',
      delegation: '',
      status: 'active',
      isActive: true
    });
    setEditingUser(null);
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUsers(prev => prev.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              ...formData,
              permissions: rolePermissions[formData.role],
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : user
      ));
    } else {
      const newUser: SystemUser = {
        id: Date.now().toString(),
        ...formData,
        permissions: rolePermissions[formData.role],
        lastLogin: '',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, newUser]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      municipality: user.municipality,
      delegation: user.delegation || '',
      status: user.status,
      isActive: user.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(user =>
      user.id === id
        ? {
            ...user,
            isActive: !user.isActive,
            status: !user.isActive ? 'active' : 'inactive',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : user
    ));
  };

  const canEdit = ['gestor', 'operador'].includes(currentUser.role);

  const getRoleBadge = (role: UserRole) => {
    const roleColors = {
      gestor: 'bg-purple-500',
      dirigente: 'bg-blue-500',
      arbitro: 'bg-green-500',
      atleta: 'bg-orange-500',
      leitor: 'bg-gray-500',
      operador: 'bg-red-500'
    };

    const roleLabels = {
      gestor: 'Gestor',
      dirigente: 'Dirigente',
      arbitro: 'Árbitro',
      atleta: 'Atleta',
      leitor: 'Leitor',
      operador: 'Operador'
    };

    return (
      <Badge className={roleColors[role]}>
        {roleLabels[role]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerenciar usuários e permissões do sistema
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? 'Atualize as informações do usuário.' 
                    : 'Adicione um novo usuário ao sistema.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil</Label>
                  <Select value={formData.role} onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="dirigente">Dirigente</SelectItem>
                      <SelectItem value="arbitro">Árbitro</SelectItem>
                      <SelectItem value="atleta">Atleta</SelectItem>
                      <SelectItem value="leitor">Usuário Leitor</SelectItem>
                      <SelectItem value="operador">Operador Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="municipality">Município</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delegation">Delegação (opcional)</Label>
                  <Input
                    id="delegation"
                    value={formData.delegation}
                    onChange={(e) => setFormData(prev => ({ ...prev, delegation: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="suspended">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Usuário Ativo</Label>
                  </div>
                </div>
                
                {/* Permissions display */}
                <div className="space-y-2 col-span-2">
                  <Label>Permissões</Label>
                  <div className="flex flex-wrap gap-2">
                    {rolePermissions[formData.role].map(permission => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission === 'all' ? 'Todas as permissões' :
                         permission === 'delegations' ? 'Delegações' :
                         permission === 'teams' ? 'Equipes' :
                         permission === 'athletes' ? 'Atletas' :
                         permission === 'registrations' ? 'Inscrições' :
                         permission === 'events' ? 'Eventos' :
                         permission === 'officials' ? 'Oficiais' :
                         permission === 'results' ? 'Resultados' :
                         permission === 'competitions' ? 'Competições' :
                         permission === 'view_own_data' ? 'Ver próprios dados' :
                         permission === 'view_public_data' ? 'Ver dados públicos' :
                         permission === 'system_operations' ? 'Operações sistema' :
                         permission === 'data_management' ? 'Gestão dados' :
                         permission === 'users' ? 'Usuários' :
                         permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingUser ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestores</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'gestor').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos Logins</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 24*60*60*1000)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="gestor">Gestor</SelectItem>
            <SelectItem value="dirigente">Dirigente</SelectItem>
            <SelectItem value="arbitro">Árbitro</SelectItem>
            <SelectItem value="atleta">Atleta</SelectItem>
            <SelectItem value="leitor">Leitor</SelectItem>
            <SelectItem value="operador">Operador</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="suspended">Suspenso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie os usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Município/Delegação</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ativo</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{user.municipality}</div>
                      {user.delegation && (
                        <div className="text-sm text-muted-foreground">{user.delegation}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastLogin ? 
                        new Date(user.lastLogin).toLocaleDateString('pt-BR') + ' ' +
                        new Date(user.lastLogin).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        : 'Nunca'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status, user.isActive)}
                  </TableCell>
                  <TableCell>
                    {canEdit ? (
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                    ) : (
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Sim' : 'Não'}
                      </Badge>
                    )}
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}