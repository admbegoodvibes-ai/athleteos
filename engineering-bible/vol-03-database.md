# 📙 AthleteOS Engineering Bible
# Volume 3 — Banco de Dados

## 1. Visão Geral
O banco de dados do AthleteOS é construído sobre o PostgreSQL, utilizando a infraestrutura do Supabase. Esta escolha nos fornece um banco relacional robusto, com suporte nativo a RLS (Row Level Security), extensões poderosas como `pgvector` (para buscas semânticas em Inteligência Artificial) e `Realtime` para atualizações em tempo real no frontend.

**Estratégia de Organização do Schema**
- A maior parte das tabelas de domínio do negócio fica no schema `public`.
- A autenticação é gerenciada no schema `auth` próprio do Supabase.
- A lógica de IA e embeddings utiliza a extensão `vector` no schema `public`.

**Convenções de Nomenclatura e Tipagem**
- Nomes de tabelas sempre no **plural** e em `snake_case` (ex: `athletes`, `training_sessions`).
- Chaves primárias (PKs) são sempre do tipo `uuid` (UUIDv4) e não seriais, evitando scraping e facilitando sincronização offline-first no futuro.
- Timestamps utilizam `timestamptz` (Timestamp with Time Zone) para evitar problemas de fuso horário.

---

## 2. Diagrama Entidade-Relacionamento

```text
[Auth]                    [Core Domain]                          [System]
auth.users <---+--------- users ------------------+------------> audit_logs
               |            |                     |            > notifications
               |            +--- athletes <---.   |            > feature_flags
               |            |        ^        |   |            > app_settings
               |            |        |        |   |
               +--------- coach_profiles      |   |
               |            |                 |   |
               +--------- scout_profiles      |   |
               |            |                 |   |
               +--------- guardian_athletes --'   |
                                                  |
[Matches Domain]                                  |
athletes <---- matches <---- match_events         |
                                                  |
[Training Domain]                                 |
athletes <---- training_sessions                  |
                    ^                             |
                    |                             |
athletes <---- training_feedbacks ----------------+
                                                  |
[Wellness & Load Domain]                          |
athletes <---- wellness_logs                      |
athletes <---- workload_metrics                   |
                                                  |
[AI Domain]                                       |
athletes <---- ai_reports                         |
athletes <---- ai_embeddings                      |
                                                  |
[Media Domain]                                    |
athletes <---- media_assets <---- video_tags      |
                                                  |
[Scouting Domain]                                 |
athletes <---- scouting_reports                   |
athletes <---- scout_interests                    |
                                                  |
[Development Domain]                              |
athletes <---- individual_development_plans       |
                    ^                             |
                    |                             |
               idp_goals                          |
                                                  |
athletes <---- maturation_records                 |
```

---

## 4. Enums (Custom Types)
*(Definidos antes das tabelas para uso nos schemas)*

```sql
CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'scout', 'guardian');
CREATE TYPE position_type AS ENUM ('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF');
CREATE TYPE dominant_foot AS ENUM ('left', 'right', 'both');
CREATE TYPE category_type AS ENUM ('sub14', 'sub15', 'sub17', 'sub20');
CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian');
CREATE TYPE match_status AS ENUM ('pending_analysis', 'analyzed', 'error');
CREATE TYPE event_type AS ENUM ('goal', 'assist', 'tackle', 'interception', 'foul', 'yellow_card', 'red_card', 'sprint', 'key_pass');
CREATE TYPE session_type AS ENUM ('technical', 'tactical', 'physical', 'match_training', 'gym', 'recovery');
CREATE TYPE acwr_zone AS ENUM ('undertrained', 'optimal', 'warning', 'danger');
CREATE TYPE report_type AS ENUM ('post_match', 'weekly', 'monthly', 'custom');
CREATE TYPE ai_source_type AS ENUM ('match_report', 'training', 'wellness');
CREATE TYPE asset_type AS ENUM ('photo', 'video');
CREATE TYPE tag_type AS ENUM ('goal', 'assist', 'tackle', 'sprint', 'error', 'highlight');
CREATE TYPE recommendation_type AS ENUM ('dismiss', 'monitor', 'invite_trial', 'sign');
CREATE TYPE scout_status AS ENUM ('pending', 'contacted', 'rejected', 'accepted');
CREATE TYPE cycle_type AS ENUM ('monthly', 'quarterly', 'semester');
CREATE TYPE idp_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE idp_category AS ENUM ('technical', 'tactical', 'physical', 'mental');
CREATE TYPE goal_status AS ENUM ('not_started', 'in_progress', 'achieved', 'missed');
CREATE TYPE phv_status AS ENUM ('pre_phv', 'phv', 'post_phv');
CREATE TYPE notification_type AS ENUM ('ai_report_ready', 'wellness_alert', 'load_alert', 'scout_interest', 'system');
```

---

## 3. Tabelas Detalhadas

### Core Domain

#### 1. users
**Propósito:** Estende os dados de usuário básicos do Supabase Auth para perfis no app.
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can read athlete profiles" ON users FOR SELECT USING (role = 'athlete');
```

#### 2. athletes
**Propósito:** Armazena dados específicos biológicos, de categoria e bio dos atletas.
```sql
CREATE TABLE athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    position position_type NOT NULL,
    secondary_position position_type,
    dominant_foot dominant_foot NOT NULL,
    height_cm INTEGER,
    weight_kg NUMERIC(5,2),
    category category_type NOT NULL,
    club TEXT,
    city TEXT,
    state TEXT,
    bio TEXT,
    slug TEXT UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_athletes_category ON athletes(category);
CREATE INDEX idx_athletes_position ON athletes(position);
CREATE INDEX idx_athletes_slug ON athletes(slug);

-- RLS
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are visible to all" ON athletes FOR SELECT USING (is_public = true);
CREATE POLICY "Athletes can update own profile" ON athletes FOR UPDATE USING (auth.uid() = user_id);
```

#### 3. coach_profiles
**Propósito:** Perfil específico para treinadores.
```sql
CREATE TABLE coach_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club TEXT NOT NULL,
    license_type TEXT,
    categories TEXT[],
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. scout_profiles
**Propósito:** Perfil específico para scouts e olheiros.
```sql
CREATE TABLE scout_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization TEXT NOT NULL,
    region TEXT,
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. guardian_athletes
**Propósito:** Conecta responsáveis legais (guardians) aos atletas.
```sql
CREATE TABLE guardian_athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    relationship relationship_type NOT NULL,
    invite_code TEXT UNIQUE,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_guardian_athlete_pair ON guardian_athletes(guardian_user_id, athlete_id);
```

### Matches Domain

#### 6. matches
**Propósito:** Registra histórico de jogos e autoavaliação pós-jogo.
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    opponent TEXT NOT NULL,
    match_date DATE NOT NULL,
    competition TEXT,
    venue TEXT,
    category category_type,
    minutes_played INTEGER,
    self_rating INTEGER CHECK (self_rating BETWEEN 1 AND 10),
    positive_points TEXT,
    improvement_points TEXT,
    emotional_note TEXT,
    status match_status DEFAULT 'pending_analysis',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_matches_athlete_date ON matches(athlete_id, match_date);
```

#### 7. match_events
**Propósito:** Log de eventos individuais dentro de uma partida (para timeline ou IA).
```sql
CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    minute INTEGER CHECK (minute >= 0),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Training Domain

#### 8. training_sessions
**Propósito:** Registra treinos prescritos ou realizados.
```sql
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_type session_type NOT NULL,
    duration_minutes INTEGER NOT NULL,
    planned_rpe INTEGER CHECK (planned_rpe BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 9. training_feedbacks
**Propósito:** Coleta a Percepção Subjetiva de Esforço (PSE / RPE) pós-treino para calcular a carga (sRPE).
```sql
CREATE TABLE training_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    perceived_rpe INTEGER CHECK (perceived_rpe BETWEEN 1 AND 10) NOT NULL,
    srpe_calculated INTEGER NOT NULL, -- duration_minutes * perceived_rpe
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Wellness Domain

#### 10. wellness_logs
**Propósito:** Questionário diário de prontidão/bem-estar (Readiness).
```sql
CREATE TABLE wellness_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 5),
    muscle_soreness INTEGER CHECK (muscle_soreness BETWEEN 1 AND 5),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
    mood INTEGER CHECK (mood BETWEEN 1 AND 5),
    wellness_score NUMERIC(5,2), -- Average of the 5 metrics
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(athlete_id, log_date)
);
```

### Workload Domain

#### 11. workload_metrics
**Propósito:** Métricas agregadas e calculadas de carga (Acute:Chronic Workload Ratio).
```sql
CREATE TABLE workload_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    acute_load_7d NUMERIC(10,2),
    chronic_load_28d NUMERIC(10,2),
    acwr NUMERIC(5,2),
    acwr_zone acwr_zone,
    ewma_acute NUMERIC(10,2),
    ewma_chronic NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(athlete_id, metric_date)
);
```

### AI Domain

#### 12. ai_reports
**Propósito:** Análises qualitativas ricas geradas por LLMs baseadas em partidas ou semanas.
```sql
CREATE TABLE ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    report_type report_type NOT NULL,
    content JSONB NOT NULL,
    strengths TEXT[],
    improvements TEXT[],
    training_focus TEXT[],
    score NUMERIC(5,2),
    model_used TEXT,
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id)
);
CREATE INDEX idx_ai_reports_athlete ON ai_reports(athlete_id);
```

#### 13. ai_embeddings
**Propósito:** Base de conhecimento vetorial (RAG) do atleta (para perguntar à IA "como o atleta melhorou no último mês?").
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE ai_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    source_type ai_source_type NOT NULL,
    source_id UUID NOT NULL,
    embedding VECTOR(768),
    content_text TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- hnsw index for pgvector
CREATE INDEX idx_embeddings_vector ON ai_embeddings USING hnsw (embedding vector_cosine_ops);
```

### Media Domain

#### 14. media_assets
```sql
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    asset_type asset_type NOT NULL,
    storage_path TEXT NOT NULL,
    original_filename TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    thumbnail_path TEXT,
    title TEXT,
    description TEXT,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    training_session_id UUID REFERENCES training_sessions(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 15. video_tags
```sql
CREATE TABLE video_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    tag_type tag_type NOT NULL,
    start_timestamp_sec INTEGER NOT NULL,
    end_timestamp_sec INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Scouting Domain

#### 16. scouting_reports
```sql
CREATE TABLE scouting_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scout_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    technical_score INTEGER CHECK (technical_score BETWEEN 1 AND 10),
    tactical_score INTEGER CHECK (tactical_score BETWEEN 1 AND 10),
    physical_score INTEGER CHECK (physical_score BETWEEN 1 AND 10),
    mental_score INTEGER CHECK (mental_score BETWEEN 1 AND 10),
    overall_score NUMERIC(5,2),
    highlights TEXT,
    limitations TEXT,
    projection TEXT,
    pro_comparison TEXT,
    recommendation recommendation_type,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 17. scout_interests
```sql
CREATE TABLE scout_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scout_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    message TEXT,
    contact_email TEXT,
    status scout_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Development Domain

#### 18. individual_development_plans (IDPs)
```sql
CREATE TABLE individual_development_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    coach_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cycle_type cycle_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status idp_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 19. idp_goals
```sql
CREATE TABLE idp_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idp_id UUID NOT NULL REFERENCES individual_development_plans(id) ON DELETE CASCADE,
    category idp_category NOT NULL,
    description TEXT NOT NULL,
    target_metric TEXT,
    current_value NUMERIC(10,2),
    target_value NUMERIC(10,2),
    status goal_status DEFAULT 'not_started',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 20. maturation_records
**Propósito:** Pico de Velocidade de Crescimento (PHV)
```sql
CREATE TABLE maturation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    standing_height_cm NUMERIC(5,2) NOT NULL,
    sitting_height_cm NUMERIC(5,2) NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL,
    leg_length_cm NUMERIC(5,2),
    growth_velocity_cm_month NUMERIC(5,2),
    phv_status phv_status,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### System Domain

#### 21. notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 22. audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 23. feature_flags
```sql
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_name TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 24. app_settings
```sql
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Funções e Triggers

### 1. Auto-calcula Wellness Score
```sql
CREATE OR REPLACE FUNCTION calc_wellness_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.wellness_score = (NEW.sleep_quality + NEW.fatigue_level + NEW.muscle_soreness + NEW.stress_level + NEW.mood) / 5.0;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_wellness
BEFORE INSERT OR UPDATE ON wellness_logs
FOR EACH ROW EXECUTE FUNCTION calc_wellness_score();
```

### 2. Auto-calcula sRPE
```sql
CREATE OR REPLACE FUNCTION calc_srpe()
RETURNS TRIGGER AS $$
DECLARE
    sess_duration INTEGER;
BEGIN
    SELECT duration_minutes INTO sess_duration FROM training_sessions WHERE id = NEW.session_id;
    NEW.srpe_calculated = NEW.perceived_rpe * sess_duration;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_srpe
BEFORE INSERT OR UPDATE ON training_feedbacks
FOR EACH ROW EXECUTE FUNCTION calc_srpe();
```

### 3. Timestamp Updated_At Automático
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_idp_goals_updated_at BEFORE UPDATE ON idp_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 6. Índices

Para garantir ótima performance das queries:
```sql
-- GIN Indexes para buscas em campos JSONB
CREATE INDEX idx_ai_reports_content_gin ON ai_reports USING GIN (content);
CREATE INDEX idx_notifications_data_gin ON notifications USING GIN (data);

-- Partial Indexes para buscas em relatórios processados
CREATE INDEX idx_matches_analyzed ON matches(athlete_id) WHERE status = 'analyzed';

-- Vector Index para busca semântica RAG (Cosine similarity)
-- Já declarado na criação da tabela
-- CREATE INDEX idx_embeddings_vector ON ai_embeddings USING hnsw (embedding vector_cosine_ops);
```

---

## 7. Políticas RLS Completas (Row Level Security)

Exemplo do nível de segurança implementado para os Atletas.

```sql
-- Athletes Row Level Security:
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

-- Select (Qualquer pessoa logada e perfis publicos)
CREATE POLICY "Athletes Select Public" ON athletes 
FOR SELECT USING (is_public = true);

CREATE POLICY "Own Profile Select" ON athletes 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Guardian Select" ON athletes 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM guardian_athletes WHERE athlete_id = athletes.id AND guardian_user_id = auth.uid())
);

-- Update
CREATE POLICY "Athlete Update Own" ON athletes 
FOR UPDATE USING (auth.uid() = user_id);
```

---

## 8. Migrations

As migrations ficam armazenadas no Supabase em `supabase/migrations/`.
Padrão de nomenclatura: `YYYYMMDDHHMMSS_description.sql`

Ordem de Migrations:
1. `20260101000000_create_enums.sql`
2. `20260101000001_core_tables.sql`
3. `20260101000002_matches_training.sql`
4. `20260101000003_functions_triggers.sql`

O Supabase realiza *up* migrations no deploy. Para Rollbacks, utilizamos snapshots ou dumps pré-deploy para restauração em point-in-time, já que migrações *down* não são estritamente suportadas nativamente pela CLI para produção.

---

## 9. Seed Data

Dados de testes para o ambiente de desenvolvimento local.
```sql
-- Auth Insertions (supõe-se que foram criados no auth.users antes)
INSERT INTO users (id, role, full_name, email) VALUES 
('a1b2c3d4-0000-0000-0000-000000000001', 'athlete', 'Lucas Silva', 'lucas@athlete.os'),
('a1b2c3d4-0000-0000-0000-000000000002', 'athlete', 'Pedro Santos', 'pedro@athlete.os'),
('a1b2c3d4-0000-0000-0000-000000000003', 'coach', 'Mister Thomas', 'coach@athlete.os'),
('a1b2c3d4-0000-0000-0000-000000000004', 'scout', 'Scout Master', 'scout@athlete.os');

INSERT INTO athletes (user_id, full_name, date_of_birth, position, dominant_foot, category, slug, is_public) VALUES 
('a1b2c3d4-0000-0000-0000-000000000001', 'Lucas Silva', '2008-05-15', 'CAM', 'right', 'sub17', 'lucas-silva', true);

INSERT INTO matches (athlete_id, opponent, match_date, category, minutes_played, self_rating, status) VALUES 
((SELECT id FROM athletes LIMIT 1), 'Rival FC', '2026-08-01', 'sub17', 90, 8, 'analyzed');

INSERT INTO wellness_logs (athlete_id, log_date, sleep_quality, fatigue_level, muscle_soreness, stress_level, mood) VALUES 
((SELECT id FROM athletes LIMIT 1), '2026-08-02', 4, 3, 3, 5, 4);
```

---

## 10. Consultas Frequentes

### Dashboard KPIs Query (Retorna Média de Bem-Estar e Carga Aguda da semana)
```sql
SELECT 
    AVG(wellness_score) as weekly_wellness,
    (SELECT acute_load_7d FROM workload_metrics WHERE athlete_id = 'atleta-id' ORDER BY metric_date DESC LIMIT 1) as current_acute_load
FROM wellness_logs 
WHERE athlete_id = 'atleta-id' AND log_date >= CURRENT_DATE - INTERVAL '7 days';
```

### Match History com AI Reports
```sql
SELECT m.match_date, m.opponent, m.minutes_played, m.self_rating, a.score as ai_score, a.strengths
FROM matches m
LEFT JOIN ai_reports a ON a.match_id = m.id
WHERE m.athlete_id = 'atleta-id'
ORDER BY m.match_date DESC;
```

### Radar Chart Data (Dados Consolidados)
```sql
SELECT 
    AVG(tactical_score) as tactical,
    AVG(technical_score) as technical,
    AVG(physical_score) as physical,
    AVG(mental_score) as mental
FROM scouting_reports 
WHERE athlete_id = 'atleta-id';
```

---
*Documento gerado como parte da AthleteOS Engineering Bible. Volume 3 de 10 — Banco de Dados. AthleteOS © 2026*
