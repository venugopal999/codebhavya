-- CodeBhavya Placement Practice Phase 1
-- Creates the protected MCQ bank, personal attempt history and answer-checking RPC.
-- Safe to run more than once: no tables or data are dropped or truncated.

begin;

create extension if not exists pgcrypto;

create table if not exists public.mcq_questions (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    topic text not null check (topic in ('aptitude', 'c', 'python', 'dsa', 'database', 'core-cs', 'ai-ml')),
    subtopic text not null,
    difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
    target_path text not null default 'general' check (target_path in ('general', 'service', 'product', 'ai')),
    time_limit_seconds integer not null default 60 check (time_limit_seconds between 20 and 180),
    question_text text not null,
    options jsonb not null check (jsonb_typeof(options) in ('object', 'array')),
    correction_rule text not null,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.mcq_answer_keys (
    question_id uuid primary key references public.mcq_questions(id) on delete cascade,
    correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
    explanation text not null,
    option_explanations jsonb not null check (jsonb_typeof(option_explanations) = 'object'),
    updated_at timestamptz not null default now()
);

create table if not exists public.mcq_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    question_id uuid not null references public.mcq_questions(id) on delete cascade,
    topic text not null,
    selected_option text,
    is_correct boolean not null,
    duration_seconds integer not null check (duration_seconds between 0 and 180),
    attempted_at timestamptz not null default now()
);

create index if not exists mcq_questions_topic_filter_idx
    on public.mcq_questions(topic, target_path, difficulty)
    where is_published = true;

create index if not exists mcq_attempts_user_topic_time_idx
    on public.mcq_attempts(user_id, topic, attempted_at desc);

alter table public.mcq_questions enable row level security;
alter table public.mcq_answer_keys enable row level security;
alter table public.mcq_attempts enable row level security;

do $policy$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'mcq_questions' and policyname = 'Published MCQs are readable'
    ) then
        create policy "Published MCQs are readable" on public.mcq_questions
            for select using (is_published = true);
    end if;

    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'mcq_attempts' and policyname = 'Users read their MCQ attempts'
    ) then
        create policy "Users read their MCQ attempts" on public.mcq_attempts
            for select to authenticated using ((select auth.uid()) = user_id);
    end if;
end
$policy$;

grant select on public.mcq_questions to anon, authenticated;
grant select on public.mcq_attempts to authenticated;
revoke all on public.mcq_answer_keys from anon, authenticated;

create or replace function public.submit_mcq_answer(
    p_question_id uuid,
    p_selected_option text,
    p_duration_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
    v_question public.mcq_questions%rowtype;
    v_answer public.mcq_answer_keys%rowtype;
    v_selected text := case when p_selected_option is null then null else upper(trim(p_selected_option)) end;
    v_correct boolean;
begin
    select * into v_question
    from public.mcq_questions
    where id = p_question_id and is_published = true;

    if not found then
        raise exception 'Question is unavailable';
    end if;

    select * into v_answer
    from public.mcq_answer_keys
    where question_id = p_question_id;

    if not found then
        raise exception 'Answer key is unavailable';
    end if;

    if v_selected is not null and not (
        (jsonb_typeof(v_question.options) = 'object' and v_question.options ? v_selected)
        or
        (jsonb_typeof(v_question.options) = 'array' and exists (
            select 1 from jsonb_array_elements(v_question.options) item
            where upper(item ->> 'key') = v_selected
        ))
    ) then
        raise exception 'Invalid answer option';
    end if;

    v_correct := v_selected is not null and v_selected = v_answer.correct_option;

    if auth.uid() is not null then
        insert into public.mcq_attempts (
            user_id, question_id, topic, selected_option, is_correct, duration_seconds
        ) values (
            auth.uid(), v_question.id, v_question.topic, v_selected, v_correct,
            greatest(0, least(180, coalesce(p_duration_seconds, 0)))
        );
    end if;

    return jsonb_build_object(
        'is_correct', v_correct,
        'correct_option', v_answer.correct_option,
        'explanation', v_answer.explanation,
        'option_explanations', v_answer.option_explanations,
        'correction_rule', v_question.correction_rule
    );
end
$function$;

revoke all on function public.submit_mcq_answer(uuid, text, integer) from public;
grant execute on function public.submit_mcq_answer(uuid, text, integer) to anon, authenticated;

with seed (
    slug, topic, subtopic, difficulty, target_path, time_limit_seconds,
    question_text, options, correction_rule, correct_option, explanation, option_explanations
) as (
values
-- Aptitude and reasoning
($$mcq-apt-successive-change$$,$$aptitude$$,$$Percentages$$,$$beginner$$,$$general$$,60,
 $$A value is increased by 25% and then decreased by 20%. What is the net change from the original?$$,
 jsonb_build_object('A',$$5% increase$$,'B',$$5% decrease$$,'C',$$No change$$,'D',$$1% decrease$$),
 $$Apply each percentage to the value produced by the previous change.$$,$$C$$,
 $$Using 100 as the original value: 100 × 1.25 × 0.80 = 100, so there is no net change.$$,
 jsonb_build_object('A',$$Adding the rates ignores their different bases.$$,'B',$$Subtracting 20 from 25 is not valid for successive changes.$$,'C',$$Correct: the multipliers 1.25 and 0.80 multiply to 1.$$,'D',$$A 1% loss occurs for equal 10% up/down changes, not these rates.$$)),
($$mcq-apt-ratio-mixture$$,$$aptitude$$,$$Ratio and Proportion$$,$$beginner$$,$$service$$,60,
 $$A class has boys and girls in the ratio 3:5. If there are 32 students, how many are girls?$$,
 jsonb_build_object('A',$$12$$,'B',$$16$$,'C',$$20$$,'D',$$24$$),
 $$Add ratio parts first, then multiply the required share by the total.$$,$$C$$,
 $$There are 8 total ratio parts. Each part represents 32 ÷ 8 = 4 students, so girls = 5 × 4 = 20.$$,
 jsonb_build_object('A',$$This is the boys' count: 3 × 4.$$,'B',$$This assumes an equal split rather than 3:5.$$,'C',$$Correct: five of eight parts equals 20.$$,'D',$$This uses six parts rather than five.$$)),
($$mcq-apt-work-rate$$,$$aptitude$$,$$Time and Work$$,$$intermediate$$,$$general$$,75,
 $$A completes a job in 10 days and B in 15 days. How long do they take together?$$,
 jsonb_build_object('A',$$5 days$$,'B',$$6 days$$,'C',$$12 days$$,'D',$$25 days$$),
 $$Add work rates, not the numbers of days.$$,$$B$$,
 $$Their combined daily rate is 1/10 + 1/15 = 1/6 of the job, so they need 6 days.$$,
 jsonb_build_object('A',$$The combined rate is not 1/5.$$,'B',$$Correct: one-sixth of the job per day means six days.$$,'C',$$This is slower than A alone and cannot be correct.$$,'D',$$Adding completion times does not combine rates.$$)),
($$mcq-apt-average-replace$$,$$aptitude$$,$$Averages$$,$$intermediate$$,$$general$$,75,
 $$The average of six numbers is 18. Replacing 12 with 24 changes the average to what value?$$,
 jsonb_build_object('A',$$18$$,'B',$$19$$,'C',$$20$$,'D',$$30$$),
 $$A replacement changes the total by new minus old; distribute that change across the same count.$$,$$C$$,
 $$The total rises by 12. Across six values, the average rises by 2, from 18 to 20.$$,
 jsonb_build_object('A',$$The total changed, so the average cannot remain 18.$$,'B',$$A 12-point total change raises six-item average by 2, not 1.$$,'C',$$Correct: 18 + (24−12)/6 = 20.$$,'D',$$This adds the entire replacement difference to the average.$$)),
($$mcq-apt-probability-without-replacement$$,$$aptitude$$,$$Probability$$,$$advanced$$,$$product$$,90,
 $$A bag has 3 red and 2 blue balls. Two balls are drawn without replacement. What is the probability both are red?$$,
 jsonb_build_object('A',$$3/10$$,'B',$$9/25$$,'C',$$1/2$$,'D',$$3/5$$),
 $$Without replacement, update both the favourable count and total after the first draw.$$,$$A$$,
 $$The probability is 3/5 × 2/4 = 6/20 = 3/10.$$,
 jsonb_build_object('A',$$Correct: the second draw has two red among four remaining.$$,'B',$$This incorrectly treats the two draws as independent with replacement.$$,'C',$$The product is 0.3, not 0.5.$$,'D',$$This is only the probability that the first ball is red.$$)),

-- C programming
($$mcq-c-string-sizeof$$,$$c$$,$$Strings and Arrays$$,$$beginner$$,$$general$$,60,
 $$For char s[] = "code"; what is sizeof(s) in bytes?$$,
 jsonb_build_object('A',$$4$$,'B',$$5$$,'C',$$Depends on pointer size$$,'D',$$Compilation error$$),
 $$A character array initialized from a string literal includes the terminating null character.$$,$$B$$,
 $$The array contains c, o, d, e and '\0', so its size is 5 bytes.$$,
 jsonb_build_object('A',$$This counts visible characters but omits the null terminator.$$,'B',$$Correct: five char elements occupy five bytes.$$,'C',$$s is an array here, not a pointer parameter.$$,'D',$$This is valid C initialization.$$)),
($$mcq-c-short-circuit$$,$$c$$,$$Operators and Control Flow$$,$$intermediate$$,$$general$$,75,
 $$If int x = 0; evaluates x != 0 && 10 / x > 1, what happens?$$,
 jsonb_build_object('A',$$Division-by-zero occurs$$,'B',$$The expression is false without division$$,'C',$$The expression is true$$,'D',$$The code cannot compile$$),
 $$For &&, the right operand is evaluated only when the left operand is true.$$,$$B$$,
 $$x != 0 is false, so short-circuit evaluation skips 10 / x and the full expression is false.$$,
 jsonb_build_object('A',$$The dangerous right operand is not evaluated.$$,'B',$$Correct: false left operand determines &&.$$,'C',$$An && expression cannot be true when its left operand is false.$$,'D',$$The expression is valid C.$$)),
($$mcq-c-pointer-increment$$,$$c$$,$$Pointers$$,$$intermediate$$,$$general$$,75,
 $$Given int a[] = {10, 20, 30}; int *p = a; what does *(p + 2) produce?$$,
 jsonb_build_object('A',$$10$$,'B',$$20$$,'C',$$30$$,'D',$$The address of a[2]$$),
 $$Pointer arithmetic advances by elements of the pointed-to type.$$,$$C$$,
 $$p points to a[0]; p + 2 points to a[2], and dereferencing it produces 30.$$,
 jsonb_build_object('A',$$That is *p without an offset.$$,'B',$$That is *(p + 1).$$,'C',$$Correct: p + 2 addresses the third element.$$,'D',$$The dereference operator returns the stored value, not its address.$$)),
($$mcq-c-malloc-count$$,$$c$$,$$Dynamic Memory$$,$$intermediate$$,$$product$$,75,
 $$Which allocation correctly reserves space for n integers using pointer p of type int *?$$,
 jsonb_build_object('A',$$p = malloc(n);$$,'B',$$p = malloc(n * sizeof *p);$$,'C',$$p = malloc(sizeof p);$$,'D',$$p = malloc(sizeof n);$$),
 $$Allocate element count multiplied by element size; sizeof *pointer follows the declared type.$$,$$B$$,
 $$n * sizeof *p reserves exactly n objects of the type that p points to.$$,
 jsonb_build_object('A',$$This allocates n bytes, not n integers.$$,'B',$$Correct and resilient if p's pointed-to type changes.$$,'C',$$This allocates only the size of the pointer.$$,'D',$$This allocates the size of variable n once.$$)),
($$mcq-c-switch-fallthrough$$,$$c$$,$$Switch Statements$$,$$advanced$$,$$service$$,75,
 $$In a C switch, a matching case has no break and the next case contains a print statement. What normally occurs?$$,
 jsonb_build_object('A',$$Only the matching case executes$$,'B',$$Execution falls into the next case$$,'C',$$The switch restarts$$,'D',$$A runtime exception is required$$),
 $$Unless control exits, execution continues through later case labels after the matching label.$$,$$B$$,
 $$Without break, return or another transfer, statements in subsequent cases execute by fall-through.$$,
 jsonb_build_object('A',$$This would require a break or other exit.$$,'B',$$Correct: case labels do not automatically stop control flow.$$,'C',$$A switch does not loop by itself.$$,'D',$$Fall-through is valid C, though it should be intentional.$$)),

-- Python
($$mcq-python-list-alias$$,$$python$$,$$Lists and Aliasing$$,$$beginner$$,$$general$$,60,
 $$After a = [1, 2]; b = a; b.append(3), what is a?$$,
 jsonb_build_object('A',$$[1, 2]$$,'B',$$[1, 2, 3]$$,'C',$$[3]$$,'D',$$An exception occurs$$),
 $$Assignment gives another reference to the same mutable object unless a copy is requested.$$,$$B$$,
 $$a and b reference one list, so appending through b is visible through a.$$,
 jsonb_build_object('A',$$This would require b = a.copy() or equivalent.$$,'B',$$Correct: both names point to the mutated list.$$,'C',$$append adds an element rather than replacing the list.$$,'D',$$Aliasing a list is valid.$$)),
($$mcq-python-mutable-default$$,$$python$$,$$Functions$$,$$intermediate$$,$$general$$,75,
 $$Why can def add(x, items=[]) produce surprising results when it appends x?$$,
 jsonb_build_object('A',$$Lists cannot be parameters$$,'B',$$The same default list is reused across calls$$,'C',$$append returns a new tuple$$,'D',$$Defaults are created after every return$$),
 $$Use None as the default sentinel when each call needs a new mutable object.$$,$$B$$,
 $$Default objects are created when the function definition executes, so omitted arguments reuse and mutate one list.$$,
 jsonb_build_object('A',$$Lists are valid parameters.$$,'B',$$Correct: state can persist between calls.$$,'C',$$append mutates the list and returns None.$$,'D',$$The default is not recreated per call.$$)),
($$mcq-python-dict-get$$,$$python$$,$$Dictionaries$$,$$beginner$$,$$general$$,60,
 $$For d = {'x': 4}, what does d.get('y', 0) return?$$,
 jsonb_build_object('A',$$0$$,'B',$$None$$,'C',$$KeyError$$,'D',$$4$$),
 $$dict.get returns its supplied default when the key is absent.$$,$$A$$,
 $$The key y is absent, so get returns the explicit default value 0 without raising KeyError.$$,
 jsonb_build_object('A',$$Correct: 0 is the provided fallback.$$,'B',$$None is returned only when no explicit default is given.$$,'C',$$Square-bracket lookup could raise KeyError; get does not here.$$,'D',$$4 belongs to key x, not y.$$)),
($$mcq-python-finally$$,$$python$$,$$Exceptions$$,$$intermediate$$,$$service$$,75,
 $$A try block returns a value and has a finally block with no new return. Does the finally block run?$$,
 jsonb_build_object('A',$$No, return skips it$$,'B',$$Yes, before control leaves the function$$,'C',$$Only if an exception occurs$$,'D',$$Only in generator functions$$),
 $$finally is for cleanup that must run whether execution succeeds, returns or raises.$$,$$B$$,
 $$Python executes the finally block before completing the pending return.$$,
 jsonb_build_object('A',$$A pending return does not bypass finally.$$,'B',$$Correct: cleanup runs before the function exits.$$,'C',$$finally also runs on normal completion and return.$$,'D',$$This behavior applies to ordinary functions too.$$)),
($$mcq-python-generator-memory$$,$$python$$,$$Iterators and Generators$$,$$advanced$$,$$product$$,90,
 $$Why may a generator expression be preferable to a list comprehension for processing a very large stream once?$$,
 jsonb_build_object('A',$$It always executes in parallel$$,'B',$$It produces values lazily$$,'C',$$It sorts values automatically$$,'D',$$It prevents every possible exception$$),
 $$Choose lazy iteration when values can be consumed one at a time and full materialization is unnecessary.$$,$$B$$,
 $$A generator computes items on demand, which can reduce peak memory for a one-pass pipeline.$$,
 jsonb_build_object('A',$$Generators are not automatically parallel.$$,'B',$$Correct: lazy production avoids holding the whole result.$$,'C',$$Iteration preserves its defined order but does not sort.$$,'D',$$Exceptions can still occur during iteration.$$)),

-- Data structures and algorithms
($$mcq-dsa-stack-brackets$$,$$dsa$$,$$Stacks$$,$$beginner$$,$$general$$,60,
 $$Which structure most directly checks correctly nested brackets?$$,
 jsonb_build_object('A',$$Queue$$,'B',$$Stack$$,'C',$$Min-heap$$,'D',$$Binary search tree$$),
 $$Use a stack when the most recently opened unfinished item must close first.$$,$$B$$,
 $$Bracket nesting is last-in, first-out: push openings and match each closing symbol with the stack top.$$,
 jsonb_build_object('A',$$FIFO order does not match nesting.$$,'B',$$Correct: LIFO mirrors nested closing order.$$,'C',$$Priority does not preserve nesting.$$,'D',$$Key ordering is unrelated to bracket matching.$$)),
($$mcq-dsa-bfs-unweighted$$,$$dsa$$,$$Graphs$$,$$intermediate$$,$$general$$,75,
 $$Which algorithm finds a shortest path by number of edges in an unweighted graph?$$,
 jsonb_build_object('A',$$Depth-first search$$,'B',$$Breadth-first search$$,'C',$$Heap sort$$,'D',$$Binary search$$),
 $$For unweighted shortest paths, explore vertices in BFS distance layers.$$,$$B$$,
 $$BFS visits distance 0, then 1, then 2, so first discovery gives the minimum number of edges.$$,
 jsonb_build_object('A',$$DFS may follow a longer path first.$$,'B',$$Correct: queue-based layers preserve unweighted distance.$$,'C',$$Heap sort orders values rather than traversing paths.$$,'D',$$Binary search needs ordered searchable data.$$)),
($$mcq-dsa-binary-search-update$$,$$dsa$$,$$Searching$$,$$intermediate$$,$$general$$,75,
 $$In ascending binary search, a[mid] is smaller than the target. Which update preserves the search invariant?$$,
 jsonb_build_object('A',$$high = mid - 1$$,'B',$$low = mid + 1$$,'C',$$low = 0$$,'D',$$high = array length$$),
 $$Discard the half that cannot contain the target, including the already-tested middle position.$$,$$B$$,
 $$All positions at or left of mid are too small, so the remaining candidate range starts at mid + 1.$$,
 jsonb_build_object('A',$$This keeps only smaller values.$$,'B',$$Correct: it removes the impossible lower half.$$,'C',$$Resetting low loses progress and may loop.$$,'D',$$Expanding high violates the shrinking-range invariant.$$)),
($$mcq-dsa-hash-collision$$,$$dsa$$,$$Hash Tables$$,$$intermediate$$,$$product$$,75,
 $$Two different keys map to the same hash-table index. What is this event called?$$,
 jsonb_build_object('A',$$Collision$$,'B',$$Recursion$$,'C',$$Underflow$$,'D',$$Stable sorting$$),
 $$A correct hash table must resolve collisions; equal indexes do not imply equal keys.$$,$$A$$,
 $$A collision occurs when distinct keys produce the same bucket or initial table position.$$,
 jsonb_build_object('A',$$Correct: chaining or probing can preserve both entries.$$,'B',$$Recursion is a function-call pattern.$$,'C',$$Underflow refers to removing from an empty structure or numeric range issues.$$,'D',$$Sorting stability is unrelated.$$)),
($$mcq-dsa-heap-top$$,$$dsa$$,$$Heaps$$,$$advanced$$,$$product$$,90,
 $$Which operation is O(1) on a binary min-heap represented conventionally?$$,
 jsonb_build_object('A',$$Read the minimum element$$,'B',$$Find an arbitrary key$$,'C',$$Delete an arbitrary value$$,'D',$$Produce all values in sorted order$$),
 $$A min-heap guarantees only that its root is minimal; it is not globally sorted.$$,$$A$$,
 $$The minimum sits at the root, so reading it is O(1); restoring order after removal would be O(log n).$$,
 jsonb_build_object('A',$$Correct: the root is directly accessible.$$,'B',$$An arbitrary key may require scanning O(n) elements.$$,'C',$$Locating an arbitrary value may be O(n) before repair.$$,'D',$$Repeated removals take O(n log n).$$)),

-- Databases and SQL
($$mcq-db-primary-key$$,$$database$$,$$Keys$$,$$beginner$$,$$general$$,60,
 $$Which statement about a primary key is required?$$,
 jsonb_build_object('A',$$It may duplicate values$$,'B',$$It uniquely identifies every row$$,'C',$$It must be a person's name$$,'D',$$It may be null on some rows$$),
 $$A primary key supplies a unique, non-null identity for each row.$$,$$B$$,
 $$Primary-key values are unique and non-null, allowing one row to be identified reliably.$$,
 jsonb_build_object('A',$$Duplicates defeat unique identification.$$,'B',$$Correct: every row has one unique key value or tuple.$$,'C',$$Names are neither required nor reliably unique.$$,'D',$$Primary-key columns cannot be null.$$)),
($$mcq-db-having$$,$$database$$,$$SQL Aggregation$$,$$intermediate$$,$$general$$,75,
 $$Which SQL clause filters groups after GROUP BY and aggregate calculation?$$,
 jsonb_build_object('A',$$WHERE$$,'B',$$HAVING$$,'C',$$ORDER BY$$,'D',$$DISTINCT$$),
 $$Use WHERE for input rows and HAVING for groups after aggregation.$$,$$B$$,
 $$HAVING applies conditions to grouped aggregate results.$$,
 jsonb_build_object('A',$$WHERE filters rows before grouping.$$,'B',$$Correct: HAVING can test aggregate results.$$,'C',$$ORDER BY sorts output.$$,'D',$$DISTINCT removes duplicate result values or rows.$$)),
($$mcq-db-left-join$$,$$database$$,$$Joins$$,$$intermediate$$,$$general$$,75,
 $$Which join keeps every row from the left table even when no matching right row exists?$$,
 jsonb_build_object('A',$$INNER JOIN$$,'B',$$LEFT JOIN$$,'C',$$CROSS JOIN$$,'D',$$SELF JOIN only$$),
 $$Choose join type from which unmatched rows must be preserved.$$,$$B$$,
 $$A LEFT JOIN returns all left rows and fills right-side columns with null when no match exists.$$,
 jsonb_build_object('A',$$INNER JOIN removes unmatched rows.$$,'B',$$Correct: the left relation is preserved.$$,'C',$$CROSS JOIN creates all combinations and uses no match condition.$$,'D',$$A self join describes table reuse, not preservation behavior.$$)),
($$mcq-db-third-normal-form$$,$$database$$,$$Normalization$$,$$advanced$$,$$product$$,90,
 $$In a table Employee(emp_id, dept_id, dept_name), dept_name depends on dept_id. If emp_id is the key, what issue suggests further normalization?$$,
 jsonb_build_object('A',$$A transitive dependency$$,'B',$$A missing sort order$$,'C',$$A network timeout$$,'D',$$A hash collision$$),
 $$When a non-key attribute determines another non-key attribute, separate that fact to remove transitive dependency.$$,$$A$$,
 $$emp_id determines dept_id, and dept_id determines dept_name, so dept_name is transitively dependent on emp_id.$$,
 jsonb_build_object('A',$$Correct: department facts belong in a department relation.$$,'B',$$Row order is not the normalization issue.$$,'C',$$Networking is unrelated to functional dependencies.$$,'D',$$Hash collisions are unrelated to schema normalization.$$)),
($$mcq-db-index-write-cost$$,$$database$$,$$Indexes$$,$$intermediate$$,$$service$$,75,
 $$What is a common cost of adding an index to a frequently updated table?$$,
 jsonb_build_object('A',$$Writes must also maintain the index$$,'B',$$SELECT becomes syntactically invalid$$,'C',$$Rows can no longer be deleted$$,'D',$$Transactions stop being atomic$$),
 $$Evaluate indexes as a read benefit with storage and write-maintenance costs.$$,$$A$$,
 $$Insert, update and delete operations may need additional index-page work, increasing storage and write cost.$$,
 jsonb_build_object('A',$$Correct: every affected index must remain consistent.$$,'B',$$Indexes do not invalidate SELECT syntax.$$,'C',$$Indexed rows can still be deleted.$$,'D',$$Indexes do not remove transaction atomicity.$$)),

-- Core computer science
($$mcq-core-thread-share$$,$$core-cs$$,$$Operating Systems$$,$$beginner$$,$$general$$,60,
 $$Threads in the same process normally share which resource?$$,
 jsonb_build_object('A',$$The process address space$$,'B',$$Each thread's call stack$$,'C',$$Each thread's program counter$$,'D',$$Each thread's register state$$),
 $$Threads share process resources but keep their own execution state.$$,$$A$$,
 $$Threads share code, data and heap in the process address space; each needs its own stack, registers and program counter.$$,
 jsonb_build_object('A',$$Correct: shared memory enables communication and creates synchronization risks.$$,'B',$$Each thread requires an independent call stack.$$,'C',$$Each thread tracks its own next instruction.$$,'D',$$Registers are saved and restored per scheduled thread.$$)),
($$mcq-core-deadlock-condition$$,$$core-cs$$,$$Concurrency$$,$$intermediate$$,$$general$$,75,
 $$Which strategy directly prevents circular wait in a multi-lock program?$$,
 jsonb_build_object('A',$$Acquire locks in one global order$$,'B',$$Add more threads$$,'C',$$Use longer variable names$$,'D',$$Ignore failed lock attempts$$),
 $$A consistent global lock order prevents a cycle in the wait-for graph.$$,$$A$$,
 $$If every thread acquires locks in the same order, no circular chain can form.$$,
 jsonb_build_object('A',$$Correct: it breaks one necessary deadlock condition.$$,'B',$$More threads can increase contention.$$,'C',$$Naming does not change synchronization.$$,'D',$$Ignoring failures harms correctness and does not prove progress.$$)),
($$mcq-core-udp-realtime$$,$$core-cs$$,$$Computer Networks$$,$$intermediate$$,$$general$$,75,
 $$Why may a live voice application prefer UDP for media packets?$$,
 jsonb_build_object('A',$$UDP guarantees order$$,'B',$$Late retransmitted audio may be less useful than timely new audio$$,'C',$$UDP corrects every loss automatically$$,'D',$$UDP requires a connection handshake$$),
 $$Choose transport behavior from reliability, ordering and timeliness requirements.$$,$$B$$,
 $$Real-time media may tolerate some loss instead of waiting for retransmissions that miss the playback deadline.$$,
 jsonb_build_object('A',$$UDP does not guarantee ordering.$$,'B',$$Correct: timeliness may dominate perfect delivery.$$,'C',$$Applications must add any desired loss handling.$$,'D',$$UDP is connectionless and has no TCP-style handshake.$$)),
($$mcq-core-polymorphism$$,$$core-cs$$,$$Object-Oriented Programming$$,$$intermediate$$,$$service$$,75,
 $$What does runtime polymorphism allow in object-oriented design?$$,
 jsonb_build_object('A',$$A base-type reference can invoke an overridden subtype behavior$$,'B',$$Every field becomes global$$,'C',$$Objects require no memory$$,'D',$$Compilation can never fail$$),
 $$Polymorphism separates the common contract from the concrete implementation chosen at runtime.$$,$$A$$,
 $$Dynamic dispatch selects an overriding implementation based on the actual object while code uses a base contract.$$,
 jsonb_build_object('A',$$Correct: subtype behavior is selected through the shared interface.$$,'B',$$Field visibility is a separate concept.$$,'C',$$Objects still require storage.$$,'D',$$Polymorphism does not eliminate compile-time errors.$$)),
($$mcq-core-http-idempotent$$,$$core-cs$$,$$Web Fundamentals$$,$$advanced$$,$$product$$,90,
 $$Which HTTP method is intended to replace a resource representation and be idempotent?$$,
 jsonb_build_object('A',$$POST$$,'B',$$PUT$$,'C',$$CONNECT$$,'D',$$PATCH is always guaranteed idempotent$$),
 $$Idempotent means repeating the same request has the same intended server-state effect as sending it once.$$,$$B$$,
 $$PUT is defined for creating or replacing the target resource and is intended to be idempotent.$$,
 jsonb_build_object('A',$$POST is generally not idempotent.$$,'B',$$Correct: repeated identical replacement has the same intended state.$$,'C',$$CONNECT establishes a tunnel.$$,'D',$$PATCH can be designed idempotently but is not guaranteed to be so.$$)),

-- AI and machine learning
($$mcq-ai-data-leakage$$,$$ai-ml$$,$$Model Evaluation$$,$$beginner$$,$$ai$$,60,
 $$Which action is a clear data-leakage risk?$$,
 jsonb_build_object('A',$$Fit a scaler on the full dataset before splitting$$,'B',$$Evaluate once on an untouched test set$$,'C',$$Record the random seed$$,'D',$$Document feature definitions$$),
 $$Split first; fit every learned preprocessing step only on training data.$$,$$A$$,
 $$Full-data scaling lets validation or test information influence training preprocessing and inflates evaluation.$$,
 jsonb_build_object('A',$$Correct: evaluation-set statistics leak into the training pipeline.$$,'B',$$A truly untouched test set is appropriate.$$,'C',$$A seed improves reproducibility.$$,'D',$$Documentation reduces ambiguity rather than leaking labels.$$)),
($$mcq-ai-recall-screening$$,$$ai-ml$$,$$Classification Metrics$$,$$intermediate$$,$$general$$,75,
 $$When missing a true medical case is especially costly, which metric needs special attention?$$,
 jsonb_build_object('A',$$Recall$$,'B',$$Parameter count$$,'C',$$Training accuracy only$$,'D',$$File size$$),
 $$Select metrics from the real costs of false negatives and false positives.$$,$$A$$,
 $$Recall measures the fraction of actual positive cases detected, directly exposing missed positives.$$,
 jsonb_build_object('A',$$Correct: low recall means many true cases are missed.$$,'B',$$Model size does not measure detection quality.$$,'C',$$Training accuracy neither tests generalization nor isolates false negatives.$$,'D',$$Storage size is unrelated to screening errors.$$)),
($$mcq-ai-test-set-purpose$$,$$ai-ml$$,$$Data Splitting$$,$$beginner$$,$$general$$,60,
 $$What is the primary purpose of a held-out test set?$$,
 jsonb_build_object('A',$$Tune hyperparameters repeatedly$$,'B',$$Estimate final performance on unseen data$$,'C',$$Increase the training sample automatically$$,'D',$$Remove the need for validation$$),
 $$Keep the test set untouched during model and hyperparameter selection.$$,$$B$$,
 $$A held-out test set provides a final, less-biased estimate after development decisions are complete.$$,
 jsonb_build_object('A',$$Repeated tuning on the test set leaks selection decisions.$$,'B',$$Correct: it simulates unseen evaluation data.$$,'C',$$Held-out examples are not used to train the model.$$,'D',$$Validation still guides development before the final test.$$)),
($$mcq-ai-overfitting-pattern$$,$$ai-ml$$,$$Generalization$$,$$intermediate$$,$$ai$$,75,
 $$Which result most strongly suggests overfitting?$$,
 jsonb_build_object('A',$$High training performance but much lower validation performance$$,'B',$$Similar poor performance on train and validation$$,'C',$$The dataset has documented columns$$,'D',$$Inference uses a fixed threshold$$),
 $$Compare training and validation behavior; a large generalization gap is the key signal.$$,$$A$$,
 $$Excellent training fit with substantially weaker validation results indicates the model learned training-specific patterns.$$,
 jsonb_build_object('A',$$Correct: the gap points to weak generalization.$$,'B',$$Poor performance on both more often suggests underfitting or weak features.$$,'C',$$Documentation is not an overfitting signal.$$,'D',$$A threshold alone does not establish overfitting.$$)),
($$mcq-ai-precision-spam$$,$$ai-ml$$,$$Classification Metrics$$,$$advanced$$,$$product$$,90,
 $$If falsely marking an important email as spam is very costly, which metric for the spam class deserves emphasis?$$,
 jsonb_build_object('A',$$Precision$$,'B',$$Recall only$$,'C',$$Training loss only$$,'D',$$Number of epochs$$),
 $$When false positives are costly, emphasize precision for the predicted-positive class while still checking the full trade-off.$$,$$A$$,
 $$Spam precision is the share of emails predicted as spam that truly are spam; higher precision reduces legitimate mail sent to spam.$$,
 jsonb_build_object('A',$$Correct: false spam flags lower precision.$$,'B',$$Recall emphasizes missed spam, a different error.$$,'C',$$Training loss does not directly communicate this false-positive cost.$$,'D',$$Epoch count is a training setting, not an error metric.$$))
),
upserted as (
    insert into public.mcq_questions (
        slug, topic, subtopic, difficulty, target_path, time_limit_seconds,
        question_text, options, correction_rule, is_published, updated_at
    )
    select slug, topic, subtopic, difficulty, target_path, time_limit_seconds,
           question_text, options, correction_rule, true, now()
    from seed
    on conflict (slug) do update set
        topic = excluded.topic,
        subtopic = excluded.subtopic,
        difficulty = excluded.difficulty,
        target_path = excluded.target_path,
        time_limit_seconds = excluded.time_limit_seconds,
        question_text = excluded.question_text,
        options = excluded.options,
        correction_rule = excluded.correction_rule,
        is_published = true,
        updated_at = now()
    returning id, slug
)
insert into public.mcq_answer_keys (question_id, correct_option, explanation, option_explanations, updated_at)
select upserted.id, seed.correct_option, seed.explanation, seed.option_explanations, now()
from upserted
join seed using (slug)
on conflict (question_id) do update set
    correct_option = excluded.correct_option,
    explanation = excluded.explanation,
    option_explanations = excluded.option_explanations,
    updated_at = now();

commit;

-- Verification: expected seed count is 35, five per topic.
select topic, count(*) as published_questions
from public.mcq_questions
where is_published = true
group by topic
order by topic;

