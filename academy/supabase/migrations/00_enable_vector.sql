-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create the knowledge base table
create table if not exists academy_knowledge (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  embedding vector(1536), -- 1536 is the dimension for openai text-embedding-3-small
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create a function for similarity search
create or replace function match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    academy_knowledge.id,
    academy_knowledge.content,
    academy_knowledge.metadata,
    1 - (academy_knowledge.embedding <=> query_embedding) as similarity
  from academy_knowledge
  where 1 - (academy_knowledge.embedding <=> query_embedding) > match_threshold
  order by academy_knowledge.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 4. Enable RLS (Read-only for authenticated/anon users, write-only for service role)
alter table academy_knowledge enable row level security;

create policy "Knowledge is viewable by everyone"
  on academy_knowledge for select
  using (true);
