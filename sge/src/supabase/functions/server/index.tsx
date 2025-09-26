// Servidor SGE ultra-simplificado
console.log('🚀 SGE Simple Server starting...');

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const method = req.method;
  
  console.log(`${method} ${url.pathname}`);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  };
  
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }
  
  try {
    // Test route
    if (url.pathname === '/make-server-3ec57ca8/test') {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'SGE Server Online',
        timestamp: new Date().toISOString()
      }), { headers });
    }
    
    // Login route
    if (url.pathname === '/make-server-3ec57ca8/auth/login' && method === 'POST') {
      const body = await req.json();
      
      // Simple hardcoded validation
      if (body.email === 'admin@sge.gov.br' && body.password === 'SGE@Admin2024!') {
        return new Response(JSON.stringify({
          user: {
            id: 'admin-1',
            email: 'admin@sge.gov.br',
            name: 'Administrador Sistema',
            role: 'gestor',
            isFirstLogin: false,
            needsPasswordChange: false
          },
          accessToken: 'server-token-' + Date.now()
        }), { headers });
      }
      
      return new Response(JSON.stringify({
        error: 'Credenciais inválidas'
      }), { status: 401, headers });
    }

    // Dashboard metrics
    if (url.pathname === '/make-server-3ec57ca8/dashboard/metrics' && method === 'GET') {
      return new Response(JSON.stringify({
        data: {
          municipalities: 12,
          delegations: 25,
          teams: 45,
          athletes: 280,
          events: 18,
          activeCompetitions: 5
        }
      }), { headers });
    }

    // Municipalities
    if (url.pathname === '/make-server-3ec57ca8/municipalities' && method === 'GET') {
      return new Response(JSON.stringify({
        data: [
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
          }
        ]
      }), { headers });
    }

    // Other basic routes
    if (url.pathname.startsWith('/make-server-3ec57ca8/') && method === 'GET') {
      // Generic GET handler for all other endpoints
      return new Response(JSON.stringify({ data: [] }), { headers });
    }

    if (url.pathname.startsWith('/make-server-3ec57ca8/') && ['POST', 'PUT', 'DELETE'].includes(method)) {
      // Generic handler for mutations
      return new Response(JSON.stringify({ 
        success: true, 
        id: 'server-' + Date.now() 
      }), { headers });
    }
    
    // Default response
    return new Response(JSON.stringify({
      error: 'Route not found',
      path: url.pathname,
      method: method
    }), { status: 404, headers });
    
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), { status: 500, headers });
  }
};

// Use Deno's serve function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
serve(handler);
console.log('✅ Simple server started');