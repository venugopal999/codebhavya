-- CodeBhavya Placement Practice V2
-- Exact-length exam sessions + secure coding arena.
-- Rerunnable. Does not drop or truncate existing objects.

begin;
create extension if not exists pgcrypto;

-- Reuse the existing MCQ tables when present.
create table if not exists public.mcq_questions (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    topic text not null,
    subtopic text not null,
    difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
    target_path text not null check (target_path in ('general','service','product','ai')),
    time_limit_seconds integer not null default 60,
    question_text text not null,
    options jsonb not null,
    correction_rule text not null,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.mcq_answer_keys (
    question_id uuid primary key references public.mcq_questions(id) on delete cascade,
    correct_option text not null check (correct_option in ('A','B','C','D')),
    explanation text not null,
    option_explanations jsonb not null,
    updated_at timestamptz not null default now()
);

create table if not exists public.mcq_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    question_id uuid not null references public.mcq_questions(id) on delete cascade,
    topic text not null,
    selected_option text,
    is_correct boolean not null,
    duration_seconds integer not null default 0,
    attempted_at timestamptz not null default now()
);

create table if not exists public.quiz_sessions (
    id uuid primary key default gen_random_uuid(),
    access_token uuid not null default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    topic text not null,
    target_path text not null,
    difficulty text not null,
    question_count integer not null check (question_count in (5,10,20)),
    total_seconds integer not null,
    status text not null default 'active' check (status in ('active','submitted','expired')),
    score integer,
    started_at timestamptz not null default now(),
    submitted_at timestamptz,
    expires_at timestamptz not null
);

create table if not exists public.quiz_session_questions (
    session_id uuid not null references public.quiz_sessions(id) on delete cascade,
    question_id uuid not null references public.mcq_questions(id) on delete cascade,
    position integer not null,
    selected_option text,
    is_correct boolean,
    primary key (session_id, question_id),
    unique (session_id, position)
);

create index if not exists mcq_question_exact_filter_idx
    on public.mcq_questions(topic,target_path,difficulty)
    where is_published = true;
create index if not exists mcq_attempt_user_question_idx
    on public.mcq_attempts(user_id,question_id,attempted_at desc);
create index if not exists quiz_session_user_time_idx
    on public.quiz_sessions(user_id,started_at desc);

-- Coding arena tables.
create table if not exists public.coding_problems (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    topic text not null check (topic in ('c','python','dsa')),
    difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
    target_path text not null check (target_path in ('general','service','product','ai')),
    statement text not null,
    input_format text not null,
    output_format text not null,
    constraints text[] not null default '{}',
    examples jsonb not null default '[]'::jsonb,
    starter_code jsonb not null default '{}'::jsonb,
    points integer not null default 100 check (points between 10 and 500),
    time_limit_seconds numeric(5,2) not null default 2,
    memory_limit_kb integer not null default 128000,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.coding_test_cases (
    id uuid primary key default gen_random_uuid(),
    problem_id uuid not null references public.coding_problems(id) on delete cascade,
    position integer not null,
    stdin text not null,
    expected_output text not null,
    is_sample boolean not null default false,
    created_at timestamptz not null default now(),
    unique(problem_id,position)
);

create table if not exists public.coding_submissions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    problem_id uuid not null references public.coding_problems(id) on delete cascade,
    language text not null check (language in ('c','python')),
    source_code text not null,
    status text not null,
    passed_tests integer not null default 0,
    total_tests integer not null default 0,
    execution_time numeric(8,3),
    memory_kb integer,
    points_awarded integer not null default 0,
    submitted_at timestamptz not null default now()
);

create index if not exists coding_problem_filter_idx
    on public.coding_problems(topic,target_path,difficulty)
    where is_published = true;
create index if not exists coding_submission_user_problem_idx
    on public.coding_submissions(user_id,problem_id,submitted_at desc);

alter table public.mcq_questions enable row level security;
alter table public.mcq_answer_keys enable row level security;
alter table public.mcq_attempts enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_session_questions enable row level security;
alter table public.coding_problems enable row level security;
alter table public.coding_test_cases enable row level security;
alter table public.coding_submissions enable row level security;

do $policies$
begin
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='mcq_questions' and policyname='Published MCQs are readable') then
        create policy "Published MCQs are readable" on public.mcq_questions for select using (is_published=true);
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='mcq_attempts' and policyname='Users read their MCQ attempts') then
        create policy "Users read their MCQ attempts" on public.mcq_attempts for select to authenticated using ((select auth.uid())=user_id);
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='quiz_sessions' and policyname='Users read their quiz sessions') then
        create policy "Users read their quiz sessions" on public.quiz_sessions for select to authenticated using ((select auth.uid())=user_id);
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='coding_problems' and policyname='Published coding problems are readable') then
        create policy "Published coding problems are readable" on public.coding_problems for select using (is_published=true);
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='coding_submissions' and policyname='Users read their coding submissions') then
        create policy "Users read their coding submissions" on public.coding_submissions for select to authenticated using ((select auth.uid())=user_id);
    end if;
end
$policies$;

grant select on public.mcq_questions,public.coding_problems to anon,authenticated;
grant select on public.mcq_attempts,public.quiz_sessions,public.coding_submissions to authenticated;
revoke all on public.mcq_answer_keys,public.quiz_session_questions,public.coding_test_cases from anon,authenticated;

-- Starts one fixed quiz. It never silently returns fewer questions.
create or replace function public.start_mcq_session(
    p_topic text,
    p_target text,
    p_difficulty text,
    p_count integer,
    p_exclude_ids uuid[] default '{}'::uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path=public,pg_temp
as $function$
declare
    v_user uuid:=auth.uid();
    v_session public.quiz_sessions%rowtype;
    v_available integer;
    v_questions jsonb;
begin
    if p_target not in ('general','service','product','ai') then raise exception 'Invalid company target'; end if;
    if p_difficulty not in ('all','beginner','intermediate','advanced') then raise exception 'Invalid difficulty'; end if;
    if p_count not in (5,10,20) then raise exception 'Question count must be 5, 10 or 20'; end if;

    select count(*) into v_available
    from public.mcq_questions q
    where q.is_published=true and q.topic=p_topic and q.target_path=p_target
      and (p_difficulty='all' or q.difficulty=p_difficulty)
      and not (q.id=any(coalesce(p_exclude_ids,'{}'::uuid[])))
      and not exists (
          select 1 from public.mcq_attempts a
          where v_user is not null and a.user_id=v_user and a.question_id=q.id and a.is_correct=true
      );

    if v_available<p_count then
        raise exception 'Only % unseen questions match these filters. Choose a smaller quiz, another filter, or Review Mistakes.',v_available;
    end if;

    insert into public.quiz_sessions(user_id,topic,target_path,difficulty,question_count,total_seconds,expires_at)
    values(v_user,p_topic,p_target,p_difficulty,p_count,p_count*60,now()+make_interval(secs=>p_count*60))
    returning * into v_session;

    with chosen as (
        select sample.id,row_number() over()::integer as position
        from (
            select q.id
            from public.mcq_questions q
            where q.is_published=true and q.topic=p_topic and q.target_path=p_target
              and (p_difficulty='all' or q.difficulty=p_difficulty)
              and not (q.id=any(coalesce(p_exclude_ids,'{}'::uuid[])))
              and not exists (
                  select 1 from public.mcq_attempts a
                  where v_user is not null and a.user_id=v_user and a.question_id=q.id and a.is_correct=true
              )
            order by random()
            limit p_count
        ) sample
    ), inserted as (
        insert into public.quiz_session_questions(session_id,question_id,position)
        select v_session.id,id,position from chosen
        returning question_id,position
    )
    select jsonb_agg(jsonb_build_object(
        'id',q.id,'slug',q.slug,'subtopic',q.subtopic,'difficulty',q.difficulty,
        'question_text',q.question_text,'options',q.options,'position',i.position
    ) order by i.position) into v_questions
    from inserted i join public.mcq_questions q on q.id=i.question_id;

    return jsonb_build_object(
        'session_id',v_session.id,'access_token',v_session.access_token,
        'total_seconds',v_session.total_seconds,'question_count',p_count,'questions',v_questions
    );
end
$function$;

-- Grades the complete quiz only once and returns explanations after submission.
create or replace function public.submit_mcq_session(
    p_session_id uuid,
    p_access_token uuid,
    p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public,pg_temp
as $function$
declare
    v_session public.quiz_sessions%rowtype;
    v_user uuid:=auth.uid();
    v_score integer;
    v_results jsonb;
begin
    select * into v_session from public.quiz_sessions
    where id=p_session_id and access_token=p_access_token for update;
    if not found then raise exception 'Quiz session is invalid'; end if;
    if v_session.status<>'active' then raise exception 'This quiz was already submitted'; end if;
    if v_session.user_id is not null and v_session.user_id is distinct from v_user then raise exception 'This quiz belongs to another user'; end if;
    if jsonb_typeof(p_answers)<>'object' then raise exception 'Answers must be a JSON object'; end if;

    update public.quiz_session_questions sq
    set selected_option=upper(nullif(trim(p_answers->>sq.question_id::text),'')),
        is_correct=(upper(nullif(trim(p_answers->>sq.question_id::text),''))=ak.correct_option)
    from public.mcq_answer_keys ak
    where sq.session_id=p_session_id and ak.question_id=sq.question_id;

    select count(*) filter(where is_correct=true) into v_score
    from public.quiz_session_questions where session_id=p_session_id;

    update public.quiz_sessions set status='submitted',score=v_score,submitted_at=now()
    where id=p_session_id;

    if v_user is not null then
        insert into public.mcq_attempts(user_id,question_id,topic,selected_option,is_correct,duration_seconds)
        select v_user,sq.question_id,v_session.topic,sq.selected_option,coalesce(sq.is_correct,false),0
        from public.quiz_session_questions sq where sq.session_id=p_session_id;
    end if;

    select jsonb_agg(jsonb_build_object(
        'question_id',q.id,'position',sq.position,'question_text',q.question_text,
        'options',q.options,'selected_option',sq.selected_option,'is_correct',coalesce(sq.is_correct,false),
        'correct_option',ak.correct_option,'explanation',ak.explanation,
        'option_explanations',ak.option_explanations,'correction_rule',q.correction_rule
    ) order by sq.position) into v_results
    from public.quiz_session_questions sq
    join public.mcq_questions q on q.id=sq.question_id
    join public.mcq_answer_keys ak on ak.question_id=sq.question_id
    where sq.session_id=p_session_id;

    return jsonb_build_object('score',v_score,'total',v_session.question_count,'results',v_results);
end
$function$;

create or replace function public.get_coding_leaderboard(p_topic text default 'c')
returns table(rank bigint,student_alias text,solved bigint,points bigint)
language sql
security definer
set search_path=public,pg_temp
as $function$
    with best as (
        select s.user_id,s.problem_id,max(s.points_awarded)::bigint points
        from public.coding_submissions s join public.coding_problems p on p.id=s.problem_id
        where p.topic=p_topic group by s.user_id,s.problem_id
    ), totals as (
        select user_id,count(*) filter(where points>0)::bigint solved,sum(points)::bigint points
        from best group by user_id
    )
    select dense_rank() over(order by points desc,solved desc),
           'Coder-'||upper(substr(md5(user_id::text),1,6)),solved,points
    from totals order by points desc,solved desc limit 100;
$function$;

revoke all on function public.start_mcq_session(text,text,text,integer,uuid[]) from public;
revoke all on function public.submit_mcq_session(uuid,uuid,jsonb) from public;
revoke all on function public.get_coding_leaderboard(text) from public;
grant execute on function public.start_mcq_session(text,text,text,integer,uuid[]) to anon,authenticated;
grant execute on function public.submit_mcq_session(uuid,uuid,jsonb) to anon,authenticated;
grant execute on function public.get_coding_leaderboard(text) to anon,authenticated;

commit;
