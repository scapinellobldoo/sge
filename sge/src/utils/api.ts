import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ec57ca8`;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private isOfflineMode(): boolean {
    return localStorage.getItem('sge_mode') === 'offline';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Se estamos em modo offline, usar dados mock diretamente
    if (this.isOfflineMode()) {
      console.log(`🏠 Using offline data for ${endpoint}`);
      return this.getOfflineData<T>(endpoint, options.method || 'GET');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Server error for ${endpoint}:`, response.status);
        // Em caso de erro 404/401, tentar dados offline
        if (response.status === 404 || response.status === 401) {
          console.log(`🔄 Falling back to offline data for ${endpoint}`);
          return this.getOfflineData<T>(endpoint, options.method || 'GET');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log(`✅ Server data for ${endpoint}`);
      return result.data as T;
    } catch (error) {
      console.error(`❌ API Error on ${endpoint}:`, error);
      
      // Se falhou por timeout ou rede, tentar dados offline
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        console.log(`🔄 Network error, using offline data for ${endpoint}`);
        return this.getOfflineData<T>(endpoint, options.method || 'GET');
      }
      
      throw error;
    }
  }

  private getOfflineData<T>(endpoint: string, method: string): T {
    // Dados mock baseados no endpoint
    if (endpoint.startsWith('/municipalities')) {
      return this.getMockMunicipalities(endpoint, method) as T;
    } else if (endpoint.startsWith('/delegations')) {
      return this.getMockDelegations(endpoint, method) as T;
    } else if (endpoint.startsWith('/teams')) {
      return this.getMockTeams(endpoint, method) as T;
    } else if (endpoint.startsWith('/athletes')) {
      return this.getMockAthletes(endpoint, method) as T;
    } else if (endpoint.startsWith('/officials')) {
      return this.getMockOfficials(endpoint, method) as T;
    } else if (endpoint.startsWith('/events')) {
      return this.getMockEvents(endpoint, method) as T;
    } else if (endpoint.startsWith('/competitions')) {
      return this.getMockCompetitions(endpoint, method) as T;
    } else if (endpoint.startsWith('/registrations')) {
      return this.getMockRegistrations(endpoint, method) as T;
    } else if (endpoint.startsWith('/results')) {
      return this.getMockResults(endpoint, method) as T;
    } else if (endpoint === '/dashboard/metrics') {
      return this.getMockDashboardMetrics() as T;
    }

    // Fallback genérico
    if (method === 'GET') {
      return [] as T;
    } else {
      return { id: 'mock-' + Date.now(), success: true } as T;
    }
  }

  private getMockMunicipalities(endpoint: string, method: string): any {
    const mockData = [
      { 
        id: '1', 
        name: 'São Paulo', 
        state: 'SP', 
        region: 'Sudeste', 
        population: 12000000,
        area: 1521,
        sportsSecretary: 'João Silva Santos',
        phone: '(11) 3133-2000',
        email: 'esportes@saopaulo.sp.gov.br',
        delegations: 8,
        athletes: 145,
        status: 'Ativo'
      },
      { 
        id: '2', 
        name: 'Rio de Janeiro', 
        state: 'RJ', 
        region: 'Sudeste', 
        population: 6700000,
        area: 1200,
        sportsSecretary: 'Maria Oliveira Costa',
        phone: '(21) 2976-1200',
        email: 'esportes@rio.rj.gov.br',
        delegations: 6,
        athletes: 98,
        status: 'Ativo'
      },
      { 
        id: '3', 
        name: 'Brasília', 
        state: 'DF', 
        region: 'Centro-Oeste', 
        population: 3100000,
        area: 5760,
        sportsSecretary: 'Carlos Eduardo Lima',
        phone: '(61) 3901-1500',
        email: 'esportes@brasilia.df.gov.br',
        delegations: 4,
        athletes: 67,
        status: 'Ativo'
      },
      { 
        id: '4', 
        name: 'Salvador', 
        state: 'BA', 
        region: 'Nordeste', 
        population: 2900000,
        area: 693,
        sportsSecretary: 'Ana Claudia Santos',
        phone: '(71) 3202-1800',
        email: 'esportes@salvador.ba.gov.br',
        delegations: 5,
        athletes: 89,
        status: 'Ativo'
      },
      { 
        id: '5', 
        name: 'Fortaleza', 
        state: 'CE', 
        region: 'Nordeste', 
        population: 2700000,
        area: 314,
        sportsSecretary: 'Roberto Mendes Silva',
        phone: '(85) 3452-3000',
        email: 'esportes@fortaleza.ce.gov.br',
        delegations: 3,
        athletes: 54,
        status: 'Ativo'
      }
    ];

    if (method === 'GET') {
      return mockData;
    } else if (method === 'POST') {
      return { id: 'new-municipality-' + Date.now(), success: true };
    } else if (method === 'PUT') {
      return { id: endpoint.split('/').pop(), success: true };
    } else if (method === 'DELETE') {
      return { success: true };
    }
  }

  private getMockDelegations(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', name: 'Delegação São Paulo Capital', municipality: 'São Paulo', athletes: 45, teams: 8 },
      { id: '2', name: 'Delegação Rio de Janeiro', municipality: 'Rio de Janeiro', athletes: 38, teams: 6 },
      { id: '3', name: 'Delegação Brasília', municipality: 'Brasília', athletes: 29, teams: 5 },
      { id: '4', name: 'Delegação Salvador', municipality: 'Salvador', athletes: 33, teams: 7 }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-delegation-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockTeams(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', name: 'Veteranos SP', delegation: 'São Paulo', sport: 'Futebol', category: 'Master 60+', athletes: 18 },
      { id: '2', name: 'Masters RJ', delegation: 'Rio de Janeiro', sport: 'Basquete', category: 'Master 60+', athletes: 12 },
      { id: '3', name: 'Golden Age BSB', delegation: 'Brasília', sport: 'Vôlei', category: 'Master 60+', athletes: 14 },
      { id: '4', name: 'Senior Salvador', delegation: 'Salvador', sport: 'Natação', category: 'Master 60+', athletes: 8 }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-team-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockAthletes(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', name: 'João Silva', age: 65, team: 'Veteranos SP', sport: 'Futebol', category: 'Master 60+' },
      { id: '2', name: 'Maria Santos', age: 62, team: 'Masters RJ', sport: 'Basquete', category: 'Master 60+' },
      { id: '3', name: 'Carlos Lima', age: 68, team: 'Golden Age BSB', sport: 'Vôlei', category: 'Master 60+' },
      { id: '4', name: 'Ana Costa', age: 64, team: 'Senior Salvador', sport: 'Natação', category: 'Master 60+' }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-athlete-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockOfficials(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', name: 'Pedro Oliveira', type: 'Árbitro', sport: 'Futebol', certification: 'CBF Nível 1' },
      { id: '2', name: 'Lucia Ferreira', type: 'Juíza', sport: 'Basquete', certification: 'FIBA Nível 2' },
      { id: '3', name: 'Roberto Cruz', type: 'Árbitro', sport: 'Vôlei', certification: 'FIVB Nível 1' }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-official-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockEvents(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', name: 'Campeonato Master 60+ SP', date: '2024-10-15', location: 'São Paulo', participants: 120 },
      { id: '2', name: 'Jogos da Terceira Idade RJ', date: '2024-11-20', location: 'Rio de Janeiro', participants: 95 },
      { id: '3', name: 'Festival Sênior BSB', date: '2024-12-05', location: 'Brasília', participants: 78 }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-event-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockCompetitions(endpoint: string, method: string): any {
    const mockData = [
      { 
        id: '1', 
        name: 'Futebol Master 60+',
        event: 'Campeonato Master 60+ SP', 
        sport: 'Futebol', 
        category: 'Master 60+',
        format: 'knockout',
        startDate: '2024-10-15',
        endDate: '2024-10-20',
        venue: 'Estádio Municipal de São Paulo',
        maxTeams: 8,
        registeredTeams: 8,
        phases: ['Quartas', 'Semifinal', 'Final'],
        currentPhase: 'Semifinal',
        rules: 'Regulamento FIFA adaptado para Master',
        prizes: '1º lugar: R$ 5.000 | 2º lugar: R$ 3.000',
        status: 'ongoing',
        organizer: 'Secretaria Municipal de Esportes SP',
        referee: 'Pedro Oliveira Silva',
        createdAt: '2024-09-01',
        updatedAt: '2024-10-10'
      },
      { 
        id: '2', 
        name: 'Basquete Master 60+',
        event: 'Jogos da Terceira Idade RJ', 
        sport: 'Basquete', 
        category: 'Master 60+',
        format: 'league',
        startDate: '2024-11-20',
        endDate: '2024-11-25',
        venue: 'Ginásio Carioca',
        maxTeams: 6,
        registeredTeams: 5,
        phases: ['Fase Classificatória', 'Playoffs'],
        currentPhase: 'Fase Classificatória',
        rules: 'Regulamento FIBA adaptado',
        prizes: '1º lugar: Troféu + Medalhas',
        status: 'registration',
        organizer: 'Federação de Basquete RJ',
        referee: 'Maria Santos Lima',
        createdAt: '2024-09-15',
        updatedAt: '2024-10-01'
      },
      { 
        id: '3', 
        name: 'Natação Master 60+',
        event: 'Festival Sênior BSB', 
        sport: 'Natação', 
        category: 'Master 60+',
        format: 'time_trial',
        startDate: '2024-09-20',
        endDate: '2024-09-22',
        venue: 'Centro Aquático de Brasília',
        maxTeams: 4,
        registeredTeams: 4,
        phases: ['Eliminatórias', 'Finais'],
        currentPhase: 'Finais',
        rules: 'Regulamento CBDA Master',
        prizes: '1º lugar: Medalha de Ouro + R$ 1.000',
        status: 'finished',
        organizer: 'Confederação Brasileira de Natação',
        referee: 'Carlos Eduardo Santos',
        createdAt: '2024-08-15',
        updatedAt: '2024-09-22'
      }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-competition-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockRegistrations(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', athlete: 'João Silva', event: 'Campeonato Master 60+ SP', status: 'Confirmado', date: '2024-09-15' },
      { id: '2', athlete: 'Maria Santos', event: 'Jogos da Terceira Idade RJ', status: 'Pendente', date: '2024-09-20' },
      { id: '3', athlete: 'Carlos Lima', event: 'Festival Sênior BSB', status: 'Confirmado', date: '2024-09-18' }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-registration-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockResults(endpoint: string, method: string): any {
    const mockData = [
      { id: '1', competition: 'Futebol Master 60+', winner: 'Veteranos SP', score: '2 x 1', date: '2024-09-25' },
      { id: '2', competition: 'Basquete Master 60+', winner: 'Masters RJ', score: '85 x 78', date: '2024-09-24' },
      { id: '3', competition: 'Natação Master 60+', winner: 'Senior Salvador', score: '1:25:30', date: '2024-09-23' }
    ];

    if (method === 'GET') return mockData;
    if (method === 'POST') return { id: 'new-result-' + Date.now(), success: true };
    if (method === 'PUT') return { id: endpoint.split('/').pop(), success: true };
    if (method === 'DELETE') return { success: true };
  }

  private getMockDashboardMetrics(): any {
    return {
      municipalities: 12,
      delegations: 25,
      teams: 45,
      athletes: 280,
      events: 18,
      activeCompetitions: 5
    };
  }

  // Municipalities
  async getMunicipalities() {
    return this.request<any[]>('/municipalities');
  }

  async createMunicipality(data: any) {
    return this.request<any>('/municipalities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMunicipality(id: string, data: any) {
    return this.request<any>(`/municipalities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMunicipality(id: string) {
    return this.request<{ success: boolean }>(`/municipalities/${id}`, {
      method: 'DELETE',
    });
  }

  // Delegations
  async getDelegations() {
    return this.request<any[]>('/delegations');
  }

  async createDelegation(data: any) {
    return this.request<any>('/delegations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDelegation(id: string, data: any) {
    return this.request<any>(`/delegations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDelegation(id: string) {
    return this.request<{ success: boolean }>(`/delegations/${id}`, {
      method: 'DELETE',
    });
  }

  // Teams
  async getTeams() {
    return this.request<any[]>('/teams');
  }

  async createTeam(data: any) {
    return this.request<any>('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeam(id: string, data: any) {
    return this.request<any>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(id: string) {
    return this.request<{ success: boolean }>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Athletes
  async getAthletes() {
    return this.request<any[]>('/athletes');
  }

  async createAthlete(data: any) {
    return this.request<any>('/athletes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAthlete(id: string, data: any) {
    return this.request<any>(`/athletes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAthlete(id: string) {
    return this.request<{ success: boolean }>(`/athletes/${id}`, {
      method: 'DELETE',
    });
  }

  // Officials
  async getOfficials() {
    return this.request<any[]>('/officials');
  }

  async createOfficial(data: any) {
    return this.request<any>('/officials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOfficial(id: string, data: any) {
    return this.request<any>(`/officials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOfficial(id: string) {
    return this.request<{ success: boolean }>(`/officials/${id}`, {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents() {
    return this.request<any[]>('/events');
  }

  async createEvent(data: any) {
    return this.request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return this.request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request<{ success: boolean }>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Competitions
  async getCompetitions() {
    return this.request<any[]>('/competitions');
  }

  async createCompetition(data: any) {
    return this.request<any>('/competitions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCompetition(id: string, data: any) {
    return this.request<any>(`/competitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCompetition(id: string) {
    return this.request<{ success: boolean }>(`/competitions/${id}`, {
      method: 'DELETE',
    });
  }

  // Registrations
  async getRegistrations() {
    return this.request<any[]>('/registrations');
  }

  async createRegistration(data: any) {
    return this.request<any>('/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRegistration(id: string, data: any) {
    return this.request<any>(`/registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRegistration(id: string) {
    return this.request<{ success: boolean }>(`/registrations/${id}`, {
      method: 'DELETE',
    });
  }

  // Results
  async getResults() {
    return this.request<any[]>('/results');
  }

  async createResult(data: any) {
    return this.request<any>('/results', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResult(id: string, data: any) {
    return this.request<any>(`/results/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResult(id: string) {
    return this.request<{ success: boolean }>(`/results/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboardMetrics() {
    return this.request<{
      municipalities: number;
      delegations: number;
      teams: number;
      athletes: number;
      events: number;
      activeCompetitions: number;
    }>('/dashboard/metrics');
  }
}

export const apiClient = new ApiClient();