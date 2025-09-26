# 🏅 Sistema de Gerenciamento Esportivo (SGE)

O **SGE** é uma aplicação web desenvolvida para **organizar e gerenciar eventos esportivos**, inicialmente voltada para os **Jogos 60+**.  
O sistema centraliza cadastros, inscrições, organização de competições e resultados, garantindo eficiência, transparência e redução de erros no processo de gestão esportiva.

---

## 🚀 Funcionalidades do MVP

- **Acesso & Perfis**
  - Login com e-mail/senha.
  - Perfis: **Admin** (gestor global) e **Dirigente** (representante municipal).
  - Aprovação de cadastros de Dirigentes pelo Admin.
  - Escopo de dados restrito por município.

- **Cadastros Base**
  - Atletas (com validação 60+, RG obrigatório).
  - Equipes, Dirigentes, Municípios.
  - Modalidades (individual/coletiva, parâmetros, categorias).
  - Locais/Quadras, Eventos e Fases.

- **Inscrições**
  - Dirigente cria/edita inscrições do seu município.
  - Admin cria/edita geral, aprova e define limites/períodos.

- **Organização Esportiva**
  - Geração de chaves e tabelas (automática/manual).
  - Registro de placares e estatísticas (homologação do Admin).
  - Cálculo de classificações, artilharia e quadro de medalhas.
  - Relatórios internos (listagens e súmulas).

- **Fora do MVP (Roadmap)**
  - Notificações automáticas, auditoria detalhada.
  - Integrações externas e API pública.
  - Portal público de resultados.
  - Exportação oficial (PDF/CSV).
  - Regras avançadas de governança/penalidades.

---

## 🛠️ Stack Tecnológica

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router) + TailwindCSS  
- **Auth/DB/Storage:** [Supabase](https://supabase.com/) (Auth, Postgres, Storage, RLS)  
- **Validação:** [Zod](https://zod.dev/)  
- **Estilo de código:** ESLint + Prettier  
- **Arquitetura:** Clean Architecture (camadas `domain`, `application`, `infra`, `ui`)  
- **Hospedagem:** Vercel (frontend) + Supabase (backend)  

---

## 📂 Estrutura de Pastas

```bash
sge/
├─ app/
│  ├─ (public)/login/page.jsx
│  ├─ (app)/dashboard/admin/page.jsx
│  ├─ (app)/dashboard/dirigente/page.jsx
│  ├─ api/...
│  └─ layout.jsx
├─ src/
│  ├─ ui/           # componentes
│  ├─ application/  # casos de uso
│  ├─ domain/       # entidades e serviços de domínio
│  └─ infra/        # supabaseClient, repositórios, RLS
├─ supabase/        # schema.sql, policies.sql, storage-buckets.sql
├─ scripts/         # seeders, fixtures
├─ public/
├─ styles/
├─ .env.example
├─ package.json
└─ README.md
````

---

## 🗄️ Banco de Dados (Supabase)

Tabelas principais do MVP:

* `municipios`, `usuarios`, `dirigentes`, `modalidades`, `locais`,
* `equipes`, `atletas`, `eventos`, `fases`, `inscricoes`,
* `partidas`, `estatisticas_partida`, `classificacoes`, `medalhas`.

🔐 **Políticas de segurança (RLS):**

* Dirigentes só acessam dados do seu município.
* Admin tem acesso global.

---

## ▶️ Como Rodar o Projeto

1. **Criar projeto Next.js**

   ```bash
   npx create-next-app@latest sge --js --tailwind --eslint --use-npm --app
   cd sge
   ```

2. **Instalar dependências**

   ```bash
   npm install @supabase/supabase-js zod
   ```

3. **Configurar variáveis de ambiente**
   Criar `.env.local` com:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

4. **Rodar em desenvolvimento**

   ```bash
   npm run dev
   ```

---

## ✅ Critérios de Aceite do MVP

* Dirigente registra/entra, cadastra atletas/equipes e submete inscrições.
* Admin aprova inscrições, define limites/períodos e homologa resultados.
* Regras de idade (>= 60) e escopo por município ativas.
* Geração de chaves/tabelas e cálculos automáticos de classificações/medalhas.
* Logs básicos + checklist WCAG atendido nas telas principais.

---

## 📌 Licença

Este projeto é de uso restrito à organização dos **Jogos 60+**. Futuramente poderá ser expandido para outros eventos esportivos.
Quer que eu já prepare este README.md no formato de arquivo para você baixar e incluir no repositório, ou prefere que eu apenas deixe o conteúdo aqui para você copiar?
```
