"use strict";

const { cMain, clean, makeProgram } = require("./helpers");

module.exports = [
  makeProgram({
    slug: "call-by-value-demo",
    title: "Demonstrate Call by Value",
    topic: "Functions, Preprocessor & Command Line",
    concepts: ["Functions", "Value parameters", "Local copies"],
    source: cMain(`    int first = 10, second = 20;
    swap_copies(first, second);
    printf("After call: %d %d\\n", first, second);
    return 0;`, ["stdio.h"], `void swap_copies(int first, int second)
{
    int temporary = first;
    first = second;
    second = temporary;
    printf("Inside function: %d %d\\n", first, second);
}`),
    sampleInput: "No input required",
    sampleOutput: "Inside function: 20 10\nAfter call: 10 20",
    method: "Pass copies into the function and observe that changing them does not change the caller's variables."
  }),
  makeProgram({
    slug: "call-by-reference-pointers",
    title: "Simulate Call by Reference Using Pointers",
    topic: "Functions, Preprocessor & Command Line",
    concepts: ["Pointer parameters", "Address operator", "Dereference"],
    source: cMain(`    int first = 10, second = 20;
    swap_values(&first, &second);
    printf("After call: %d %d\\n", first, second);
    return 0;`, ["stdio.h"], `void swap_values(int *first, int *second)
{
    int temporary = *first;
    *first = *second;
    *second = temporary;
}`),
    sampleInput: "No input required",
    sampleOutput: "After call: 20 10",
    method: "Pass variable addresses so the function can modify the original values through dereferencing."
  }),
  makeProgram({
    slug: "return-structure-from-function",
    title: "Return a Structure from a Function",
    topic: "Functions, Preprocessor & Command Line",
    difficulty: "Intermediate",
    concepts: ["Structure return", "Factory function", "Member access"],
    source: cMain(`    struct Point point = create_point(4, 7);
    printf("Point = (%d, %d)\\n", point.x, point.y);
    return 0;`, ["stdio.h"], `struct Point { int x; int y; };

struct Point create_point(int x, int y)
{
    struct Point result = {x, y};
    return result;
}`),
    sampleInput: "No input required",
    sampleOutput: "Point = (4, 7)",
    method: "Construct a complete structure inside a function and return it by value to the caller."
  }),
  makeProgram({
    slug: "variadic-function-sum",
    title: "Add Values Using a Variadic Function",
    topic: "Functions, Preprocessor & Command Line",
    difficulty: "Advanced",
    concepts: ["stdarg.h", "Variable arguments", "va_list"],
    source: cMain(`    printf("Sum = %d\\n", sum_values(5, 4, 8, 15, 16, 23));
    return 0;`, ["stdio.h", "stdarg.h"], `int sum_values(int count, ...)
{
    va_list arguments;
    va_start(arguments, count);
    int sum = 0;
    for (int index = 0; index < count; index++) sum += va_arg(arguments, int);
    va_end(arguments);
    return sum;
}`),
    sampleInput: "No input required",
    sampleOutput: "Sum = 66",
    time: "O(n)",
    method: "Receive a count followed by that many integer arguments and visit each with va_arg."
  }),
  makeProgram({
    slug: "function-pointer-calculator",
    title: "Build a Calculator Using Function Pointers",
    topic: "Functions, Preprocessor & Command Line",
    difficulty: "Advanced",
    concepts: ["Function pointer", "Callback", "Indirect call"],
    source: cMain(`    int choice, first, second;
    int (*operation)(int, int) = NULL;
    printf("1. Add  2. Subtract: ");
    scanf("%d", &choice);
    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    if (choice == 1) operation = add;
    else if (choice == 2) operation = subtract;
    else { puts("Invalid choice."); return 0; }
    printf("Result = %d\\n", operation(first, second));
    return 0;`, ["stdio.h", "stddef.h"], `int add(int first, int second) { return first + second; }
int subtract(int first, int second) { return first - second; }`),
    sampleInput: "1\n14 9",
    sampleOutput: "Result = 23",
    method: "Store the selected function's address in a compatible pointer and invoke it indirectly."
  }),
  makeProgram({
    slug: "macro-square",
    title: "Calculate a Square Using a Function-like Macro",
    topic: "Functions, Preprocessor & Command Line",
    concepts: ["#define", "Macro parameter", "Parentheses"],
    source: cMain(`    int number;
    printf("Enter an integer: ");
    scanf("%d", &number);
    printf("Square = %d\\n", SQUARE(number));
    return 0;`, ["stdio.h"], `#define SQUARE(value) ((value) * (value))`),
    sampleInput: "12",
    sampleOutput: "Square = 144",
    method: "Define a parameterized text substitution and parenthesize every use to preserve expression order."
  }),
  makeProgram({
    slug: "macro-maximum",
    title: "Find a Maximum Using a Function-like Macro",
    topic: "Functions, Preprocessor & Command Line",
    concepts: ["#define", "Conditional operator", "Macro safety"],
    source: cMain(`    int first, second;
    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    printf("Maximum = %d\\n", MAXIMUM(first, second));
    return 0;`, ["stdio.h"], `#define MAXIMUM(first, second) ((first) > (second) ? (first) : (second))`),
    sampleInput: "28 19",
    sampleOutput: "Maximum = 28",
    method: "Use a fully parenthesized macro expression to select the larger argument."
  }),
  makeProgram({
    slug: "conditional-compilation",
    title: "Use Conditional Compilation for Debug Output",
    topic: "Functions, Preprocessor & Command Line",
    difficulty: "Intermediate",
    concepts: ["#ifdef", "Compile-time flag", "Debug build"],
    source: cMain(`    int result = 7 * 6;
#ifdef DEBUG_MODE
    printf("Debug: result was calculated.\\n");
#endif
    printf("Result = %d\\n", result);
    return 0;`, ["stdio.h"], `#define DEBUG_MODE`),
    sampleInput: "No input required",
    sampleOutput: "Debug: result was calculated.\nResult = 42",
    method: "Define a compile-time symbol and include diagnostic statements only while that symbol exists."
  }),
  makeProgram({
    slug: "command-line-arguments",
    title: "Read Command-Line Arguments",
    topic: "Functions, Preprocessor & Command Line",
    difficulty: "Intermediate",
    concepts: ["argc", "argv", "main parameters"],
    source: clean(`#include <stdio.h>

int main(int argc, char *argv[])
{
    if (argc == 1) {
        puts("No command-line arguments supplied.");
        return 0;
    }
    printf("Argument count = %d\\n", argc - 1);
    for (int index = 1; index < argc; index++)
        printf("Argument %d = %s\\n", index, argv[index]);
    return 0;
}`),
    sampleInput: "No input required",
    sampleOutput: "No command-line arguments supplied.",
    time: "O(n)",
    method: "Use argc for the number of tokens and argv for the string stored at each command-line position."
  }),
  makeProgram({
    slug: "static-local-counter",
    title: "Preserve Function State with a static Local Variable",
    topic: "Functions, Preprocessor & Command Line",
    concepts: ["static local", "Storage duration", "Function calls"],
    source: cMain(`    visit();
    visit();
    visit();
    return 0;`, ["stdio.h"], `void visit(void)
{
    static int count = 0;
    count++;
    printf("Visit %d\\n", count);
}`),
    sampleInput: "No input required",
    sampleOutput: "Visit 1\nVisit 2\nVisit 3",
    method: "Initialize a static local variable once and observe that its value survives later function calls."
  }),

  makeProgram({
    slug: "pointer-to-pointer",
    title: "Access a Value Through a Pointer to a Pointer",
    topic: "Pointers & Dynamic Memory",
    concepts: ["Double pointer", "Dereference", "Address"],
    source: cMain(`    int value = 42;
    int *pointer = &value;
    int **double_pointer = &pointer;
    printf("Value = %d\\n", **double_pointer);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Value = 42",
    method: "Store the address of a pointer and dereference twice to reach the original integer."
  }),
  makeProgram({
    slug: "traverse-array-with-pointer",
    title: "Traverse an Array Using a Pointer",
    topic: "Pointers & Dynamic Memory",
    concepts: ["Pointer arithmetic", "Array decay", "Traversal"],
    source: cMain(`    int values[] = {3, 6, 9, 12, 15};
    int *pointer = values;
    size_t length = sizeof values / sizeof values[0];
    for (size_t index = 0; index < length; index++) printf("%d ", *(pointer + index));
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "3 6 9 12 15",
    time: "O(n)",
    method: "Move by element-sized pointer offsets and dereference each resulting address."
  }),
  makeProgram({
    slug: "array-of-string-pointers",
    title: "Store Strings in an Array of Pointers",
    topic: "Pointers & Dynamic Memory",
    concepts: ["Array of pointers", "String literals", "const"],
    source: cMain(`    const char *languages[] = {"C", "Python", "Java"};
    size_t count = sizeof languages / sizeof languages[0];
    for (size_t index = 0; index < count; index++) puts(languages[index]);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "C\nPython\nJava",
    time: "O(n)",
    method: "Store one pointer to the first character of each string literal and iterate over those pointers."
  }),
  makeProgram({
    slug: "calloc-array-average",
    title: "Allocate a Zero-Initialized Array with calloc()",
    topic: "Pointers & Dynamic Memory",
    difficulty: "Intermediate",
    concepts: ["calloc()", "Dynamic array", "free()"],
    source: cMain(`    size_t count;
    printf("Enter number of values: ");
    scanf("%zu", &count);
    if (count == 0) { puts("Count must be positive."); return 0; }
    double *values = calloc(count, sizeof *values);
    if (values == NULL) { puts("Allocation failed."); return 1; }
    double sum = 0;
    printf("Enter values: ");
    for (size_t index = 0; index < count; index++) {
        scanf("%lf", &values[index]);
        sum += values[index];
    }
    printf("Average = %.2f\\n", sum / (double) count);
    free(values);
    return 0;`, ["stdio.h", "stdlib.h"]),
    sampleInput: "4\n6 8 10 12",
    sampleOutput: "Average = 9.00",
    time: "O(n)",
    space: "O(n)",
    method: "Allocate cleared storage for the requested count, calculate the average and release the block."
  }),
  makeProgram({
    slug: "dynamic-two-dimensional-array",
    title: "Create a Dynamic Two-Dimensional Array",
    topic: "Pointers & Dynamic Memory",
    difficulty: "Advanced",
    concepts: ["Pointer to pointer", "malloc()", "Dynamic matrix"],
    source: cMain(`    size_t rows, columns;
    printf("Enter rows and columns: ");
    scanf("%zu %zu", &rows, &columns);
    int **matrix = malloc(rows * sizeof *matrix);
    if (matrix == NULL) return 1;
    for (size_t row = 0; row < rows; row++) {
        matrix[row] = malloc(columns * sizeof *matrix[row]);
        if (matrix[row] == NULL) {
            while (row > 0) free(matrix[--row]);
            free(matrix);
            return 1;
        }
    }
    int sum = 0;
    printf("Enter matrix elements: ");
    for (size_t row = 0; row < rows; row++)
        for (size_t column = 0; column < columns; column++) {
            scanf("%d", &matrix[row][column]);
            sum += matrix[row][column];
        }
    printf("Sum = %d\\n", sum);
    for (size_t row = 0; row < rows; row++) free(matrix[row]);
    free(matrix);
    return 0;`, ["stdio.h", "stdlib.h"]),
    sampleInput: "2 2\n1 2\n3 4",
    sampleOutput: "Sum = 10",
    time: "O(rows × columns)",
    space: "O(rows × columns)",
    method: "Allocate an array of row pointers, allocate every row, use the matrix, and free every allocation."
  }),
  makeProgram({
    slug: "sort-dynamic-array",
    title: "Sort a Dynamically Allocated Array",
    topic: "Pointers & Dynamic Memory",
    difficulty: "Intermediate",
    concepts: ["malloc()", "Pointer indexing", "Bubble sort"],
    source: cMain(`    size_t count;
    printf("Enter array size: ");
    scanf("%zu", &count);
    int *values = malloc(count * sizeof *values);
    if (values == NULL && count != 0) return 1;
    printf("Enter elements: ");
    for (size_t index = 0; index < count; index++) scanf("%d", &values[index]);
    for (size_t pass = 0; pass < count; pass++)
        for (size_t index = 0; index + 1 < count - pass; index++)
            if (values[index] > values[index + 1]) {
                int temporary = values[index];
                values[index] = values[index + 1];
                values[index + 1] = temporary;
            }
    printf("Sorted: ");
    for (size_t index = 0; index < count; index++) printf("%d ", values[index]);
    putchar('\\n');
    free(values);
    return 0;`, ["stdio.h", "stdlib.h"]),
    sampleInput: "5\n9 2 7 1 4",
    sampleOutput: "Sorted: 1 2 4 7 9",
    time: "O(n²)",
    space: "O(n)",
    method: "Allocate exactly the requested storage, sort through indexed pointer access, then free it."
  }),
  makeProgram({
    slug: "reverse-string-with-pointers",
    title: "Reverse a String Using Pointers",
    topic: "Pointers & Dynamic Memory",
    difficulty: "Intermediate",
    concepts: ["Character pointers", "Two-pointer method", "strlen()"],
    source: cMain(`    char text[100];
    printf("Enter text: ");
    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    char *left = text;
    char *right = text + strlen(text);
    if (right != left) right--;
    while (left < right) {
        char temporary = *left;
        *left++ = *right;
        *right-- = temporary;
    }
    printf("Reversed = %s\\n", text);
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "CodeBhavya",
    sampleOutput: "Reversed = ayvahBedoC",
    time: "O(n)",
    method: "Point at both ends of the mutable string and exchange characters while the pointers move inward."
  }),
  makeProgram({
    slug: "pointer-difference",
    title: "Calculate the Difference Between Two Array Pointers",
    topic: "Pointers & Dynamic Memory",
    concepts: ["ptrdiff_t", "Pointer subtraction", "Array positions"],
    source: cMain(`    int values[] = {10, 20, 30, 40, 50};
    int *first = &values[1];
    int *second = &values[4];
    ptrdiff_t distance = second - first;
    printf("Element distance = %td\\n", distance);
    return 0;`, ["stdio.h", "stddef.h"]),
    sampleInput: "No input required",
    sampleOutput: "Element distance = 3",
    method: "Subtract pointers into the same array to obtain their distance measured in elements."
  }),

  makeProgram({
    slug: "array-of-student-structures",
    title: "Store Multiple Student Records in an Array of Structures",
    topic: "Structures, Unions & Enums",
    difficulty: "Intermediate",
    concepts: ["Structure array", "Records", "Loop"],
    source: cMain(`    struct Student students[3];
    for (int index = 0; index < 3; index++)
        scanf("%19s %d", students[index].name, &students[index].marks);
    for (int index = 0; index < 3; index++)
        printf("%s: %d\\n", students[index].name, students[index].marks);
    return 0;`, ["stdio.h"], `struct Student { char name[20]; int marks; };`),
    sampleInput: "Anu 86\nRavi 91\nMeena 88",
    sampleOutput: "Anu: 86\nRavi: 91\nMeena: 88",
    time: "O(n)",
    space: "O(n)",
    method: "Use one structure element per student and process the record array with loops."
  }),
  makeProgram({
    slug: "nested-structure-date",
    title: "Use a Nested Structure for an Employee Joining Date",
    topic: "Structures, Unions & Enums",
    concepts: ["Nested structure", "Composition", "Member access"],
    source: cMain(`    struct Employee employee = {101, "Bhavya", {9, 9, 2026}};
    printf("%d %s joined on %02d-%02d-%d\\n", employee.id, employee.name,
           employee.joined.day, employee.joined.month, employee.joined.year);
    return 0;`, ["stdio.h"], `struct Date { int day, month, year; };
struct Employee { int id; char name[20]; struct Date joined; };`),
    sampleInput: "No input required",
    sampleOutput: "101 Bhavya joined on 09-09-2026",
    method: "Embed a Date structure inside an Employee structure and access members through both levels."
  }),
  makeProgram({
    slug: "structure-pointer-arrow",
    title: "Access Structure Members Through a Pointer",
    topic: "Structures, Unions & Enums",
    concepts: ["Structure pointer", "Arrow operator", "Address"],
    source: cMain(`    struct Book book = {"C Fundamentals", 450.0};
    struct Book *pointer = &book;
    printf("%s costs %.2f\\n", pointer->title, pointer->price);
    return 0;`, ["stdio.h"], `struct Book { char title[40]; double price; };`),
    sampleInput: "No input required",
    sampleOutput: "C Fundamentals costs 450.00",
    method: "Store the structure address and use the arrow operator to reach its members."
  }),
  makeProgram({
    slug: "typedef-structure",
    title: "Create a Structure Alias Using typedef",
    topic: "Structures, Unions & Enums",
    concepts: ["typedef", "Structure alias", "Initialization"],
    source: cMain(`    Product item = {501, "Keyboard", 899.0};
    printf("%d %s %.2f\\n", item.id, item.name, item.price);
    return 0;`, ["stdio.h"], `typedef struct {
    int id;
    char name[30];
    double price;
} Product;`),
    sampleInput: "No input required",
    sampleOutput: "501 Keyboard 899.00",
    method: "Assign a short type alias to an anonymous structure and declare records with that alias."
  }),
  makeProgram({
    slug: "union-memory-sharing",
    title: "Demonstrate Memory Sharing in a union",
    topic: "Structures, Unions & Enums",
    difficulty: "Intermediate",
    concepts: ["union", "Shared storage", "Active member"],
    source: cMain(`    union Value value;
    value.integer = 42;
    printf("Integer = %d\\n", value.integer);
    strcpy(value.text, "C language");
    printf("Text = %s\\n", value.text);
    return 0;`, ["stdio.h", "string.h"], `union Value { int integer; double decimal; char text[20]; };`),
    sampleInput: "No input required",
    sampleOutput: "Integer = 42\nText = C language",
    method: "Write and read one union member at a time because every member occupies the same storage."
  }),
  makeProgram({
    slug: "enum-weekday",
    title: "Represent Weekdays Using an enum",
    topic: "Structures, Unions & Enums",
    concepts: ["enum", "Named constants", "switch"],
    source: cMain(`    enum Weekday today = FRIDAY;
    switch (today) {
        case MONDAY: case TUESDAY: case WEDNESDAY: case THURSDAY: case FRIDAY:
            printf("Weekday number = %d\\n", today); break;
        case SATURDAY: case SUNDAY: puts("It is the weekend."); break;
    }
    return 0;`, ["stdio.h"], `enum Weekday { MONDAY = 1, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };`),
    sampleInput: "No input required",
    sampleOutput: "Weekday number = 5",
    method: "Use meaningful enum names instead of unexplained integer constants."
  }),
  makeProgram({
    slug: "structure-bit-fields",
    title: "Store Flags Using Structure Bit-Fields",
    topic: "Structures, Unions & Enums",
    difficulty: "Advanced",
    concepts: ["Bit-field", "Packed flags", "Unsigned members"],
    source: cMain(`    struct Status status = {1, 0, 2};
    printf("ready=%u error=%u mode=%u\\n", (unsigned) status.ready,
           (unsigned) status.error, (unsigned) status.mode);
    return 0;`, ["stdio.h"], `struct Status {
    unsigned ready : 1;
    unsigned error : 1;
    unsigned mode : 2;
};`),
    sampleInput: "No input required",
    sampleOutput: "ready=1 error=0 mode=2",
    method: "Assign a precise bit width to small unsigned flags and access them like structure members."
  }),

  makeProgram({
    slug: "append-text-file",
    title: "Append Text to an Existing File",
    topic: "File Handling",
    difficulty: "Intermediate",
    concepts: ["Append mode", "fopen()", "fgets()"],
    source: cMain(`    FILE *file = fopen("notes.txt", "w");
    if (file == NULL) return 1;
    fputs("First line\\n", file);
    fclose(file);
    file = fopen("notes.txt", "a");
    if (file == NULL) return 1;
    fputs("Appended line\\n", file);
    fclose(file);
    file = fopen("notes.txt", "r");
    if (file == NULL) return 1;
    char line[80];
    while (fgets(line, sizeof line, file) != NULL) fputs(line, stdout);
    fclose(file);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "First line\nAppended line",
    time: "O(n)",
    method: "Create the file, reopen it with append mode, add content and read the complete result."
  }),
  makeProgram({
    slug: "binary-structure-file",
    title: "Write and Read a Structure in a Binary File",
    topic: "File Handling",
    difficulty: "Advanced",
    concepts: ["Binary file", "fwrite()", "fread()"],
    source: cMain(`    struct Record original = {101, "Anu", 92.5};
    struct Record restored = {0};
    FILE *file = fopen("record.bin", "wb");
    if (file == NULL) return 1;
    if (fwrite(&original, sizeof original, 1, file) != 1) { fclose(file); return 1; }
    fclose(file);
    file = fopen("record.bin", "rb");
    if (file == NULL) return 1;
    if (fread(&restored, sizeof restored, 1, file) != 1) { fclose(file); return 1; }
    fclose(file);
    printf("%d %s %.1f\\n", restored.id, restored.name, restored.marks);
    return 0;`, ["stdio.h"], `struct Record { int id; char name[20]; double marks; };`),
    sampleInput: "No input required",
    sampleOutput: "101 Anu 92.5",
    time: "O(1)",
    method: "Write the structure bytes as one record and restore the same record with fread."
  }),
  makeProgram({
    slug: "merge-two-text-files",
    title: "Merge Two Text Files",
    topic: "File Handling",
    difficulty: "Intermediate",
    concepts: ["Multiple files", "fgetc()", "Merge"],
    source: cMain(`    FILE *first = fopen("first.txt", "w");
    FILE *second = fopen("second.txt", "w");
    if (first == NULL || second == NULL) return 1;
    fputs("Alpha\\n", first); fputs("Beta\\n", second);
    fclose(first); fclose(second);
    first = fopen("first.txt", "r"); second = fopen("second.txt", "r");
    FILE *merged = fopen("merged.txt", "w");
    if (first == NULL || second == NULL || merged == NULL) return 1;
    int character;
    while ((character = fgetc(first)) != EOF) fputc(character, merged);
    while ((character = fgetc(second)) != EOF) fputc(character, merged);
    fclose(first); fclose(second); fclose(merged);
    merged = fopen("merged.txt", "r");
    if (merged == NULL) return 1;
    while ((character = fgetc(merged)) != EOF) putchar(character);
    fclose(merged);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Alpha\nBeta",
    time: "O(n + m)",
    method: "Copy the complete first stream followed by the complete second stream into a new file."
  }),
  makeProgram({
    slug: "compare-two-text-files",
    title: "Compare Two Text Files Character by Character",
    topic: "File Handling",
    difficulty: "Intermediate",
    concepts: ["fgetc()", "EOF", "File comparison"],
    source: cMain(`    FILE *first = fopen("first.txt", "w");
    FILE *second = fopen("second.txt", "w");
    if (first == NULL || second == NULL) return 1;
    fputs("CodeBhavya\\n", first); fputs("CodeBhavya\\n", second);
    fclose(first); fclose(second);
    first = fopen("first.txt", "r"); second = fopen("second.txt", "r");
    if (first == NULL || second == NULL) return 1;
    int left, right;
    do {
        left = fgetc(first); right = fgetc(second);
        if (left != right) break;
    } while (left != EOF);
    puts(left == right ? "Files are identical." : "Files are different.");
    fclose(first); fclose(second);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Files are identical.",
    time: "O(min(n,m))",
    method: "Read corresponding characters until they differ or both streams reach the end together."
  }),
  makeProgram({
    slug: "search-word-in-file",
    title: "Search for a Word in a Text File",
    topic: "File Handling",
    difficulty: "Intermediate",
    concepts: ["fscanf()", "strcmp()", "Word search"],
    source: cMain(`    FILE *file = fopen("lesson.txt", "w");
    if (file == NULL) return 1;
    fputs("learn C and practise C every day", file);
    fclose(file);
    file = fopen("lesson.txt", "r");
    if (file == NULL) return 1;
    char word[64];
    int count = 0;
    while (fscanf(file, "%63s", word) == 1)
        if (strcmp(word, "C") == 0) count++;
    fclose(file);
    printf("Occurrences of C = %d\\n", count);
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "No input required",
    sampleOutput: "Occurrences of C = 2",
    time: "O(n)",
    method: "Read one whitespace-delimited token at a time and count exact matches."
  }),
  makeProgram({
    slug: "random-access-fseek",
    title: "Read a File Position Using fseek()",
    topic: "File Handling",
    difficulty: "Advanced",
    concepts: ["fseek()", "SEEK_END", "Random access"],
    source: cMain(`    FILE *file = fopen("letters.txt", "wb");
    if (file == NULL) return 1;
    fputs("ABCDE", file);
    fclose(file);
    file = fopen("letters.txt", "rb");
    if (file == NULL) return 1;
    if (fseek(file, -1L, SEEK_END) != 0) { fclose(file); return 1; }
    int character = fgetc(file);
    fclose(file);
    if (character == EOF) return 1;
    printf("Last character = %c\\n", character);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Last character = E",
    method: "Move the file-position indicator relative to the end and read from that exact byte."
  }),
  makeProgram({
    slug: "rename-and-delete-file",
    title: "Rename and Delete a File",
    topic: "File Handling",
    difficulty: "Intermediate",
    concepts: ["rename()", "remove()", "File lifecycle"],
    source: cMain(`    FILE *file = fopen("old-name.txt", "w");
    if (file == NULL) return 1;
    fputs("temporary file", file);
    fclose(file);
    if (rename("old-name.txt", "new-name.txt") != 0) return 1;
    puts("File renamed.");
    if (remove("new-name.txt") != 0) return 1;
    puts("File deleted.");
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "File renamed.\nFile deleted.",
    method: "Create and close a file before renaming it, then remove the renamed path and check both results."
  })
];
