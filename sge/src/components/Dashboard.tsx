import { 
  Users, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Activity,
  MapPin,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { apiClient } from '../utils/api';
import { useState, useEffect } from 'react';
import type { User } from '../App';

interface DashboardProps {
  currentUser: User;
}

const registrationData = [
  { month: 'Jan', athletes: 120, teams: 15 },
  { month: 'Fev', athletes: 135, teams: 18 },
  { month: 'Mar', athletes: 142, teams: 20 },
  { month: 'Abr', athletes: 158, teams: 22 },
  { month: 'Mai', athletes: 167, teams: 25 },
  { month: 'Jun', athletes: 180, teams: 28 },
];

const eventData = [
  { name: 'Futebol', value: 35, color: '#8884d8' },
  { name: 'Vôlei', value: 25, color: '#82ca9d' },
  { name: 'Basquete', value: 20, color: '#ffc658' },
  { name: 'Natação', value: 15, color: '#ff7300' },
  { name: 'Outros', value: 5, color: '#8dd1e1' },
];

const upcomingEvents = [
  { id: 1, name: 'Campeonato Municipal de Futebol Master', date: '2024-01-15', status: 'Em andamento', participants: 24 },
  { id: 2, name: 'Torneio de Vôlei Feminino Master', date: '2024-01-20', status: 'Inscrições abertas', participants: 16 },
  { id: 3, name: 'Copa de Natação Master', date: '2024-02-01', status: 'Planejamento', participants: 32 },
  { id: 4, name: 'Liga Regional de Basquete Master', date: '2024-02-10', status: 'Inscrições abertas', participants: 12 },
];

const recentResults = [
  { id: 1, competition: 'Final Futebol Sub-20', result: 'São Paulo 2 x 1 Santos', date: '2024-01-10' },
  { id: 2, competition: 'Vôlei Feminino - Semifinal', result: 'Minas 3 x 1 Rio', date: '2024-01-09' },
  { id: 3, competition: 'Natação 100m Livre', result: '1º João Silva - 48.32s', date: '2024-01-08' },
  { id: 4, competition: 'Basquete Masculino', result: 'Flamengo 85 x 78 Corinthians', date: '2024-01-07' },
];

export function Dashboard({ currentUser }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    municipalities: 0,
    delegations: 0,
    teams: 0,
    athletes: 0,
    events: 0,
    activeCompetitions: 0
  });
  const [loading, setLoading] = useState(true);
  const isOfflineMode = typeof window !== 'undefined' && localStorage.getItem('sge_mode') === 'offline';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        if (!isOfflineMode) {
          const data = await apiClient.getDashboardMetrics();
          setMetrics(data);
        } else {
          console.log('📊 Using demo dashboard data in offline mode');
          // Usar dados de demonstração em modo offline
          setMetrics({
            municipalities: 12,
            delegations: 25,
            teams: 45,
            athletes: 280,
            events: 18,
            activeCompetitions: 5
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        // Em caso de erro, usar dados demo
        setMetrics({
          municipalities: 8,
          delegations: 15,
          teams: 28,
          athletes: 180,
          events: 12,
          activeCompetitions: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isOfflineMode]);

  const stats = [
    {
      title: 'Atletas Cadastrados',
      value: loading ? '...' : metrics.athletes.toString(),
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Eventos Ativos',
      value: loading ? '...' : metrics.events.toString(),
      change: '+3',
      icon: Calendar,
      trend: 'up'
    },
    {
      title: 'Equipes',
      value: loading ? '...' : metrics.teams.toString(),
      change: '+8%',
      icon: Trophy,
      trend: 'up'
    },
    {
      title: 'Municípios',
      value: loading ? '...' : metrics.municipalities.toString(),
      change: '+2',
      icon: MapPin,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento esportivo
        </p>
      </div>

      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-full">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-orange-900">Modo Demonstração Ativo</h3>
                <p className="text-sm text-orange-700">
                  Você está usando dados de demonstração. Todas as funcionalidades estão disponíveis para teste.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span>vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Cadastros</CardTitle>
            <CardDescription>Atletas e equipes por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="athletes" stroke="#8884d8" name="Atletas" />
                <Line type="monotone" dataKey="teams" stroke="#82ca9d" name="Equipes" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sports Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Modalidade</CardTitle>
            <CardDescription>Participação nas competições</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {eventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Competições programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{event.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('pt-BR')} • {event.participants} participantes
                    </p>
                  </div>
                  <Badge variant={
                    event.status === 'Em andamento' ? 'default' :
                    event.status === 'Inscrições abertas' ? 'secondary' :
                    'outline'
                  }>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados Recentes</CardTitle>
            <CardDescription>Últimas competições finalizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{result.competition}</h4>
                    <p className="text-sm text-muted-foreground">{result.result}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(result.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {['gestor', 'operador', 'dirigente'].includes(currentUser.role) && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Tarefas que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Homologações Pendentes</span>
                </div>
                <p className="text-2xl font-bold">7</p>
                <Progress value={70} className="mt-2" />
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Eventos Esta Semana</span>
                </div>
                <p className="text-2xl font-bold">3</p>
                <Progress value={30} className="mt-2" />
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Inscrições Abertas</span>
                </div>
                <p className="text-2xl font-bold">12</p>
                <Progress value={85} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}