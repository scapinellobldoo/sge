import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Trophy, Users, Calendar, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MODALIDADES_ESPORTIVAS, CATEGORIAS_IDADE, TIPOS_COMPETICAO, STATUS_COMPETICAO } from '../utils/sports';
import { apiClient } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';

interface Competition {
  id: string;
  name: string;
  event: string;
  sport: string;
  category: string;
  format: 'knockout' | 'league' | 'mixed' | 'time_trial';
  startDate: string;
  endDate: string;
  venue: string;
  maxTeams: number;
  registeredTeams: number;
  phases: string[];
  currentPhase: string;
  rules: string;
  prizes: string;
  status: 'setup' | 'registration' | 'draw' | 'ongoing' | 'finished';
  organizer: string;
  referee: string;
  createdAt: string;
  updatedAt: string;
}

interface CompetitionsProps {
  currentUser: User;
}

export function Competitions({ currentUser }: CompetitionsProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    sport: '',
    category: '',
    format: 'knockout' as const,
    startDate: '',
    endDate: '',
    venue: '',
    maxTeams: '',
    rules: '',
    prizes: '',
    organizer: '',
    referee: '',
    status: 'setup' as const
  });

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await apiClient.getCompetitions();
        setCompetitions(data || []);
      } catch (error) {
        console.error('Error fetching competitions:', error);
        toast.error('Erro ao carregar competições');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter(competition => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (competition.name || '').toLowerCase().includes(searchLower) ||
                         (competition.sport || '').toLowerCase().includes(searchLower) ||
                         (competition.event || '').toLowerCase().includes(searchLower);
    const matchesSport = filterSport === 'all' || competition.sport === filterSport;
    const matchesStatus = filterStatus === 'all' || competition.status === filterStatus;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  const allSports = Array.from(new Set(competitions.map(c => c.sport).filter(Boolean)));

  const resetForm = () => {
    setFormData({
      name: '',
      event: '',
      sport: '',
      category: '',
      format: 'knockout',
      startDate: '',
      endDate: '',
      venue: '',
      maxTeams: '',
      rules: '',
      prizes: '',
      organizer: '',
      referee: '',
      status: 'setup'
    });
    setEditingCompetition(null);
  };

  const handleSubmit = async () => {
    try {
      const competitionData = {
        ...formData,
        maxTeams: parseInt(formData.maxTeams),
        registeredTeams: 0,
        phases: ['Fase Única'],
        currentPhase: 'Configuração'
      };

      if (editingCompetition) {
        const updated = await apiClient.updateCompetition(editingCompetition.id, competitionData);
        setCompetitions(prev => prev.map(competition =>
          competition.id === editingCompetition.id ? updated : competition
        ));
        toast.success('Competição atualizada com sucesso!');
      } else {
        const created = await apiClient.createCompetition(competitionData);
        setCompetitions(prev => [...prev, created]);
        toast.success('Competição criada com sucesso!');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving competition:', error);
      toast.error('Erro ao salvar competição');
    }
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setFormData({
      name: competition.name || '',
      event: competition.event || '',
      sport: competition.sport || '',
      category: competition.category || 'Master 60+',
      format: competition.format || 'knockout',
      startDate: competition.startDate || '',
      endDate: competition.endDate || '',
      venue: competition.venue || '',
      maxTeams: (competition.maxTeams || 0).toString(),
      rules: competition.rules || '',
      prizes: competition.prizes || '',
      organizer: competition.organizer || '',
      referee: competition.referee || '',
      status: competition.status || 'setup'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteCompetition(id);
      setCompetitions(prev => prev.filter(competition => competition.id !== id));
      toast.success('Competição excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting competition:', error);
      toast.error('Erro ao excluir competição');
    }
  };

  const canEdit = ['gestor', 'dirigente', 'arbitro', 'operador'].includes(currentUser.role);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'setup':
        return <Badge variant="outline">Configuração</Badge>;
      case 'registration':
        return <Badge className="bg-green-500 hover:bg-green-600">Inscrições</Badge>;
      case 'draw':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Sorteio</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em Andamento</Badge>;
      case 'finished':
        return <Badge variant="default">Finalizada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'league':
        return 'Liga (Pontos Corridos)';
      case 'knockout':
        return 'Eliminatório';
      case 'mixed':
        return 'Misto';
      case 'time_trial':
        return 'Tempo/Performance';
      default:
        return format;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Competições</h1>
            <p className="text-muted-foreground">
              Carregando competições...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Competições</h1>
          <p className="text-muted-foreground">
            Gerenciar competições e torneios esportivos
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Competição
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCompetition ? 'Editar Competição' : 'Nova Competição'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações da competição
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Competição</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Final Masculino Sub-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="event">Evento</Label>
                  <Input
                    id="event"
                    value={formData.event}
                    onChange={(e) => setFormData(prev => ({ ...prev, event: e.target.value }))}
                    placeholder="Ex: Campeonato Municipal de Futebol"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sport">Modalidade</Label>
                  <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {MODALIDADES_ESPORTIVAS.map(sport => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
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
                      {CATEGORIAS_IDADE.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Formato</Label>
                  <Select value={formData.format} onValueChange={(value: typeof formData.format) => setFormData(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_COMPETICAO.map(type => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/[^a-z0-9]/g, '_')}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: typeof formData.status) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="setup">Configuração</SelectItem>
                      <SelectItem value="registration">Inscrições Abertas</SelectItem>
                      <SelectItem value="draw">Sorteio</SelectItem>
                      <SelectItem value="ongoing">Em Andamento</SelectItem>
                      <SelectItem value="finished">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="venue">Local</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Ex: Estádio Municipal"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxTeams">Máximo de Equipes</Label>
                  <Input
                    id="maxTeams"
                    type="number"
                    min="2"
                    value={formData.maxTeams}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizador</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                    placeholder="Ex: Secretaria de Esportes"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referee">Árbitro Responsável</Label>
                  <Input
                    id="referee"
                    value={formData.referee}
                    onChange={(e) => setFormData(prev => ({ ...prev, referee: e.target.value }))}
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rules">Regulamento</Label>
                  <Textarea
                    id="rules"
                    value={formData.rules}
                    onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                    placeholder="Descreva as regras e regulamentos da competição..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="prizes">Premiação</Label>
                  <Textarea
                    id="prizes"
                    value={formData.prizes}
                    onChange={(e) => setFormData(prev => ({ ...prev, prizes: e.target.value }))}
                    placeholder="Descreva as premiações (troféus, medalhas, etc.)..."
                    rows={2}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  {editingCompetition ? 'Atualizar' : 'Criar'} Competição
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar competições..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterSport} onValueChange={setFilterSport}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {allSports.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="setup">Configuração</SelectItem>
              <SelectItem value="registration">Inscrições</SelectItem>
              <SelectItem value="draw">Sorteio</SelectItem>
              <SelectItem value="ongoing">Em Andamento</SelectItem>
              <SelectItem value="finished">Finalizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Competições</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {competitions.filter(c => c.status === 'ongoing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscrições Abertas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {competitions.filter(c => c.status === 'registration').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {competitions.filter(c => c.status === 'finished').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Competições</CardTitle>
          <CardDescription>
            {filteredCompetitions.length} competição(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Equipes</TableHead>
                  <TableHead>Status</TableHead>
                  {canEdit && <TableHead>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetitions.map((competition) => (
                  <TableRow key={competition.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{competition.name || 'Nome não informado'}</div>
                        <div className="text-sm text-muted-foreground">{competition.event || 'Evento não informado'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{competition.sport || 'N/A'}</TableCell>
                    <TableCell>{competition.category || 'N/A'}</TableCell>
                    <TableCell>{getFormatLabel(competition.format || 'knockout')}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {competition.startDate ? new Date(competition.startDate).toLocaleDateString('pt-BR') : 'Data não informada'}
                        </div>
                        <div className="text-muted-foreground">
                          até {competition.endDate ? new Date(competition.endDate).toLocaleDateString('pt-BR') : 'Data não informada'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{competition.registeredTeams || 0}</span>
                        <span className="text-muted-foreground">/{competition.maxTeams || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(competition.status || 'setup')}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(competition)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(competition.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {filteredCompetitions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma competição encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}