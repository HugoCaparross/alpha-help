-- ==========================================
-- EXTENSIONS
-- ==========================================

create extension if not exists "pgcrypto";

-- ==========================================
-- PROFILES
-- ==========================================

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    email text not null unique,

    region text not null check (
        region in ('España', 'Latinoamérica')
    ),

    role text not null default 'user' check (
        role in ('user', 'admin')
    ),

    accepted_policy boolean not null default false,

    accepted_at timestamptz,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);

-- ==========================================
-- QUESTIONNAIRES
-- ==========================================

create table public.questionnaire_responses (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references public.profiles(id) on delete cascade,

    questionnaire_type text not null check (
        questionnaire_type in ('pre', 'post')
    ),

    question_key text not null,

    answer integer not null,

    created_at timestamptz not null default now()
);

create index idx_questionnaire_user
on questionnaire_responses(user_id);

create index idx_questionnaire_type
on questionnaire_responses(questionnaire_type);

-- ==========================================
-- SESSIONS
-- ==========================================

create table public.sessions (
    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    youtube_url text,

    thumbnail_url text,

    session_type text not null check (
        session_type in ('live', 'recorded')
    ),

    starts_at timestamptz,

    is_published boolean not null default true,

    created_at timestamptz not null default now()
);

-- ==========================================
-- SESSION VIEWS
-- ==========================================

create table public.session_views (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references public.profiles(id) on delete cascade,

    session_id uuid not null references public.sessions(id) on delete cascade,

    viewed_at timestamptz not null default now(),

    unique(user_id, session_id)
);

-- ==========================================
-- RESOURCES
-- ==========================================

create table public.resources (
    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    category text not null check (
        category in (
            'formacion_completa',
            'formacion_resumen'
        )
    ),

    topic text not null,

    file_path text not null,

    created_at timestamptz not null default now()
);

-- ==========================================
-- FAQ
-- ==========================================

create table public.faq (
    id uuid primary key default gen_random_uuid(),

    question text not null,

    answer text not null,

    created_at timestamptz not null default now()
);

-- ==========================================
-- CONTACT MESSAGES
-- ==========================================

create table public.contact_messages (
    id uuid primary key default gen_random_uuid(),

    name text not null,

    email text not null,

    message text not null,

    created_at timestamptz not null default now()
);

-- ==========================================
-- USER CREATION TRIGGER
-- ==========================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin

    insert into public.profiles (
        id,
        email,
        region,
        accepted_policy,
        accepted_at
    )
    values (
        new.id,
        new.email,
        'España',
        false,
        null
    );

    return new;

end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();