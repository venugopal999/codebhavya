"use strict";
const starter=(focus)=>`import java.util.*;

public class Program {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        // TODO: ${focus}
    }
}`;
const P=(id,title,difficulty,story,tags,input,output,constraints,exampleInput,exampleOutput,hint,approach,solution)=>({id,title,difficulty,story,tags,input,output,constraints,exampleInput,exampleOutput,hint,approach,starter:starter(approach),solution});
window.JAVA_PRACTICE_LEVELS=[
{n:1,title:"Java Foundations",problems:[
P("campus-id","Campus ID Formatter","Foundation","A college wants one consistent identity line from raw student details. Read a name, roll number and branch, then produce the official label.",["input","formatting","strings"],"Line 1: name. Line 2: roll number. Line 3: branch code.","NAME [ROLL] - BRANCH, with the name converted to uppercase.","Name and branch are non-empty; roll number is a positive integer.","Ananya Rao\n24017\nCSE","ANANYA RAO [24017] - CSE","Read full lines for text; parse the trimmed roll-number line separately.","Use nextLine throughout so spaces in the name are preserved. Normalize only the name and branch, then format once.",`import java.util.*;
public class Program {
    public static void main(String[] args) {
        Scanner in=new Scanner(System.in);
        String name=in.nextLine().trim().toUpperCase();
        int roll=Integer.parseInt(in.nextLine().trim());
        String branch=in.nextLine().trim().toUpperCase();
        System.out.printf("%s [%d] - %s%n",name,roll,branch);
    }
}`),
P("lab-energy","Lab Electricity Cost","Foundation","The lab coordinator records device power and usage time. Calculate energy consumed and its cost without losing decimal precision.",["arithmetic","double","formatting"],"Power in watts, hours used, and price per kWh on one line.","Energy in kWh and cost, each rounded to two decimals.","0 < power <= 10000; 0 <= hours <= 24; rate >= 0.","750 6 8.25","Energy: 4.50 kWh\nCost: 37.13","Convert watt-hours to kilowatt-hours by dividing by 1000.0.","Compute energy first as a double, multiply by the rate, and let printf handle display rounding.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        Scanner in=new Scanner(System.in);
        double watts=in.nextDouble(), hours=in.nextDouble(), rate=in.nextDouble();
        double energy=watts*hours/1000.0;
        System.out.printf("Energy: %.2f kWh%nCost: %.2f%n",energy,energy*rate);
    }
}`),
P("time-capsule","Time Capsule Converter","Foundation","A coding contest stores durations as total seconds. Convert a duration into a clock-style hours, minutes and seconds reading.",["division","modulo","formatting"],"One non-negative integer: total seconds.","The duration formatted as HH:MM:SS.","0 <= seconds <= 359999.","7384","02:03:04","Use integer division for hours, then remainder for minutes and seconds.","Divide by 3600, reduce with modulo 3600, and format every field with two digits.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        int total=new Scanner(System.in).nextInt();
        int h=total/3600, m=(total%3600)/60, s=total%60;
        System.out.printf("%02d:%02d:%02d%n",h,m,s);
    }
}`)
]},
{n:7,title:"Exceptions & Generics",problems:[
P("safe-mark-parser","Safe Mark Parser","Intermediate","An import may contain malformed marks. Parse every token, keep valid values from 0 to 100, and count rejected entries.",["exceptions","parsing","validation"],"n followed by n whitespace-separated tokens.","Valid sum and rejected count.","1 <= n <= 10000; tokens may be non-numeric or numeric but outside 0..100.","7\n80 absent 101 65 -2 90 74","Valid sum: 309\nRejected: 3","Catch NumberFormatException, but validate range after parsing.","Treat syntax and domain failures as two routes to the same rejected counter. Never let one bad token stop the import.",`import java.util.*;
public class Program {
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt(),sum=0,bad=0;for(int i=0;i<n;i++){String token=in.next();try{int x=Integer.parseInt(token);if(x<0||x>100)bad++;else sum+=x;}catch(NumberFormatException e){bad++;}}System.out.println("Valid sum: "+sum);System.out.println("Rejected: "+bad);}
}`),
P("generic-range","Generic Min-Max Box","Advanced","Build one reusable range function that works for comparable integers, words and other naturally ordered types.",["generics","comparable","type bounds"],"n followed by n words.","Lexicographically smallest and largest word.","1 <= n <= 10000; words are non-empty and case-sensitive.","5\npear apple mango kiwi banana","Min: apple\nMax: pear","Use a bounded type parameter: T extends Comparable<? super T>.","Initialize min and max from the first element, then compare every later value through compareTo.",`import java.util.*;
public class Program {
    static <T extends Comparable<? super T>> List<T> range(List<T> values){T min=values.get(0),max=min;for(T v:values){if(v.compareTo(min)<0)min=v;if(v.compareTo(max)>0)max=v;}return List.of(min,max);}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();List<String> a=new ArrayList<>();for(int i=0;i<n;i++)a.add(in.next());List<String> r=range(a);System.out.println("Min: "+r.get(0));System.out.println("Max: "+r.get(1));}
}`),
P("typed-stack","Typed Undo Stack","Advanced","Implement a generic fixed-capacity stack for editor actions. Extra pushes and pops from an empty stack must fail clearly.",["generics","stack","exception"],"Capacity c, command count n, then PUSH word or POP commands.","For POP print the item; for invalid operations print FULL or EMPTY.","1 <= c,n <= 1000.","2 6\nPUSH type\nPUSH delete\nPUSH paste\nPOP\nPOP\nPOP","FULL\ndelete\ntype\nEMPTY","Back the stack with an ArrayList<T> and check size at both boundaries.","Expose push and pop operations with boolean/Optional outcomes so main can turn boundary cases into messages.",`import java.util.*;
public class Program {
    static class Stack<T>{private final int cap;private final List<T> a=new ArrayList<>();Stack(int c){cap=c;}boolean push(T x){if(a.size()==cap)return false;a.add(x);return true;}Optional<T> pop(){return a.isEmpty()?Optional.empty():Optional.of(a.remove(a.size()-1));}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int c=in.nextInt(),n=in.nextInt();Stack<String> s=new Stack<>(c);for(int i=0;i<n;i++){String cmd=in.next();if(cmd.equals("PUSH")){if(!s.push(in.next()))System.out.println("FULL");}else System.out.println(s.pop().orElse("EMPTY"));}}
}`)
]},
{n:8,title:"Collections",problems:[
P("first-unique","First Unique Visitor","Intermediate","A check-in log lists visitor IDs in arrival order. Find the first ID that appears exactly once.",["linkedhashmap","frequency","order"],"n followed by n integer visitor IDs.","First unique ID or NONE.","1 <= n <= 200000.","8\n4 7 4 9 7 5 9 8","First unique: 5","A LinkedHashMap remembers insertion order while storing counts.","Count with merge, then iterate entries in first-seen order and stop at the first count of one. O(n) expected time.",`import java.util.*;
public class Program {
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();Map<Integer,Integer> counts=new LinkedHashMap<>();for(int i=0;i<n;i++)counts.merge(in.nextInt(),1,Integer::sum);for(var e:counts.entrySet())if(e.getValue()==1){System.out.println("First unique: "+e.getKey());return;}System.out.println("NONE");}
}`),
P("department-board","Department Leaderboard","Advanced","Aggregate placement counts by department and rank departments by count descending, breaking ties alphabetically.",["hashmap","sorting","comparator"],"n followed by n department names.","One DEPARTMENT COUNT line per department in rank order.","1 <= n <= 100000; names are single uppercase words.","8\nCSE ECE CSE ME ECE CSE CIVIL ME","CSE 3\nECE 2\nME 2\nCIVIL 1","Count in a map, then sort entries with a compound comparator.","Compare counts in reverse order; only if equal compare keys naturally. Aggregation is O(n), ranking O(d log d).",`import java.util.*;
public class Program {
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();Map<String,Integer> m=new HashMap<>();for(int i=0;i<n;i++)m.merge(in.next(),1,Integer::sum);List<Map.Entry<String,Integer>> list=new ArrayList<>(m.entrySet());list.sort(Comparator.<Map.Entry<String,Integer>>comparingInt(Map.Entry::getValue).reversed().thenComparing(Map.Entry::getKey));for(var e:list)System.out.println(e.getKey()+" "+e.getValue());}
}`),
P("clinic-queue","Clinic Priority Queue","Advanced","Patients are served by severity first. For equal severity, earlier arrival wins.",["priorityqueue","comparator","stable ordering"],"n followed by name and severity (1 highest to 5 lowest).",
"Names in service order, one per line.","1 <= n <= 10000; names are single words.","5\nRavi 3\nMeera 1\nAsha 3\nKabir 2\nNoor 1","Meera\nNoor\nKabir\nRavi\nAsha","Store arrival sequence and include it as the comparator tie-breaker.","Create immutable patient records. PriorityQueue orders severity ascending, then sequence ascending, preserving FIFO among equals.",`import java.util.*;
public class Program {
    record Patient(String name,int severity,int order){}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();PriorityQueue<Patient> q=new PriorityQueue<>(Comparator.comparingInt(Patient::severity).thenComparingInt(Patient::order));for(int i=0;i<n;i++)q.add(new Patient(in.next(),in.nextInt(),i));while(!q.isEmpty())System.out.println(q.poll().name());}
}`)
]},
{n:9,title:"Lambdas & Streams",problems:[
P("eligibility-pipeline","Placement Eligibility Pipeline","Advanced","Filter placement records by CGPA and active backlogs, then print eligible names alphabetically.",["streams","filter","sort"],"n followed by name, CGPA and backlog count.","Eligible names, or NONE.","Eligible means CGPA >= 7.5 and zero backlogs; 1 <= n <= 10000.","5\nZoya 8.1 0\nArun 7.4 0\nMeera 9.0 1\nBhavya 7.8 0\nCharan 8.3 0","Bhavya\nCharan\nZoya","Map input into records, then filter and sorted before printing.","Keep eligibility as one readable predicate. Collect names after filtering so the stream describes the business rule directly.",`import java.util.*;
public class Program {
    record Candidate(String name,double cgpa,int backlogs){}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();List<Candidate> a=new ArrayList<>();for(int i=0;i<n;i++)a.add(new Candidate(in.next(),in.nextDouble(),in.nextInt()));List<String> names=a.stream().filter(c->c.cgpa()>=7.5&&c.backlogs()==0).map(Candidate::name).sorted().toList();if(names.isEmpty())System.out.println("NONE");else names.forEach(System.out::println);}
}`),
P("expense-summary","Expense Category Summary","Advanced","Summarize transactions by category with stream collectors and print categories alphabetically.",["streams","groupingBy","summing"],"n followed by category and integer amount.","CATEGORY TOTAL for each category alphabetically.","1 <= n <= 100000; amounts may be positive or negative.","6\nFOOD 250\nTRAVEL 600\nFOOD 180\nBOOKS 400\nTRAVEL -100\nBOOKS 75","BOOKS 475\nFOOD 430\nTRAVEL 500","groupingBy can accept a TreeMap supplier and summingInt downstream collector.","Collect directly into a sorted map, combining equal categories in one declarative terminal operation.",`import java.util.*;import java.util.stream.*;
public class Program {
    record Expense(String category,int amount){}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();List<Expense> a=new ArrayList<>();for(int i=0;i<n;i++)a.add(new Expense(in.next(),in.nextInt()));Map<String,Integer> totals=a.stream().collect(Collectors.groupingBy(Expense::category,TreeMap::new,Collectors.summingInt(Expense::amount)));totals.forEach((k,v)->System.out.println(k+" "+v));}
}`),
P("skill-index","Skill Tag Index","Advanced","Create a normalized, duplicate-free skill catalogue from comma-separated candidate tags.",["streams","flatMap","normalization"],"n lines; each contains comma-separated skills.","Lowercase unique skills alphabetically on one comma-separated line.","1 <= n <= 1000; blank tag fragments must be ignored.","3\nJava, SQL, Git\njava, Spring\n SQL , Docker","docker, git, java, spring, sql","Use flatMap after splitting each line and normalize before distinct/sort.","Stream the lines, flatten arrays from split, trim, lowercase, reject blanks, distinct, sort and join.",`import java.util.*;import java.util.stream.*;
public class Program {
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=Integer.parseInt(in.nextLine());List<String> lines=new ArrayList<>();for(int i=0;i<n;i++)lines.add(in.nextLine());String result=lines.stream().flatMap(s->Arrays.stream(s.split(","))).map(String::trim).map(String::toLowerCase).filter(s->!s.isBlank()).distinct().sorted().collect(Collectors.joining(", "));System.out.println(result);}
}`)
]},
{n:10,title:"Files, Text & Time",problems:[
P("log-severity","Log Severity Analyzer","Advanced","Analyze log lines as though they were read from a file, counting INFO, WARN and ERROR prefixes while ignoring unknown lines.",["buffered input","text processing","map"],"n followed by n complete log lines.","INFO, WARN, ERROR and IGNORED counts.","1 <= n <= 100000; a recognized line begins with LEVEL plus a space.","6\nINFO server started\nWARN disk 80%\nERROR timeout\nDEBUG retry\nERROR refused\nINFO ready","INFO 2\nWARN 1\nERROR 2\nIGNORED 1","Read complete lines; check exact prefixes instead of substring presence.","Initialize all counters, classify each line once, and reserve the final else branch for ignored content.",`import java.io.*;import java.util.*;
public class Program {
    public static void main(String[] args)throws Exception{BufferedReader br=new BufferedReader(new InputStreamReader(System.in));int n=Integer.parseInt(br.readLine());Map<String,Integer> c=new LinkedHashMap<>();for(String k:List.of("INFO","WARN","ERROR","IGNORED"))c.put(k,0);for(int i=0;i<n;i++){String line=br.readLine();String key=line.startsWith("INFO ")?"INFO":line.startsWith("WARN ")?"WARN":line.startsWith("ERROR ")?"ERROR":"IGNORED";c.put(key,c.get(key)+1);}c.forEach((k,v)->System.out.println(k+" "+v));}
}`),
P("deadline-clock","Assignment Deadline Clock","Advanced","Given a submission date and due date, report days early, late, or ON TIME using the date API.",["LocalDate","ChronoUnit","date"],"Submission date and deadline as ISO yyyy-MM-dd values.","EARLY d, LATE d, or ON TIME.","Dates are valid ISO dates between 2000 and 2100.","2026-09-08 2026-09-11","EARLY 3","Compute signed days from submission to deadline.","ChronoUnit.DAYS.between(submitted, due) is positive when early and negative when late; classify its sign.",`import java.util.*;import java.time.*;import java.time.temporal.*;
public class Program {
    public static void main(String[] args){Scanner in=new Scanner(System.in);LocalDate submitted=LocalDate.parse(in.next()),due=LocalDate.parse(in.next());long d=ChronoUnit.DAYS.between(submitted,due);System.out.println(d==0?"ON TIME":d>0?"EARLY "+d:"LATE "+(-d));}
}`),
P("report-export","CSV Report Export","Advanced","Convert comma-separated student records into a clean fixed-width report while rejecting malformed rows.",["CSV","formatting","validation"],"n lines in name,score format.","Valid rows as left-aligned name and score; then REJECTED count.","Names contain no commas; valid scores are integers 0..100.","4\nAsha,91\nRavi,eighty\nMeera,76\nKabir,110","Asha       91\nMeera      76\nREJECTED 2","Split with a negative limit so a missing field is not silently dropped.","Validate column count, trimmed name, numeric syntax and score range. Catch row-level failures and continue exporting.",`import java.io.*;
public class Program {
    public static void main(String[] args)throws Exception{BufferedReader br=new BufferedReader(new InputStreamReader(System.in));int n=Integer.parseInt(br.readLine()),bad=0;StringBuilder out=new StringBuilder();for(int i=0;i<n;i++){String[] p=br.readLine().split(",",-1);try{if(p.length!=2||p[0].trim().isEmpty())throw new IllegalArgumentException();int score=Integer.parseInt(p[1].trim());if(score<0||score>100)throw new IllegalArgumentException();out.append(String.format("%-10s %d%n",p[0].trim(),score));}catch(Exception e){bad++;}}System.out.print(out);System.out.println("REJECTED "+bad);}
}`)
]},
{n:11,title:"Concurrency & JVM",problems:[
P("atomic-visitors","Atomic Visitor Counter","Advanced","Several worker threads record page visits. Produce an exact total without lost updates.",["threads","AtomicInteger","join"],"Thread count and increments per thread.","Expected and actual totals.","1 <= threads <= 32; 0 <= increments <= 100000.","4 25000","Expected: 100000\nActual: 100000","Use AtomicInteger.incrementAndGet and wait for every worker with join.","Create the threads, start them, then join them before reading the counter. Atomic operations make each increment indivisible.",`import java.util.*;import java.util.concurrent.atomic.*;
public class Program {
    public static void main(String[] args)throws Exception{Scanner in=new Scanner(System.in);int n=in.nextInt(),times=in.nextInt();AtomicInteger count=new AtomicInteger();List<Thread> workers=new ArrayList<>();for(int i=0;i<n;i++)workers.add(new Thread(()->{for(int j=0;j<times;j++)count.incrementAndGet();}));workers.forEach(Thread::start);for(Thread t:workers)t.join();System.out.println("Expected: "+(n*times));System.out.println("Actual: "+count.get());}
}`),
P("ordered-futures","Ordered Future Results","Advanced","Tasks may finish in any order, but a report must print squared results in submission order.",["ExecutorService","Future","ordering"],"n followed by n integers.","Their squares in original order on one line.","1 <= n <= 1000; absolute value <= 30000.","5\n4 1 7 3 2","16 1 49 9 4","Store Future objects in submission order and call get in that same order.","A fixed pool executes independently. The future list provides deterministic reporting even though completion order may vary.",`import java.util.*;import java.util.concurrent.*;
public class Program {
    public static void main(String[] args)throws Exception{Scanner in=new Scanner(System.in);int n=in.nextInt();ExecutorService pool=Executors.newFixedThreadPool(Math.min(4,n));List<Future<Integer>> jobs=new ArrayList<>();for(int i=0;i<n;i++){int x=in.nextInt();jobs.add(pool.submit(()->x*x));}pool.shutdown();for(int i=0;i<n;i++){if(i>0)System.out.print(" ");System.out.print(jobs.get(i).get());}System.out.println();}
}`),
P("bounded-handoff","Bounded Task Handoff","Placement","A producer hands numbered tasks to a consumer through a bounded blocking queue, then sends a sentinel to stop safely.",["BlockingQueue","producer consumer","sentinel"],"Task count and queue capacity.","Processed task IDs in order, then a count.","0 <= tasks <= 1000; 1 <= capacity <= 100.","5 2","Processed: 1 2 3 4 5\nCount: 5","ArrayBlockingQueue handles waiting; choose a sentinel outside valid task IDs.","Producer puts 1..n and -1. Consumer takes until -1. Joining both establishes completion before printing.",`import java.util.*;import java.util.concurrent.*;
public class Program {
    public static void main(String[] args)throws Exception{Scanner in=new Scanner(System.in);int n=in.nextInt(),cap=in.nextInt();BlockingQueue<Integer> q=new ArrayBlockingQueue<>(cap);List<Integer> done=Collections.synchronizedList(new ArrayList<>());Thread producer=new Thread(()->{try{for(int i=1;i<=n;i++)q.put(i);q.put(-1);}catch(InterruptedException e){Thread.currentThread().interrupt();}});Thread consumer=new Thread(()->{try{for(;;){int x=q.take();if(x==-1)break;done.add(x);}}catch(InterruptedException e){Thread.currentThread().interrupt();}});producer.start();consumer.start();producer.join();consumer.join();System.out.print("Processed:");for(int x:done)System.out.print(" "+x);System.out.println();System.out.println("Count: "+done.size());}
}`)
]},
{n:12,title:"JDBC, Testing & Placement",problems:[
P("prepared-lookup","Prepared Student Lookup","Placement","Construct a safe parameterized lookup plan instead of concatenating an untrusted student ID into SQL.",["JDBC","PreparedStatement","security"],"One student ID string.","The SQL template and bound parameter.","ID length is 1..50 and may contain punctuation.","CB' OR '1'='1","SQL: SELECT name, cgpa FROM students WHERE student_id = ?\nPARAM 1: CB' OR '1'='1","Keep data out of the SQL string; the driver receives it through setString.","This offline exercise prints the plan. In JDBC, prepare the constant SQL, call setString(1,id), then executeQuery.",`import java.util.*;
public class Program {
    public static void main(String[] args){String id=new Scanner(System.in).nextLine();String sql="SELECT name, cgpa FROM students WHERE student_id = ?";System.out.println("SQL: "+sql);System.out.println("PARAM 1: "+id);}
}`),
P("transfer-tests","Atomic Transfer Validator","Placement","Implement a money transfer whose invariant is preserved: no negative amount, no overdraft, and no partial balance change.",["service design","invariant","testing"],"Source balance, target balance and transfer amount.","Either OK with balances or REJECTED with unchanged balances.","Balances and amount are integer units; balances start non-negative.","900 250 1000","REJECTED\nSource: 900\nTarget: 250","Validate every precondition before changing either account.","Place transfer logic in one method. Only after validation passes should it debit source and credit target, making failure atomic.",`import java.util.*;
public class Program {
    static class Account{int balance;Account(int b){balance=b;}}static boolean transfer(Account from,Account to,int amount){if(amount<=0||from.balance<amount)return false;from.balance-=amount;to.balance+=amount;return true;}
    public static void main(String[] args){Scanner in=new Scanner(System.in);Account a=new Account(in.nextInt()),b=new Account(in.nextInt());boolean ok=transfer(a,b,in.nextInt());System.out.println(ok?"OK":"REJECTED");System.out.println("Source: "+a.balance);System.out.println("Target: "+b.balance);}
}`),
P("placement-service","Placement Record Service","Placement","Design a repository-backed service that returns eligible students without tying business logic to a database implementation.",["repository pattern","dependency injection","records"],"n followed by name, CGPA and backlog count.","Eligible names sorted by CGPA descending, then name.","Eligible means CGPA >= 7.0 and zero backlogs; 1 <= n <= 10000.","5\nAsha 8.2 0\nRavi 7.1 1\nMeera 8.2 0\nKabir 6.9 0\nZoya 9.0 0","Zoya\nAsha\nMeera","Inject a repository interface into the service and keep filtering in the service layer.","An in-memory repository stands in for JDBC. The service applies rules and deterministic sorting, so both parts can be tested independently.",`import java.util.*;
public class Program {
    record Student(String name,double cgpa,int backlogs){}interface Repository{List<Student> findAll();}static class MemoryRepository implements Repository{private final List<Student> data;MemoryRepository(List<Student> d){data=List.copyOf(d);}public List<Student> findAll(){return data;}}static class PlacementService{private final Repository repo;PlacementService(Repository r){repo=r;}List<Student> eligible(){return repo.findAll().stream().filter(s->s.cgpa()>=7&&s.backlogs()==0).sorted(Comparator.comparingDouble(Student::cgpa).reversed().thenComparing(Student::name)).toList();}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();List<Student> data=new ArrayList<>();for(int i=0;i<n;i++)data.add(new Student(in.next(),in.nextDouble(),in.nextInt()));new PlacementService(new MemoryRepository(data)).eligible().forEach(s->System.out.println(s.name()));}
}`)
]},
{n:2,title:"Decisions & Loops",problems:[
P("scholarship-gate","Scholarship Gate","Foundation","A scholarship requires both strong academics and attendance, but an exceptional exam score can override attendance.",["if","boolean logic","rules"],"Score and attendance percentage as integers.","ELIGIBLE or NOT ELIGIBLE.","0 <= score, attendance <= 100. Eligible when score >= 80 and attendance >= 75, or score >= 95.","96 62","ELIGIBLE","Translate the sentence into two parenthesized boolean conditions.","Name the normal and exceptional routes, combine them with OR, and print exactly one verdict.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        Scanner in=new Scanner(System.in); int score=in.nextInt(), attendance=in.nextInt();
        boolean eligible=(score>=80 && attendance>=75)||score>=95;
        System.out.println(eligible?"ELIGIBLE":"NOT ELIGIBLE");
    }
}`),
P("token-checksum","Festival Token Checksum","Foundation","Volunteers validate a positive token number using the sum of its digits and the number of digits.",["while","digits","accumulator"],"One positive long integer.","DIGITS d, SUM s, CHECK c where c = d * s.","1 <= token <= 10^18 - 1.","507204","DIGITS 6\nSUM 18\nCHECK 108","Repeatedly take n % 10, then remove that digit with n / 10.","Preserve a working copy, update count and sum in one loop, then calculate the checksum.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        long n=new Scanner(System.in).nextLong(); int digits=0,sum=0;
        while(n>0){sum+=(int)(n%10);digits++;n/=10;}
        System.out.printf("DIGITS %d%nSUM %d%nCHECK %d%n",digits,sum,digits*sum);
    }
}`),
P("bus-fare","Smart Bus Fare","Intermediate","A city charges by distance slabs: the first 5 km cost 10 per km, the next 10 cost 8, and remaining kilometres cost 6.",["loops","slabs","arithmetic"],"One integer distance in kilometres.","Total fare as an integer.","1 <= distance <= 500; each started kilometre is already represented as an integer.","22","Fare: 172","Charge only the portion of distance that belongs to each slab.","Use Math.min for the first two slabs and Math.max for the remainder; this avoids a per-kilometre loop.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        int km=new Scanner(System.in).nextInt();
        int fare=Math.min(km,5)*10+Math.min(Math.max(km-5,0),10)*8+Math.max(km-15,0)*6;
        System.out.println("Fare: "+fare);
    }
}`)
]},
{n:3,title:"Arrays & Strings",problems:[
P("attendance-streak","Attendance Streak","Intermediate","An attendance string uses P for present and A for absent. Find the longest uninterrupted present streak.",["string","scan","maximum"],"One uppercase string containing only P and A.","Length of the longest P streak.","1 <= length <= 100000.","APPPPPAPPP","Longest streak: 5","Reset the current count on A, but never reset the best count.","Scan once. Extend current on P and update best; otherwise set current to zero. Time O(n), space O(1).",`import java.util.*;
public class Program {
    public static void main(String[] args){
        String s=new Scanner(System.in).next(); int best=0,current=0;
        for(char c:s.toCharArray()){current=c=='P'?current+1:0;best=Math.max(best,current);}
        System.out.println("Longest streak: "+best);
    }
}`),
P("second-distinct","Second Distinct Score","Intermediate","A leaderboard needs the second-highest distinct score; duplicate top scores must not consume second place.",["array","maximum","edge case"],"n followed by n integer scores.","The second-highest distinct score, or NONE.","1 <= n <= 100000; scores fit in int.","7\n8 12 12 4 9 9 3","Second: 9","Track two distinct values; ignore a value equal to the current maximum.","Maintain largest and second using nullable Integer values. Each score updates at most two variables.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        Scanner in=new Scanner(System.in); int n=in.nextInt(); Integer first=null,second=null;
        for(int i=0;i<n;i++){int x=in.nextInt();if(first==null||x>first){if(first==null||x!=first){second=first;first=x;}}else if(x<first&&(second==null||x>second))second=x;}
        System.out.println(second==null?"NONE":"Second: "+second);
    }
}`),
P("notice-rotation","Circular Notice Board","Intermediate","A digital notice board rotates words to the right so the last k announcements appear first.",["arrays","rotation","modulo"],"n and k, followed by n single-word announcements.","The right-rotated sequence on one line.","1 <= n <= 100000; 0 <= k <= 10^9.","5 2\nexam lab sports fees holiday","fees holiday exam lab sports","Normalize k with modulo n before mapping output positions.","The item displayed at position i originally lived at (i - k + n) % n. Print directly without another array.",`import java.util.*;
public class Program {
    public static void main(String[] args){
        Scanner in=new Scanner(System.in);int n=in.nextInt(),k=in.nextInt()%n;String[] a=new String[n];
        for(int i=0;i<n;i++)a[i]=in.next();
        for(int i=0;i<n;i++){if(i>0)System.out.print(" ");System.out.print(a[(i-k+n)%n]);}
        System.out.println();
    }
}`)
]},
{n:4,title:"Methods & Recursion",problems:[
P("recursive-locker","Recursive Locker Code","Intermediate","A locker verifies a code by recursively summing its digits until only one digit remains.",["recursion","methods","digits"],"One non-negative long integer.","Its digital root.","0 <= number <= 10^18 - 1.","98756","Digital root: 8","Create one recursive method for digit sum and another recursive step for repeated reduction.","Base case: values below 10. Otherwise compute a digit sum recursively and call the reduction again.",`import java.util.*;
public class Program {
    static long sum(long n){return n==0?0:n%10+sum(n/10);}
    static long root(long n){return n<10?n:root(sum(n));}
    public static void main(String[] args){System.out.println("Digital root: "+root(new Scanner(System.in).nextLong()));}
}`),
P("helpdesk-search","Help-Desk Binary Search","Intermediate","Sorted ticket IDs are stored in an array. Report the zero-based position of a requested ID without scanning every entry.",["binary search","method","array"],"n, n sorted distinct IDs, then the target.","Index i or NOT FOUND.","1 <= n <= 200000; IDs fit in int.","6\n101 108 115 121 140 188\n121","Index: 3","Compare at the middle and discard the half that cannot contain the target.","Use an iterative binary-search method with inclusive low and high bounds. Complexity is O(log n).",`import java.util.*;
public class Program {
    static int find(int[] a,int target){int lo=0,hi=a.length-1;while(lo<=hi){int mid=lo+(hi-lo)/2;if(a[mid]==target)return mid;if(a[mid]<target)lo=mid+1;else hi=mid-1;}return -1;}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();int[] a=new int[n];for(int i=0;i<n;i++)a[i]=in.nextInt();int p=find(a,in.nextInt());System.out.println(p<0?"NOT FOUND":"Index: "+p);}
}`),
P("grade-toolkit","Modular Grade Toolkit","Intermediate","A result service separates average calculation from grade classification so each rule can be tested independently.",["methods","average","classification"],"n followed by n marks.","Average to two decimals and grade A/B/C/D/F.","1 <= n <= 100; 0 <= each mark <= 100. Cutoffs: 90, 75, 60, 50.","5\n72 88 91 67 82","Average: 80.00\nGrade: B","Write average and grade as separate pure methods.","Sum with a double-capable return, classify with descending cutoffs, and keep main responsible only for input/output.",`import java.util.*;
public class Program {
    static double average(int[] marks){long sum=0;for(int x:marks)sum+=x;return (double)sum/marks.length;}
    static char grade(double x){if(x>=90)return 'A';if(x>=75)return 'B';if(x>=60)return 'C';if(x>=50)return 'D';return 'F';}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=in.nextInt();int[] a=new int[n];for(int i=0;i<n;i++)a[i]=in.nextInt();double avg=average(a);System.out.printf("Average: %.2f%nGrade: %c%n",avg,grade(avg));}
}`)
]},
{n:5,title:"Object-Oriented Design",problems:[
P("wallet-rules","Wallet With Rules","Intermediate","Model a wallet that rejects negative deposits and withdrawals that exceed the available balance.",["encapsulation","class","validation"],"Initial balance, deposit amount and withdrawal amount.","Final balance, or ERROR followed by the unchanged balance when an operation fails.","All values are whole currency units from -100000 to 100000.","500 250 900","ERROR\nBalance: 750","Keep balance private and expose operations that return success or failure.","Construct only with a non-negative balance. Apply deposit first, then withdrawal, printing ERROR for the failed operation.",`import java.util.*;
public class Program {
    static class Wallet{private int balance;Wallet(int b){if(b<0)throw new IllegalArgumentException();balance=b;}boolean deposit(int x){if(x<0)return false;balance+=x;return true;}boolean withdraw(int x){if(x<0||x>balance)return false;balance-=x;return true;}int balance(){return balance;}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);Wallet w=new Wallet(in.nextInt());boolean ok=w.deposit(in.nextInt());ok=w.withdraw(in.nextInt())&&ok;if(!ok)System.out.println("ERROR");System.out.println("Balance: "+w.balance());}
}`),
P("book-lifecycle","Library Book Lifecycle","Intermediate","A book can be borrowed only while available and returned only while borrowed. Process a sequence of commands through the object.",["state","class","commands"],"n followed by n commands: BORROW, RETURN or STATUS.","For actions print OK or REJECTED; for STATUS print AVAILABLE or BORROWED.","1 <= n <= 100; commands are uppercase.","5\nSTATUS\nBORROW\nBORROW\nRETURN\nSTATUS","AVAILABLE\nOK\nREJECTED\nOK\nAVAILABLE","Represent availability with one private boolean; let methods enforce transitions.","The object owns its invariant. Main translates commands into method calls and never modifies state directly.",`import java.util.*;
public class Program {
    static class Book{private boolean available=true;boolean borrow(){if(!available)return false;available=false;return true;}boolean giveBack(){if(available)return false;available=true;return true;}String status(){return available?"AVAILABLE":"BORROWED";}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);int n=Integer.parseInt(in.nextLine());Book b=new Book();for(int i=0;i<n;i++){String c=in.nextLine();if(c.equals("BORROW"))System.out.println(b.borrow()?"OK":"REJECTED");else if(c.equals("RETURN"))System.out.println(b.giveBack()?"OK":"REJECTED");else System.out.println(b.status());}}
}`),
P("immutable-registration","Immutable Registration","Advanced","Create an immutable registration value, then apply a requested course change by producing a new value rather than mutating the original.",["immutability","record","validation"],"Student ID, old course, and new course on separate lines.","Original and updated registrations.","Text fields are non-empty. Use a Java record with constructor validation.","CB2408\nJAVA\nDSA","Original: CB2408 -> JAVA\nUpdated: CB2408 -> DSA","A record is immutable; add a method that returns a new record with the changed course.","Validate canonical constructor arguments, implement withCourse, and prove the original reference remains unchanged.",`import java.util.*;
public class Program {
    record Registration(String studentId,String course){Registration{if(studentId.isBlank()||course.isBlank())throw new IllegalArgumentException();}Registration withCourse(String next){return new Registration(studentId,next);}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);Registration old=new Registration(in.nextLine(),in.nextLine());Registration updated=old.withCourse(in.nextLine());System.out.println("Original: "+old.studentId()+" -> "+old.course());System.out.println("Updated: "+updated.studentId()+" -> "+updated.course());}
}`)
]},
{n:6,title:"Inheritance & Interfaces",problems:[
P("notification-channels","Notification Channels","Advanced","Send one message through configurable email and SMS channels using a common contract.",["interface","polymorphism","strategy"],"Channel EMAIL or SMS, then recipient and message on separate lines.","A channel-specific delivery sentence.","Message and recipient are non-empty.","SMS\n9876543210\nLab starts at 9","SMS to 9876543210: Lab starts at 9","Define a Notification interface and choose an implementation without changing the send call.","Both classes implement the same method. A factory-style conditional creates the required implementation; polymorphism handles delivery.",`import java.util.*;
public class Program {
    interface Notification{void send(String to,String message);}static class Email implements Notification{public void send(String t,String m){System.out.println("Email to "+t+": "+m);}}static class Sms implements Notification{public void send(String t,String m){System.out.println("SMS to "+t+": "+m);}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);String type=in.nextLine(),to=in.nextLine(),message=in.nextLine();Notification n=type.equals("EMAIL")?new Email():new Sms();n.send(to,message);}
}`),
P("pay-policies","Employee Pay Policies","Advanced","Permanent and contract employees calculate pay differently while sharing a common employee abstraction.",["abstract class","override","polymorphism"],"Type PERMANENT with monthly salary, or CONTRACT with hours and hourly rate.","Pay rounded to two decimals.","Salary, hours and rate are non-negative.","CONTRACT 42 650","Pay: 27300.00","Put identity/common behavior in an abstract base and calculation in subclasses.","Define abstract pay(). Construct the appropriate subtype from the type token, then call pay through the base reference.",`import java.util.*;
public class Program {
    static abstract class Employee{abstract double pay();}static class Permanent extends Employee{double salary;Permanent(double s){salary=s;}double pay(){return salary;}}static class Contract extends Employee{double hours,rate;Contract(double h,double r){hours=h;rate=r;}double pay(){return hours*rate;}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);String type=in.next();Employee e=type.equals("PERMANENT")?new Permanent(in.nextDouble()):new Contract(in.nextDouble(),in.nextDouble());System.out.printf("Pay: %.2f%n",e.pay());}
}`),
P("fare-strategy","Transport Fare Strategy","Advanced","A trip planner applies different fare formulas for BUS and METRO without scattering transport-specific conditionals.",["strategy","interface","open closed"],"Mode and integer distance in kilometres.","Calculated fare as an integer.","1 <= distance <= 500. BUS = 12 + 5/km; METRO = 20 + 4/km.","METRO 18","Fare: 92","Represent the changing algorithm with a functional interface.","Select one FarePolicy implementation at the boundary and call the same fare method afterward. New modes can be added independently.",`import java.util.*;
public class Program {
    interface FarePolicy{int fare(int km);}static class Bus implements FarePolicy{public int fare(int km){return 12+5*km;}}static class Metro implements FarePolicy{public int fare(int km){return 20+4*km;}}
    public static void main(String[] args){Scanner in=new Scanner(System.in);String mode=in.next();int km=in.nextInt();FarePolicy p=mode.equals("BUS")?new Bus():new Metro();System.out.println("Fare: "+p.fare(km));}
}`)
]}
];
