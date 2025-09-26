import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Trophy, Target, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { User } from '../App';

interface Team {
  id: string;
  name: string;
  sport: string;
  category: string;
  delegation: string;
  municipality: string;
  coach: string;
  coachPhone: string;
  coachEmail: string;
  captain: string;
  founded: string;
  athletes: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  status: 'active' | 'inactive' | 'suspended';
  logo?: string;
  uniform: {
    primary: string;
    secondary: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TeamsProps {
  currentUser: User;
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'São Paulo FC Master',
    sport: 'Futebol - Masculino',
    category: 'Master 60+ (60 anos ou mais)',
    delegation: 'Delegação SP Centro',
    municipality: 'São Paulo',
    coach: 'Carlos Técnico',
    coachPhone: '(11) 99999-1111',
    coachEmail: 'carlos@spfc.com.br',
    captain: 'João Silva Santos',
    founded: '2020-01-15',
    athletes: 22,
    wins: 15,
    losses: 3,
    draws: 2,
    points: 47,
    status: 'active',
    uniform: {
      primary: 'Branca com detalhes vermelhos',
      secondary: 'Vermelha'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Minas Tênis Clube Master',
    sport: 'Voleibol - Feminino',
    category: 'Master 60+ (60 anos ou mais)',
    delegation: 'Delegação MG Belo Horizonte',
    municipality: 'Belo Horizonte',
    coach: 'Ana Treinadora',
    coachPhone: '(31) 88888-2222',
    coachEmail: 'ana@minastc.com.br',
    captain: 'Maria Jogadora',
    founded: '2019-03-10',
    athletes: 14,
    wins: 12,
    losses: 2,
    draws: 0,
    points: 36,
    status: 'active',
    uniform: {
      primary: 'Azul e branca',
      secondary: 'Branca'
    },
    createdAt: '2024-01-02',
    updatedAt: '2024-01-09'
  },
  {
    id: '3',
    name: 'Natação Brasília Master',
    sport: 'Natação - 50m Livre',
    category: 'Master 60+ (60 anos ou mais)',
    delegation: 'Delegação DF',
    municipality: 'Brasília',
    coach: 'Pedro Nadador',
    coachPhone: '(61) 77777-3333',
    coachEmail: 'pedro@natacao-bsb.com.br',
    captain: 'Pedro Oliveira Lima',
    founded: '2021-06-20',
    athletes: 18,
    wins: 8,
    losses: 1,
    draws: 0,
    points: 24,
    status: 'active',
    uniform: {
      primary: 'Azul marinho',
      secondary: 'Branca'
    },
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'Basquete Salvador Master',
    sport: 'Basquetebol - Feminino',
    category: 'Master 60+ (60 anos ou mais)',
    delegation: 'Delegação BA Salvador',
    municipality: 'Salvador',
    coach: 'Roberto Coach',
    coachPhone: '(71) 66666-4444',
    coachEmail: 'roberto@basquete-ssa.com.br',
    captain: 'Mariana Santos Ferreira',
    founded: '2020-09-12',
    athletes: 12,
    wins: 10,
    losses: 4,
    draws: 0,
    points: 30,
    status: 'active',
    uniform: {
      primary: 'Amarela e verde',
      secondary: 'Azul'
    },
    createdAt: '2024-01-04',
    updatedAt: '2024-01-07'
  }
];

export function Teams({ currentUser }: TeamsProps) {
  const [teams, setTeams] = useState(mockTeams);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    category: '',
    delegation: '',
    municipality: '',
    coach: '',
    coachPhone: '',
    coachEmail: '',
    captain: '',
    founded: '',
    primaryUniform: '',
    secondaryUniform: '',
    status: 'active' as const
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.coach.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === 'all' || team.sport === filterSport;
    const matchesCategory = filterCategory === 'all' || team.category === filterCategory;
    
    return matchesSearch && matchesSport && matchesCategory;
  });

  const allSports = Array.from(new Set(teams.map(team => team.sport)));
  const allCategories = Array.from(new Set(teams.map(team => team.category)));

  const resetForm = () => {
    setFormData({
      name: '',
      sport: '',
      category: '',
      delegation: '',
      municipality: '',
      coach: '',
      coachPhone: '',
      coachEmail: '',
      captain: '',
      founded: '',
      primaryUniform: '',
      secondaryUniform: '',
      status: 'active'
    });
    setEditingTeam(null);
  };

  const handleSubmit = () => {
    if (editingTeam) {
      setTeams(prev => prev.map(team =>
        team.id === editingTeam.id
          ? {
              ...team,
              ...formData,
              uniform: {
                primary: formData.primaryUniform,
                secondary: formData.secondaryUniform
              },
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : team
      ));
    } else {
      const newTeam: Team = {
        id: Date.now().toString(),
        ...formData,
        athletes: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        uniform: {
          primary: formData.primaryUniform,
          secondary: formData.secondaryUniform
        },
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setTeams(prev => [...prev, newTeam]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      sport: team.sport,
      category: team.category,
      delegation: team.delegation,
      municipality: team.municipality,
      coach: team.coach,
      coachPhone: team.coachPhone,
      coachEmail: team.coachEmail,
      captain: team.captain,
      founded: team.founded,
      primaryUniform: team.uniform.primary,
      secondaryUniform: team.uniform.secondary,
      status: team.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTeams(prev => prev.filter(team => team.id !== id));
  };

  const canEdit = ['gestor', 'dirigente', 'operador'].includes(currentUser.role);

  const calculateWinRate = (wins: number, losses: number, draws: number) => {
    const total = wins + losses + draws;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Equipes</h1>
          <p className="text-muted-foreground">
            Gerenciar equipes esportivas cadastradas no sistema
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Equipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? 'Editar Equipe' : 'Nova Equipe'}
                </DialogTitle>
                <DialogDescription>
                  {editingTeam 
                    ? 'Atualize as informações da equipe.' 
                    : 'Adicione uma nova equipe ao sistema.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Equipe</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sport">Modalidade</Label>
                  <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Futebol">Futebol</SelectItem>
                      <SelectItem value="Vôlei">Vôlei</SelectItem>
                      <SelectItem value="Basquete">Basquete</SelectItem>
                      <SelectItem value="Natação">Natação</SelectItem>
                      <SelectItem value="Atletismo">Atletismo</SelectItem>
                      <SelectItem value="Tênis">Tênis</SelectItem>
                      <SelectItem value="Judô">Judô</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Master 60+ (60 anos ou mais)">Master 60+ (60 anos ou mais)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delegation">Delegação</Label>
                  <Input
                    id="delegation"
                    value={formData.delegation}
                    onChange={(e) => setFormData(prev => ({ ...prev, delegation: e.target.value }))}
                  />
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
                  <Label htmlFor="founded">Data de Fundação</Label>
                  <Input
                    id="founded"
                    type="date"
                    value={formData.founded}
                    onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coach">Técnico/Treinador</Label>
                  <Input
                    id="coach"
                    value={formData.coach}
                    onChange={(e) => setFormData(prev => ({ ...prev, coach: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coachPhone">Telefone do Técnico</Label>
                  <Input
                    id="coachPhone"
                    value={formData.coachPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, coachPhone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="coachEmail">Email do Técnico</Label>
                  <Input
                    id="coachEmail"
                    type="email"
                    value={formData.coachEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, coachEmail: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="captain">Capitão</Label>
                  <Input
                    id="captain"
                    value={formData.captain}
                    onChange={(e) => setFormData(prev => ({ ...prev, captain: e.target.value }))}
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
                
                <div className="space-y-2">
                  <Label htmlFor="primaryUniform">Uniforme Principal</Label>
                  <Input
                    id="primaryUniform"
                    value={formData.primaryUniform}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryUniform: e.target.value }))}
                    placeholder="Ex: Camisa azul, calção branco"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryUniform">Uniforme Secundário</Label>
                  <Input
                    id="secondaryUniform"
                    value={formData.secondaryUniform}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryUniform: e.target.value }))}
                    placeholder="Ex: Camisa branca, calção azul"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingTeam ? 'Atualizar' : 'Cadastrar'}
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
            <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atletas Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((acc, t) => acc + t.athletes, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vitórias</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((acc, t) => acc + t.wins, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((acc, t) => acc + t.points, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterSport} onValueChange={setFilterSport}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {allSports.map(sport => (
              <SelectItem key={sport} value={sport}>{sport}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {allCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipes</CardTitle>
          <CardDescription>
            Gerencie as equipes cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipe</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Modalidade/Categoria</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Atletas</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => {
                const winRate = calculateWinRate(team.wins, team.losses, team.draws);
                return (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={team.logo} />
                          <AvatarFallback>
                            {team.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {team.municipality}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{team.coach}</div>
                        <div className="text-sm text-muted-foreground">{team.coachPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{team.sport}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">{team.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{team.wins}V {team.losses}D {team.draws}E</div>
                        <div className="text-muted-foreground">
                          {winRate}% vitórias • {team.points} pts
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{team.athletes}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        team.status === 'active' ? 'default' :
                        team.status === 'inactive' ? 'secondary' :
                        'destructive'
                      }>
                        {team.status === 'active' ? 'Ativo' :
                         team.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                      </Badge>
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(team)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(team.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}