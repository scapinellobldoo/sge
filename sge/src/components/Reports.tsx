import { useState } from 'react';
import { Download, Filter, FileText, BarChart3, Calendar, Users, Trophy, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { User } from '../App';

interface Report {
  id: string;
  name: string;
  type: 'athletes' | 'events' | 'competitions' | 'registrations' | 'results' | 'custom';
  description: string;
  createdAt: string;
  createdBy: string;
  filters: Record<string, any>;
  data: any[];
}

interface ReportsProps {
  currentUser: User;
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Relatório de Atletas por Município',
    type: 'athletes',
    description: 'Distribuição de atletas cadastrados por município',
    createdAt: '2024-01-10',
    createdBy: 'Admin Sistema',
    filters: { municipality: 'all', sport: 'all' },
    data: []
  },
  {
    id: '2',
    name: 'Relatório de Eventos do Mês',
    type: 'events',
    description: 'Eventos realizados no mês atual',
    createdAt: '2024-01-09',
    createdBy: 'João Organizador',
    filters: { month: '2024-01', status: 'all' },
    data: []
  }
];

const athletesByMunicipality = [
  { name: 'São Paulo', athletes: 1247, teams: 45 },
  { name: 'Rio de Janeiro', athletes: 892, teams: 32 },
  { name: 'Brasília', athletes: 456, teams: 18 },
  { name: 'Salvador', athletes: 623, teams: 25 },
  { name: 'Belo Horizonte', athletes: 334, teams: 14 },
];

const sportDistribution = [
  { name: 'Futebol', value: 35, color: '#8884d8' },
  { name: 'Vôlei', value: 25, color: '#82ca9d' },
  { name: 'Basquete', value: 20, color: '#ffc658' },
  { name: 'Natação', value: 15, color: '#ff7300' },
  { name: 'Outros', value: 5, color: '#8dd1e1' },
];

const monthlyRegistrations = [
  { month: 'Jan', registrations: 120 },
  { month: 'Fev', registrations: 135 },
  { month: 'Mar', registrations: 142 },
  { month: 'Abr', registrations: 158 },
  { month: 'Mai', registrations: 167 },
  { month: 'Jun', registrations: 180 },
];

const eventsByStatus = [
  { status: 'Planejamento', count: 5 },
  { status: 'Inscrições Abertas', count: 8 },
  { status: 'Em Andamento', count: 3 },
  { status: 'Finalizados', count: 12 },
];

export function Reports({ currentUser }: ReportsProps) {
  const [reports, setReports] = useState(mockReports);
  const [selectedReportType, setSelectedReportType] = useState('athletes');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterMunicipality, setFilterMunicipality] = useState('all');
  const [filterSport, setFilterSport] = useState('all');

  const canCreateReports = ['gestor', 'dirigente', 'arbitro', 'operador'].includes(currentUser.role);

  const generateReport = () => {
    // Mock report generation
    const newReport: Report = {
      id: Date.now().toString(),
      name: `Relatório ${selectedReportType} - ${new Date().toLocaleDateString('pt-BR')}`,
      type: selectedReportType as any,
      description: `Relatório gerado automaticamente`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser.name,
      filters: { municipality: filterMunicipality, sport: filterSport },
      data: []
    };
    
    setReports(prev => [newReport, ...prev]);
  };

  const downloadReport = (reportId: string, format: 'pdf' | 'xlsx' | 'csv') => {
    // Mock download functionality
    console.log(`Downloading report ${reportId} as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Relatórios</h1>
          <p className="text-muted-foreground">
            Gerar e visualizar relatórios do sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Atletas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competições</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Athletes by Municipality */}
            <Card>
              <CardHeader>
                <CardTitle>Atletas por Município</CardTitle>
                <CardDescription>Distribuição de atletas cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={athletesByMunicipality}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="athletes" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sport Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Modalidade</CardTitle>
                <CardDescription>Participação nas competições</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sportDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {sportDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Inscrições Mensais</CardTitle>
                <CardDescription>Evolução de inscrições ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="registrations" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Events by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos por Status</CardTitle>
                <CardDescription>Status atual dos eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo de Participação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total de Municípios:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Delegações Ativas:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Equipes Cadastradas:</span>
                    <span className="font-medium">134</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Atletas Ativos:</span>
                    <span className="font-medium">2,847</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Taxa de Ocupação:</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Eventos Finalizados:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Média Participantes:</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfação Média:</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores Operacionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Inscrições Pendentes:</span>
                    <span className="font-medium text-yellow-600">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Homologações Dia:</span>
                    <span className="font-medium text-green-600">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resultados Pendentes:</span>
                    <span className="font-medium text-orange-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Oficiais Disponíveis:</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Generator Tab */}
        <TabsContent value="generator" className="space-y-4">
          {canCreateReports ? (
            <Card>
              <CardHeader>
                <CardTitle>Gerador de Relatórios</CardTitle>
                <CardDescription>
                  Configure e gere relatórios personalizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Relatório</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="athletes">Atletas</SelectItem>
                        <SelectItem value="events">Eventos</SelectItem>
                        <SelectItem value="competitions">Competições</SelectItem>
                        <SelectItem value="registrations">Inscrições</SelectItem>
                        <SelectItem value="results">Resultados</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Município</Label>
                    <Select value={filterMunicipality} onValueChange={setFilterMunicipality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="sao-paulo">São Paulo</SelectItem>
                        <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                        <SelectItem value="brasilia">Brasília</SelectItem>
                        <SelectItem value="salvador">Salvador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Modalidade</Label>
                    <Select value={filterSport} onValueChange={setFilterSport}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="futebol">Futebol</SelectItem>
                        <SelectItem value="volei">Vôlei</SelectItem>
                        <SelectItem value="basquete">Basquete</SelectItem>
                        <SelectItem value="natacao">Natação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Período</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button onClick={generateReport}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" onClick={() => downloadReport('preview', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Prévia PDF
                  </Button>
                  <Button variant="outline" onClick={() => downloadReport('preview', 'xlsx')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">
                  Você não tem permissão para gerar relatórios.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Relatórios</CardTitle>
              <CardDescription>
                Relatórios gerados anteriormente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant="outline">
                          {report.type === 'athletes' ? 'Atletas' :
                           report.type === 'events' ? 'Eventos' :
                           report.type === 'competitions' ? 'Competições' :
                           report.type === 'registrations' ? 'Inscrições' :
                           report.type === 'results' ? 'Resultados' :
                           'Personalizado'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Criado por {report.createdBy} em {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => downloadReport(report.id, 'pdf')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}