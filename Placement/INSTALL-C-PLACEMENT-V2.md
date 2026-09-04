# CodeBhavya C Placement V2 — Installation

This package replaces the earlier quiz prototype with an exam-style MCQ flow and adds the first executable C Coding Arena.

## 1. Run the database scripts

Open the same Supabase project used by the Placement page. In **SQL Editor**, run these files in this exact order:

1. `Placement/placement-v2-schema.sql`
2. `Placement/c-placement-mcq-seed.sql`
3. `Placement/c-coding-problems-seed.sql`

Expected verification:

- MCQ seed: 20 questions for each company target, 80 C MCQs total.
- Coding seed: 3 problems for each company target, 12 C coding problems total.

All three scripts are rerunnable. They do not drop or truncate existing tables.

## 2. Create the code-judge Edge Function

1. Open **Supabase → Edge Functions**.
2. Choose **Deploy a new function → Via Editor**.
3. Name it exactly `judge-submission`.
4. Replace its generated code with `supabase/functions/judge-submission/index.ts` from this package.
5. Deploy the function with JWT verification enabled. Students must sign in before running code; this prevents anonymous abuse of the judge.

The function uses the Judge0 CE endpoint by default. For a managed or self-hosted Judge0 installation, configure these Supabase function secrets:

- `JUDGE0_URL`
- `JUDGE0_AUTH_TOKEN` when the provider requires it
- `JUDGE0_AUTH_HEADER` when the provider uses a header other than `X-Auth-Token`
- `JUDGE0_C_LANGUAGE_ID` when the installation's C language ID is not `50`

Never put the Judge0 token or Supabase secret/service-role key in browser JavaScript.

## 3. Upload the website files

Upload these files into the existing repository's `Placement` directory:

- `practice.html`
- `quiz.html`
- `coding.html`
- `placement-hub-v2.css`
- `placement-exam-v2.css`
- `placement-exam-v2.js`
- `placement-coding-v2.css`
- `placement-coding-v2.js`

Do not replace your existing `Placement/supabase-config.js`. It is intentionally not included in this package.

The new pages reuse the existing files already on the website:

- `style.css`
- `Placement/placement.css`
- `Placement/supabase-client.js`

## 4. Test the quiz

1. Open `Placement/practice.html`.
2. Choose **C Placement Practice → Open C Quiz**.
3. Select each company target and confirm its question bank changes.
4. Select **Balanced → 20 questions** and start.
5. Confirm no answer or explanation appears while attempting questions.
6. Confirm the last action says **Finish & Review**.
7. Submit and confirm the score and all explanations appear together.
8. Take another quiz and confirm correctly answered questions are removed from the unseen pool.

Difficulty-specific selections contain 6 or 7 questions per company in this starter bank. Therefore, unavailable 10/20 choices are disabled instead of silently returning fewer questions. Future question batches can increase those counts.

## 5. Test the Coding Arena

1. Sign in through the Placement page.
2. Open `Placement/coding.html`.
3. Select a problem.
4. Write a complete C program.
5. Choose **Run sample tests** and confirm visible input/output comparisons appear.
6. Choose **Submit solution** and confirm protected-test results, points and score appear.
7. Open the leaderboard and confirm an anonymous student alias is used.

## Important production note

The public Judge0 CE endpoint is suitable for initial testing but may apply availability or rate limits. Before inviting many students, use a managed Judge0 plan or self-host Judge0 and add request-rate limiting to the Edge Function.
