-- CodeBhavya Placement Practice Studio: 40-question starter bank
-- Safe to run more than once. It inserts new slugs and updates matching slugs.
-- It does not delete, truncate, drop or recreate any database object.

begin;

insert into public.question_bank (
    slug,
    question_type,
    category,
    topic,
    difficulty,
    target_path,
    question,
    answer_framework,
    hint,
    common_mistake,
    follow_up_questions,
    is_published,
    last_reviewed_at
)
values
-- 01-06: Aptitude and reasoning
(
    $$successive-percentage-price$$, $$practice$$, $$aptitude$$, $$Percentages$$, $$beginner$$, $$general$$,
    $$A product price is increased by 20% and then discounted by 20%. Is the final price equal to the original price? Calculate the exact change and explain why.$$,
    jsonb_build_array($$Assume a convenient original price such as 100.$$,$$Apply each percentage to the current price, not the original price.$$,$$Compare the final value with the starting value.$$,$$Generalise that equal successive increase and decrease percentages produce a net loss of p squared divided by 100 percent.$$),
    $$Use 100 as the original price and apply the two changes in sequence.$$,
    $$Cancelling plus 20% and minus 20% as though both percentages use the same base.$$,
    jsonb_build_array($$What discount would exactly reverse a 20% increase?$$,$$How would the result change for a 10% increase followed by a 20% decrease?$$), true, now()
),
(
    $$ratio-profit-share$$, $$practice$$, $$aptitude$$, $$Ratio and Proportion$$, $$beginner$$, $$service$$,
    $$A and B invest money in the ratio 3:5. After four months, A doubles the investment while B keeps the same amount for the full year. In what ratio should the annual profit be divided?$$,
    jsonb_build_array($$Treat profit share as capital multiplied by time.$$,$$Choose 3x and 5x as the initial investments.$$,$$Calculate A's contribution for four months at 3x and eight months at 6x.$$,$$Compare A's total capital-months with B's twelve-month contribution and simplify.$$),
    $$Create a two-row table with investment, months and capital-months.$$,
    $$Using only the original capital ratio and ignoring how long each amount remained invested.$$,
    jsonb_build_array($$What if B withdrew half the investment after six months?$$,$$Why is capital-time the correct basis for partnership profit?$$), true, now()
),
(
    $$average-after-replacement$$, $$practice$$, $$aptitude$$, $$Averages$$, $$intermediate$$, $$general$$,
    $$The average score of 10 students is 68. One recorded score of 48 is corrected to 78. What is the new average, and how can you solve it without recomputing every score?$$,
    jsonb_build_array($$Convert the original average into a total.$$,$$Find the change caused by replacing 48 with 78.$$,$$Add that difference to the original total.$$,$$Divide by the unchanged number of students and verify the average rises by the difference divided by 10.$$),
    $$Only one score changed, so work with the change in the total.$$,
    $$Adding the corrected score without first removing the incorrect score.$$,
    jsonb_build_array($$What if two scores were corrected?$$,$$Can an average change without the number of items changing?$$), true, now()
),
(
    $$combined-time-and-work$$, $$practice$$, $$aptitude$$, $$Time and Work$$, $$intermediate$$, $$general$$,
    $$A completes a task in 12 days and B in 18 days. They work together for four days, then A leaves. How many more days will B need to finish the task? Show a verification.$$,
    jsonb_build_array($$Express A's and B's work rates as 1/12 and 1/18.$$,$$Add the rates and multiply by four days to find completed work.$$,$$Subtract from one to find the remaining work.$$,$$Divide the remainder by B's rate and verify all completed fractions sum to one.$$),
    $$Use a total of 36 work units if fractions feel difficult.$$,
    $$Adding or subtracting completion times instead of adding work rates.$$,
    jsonb_build_array($$How long would the full task take if both stayed?$$,$$What changes if B leaves after four days instead?$$), true, now()
),
(
    $$relative-speed-platform$$, $$practice$$, $$aptitude$$, $$Speed, Time and Distance$$, $$intermediate$$, $$general$$,
    $$A 180-metre train travelling at 54 km/h crosses a platform in 24 seconds. Find the platform length and explain every unit conversion.$$,
    jsonb_build_array($$Convert 54 km/h to metres per second.$$,$$The distance covered while crossing is train length plus platform length.$$,$$Multiply speed by 24 seconds to obtain total distance.$$,$$Subtract the train length and check that all values use metres and seconds.$$),
    $$Multiply km/h by 5/18 to convert to metres per second.$$,
    $$Using only the platform length as the crossing distance or mixing kilometres with metres.$$,
    jsonb_build_array($$How long would the train take to cross a person standing still?$$,$$What relative speed is used when two trains move in opposite directions?$$), true, now()
),
(
    $$logical-ordering-constraints$$, $$practice$$, $$aptitude$$, $$Logical Ordering$$, $$intermediate$$, $$general$$,
    $$Five tasks P, Q, R, S and T must be scheduled once. P is before R, Q is immediately after S, and T is not first. Describe a reliable method to find valid orders and give one valid order.$$,
    jsonb_build_array($$Translate each sentence into a precise constraint.$$,$$Treat S-Q as one fixed block because Q is immediately after S.$$,$$Place the P-before-R pair and the S-Q block among the available positions.$$,$$Check the final sequence against every condition, including T not being first.$$),
    $$Begin with the strongest constraint: keep S and Q together as the block SQ.$$,
    $$Finding an order that satisfies two conditions and forgetting to verify the remaining condition.$$,
    jsonb_build_array($$How would you count every valid order?$$,$$Which new constraint would make the schedule impossible?$$), true, now()
),

-- 07-12: Programming fundamentals
(
    $$scope-lifetime-and-memory$$, $$interview$$, $$programming$$, $$Scope and Memory$$, $$beginner$$, $$general$$,
    $$Explain local, global and static variables by separating visibility from lifetime. Include one bug that careless use of shared state can create.$$,
    jsonb_build_array($$Define scope as where a name is visible and lifetime as how long its storage exists.$$,$$Use one small example to contrast local and global visibility.$$,$$Explain how a static local value persists between calls while remaining locally scoped.$$,$$Connect global or static state to a risk such as hidden coupling, stale state or unsafe concurrent access.$$),
    $$Scope and lifetime answer different questions; discuss them separately.$$,
    $$Saying a static local variable is globally accessible because it has program-long lifetime.$$,
    jsonb_build_array($$What is variable shadowing?$$,$$Where are automatic local variables commonly stored?$$), true, now()
),
(
    $$pointer-pass-by-value$$, $$interview$$, $$programming$$, $$Pointers and Function Calls$$, $$intermediate$$, $$general$$,
    $$C passes arguments by value. Then how can a function modify a caller's variable through a pointer? Explain without saying that C uses pass-by-reference.$$,
    jsonb_build_array($$State that every argument value, including an address, is copied into the function.$$,$$The copied pointer value still identifies the caller's storage.$$,$$Dereferencing that copied address changes the pointed-to object, not the caller's pointer variable.$$,$$Use a small swap or increment example and distinguish changing *p from changing p.$$),
    $$The pointer itself is copied; the copied address can still reach the original object.$$,
    $$Calling pointer arguments pass-by-reference and failing to distinguish the pointer from the pointed-to value.$$,
    jsonb_build_array($$Can the function redirect the caller's pointer using a single pointer parameter?$$,$$When would a pointer-to-pointer be required?$$), true, now()
),
(
    $$recursion-base-case-proof$$, $$practice$$, $$programming$$, $$Recursion$$, $$beginner$$, $$general$$,
    $$Design a recursive factorial function, then explain how the base case and decreasing argument together prove that valid calls terminate.$$,
    jsonb_build_array($$Define the valid input domain and decide how invalid negative input is handled.$$,$$Use 0 or 1 as the base case with result 1.$$,$$Make each recursive call with n minus 1 so it moves toward the base case.$$,$$Trace a small input and discuss overflow even when the recursion is logically correct.$$),
    $$A recursive solution needs both a stopping condition and guaranteed progress toward it.$$,
    $$Writing a base case that valid recursive calls never reach.$$,
    jsonb_build_array($$What are the time and call-stack costs?$$,$$When is an iterative solution preferable?$$), true, now()
),
(
    $$debug-array-boundary$$, $$practice$$, $$programming$$, $$Arrays and Debugging$$, $$intermediate$$, $$service$$,
    $$A loop uses for (i = 0; i <= n; i++) to process an array of n elements. Diagnose the defect, explain why it may appear to work, and propose tests that expose it.$$,
    jsonb_build_array($$Valid zero-based indexes are 0 through n minus 1.$$,$$The less-than-or-equal condition accesses one element beyond the array.$$,$$Undefined behaviour may remain invisible because adjacent memory sometimes appears readable.$$,$$Fix the bound to i < n and test empty, one-element and sanitizer-enabled cases.$$),
    $$List the valid index range before inspecting the loop condition.$$,
    $$Calling it only a wrong output bug without recognising unsafe out-of-bounds memory access.$$,
    jsonb_build_array($$How would the loop differ for indexes 1 through n?$$,$$Which compiler or runtime tools help detect this defect?$$), true, now()
),
(
    $$safe-file-processing$$, $$practice$$, $$programming$$, $$File Handling$$, $$intermediate$$, $$general$$,
    $$Outline a robust program that opens a text file, processes every line, handles errors and guarantees cleanup. What should happen if reading fails halfway?$$,
    jsonb_build_array($$Validate input and check whether opening the file succeeded.$$,$$Read using a bounded line operation and distinguish end-of-file from an input error.$$,$$Keep partial-result behaviour explicit instead of silently accepting incomplete data.$$,$$Close the resource on every exit path and report an actionable error.$$),
    $$Opening, reading and closing can fail independently; handle each stage.$$,
    $$Assuming a non-null file handle guarantees every later read succeeds.$$,
    jsonb_build_array($$How would a with-statement or RAII change cleanup?$$,$$When should partial output be discarded rather than retained?$$), true, now()
),
(
    $$python-mutable-default-argument$$, $$interview$$, $$programming$$, $$Python Function Semantics$$, $$advanced$$, $$ai$$,
    $$Why can a Python function with items=[] as a default parameter retain data across calls? Show the safe pattern and explain when the default expression is evaluated.$$,
    jsonb_build_array($$State that default argument objects are created when the function definition executes.$$,$$The same list object is reused by calls that omit the argument.$$,$$Demonstrate how mutation in one call becomes visible in a later call.$$,$$Use None as a sentinel and create a new list inside the function.$$),
    $$Ask whether the default list is created once or once per call.$$,
    $$Calling the behaviour random or fixing it with a shallow copy without explaining object reuse.$$,
    jsonb_build_array($$Are immutable default arguments always safe?$$,$$How can this behaviour ever be used deliberately?$$), true, now()
),

-- 13-18: Coding and problem solving
(
    $$two-sum-tradeoffs$$, $$practice$$, $$coding$$, $$Hashing Pattern$$, $$beginner$$, $$general$$,
    $$Given an unsorted array and a target, return indexes of two distinct elements whose sum is the target. Compare a brute-force solution with a hash-map solution.$$,
    jsonb_build_array($$Clarify whether one solution is guaranteed and whether duplicate values are allowed.$$,$$Describe the O(n squared) pair-checking baseline.$$,$$Scan once while storing each value's index and looking for target minus current value.$$,$$State O(n) expected time, O(n) space and test duplicates, negatives and no-solution input.$$),
    $$For each value x, ask whether target minus x has already appeared.$$,
    $$Inserting the current value before checking and accidentally using the same element twice.$$,
    jsonb_build_array($$How would sorted input change the approach?$$,$$What if every valid pair must be returned?$$), true, now()
),
(
    $$normalized-palindrome$$, $$practice$$, $$coding$$, $$Two Pointers$$, $$beginner$$, $$general$$,
    $$Decide whether a sentence is a palindrome while ignoring spaces, punctuation and letter case. Explain the algorithm, complexity and edge cases.$$,
    jsonb_build_array($$Define exactly which characters count and how case is normalized.$$,$$Place pointers at both ends and skip non-alphanumeric characters.$$,$$Compare normalized characters and stop at the first mismatch.$$,$$State O(n) time, O(1) extra space and test empty or punctuation-only input.$$),
    $$Two pointers can compare valid characters without constructing a second string.$$,
    $$Checking the raw sentence without defining or implementing normalization.$$,
    jsonb_build_array($$How would Unicode-aware normalization change the design?$$,$$What is the simpler solution if O(n) extra space is acceptable?$$), true, now()
),
(
    $$first-non-repeating-character$$, $$practice$$, $$coding$$, $$Frequency Counting$$, $$intermediate$$, $$service$$,
    $$Return the first non-repeating character in a string while preserving original order. Explain why one pass may not be enough with a basic frequency table.$$,
    jsonb_build_array($$Clarify case sensitivity and the required result when no character qualifies.$$,$$First count every character's frequency.$$,$$Scan the string in original order and return the first character with count one.$$,$$State O(n) time and space based on the character set, then test repeated and empty strings.$$),
    $$Frequency answers how often; a second ordered scan answers which unique character comes first.$$,
    $$Returning the first key with count one from a map without guaranteeing original string order.$$,
    jsonb_build_array($$Can a queue support a streaming version?$$,$$How does a fixed ASCII alphabet change space complexity?$$), true, now()
),
(
    $$merge-overlapping-intervals$$, $$practice$$, $$coding$$, $$Sorting and Intervals$$, $$advanced$$, $$product$$,
    $$Given meeting intervals in arbitrary order, merge all overlaps. Explain the invariant that makes a sort-and-scan solution correct.$$,
    jsonb_build_array($$Clarify whether touching intervals such as [1,2] and [2,3] should merge.$$,$$Sort intervals by start time, with a defined tie rule.$$,$$Maintain a result whose last interval covers every merged interval seen so far.$$,$$Merge when the next start is within the last end; otherwise append a new interval. State O(n log n) time.$$),
    $$After sorting by start, only the last merged interval can overlap the next interval.$$,
    $$Scanning unsorted intervals and assuming local comparisons reveal every overlap.$$,
    jsonb_build_array($$Can the problem be solved in linear time under bounded integer endpoints?$$,$$How would you insert one new interval into an already merged list?$$), true, now()
),
(
    $$missing-number-xor$$, $$practice$$, $$coding$$, $$Bitwise Reasoning$$, $$intermediate$$, $$general$$,
    $$An array contains distinct numbers from 0 through n with exactly one number missing. Find it without sorting and compare sum-based and XOR-based solutions.$$,
    jsonb_build_array($$State the constraints: one missing value, no duplicates and known range 0 through n.$$,$$The sum method subtracts the actual sum from the expected arithmetic-series sum.$$,$$The XOR method cancels equal index and value occurrences, leaving the missing number.$$,$$Compare O(n) time and O(1) space, noting integer-overflow risk in fixed-width sum calculations.$$),
    $$XOR has the useful property x XOR x equals zero.$$,
    $$Using XOR without explaining why paired values cancel or forgetting to include n.$$,
    jsonb_build_array($$What changes if two numbers are missing?$$,$$What if duplicates are allowed?$$), true, now()
),
(
    $$longest-unique-substring$$, $$practice$$, $$coding$$, $$Sliding Window$$, $$advanced$$, $$product$$,
    $$Find the length of the longest substring without repeated characters. Explain how the left boundary moves without rechecking the whole window.$$,
    jsonb_build_array($$Use a window whose characters are always unique.$$,$$Store the most recent index of each character.$$,$$When a repeat lies inside the current window, move left to one position after that occurrence.$$,$$Update the maximum length and state O(n) time because each boundary moves forward only.$$),
    $$Never move the left boundary backward when a repeated character occurred before the current window.$$,
    $$Restarting the scan after every duplicate and degrading to quadratic time.$$,
    jsonb_build_array($$How would you return the substring itself?$$,$$How does the solution change for at most k distinct characters?$$), true, now()
),

-- 19-24: Data structures and algorithms
(
    $$array-vs-linked-list$$, $$interview$$, $$dsa$$, $$Choosing a Data Structure$$, $$intermediate$$, $$general$$,
    $$For a collection with frequent indexed reads and occasional insertions, would you choose an array or a linked list? Defend the decision and say when you would change it.$$,
    jsonb_build_array($$Begin with the dominant operations and constraints.$$,$$Compare indexed access, insertion cost, memory overhead and cache locality.$$,$$Choose an array when indexed reads dominate.$$,$$State the workload or stability requirement that would justify a linked structure or another alternative.$$),
    $$The best structure follows the dominant costly operation, not one operation in isolation.$$,
    $$Saying linked-list insertion is always O(1) without including the cost of finding the position.$$,
    jsonb_build_array($$How does a dynamic array change the trade-off?$$,$$What if stable references to elements are required?$$), true, now()
),
(
    $$balanced-parentheses-stack$$, $$practice$$, $$dsa$$, $$Stacks$$, $$beginner$$, $$general$$,
    $$Validate a string containing (), [] and {} brackets. Explain why a stack matches the structure of the problem and identify early failure cases.$$,
    jsonb_build_array($$Push each opening bracket onto a stack.$$,$$For a closing bracket, fail if the stack is empty or the top has the wrong type.$$,$$Pop only a matching opening bracket.$$,$$At the end, accept only if the stack is empty; state O(n) time and O(n) worst-case space.$$),
    $$The most recently opened bracket must be the first one closed.$$,
    $$Counting bracket types without checking their nesting order.$$,
    jsonb_build_array($$How would you report the index of the first error?$$,$$Can the worst-case auxiliary space be reduced?$$), true, now()
),
(
    $$bfs-unweighted-shortest-path$$, $$interview$$, $$dsa$$, $$Graphs and BFS$$, $$intermediate$$, $$general$$,
    $$Why does breadth-first search find a shortest path in an unweighted graph? Describe the queue invariant and how to reconstruct the actual path.$$,
    jsonb_build_array($$BFS explores vertices in nondecreasing distance from the source.$$,$$A queue preserves level-by-level discovery.$$,$$Mark a vertex when it is enqueued to prevent duplicate work.$$,$$Store each discovered vertex's parent, then walk parents backward from the destination to reconstruct the path.$$),
    $$Think in layers: distance 0, then 1, then 2 and so on.$$,
    $$Marking visited only when dequeued, which may enqueue the same vertex many times.$$,
    jsonb_build_array($$Why does the guarantee fail for arbitrary weighted edges?$$,$$What are the time and space complexities with adjacency lists?$$), true, now()
),
(
    $$skewed-bst-complexity$$, $$interview$$, $$dsa$$, $$Binary Search Trees$$, $$intermediate$$, $$general$$,
    $$A binary search tree receives keys in increasing order. What shape results, how do search and insertion costs change, and which strategies prevent the problem?$$,
    jsonb_build_array($$Trace the first few increasing insertions and show that every node gets a right child only.$$,$$The height becomes n minus 1 instead of logarithmic.$$,$$Search and insertion therefore degrade from average O(log n) to O(n).$$,$$Use a self-balancing tree, randomised priorities or a build strategy that avoids ordered insertion.$$),
    $$BST performance follows tree height, not the word binary.$$,
    $$Claiming all BST operations are always O(log n).$$,
    jsonb_build_array($$How do AVL and red-black trees differ in balancing strictness?$$,$$Does random insertion guarantee logarithmic height?$$), true, now()
),
(
    $$hash-collision-strategies$$, $$interview$$, $$dsa$$, $$Hash Tables$$, $$intermediate$$, $$product$$,
    $$Two different keys produce the same hash-table index. Compare separate chaining and open addressing, including load factor, deletion and cache behaviour.$$,
    jsonb_build_array($$Define a collision and explain why a correct table must preserve both keys.$$,$$Separate chaining stores colliding entries in per-bucket collections and supports straightforward deletion.$$,$$Open addressing probes within the array, improving locality but requiring careful deletion markers.$$,$$Connect performance to hash quality, load factor and resizing rather than promising constant time unconditionally.$$),
    $$Collision resolution affects where the second entry goes; it must never silently replace the first.$$,
    $$Stating that hash tables cannot have collisions or that operations are worst-case O(1).$$,
    jsonb_build_array($$Why are tombstones used in open addressing?$$,$$When should a table resize?$$), true, now()
),
(
    $$sort-nearly-sorted-data$$, $$interview$$, $$dsa$$, $$Algorithm Selection$$, $$advanced$$, $$product$$,
    $$Every element in an array is at most k positions from its sorted location. Choose an algorithm that uses this property and compare it with general comparison sorting.$$,
    jsonb_build_array($$Recognise that the smallest remaining element must be among the next k plus one items.$$,$$Maintain those candidates in a min-heap of size at most k plus one.$$,$$Repeatedly remove the minimum and insert the next unseen value.$$,$$State O(n log k) time and O(k) space, better than O(n log n) when k is much smaller than n.$$),
    $$At each output position, inspect only the window where its correct value can exist.$$,
    $$Ignoring the k-displacement guarantee and giving only a generic sorting answer.$$,
    jsonb_build_array($$What happens when k is zero or k approaches n?$$,$$Could insertion sort be competitive for very small k?$$), true, now()
),

-- 25-30: Core computer science
(
    $$database-index-tradeoff$$, $$interview$$, $$core-cs$$, $$DBMS Indexes$$, $$intermediate$$, $$general$$,
    $$A query on a large table is slow. Explain when an index can help, what it costs, and how you would verify that the database actually uses it.$$,
    jsonb_build_array($$Identify columns used for selective filtering, joining or ordering.$$,$$Explain that an index provides an alternative access path that can avoid scanning most rows.$$,$$State storage, write and maintenance costs.$$,$$Inspect the execution plan and compare measured timing and rows read before and after the change.$$),
    $$An index helps when its access path is more selective than scanning the table.$$,
    $$Claiming that adding an index always makes every query faster.$$,
    jsonb_build_array($$Why may a low-cardinality index be ignored?$$,$$How does column order matter in a composite index?$$), true, now()
),
(
    $$normalization-orders-schema$$, $$interview$$, $$core-cs$$, $$Database Normalization$$, $$beginner$$, $$general$$,
    $$An orders table repeats customer name and address on every order row. Explain the anomalies this creates and how you would normalise the design without losing the relationship.$$,
    jsonb_build_array($$Identify update, insertion and deletion anomalies caused by repeated customer facts.$$,$$Separate customer data into a Customers table with a stable key.$$,$$Keep the customer key as a foreign key in Orders.$$,$$Explain that joins reconstruct the view while constraints protect referential integrity.$$),
    $$Separate facts that describe the customer from facts that describe an order.$$,
    $$Creating extra tables without identifying keys, dependencies or the anomalies being fixed.$$,
    jsonb_build_array($$When might deliberate denormalisation be reasonable?$$,$$Where should an order's historical shipping address be stored?$$), true, now()
),
(
    $$transaction-isolation-ticketing$$, $$interview$$, $$core-cs$$, $$Transactions and Isolation$$, $$advanced$$, $$product$$,
    $$Two users try to buy the final ticket at the same time. Explain how a transaction can prevent overselling and what isolation or locking decision is involved.$$,
    jsonb_build_array($$Keep the availability check and reservation update in one transaction.$$,$$Use an atomic conditional update, row lock or serializable execution so both buyers cannot commit the same inventory.$$,$$Check affected rows and roll back when no ticket remains.$$,$$Discuss the correctness-versus-concurrency trade-off and test with concurrent requests.$$),
    $$The check and the update must behave as one indivisible decision.$$,
    $$Checking availability outside the transaction and assuming a later update sees the same state.$$,
    jsonb_build_array($$What retry behaviour may serializable isolation require?$$,$$How would optimistic concurrency control solve this?$$), true, now()
),
(
    $$process-vs-thread$$, $$interview$$, $$core-cs$$, $$Operating Systems$$, $$beginner$$, $$general$$,
    $$Compare a process and a thread in terms of address space, isolation, communication, creation cost and failure impact. Give one situation suited to each.$$,
    jsonb_build_array($$Define a process as a protected resource and address-space container.$$,$$Define threads as execution units that share their process resources.$$,$$Compare isolation and IPC with cheaper shared-memory communication and synchronization risks.$$,$$Choose processes for isolation boundaries and threads for coordinated concurrent work within one application.$$),
    $$Organise the answer by what is private and what is shared.$$,
    $$Saying threads are simply smaller processes without discussing shared state and isolation.$$,
    jsonb_build_array($$Why can a data race occur between threads?$$,$$How do user-level and kernel threads differ?$$), true, now()
),
(
    $$deadlock-four-conditions$$, $$interview$$, $$core-cs$$, $$Concurrency and Deadlock$$, $$intermediate$$, $$general$$,
    $$Two threads each hold one lock and wait forever for the other lock. Explain the four necessary deadlock conditions and one practical prevention strategy.$$,
    jsonb_build_array($$Name mutual exclusion, hold-and-wait, no preemption and circular wait.$$,$$Map each condition to the two-lock example.$$,$$Explain that all four must hold simultaneously for deadlock.$$,$$Prevent circular wait with one global lock order, or break another condition with a justified strategy.$$),
    $$Draw the wait cycle and connect it to circular wait.$$,
    $$Listing the four conditions without showing how a proposed fix breaks one of them.$$,
    jsonb_build_array($$How is deadlock different from starvation?$$,$$What trade-off comes with lock timeouts?$$), true, now()
),
(
    $$tcp-vs-udp-video-call$$, $$interview$$, $$core-cs$$, $$Computer Networks$$, $$intermediate$$, $$general$$,
    $$For a live video call, compare TCP and UDP and explain why an application may prefer timely delivery over retransmitting every lost packet.$$,
    jsonb_build_array($$Compare connection setup, ordering, reliability and congestion behaviour.$$,$$Relate retransmission delay and head-of-line blocking to real-time media.$$,$$Explain why UDP gives the application control over loss recovery and timing.$$,$$Mention that signalling or other reliable parts may still use TCP and that modern protocols add reliability selectively.$$),
    $$Ask whether an old packet is still valuable after its playback deadline.$$,
    $$Saying UDP is always faster without discussing reliability, ordering and application requirements.$$,
    jsonb_build_array($$When would TCP be preferable for media delivery?$$,$$How can an application cope with packet loss over UDP?$$), true, now()
),

-- 31-34: Resume and projects
(
    $$two-minute-project-story$$, $$interview$$, $$resume-projects$$, $$Project Defence$$, $$intermediate$$, $$general$$,
    $$Give a two-minute explanation of one project that proves your contribution, engineering judgment and result rather than merely listing technologies.$$,
    jsonb_build_array($$State the problem, intended user and why it mattered.$$,$$Separate your responsibility from the team's work.$$,$$Explain one important design choice, one challenge and how you tested the solution.$$,$$Close with a measurable or observable result, limitation and next improvement.$$),
    $$Use Problem, My Role, Decision, Challenge, Result and Next Step.$$,
    $$Listing technologies without explaining decisions, ownership or evidence.$$,
    jsonb_build_array($$What part would fail first at ten times the usage?$$,$$Which decision would you change if rebuilding it?$$), true, now()
),
(
    $$defend-technology-choice$$, $$interview$$, $$resume-projects$$, $$Engineering Trade-offs$$, $$advanced$$, $$product$$,
    $$An interviewer asks, “Why did you choose this database or framework?” Build an answer that proves a decision rather than personal preference.$$,
    jsonb_build_array($$Begin with project requirements and constraints.$$,$$Name at least two reasonable alternatives considered.$$,$$Compare them using relevant criteria such as data model, scale, team skill, delivery time and operational cost.$$,$$State the chosen option, its downside and the evidence you would monitor to reconsider it.$$),
    $$A strong technology answer begins with requirements, not popularity.$$,
    $$Saying it was easy, trending or already known without connecting it to project constraints.$$,
    jsonb_build_array($$Which requirement most influenced the decision?$$,$$At what scale or condition would you migrate?$$), true, now()
),
(
    $$measurable-resume-bullet$$, $$practice$$, $$resume-projects$$, $$Evidence-first Resume$$, $$beginner$$, $$general$$,
    $$Rewrite “Worked on a student attendance website using Python” as an evidence-first resume bullet without inventing numbers you cannot defend.$$,
    jsonb_build_array($$Start with a precise action verb and your actual contribution.$$,$$Name the user problem or workflow improved.$$,$$Add verifiable scope or result, which may be qualitative when no honest metric exists.$$,$$Include relevant technology only where it explains how the result was achieved.$$),
    $$Use Action + What you built + For whom or why + Verifiable result.$$,
    $$Inventing impressive percentages or claiming team outcomes as personal work.$$,
    jsonb_build_array($$What evidence would support the bullet in an interview?$$,$$Which weak words can be removed?$$), true, now()
),
(
    $$ml-project-limitation$$, $$interview$$, $$resume-projects$$, $$Responsible ML Projects$$, $$advanced$$, $$ai$$,
    $$Explain one limitation of an ML project, how you discovered it, and what experiment would reduce uncertainty. Avoid claiming that model accuracy alone proves usefulness.$$,
    jsonb_build_array($$Define the intended decision, user and cost of different errors.$$,$$Describe the data or model limitation with concrete evidence.$$,$$Choose a metric and slice analysis that reveal the limitation.$$,$$Propose a controlled next experiment, expected learning and responsible deployment boundary.$$),
    $$Connect the limitation to users or decisions, not just a lower metric.$$,
    $$Hiding limitations or proposing a more complex model before checking data quality and evaluation design.$$,
    jsonb_build_array($$How would you detect data leakage?$$,$$What baseline should the model beat?$$), true, now()
),

-- 35-37: Technical communication
(
    $$think-aloud-unfamiliar-problem$$, $$interview$$, $$communication$$, $$Visible Problem Solving$$, $$intermediate$$, $$general$$,
    $$You receive an unfamiliar coding problem and do not see the solution immediately. Demonstrate the first two minutes of useful think-aloud reasoning.$$,
    jsonb_build_array($$Restate the problem and confirm inputs, outputs and constraints.$$,$$Walk through a small example and identify ambiguous or edge cases.$$,$$Offer a correct simple baseline before seeking optimisation.$$,$$Name the likely bottleneck and the property or data structure you would investigate next.$$),
    $$The evaluator needs access to your reasoning, not a stream of nervous guesses.$$,
    $$Remaining silent until a complete optimal solution appears or speaking without a structured direction.$$,
    jsonb_build_array($$How would you recover after discovering a wrong assumption?$$,$$When should you ask the interviewer for a hint?$$), true, now()
),
(
    $$professional-i-do-not-know$$, $$interview$$, $$communication$$, $$Reasoning Under Uncertainty$$, $$beginner$$, $$general$$,
    $$An interviewer asks about a concept you do not know. Respond honestly while still demonstrating useful technical reasoning and a verification plan.$$,
    jsonb_build_array($$State precisely which part you do not know instead of making a vague apology.$$,$$Share the related facts or principles you do understand.$$,$$Reason cautiously from those facts and label any hypothesis.$$,$$Ask a focused clarifying question or describe how you would verify the answer.$$),
    $$Honesty plus bounded reasoning is stronger than a confident guess.$$,
    $$Stopping at “I don't know” or presenting speculation as fact.$$,
    jsonb_build_array($$How would you verify the hypothesis in a real project?$$,$$Can you connect the question to a concept you already know?$$), true, now()
),
(
    $$explain-technical-tradeoff$$, $$interview$$, $$communication$$, $$Trade-off Communication$$, $$intermediate$$, $$general$$,
    $$Explain a technical trade-off to both an engineer and a non-technical stakeholder. How should the content change while the underlying decision remains consistent?$$,
    jsonb_build_array($$Begin with the shared goal and the decision being made.$$,$$For the engineer, discuss constraints, alternatives, failure modes and measurable consequences.$$,$$For the stakeholder, translate those consequences into time, risk, cost and user impact.$$,$$Give the same recommendation, state its downside and define the signal that would trigger reconsideration.$$),
    $$Change vocabulary and evidence depth, not the truth of the decision.$$,
    $$Removing all substance for the stakeholder or overwhelming them with implementation details.$$,
    jsonb_build_array($$How would you present uncertainty?$$,$$What visual evidence could help each audience?$$), true, now()
),

-- 38-40: HR and professional readiness
(
    $$role-focused-self-introduction$$, $$interview$$, $$hr$$, $$Self-introduction$$, $$beginner$$, $$general$$,
    $$Give a 60–90 second “Tell me about yourself” answer for an entry-level role that connects your present skills, evidence and direction without narrating your full biography.$$,
    jsonb_build_array($$Open with your current academic or professional identity.$$,$$Name two role-relevant strengths supported by a project, practice result or responsibility.$$,$$Connect your recent learning to the role's actual work.$$,$$Close with why this opportunity is a logical next step, keeping personal details minimal.$$),
    $$Use Present → Evidence → Direction; every claim should lead to something you can explain.$$,
    $$Reciting family history, every academic year or generic adjectives without evidence.$$,
    jsonb_build_array($$Why are you interested in this specific role?$$,$$Which project best supports your introduction?$$), true, now()
),
(
    $$team-conflict-with-evidence$$, $$interview$$, $$hr$$, $$Team Conflict$$, $$intermediate$$, $$general$$,
    $$Tell me about a genuine disagreement in a team. How did you keep it productive, what action did you take, and what changed afterward?$$,
    jsonb_build_array($$Give concise context and identify the shared goal.$$,$$Describe the disagreement fairly without blaming or questioning motives.$$,$$Explain the listening, evidence, experiment or decision rule you used.$$,$$State the result and what you learned for future collaboration.$$),
    $$Use Situation → Tension → Action → Result → Learning with a real example.$$,
    $$Claiming you never experience conflict or presenting yourself as the only reasonable person.$$,
    jsonb_build_array($$What would the other person say about the situation?$$,$$What would you do differently now?$$), true, now()
),
(
    $$failure-feedback-growth$$, $$interview$$, $$hr$$, $$Failure and Feedback$$, $$intermediate$$, $$general$$,
    $$Describe a real failure or difficult feedback. Show accountability, the correction you made and evidence that your behaviour changed afterward.$$,
    jsonb_build_array($$Choose a meaningful example that is safe to discuss and genuinely yours.$$,$$State what you expected, what happened and your contribution to the outcome.$$,$$Explain the specific feedback or lesson and the action you changed.$$,$$Provide later evidence that the new process or behaviour produced a better result.$$),
    $$The strongest ending is proof of changed behaviour, not “I learned a lot.”$$,
    $$Using a disguised strength, blaming circumstances or describing learning without a later behavioural change.$$,
    jsonb_build_array($$How did you measure improvement?$$,$$What safeguard now prevents the same failure?$$), true, now()
)
on conflict (slug) do update set
    question_type = excluded.question_type,
    category = excluded.category,
    topic = excluded.topic,
    difficulty = excluded.difficulty,
    target_path = excluded.target_path,
    question = excluded.question,
    answer_framework = excluded.answer_framework,
    hint = excluded.hint,
    common_mistake = excluded.common_mistake,
    follow_up_questions = excluded.follow_up_questions,
    is_published = excluded.is_published,
    last_reviewed_at = excluded.last_reviewed_at,
    updated_at = now();

commit;

-- Optional verification after the transaction succeeds:
select category, count(*) as published_questions
from public.question_bank
where is_published = true
group by category
order by category;
