import { useState } from 'react';
import { Plus, Search, Trophy, Medal, Target, Clock, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { User } from '../App';

interface Result {
  id: string;
  competition: string;
  event: string;
  sport: string;
  category: string;
  date: string;
  status: 'live' | 'finished' | 'scheduled';
  participants: {
    id: string;
    name: string;
    team?: string;
    position: number;
    score?: string;
    time?: string;
    points?: number;
  }[];
  referee: string;
  venue: string;
  round: string;
  createdAt: string;
  updatedAt: string;
}

interface ResultsProps {
  currentUser: User;
}

const mockResults: Result[] = [
  {
    id: '1',
    competition: 'Campeonato Municipal de Futebol Master',
    event: 'Final Masculino Master 60+',
    sport: 'Futebol - Masculino',
    category: 'Master 60+ (60 anos ou mais)',
    date: '2024-01-15T15:00:00',
    status: 'finished',
    participants: [
      { id: '1', name: 'São Paulo FC Master', team: 'São Paulo FC Master', position: 1, score: '2' },
      { id: '2', name: 'Santos FC Master', team: 'Santos FC Master', position: 2, score: '1' }
    ],
    referee: 'João Arbitro',
    venue: 'Estádio Municipal',
    round: 'Final',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    competition: 'Torneio de Natação Master',
    event: '100m Livre Masculino Master 60+',
    sport: 'Natação - 100m Livre',
    category: 'Master 60+ (60 anos ou mais)',
    date: '2024-01-14T14:30:00',
    status: 'finished',
    participants: [
      { id: '3', name: 'Pedro Lima', position: 1, time: '1:12.32', points: 100 },
      { id: '4', name: 'Carlos Silva', position: 2, time: '1:15.89', points: 80 },
      { id: '5', name: 'João Santos', position: 3, time: '1:18.15', points: 60 }
    ],
    referee: 'Maria Juiza',
    venue: 'Centro Aquático',
    round: 'Final',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    competition: 'Liga de Vôlei Feminino Master',
    event: 'Semifinal Master 60+ - Jogo 1',
    sport: 'Voleibol - Feminino',
    category: 'Master 60+ (60 anos ou mais)',
    date: '2024-01-16T19:00:00',
    status: 'live',
    participants: [
      { id: '6', name: 'Minas Tênis Clube Master', team: 'Minas TC Master', position: 1, score: '2' },
      { id: '7', name: 'Rio de Janeiro Vôlei Master', team: 'RJ Vôlei Master', position: 2, score: '1' }
    ],
    referee: 'Ana Arbitro',
    venue: 'Ginásio Poliesportivo',
    round: 'Semifinal',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: '4',
    competition: 'Campeonato de Basquete Master',
    event: 'Quartas de Final Master 60+ - Jogo 3',
    sport: 'Basquetebol - Feminino',
    category: 'Master 60+ (60 anos ou mais)',
    date: '2024-01-17T20:00:00',
    status: 'scheduled',
    participants: [
      { id: '8', name: 'Flamengo', team: 'Flamengo', position: 0, score: '-' },
      { id: '9', name: 'Corinthians', team: 'Corinthians', position: 0, score: '-' }
    ],
    referee: 'Roberto Arbitro',
    venue: 'Arena Esportiva',
    round: 'Quartas de Final',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function Results({ currentUser }: ResultsProps) {
  const [results, setResults] = useState(mockResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.competition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSport = filterSport === 'all' || result.sport === filterSport;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  const liveResults = results.filter(r => r.status === 'live');
  const recentResults = results.filter(r => r.status === 'finished').slice(0, 5);
  const upcomingResults = results.filter(r => r.status === 'scheduled').slice(0, 5);

  const allSports = Array.from(new Set(results.map(result => result.sport)));

  const canEdit = ['gestor', 'arbitro', 'operador'].includes(currentUser.role);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse">AO VIVO</Badge>;
      case 'finished':
        return <Badge variant="default">Finalizado</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Agendado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Resultados</h1>
          <p className="text-muted-foreground">
            Acompanhe resultados em tempo real e histórico de competições
          </p>
        </div>
        {canEdit && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Resultado
          </Button>
        )}
      </div>

      {/* Live Results Banner */}
      {liveResults.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Play className="h-5 w-5" />
              Competições ao Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveResults.map(result => (
                <div key={result.id} className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{result.event}</h4>
                    <Badge className="bg-red-500 text-white animate-pulse">AO VIVO</Badge>
                  </div>
                  <div className="space-y-1">
                    {result.participants.map(participant => (
                      <div key={participant.id} className="flex justify-between items-center">
                        <span className="text-sm">{participant.name}</span>
                        <span className="font-mono font-bold text-lg">{participant.score}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {result.venue} • {result.round}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Resultados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ao Vivo</CardTitle>
            <Play className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{liveResults.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.filter(r => r.status === 'finished').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.filter(r => r.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Resultados</TabsTrigger>
          <TabsTrigger value="live">Ao Vivo</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar resultados..."
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
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="live">Ao Vivo</SelectItem>
                <SelectItem value="finished">Finalizados</SelectItem>
                <SelectItem value="scheduled">Agendados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Todos os Resultados</CardTitle>
              <CardDescription>
                Histórico completo de resultados e competições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competição/Evento</TableHead>
                    <TableHead>Participantes/Resultado</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => {
                    const { date, time } = formatDateTime(result.date);
                    return (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{result.event}</div>
                            <div className="text-sm text-muted-foreground">
                              {result.competition} • {result.category}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {result.participants.slice(0, 2).map(participant => (
                              <div key={participant.id} className="flex justify-between items-center">
                                <span className="text-sm">{participant.name}</span>
                                <span className="font-mono">
                                  {participant.score || participant.time || '-'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{date}</div>
                            <div className="text-sm text-muted-foreground">{time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{result.venue}</div>
                            <div className="text-xs text-muted-foreground">{result.round}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(result.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveResults.map(result => (
              <Card key={result.id} className="border-red-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.event}</CardTitle>
                    <Badge className="bg-red-500 text-white animate-pulse">AO VIVO</Badge>
                  </div>
                  <CardDescription>{result.competition}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.participants.map(participant => (
                      <div key={participant.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">{participant.team}</div>
                        </div>
                        <div className="text-2xl font-bold font-mono">{participant.score}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {result.venue} • Árbitro: {result.referee}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Recentes</CardTitle>
              <CardDescription>Últimas competições finalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResults.map(result => (
                  <div key={result.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{result.event}</h4>
                        <p className="text-sm text-muted-foreground">{result.competition}</p>
                      </div>
                      <Badge variant="outline">{formatDateTime(result.date).date}</Badge>
                    </div>
                    <div className="space-y-1">
                      {result.participants.map((participant, index) => (
                        <div key={participant.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Medal className="h-4 w-4 text-yellow-500" />}
                            <span className="text-sm">{participant.name}</span>
                          </div>
                          <span className="font-mono">
                            {participant.score || participant.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Competições</CardTitle>
              <CardDescription>Jogos e competições agendados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingResults.map(result => {
                  const { date, time } = formatDateTime(result.date);
                  return (
                    <div key={result.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{result.event}</h4>
                          <p className="text-sm text-muted-foreground">{result.competition}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{date}</div>
                          <div className="text-muted-foreground">{time}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {result.participants.map(participant => (
                          <div key={participant.id} className="flex justify-between items-center">
                            <span className="text-sm">{participant.name}</span>
                            <Badge variant="outline">vs</Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {result.venue} • Árbitro: {result.referee}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}