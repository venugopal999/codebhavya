import java.util.concurrent.*;
class Main{public static void main(String[] args){CompletableFuture<Integer> future=CompletableFuture.completedFuture(20).thenApply(value->value+22);System.out.println(future.join());}}
