// Script para criar usuário administrador inicial
// Execute este script uma vez para criar o primeiro admin

import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

const seedAdmin = async () => {
  try {
    console.log('🌱 Criando usuário administrador inicial...');

    const adminEmail = 'admin@sge.gov.br';
    const adminPassword = 'SGE@Admin2024!';

    // Verificar se já existe
    const existingUsers = await kv.getByPrefix('user:');
    const adminExists = existingUsers.some(user => user.email === adminEmail);
    
    if (adminExists) {
      console.log('✅ Usuário administrador já existe');
      return;
    }

    // Criar no Supabase Auth
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: { 
        name: 'Administrador Sistema',
        role: 'gestor' 
      },
      email_confirm: true
    });

    if (createError) {
      console.error('❌ Erro ao criar usuário no Supabase:', createError);
      return;
    }

    // Criar no KV store
    const adminId = crypto.randomUUID();
    const adminUser = {
      id: adminId,
      name: 'Administrador Sistema',
      email: adminEmail,
      document: '000.000.000-00',
      documentType: 'cpf',
      role: 'gestor',
      status: 'approved',
      supabaseId: newUser.user.id,
      isFirstLogin: false,
      needsPasswordChange: false,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: 'system'
    };

    await kv.set(`user:${adminId}`, adminUser);

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminPassword}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
  }
};

// Executar se for chamado diretamente
if (import.meta.main) {
  await seedAdmin();
}