"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Strings";

function stringProgram(options) {
  return makeProgram({
    topic,
    concepts: ["Strings", "Character arrays", "Loops"],
    time: "O(n)",
    space: "O(1)",
    ...options
  });
}

module.exports = [
  stringProgram({
    slug: "string-length-without-strlen",
    title: "Find String Length Without strlen()",
    source: cMain(`    char text[200];
    int length = 0;

    printf("Enter text: ");
    fgets(text, sizeof text, stdin);
    while (text[length] != '\\0' && text[length] != '\\n') length++;
    printf("Length = %d\\n", length);
    return 0;`, ["stdio.h"]),
    sampleInput: "CodeBhavya",
    sampleOutput: "Length = 10",
    method: "Count characters until the null terminator or newline is reached."
  }),
  stringProgram({
    slug: "copy-string-without-strcpy",
    title: "Copy a String Without strcpy()",
    source: cMain(`    char source[200], destination[200];
    int index = 0;

    printf("Enter text: ");
    fgets(source, sizeof source, stdin);
    while (source[index] != '\\0') {
        destination[index] = source[index];
        index++;
    }
    destination[index] = '\\0';
    printf("Copied text: %s", destination);
    return 0;`),
    sampleInput: "Learn C",
    sampleOutput: "Copied text: Learn C",
    space: "O(n)",
    method: "Copy each character including the terminating null character into another array."
  }),
  stringProgram({
    slug: "concatenate-strings-without-strcat",
    title: "Concatenate Two Strings Without strcat()",
    source: cMain(`    char first[400], second[200];
    int firstLength = 0, secondIndex = 0;

    printf("Enter first text: ");
    fgets(first, 200, stdin);
    first[strcspn(first, "\\n")] = '\\0';
    printf("Enter second text: ");
    fgets(second, sizeof second, stdin);
    while (first[firstLength] != '\\0') firstLength++;
    while (second[secondIndex] != '\\0') first[firstLength++] = second[secondIndex++];
    first[firstLength] = '\\0';
    printf("Combined: %s", first);
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "Code\nBhavya",
    sampleOutput: "Combined: CodeBhavya",
    time: "O(n+m)",
    space: "O(n+m)",
    method: "Find the end of the first string and append characters from the second string."
  }),
  stringProgram({
    slug: "compare-strings-without-strcmp",
    title: "Compare Two Strings Without strcmp()",
    source: cMain(`    char first[200], second[200];
    int index = 0;

    fgets(first, sizeof first, stdin);
    fgets(second, sizeof second, stdin);
    first[strcspn(first, "\\n")] = '\\0';
    second[strcspn(second, "\\n")] = '\\0';
    while (first[index] != '\\0' && first[index] == second[index]) index++;
    if (first[index] == second[index]) printf("Strings are equal\\n");
    else if ((unsigned char) first[index] < (unsigned char) second[index]) printf("First string comes before second\\n");
    else printf("First string comes after second\\n");
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "apple\napricot",
    sampleOutput: "First string comes before second",
    method: "Advance through equal characters and compare the first differing character."
  }),
  stringProgram({
    slug: "reverse-string",
    title: "Reverse a String",
    concepts: ["Strings", "Two pointers", "In-place swap"],
    source: cMain(`    char text[200];

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    int left = 0, right = (int) strlen(text) - 1;
    while (left < right) {
        char temporary = text[left]; text[left] = text[right]; text[right] = temporary;
        left++; right--;
    }
    printf("Reversed: %s\\n", text);
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "CodeBhavya",
    sampleOutput: "Reversed: ayvahBedoC",
    method: "Swap characters at symmetric positions while moving two pointers inward."
  }),
  stringProgram({
    slug: "palindrome-string",
    title: "Check Whether a String Is a Palindrome",
    concepts: ["Strings", "Two pointers", "Palindrome"],
    source: cMain(`    char text[200];
    int palindrome = 1;

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    int left = 0, right = (int) strlen(text) - 1;
    while (left < right) {
        if (text[left] != text[right]) { palindrome = 0; break; }
        left++; right--;
    }
    printf(palindrome ? "Palindrome\\n" : "Not a palindrome\\n");
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "level",
    sampleOutput: "Palindrome",
    method: "Compare characters from both ends and stop when a mismatch is found."
  }),
  stringProgram({
    slug: "count-string-character-types",
    title: "Count Vowels, Consonants, Digits and Spaces",
    concepts: ["ctype.h", "Character classes", "Counters"],
    source: cMain(`    char text[300];
    int vowels = 0, consonants = 0, digits = 0, spaces = 0;

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\\0'; index++) {
        unsigned char value = (unsigned char) text[index];
        if (isdigit(value)) digits++;
        else if (isspace(value)) { if (value != '\\n') spaces++; }
        else if (isalpha(value)) {
            char lower = (char) tolower(value);
            if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') vowels++;
            else consonants++;
        }
    }
    printf("Vowels = %d\\nConsonants = %d\\nDigits = %d\\nSpaces = %d\\n", vowels, consonants, digits, spaces);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "C is fun 2026",
    sampleOutput: "Vowels = 2\nConsonants = 4\nDigits = 4\nSpaces = 3",
    method: "Classify each character with ctype functions and update the matching counter."
  }),
  stringProgram({
    slug: "character-frequency-string",
    title: "Count the Frequency of a Character in a String",
    concepts: ["Strings", "Linear scan", "Frequency"],
    source: cMain(`    char text[300], target;
    int count = 0;

    fgets(text, sizeof text, stdin);
    printf("Enter character to count: ");
    scanf("%c", &target);
    for (int index = 0; text[index] != '\\0'; index++)
        if (text[index] == target) count++;
    printf("'%c' occurs %d time(s)\\n", target, count);
    return 0;`),
    sampleInput: "banana\na",
    sampleOutput: "'a' occurs 3 time(s)",
    method: "Compare every string character with the target and increment on equality."
  }),
  stringProgram({
    slug: "frequency-of-every-character-string",
    title: "Count the Frequency of Every Character",
    difficulty: "Intermediate",
    concepts: ["Strings", "ASCII table", "Frequency array"],
    space: "O(1)",
    source: cMain(`    char text[300];
    int frequency[256] = {0};

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\\0' && text[index] != '\\n'; index++)
        frequency[(unsigned char) text[index]]++;
    for (int value = 0; value < 256; value++)
        if (frequency[value] > 0) printf("%c : %d\\n", value, frequency[value]);
    return 0;`),
    sampleInput: "hello",
    sampleOutput: "e : 1\nh : 1\nl : 2\no : 1",
    method: "Use each unsigned character code as an index into a 256-entry frequency array."
  }),
  stringProgram({
    slug: "remove-spaces-string",
    title: "Remove Spaces from a String",
    concepts: ["Strings", "In-place filtering", "isspace()"],
    source: cMain(`    char text[300];
    int write = 0;

    fgets(text, sizeof text, stdin);
    for (int read = 0; text[read] != '\\0'; read++) {
        if (!isspace((unsigned char) text[read])) text[write++] = text[read];
    }
    text[write] = '\\0';
    printf("Without spaces: %s\\n", text);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "Code Bhavya makes C clear",
    sampleOutput: "Without spaces: CodeBhavyamakesCclear",
    method: "Copy only non-whitespace characters forward inside the same array."
  }),
  stringProgram({
    slug: "remove-duplicate-characters-string",
    title: "Remove Duplicate Characters from a String",
    difficulty: "Intermediate",
    concepts: ["Strings", "Seen table", "In-place filtering"],
    space: "O(1)",
    source: cMain(`    char text[300];
    int seen[256] = {0}, write = 0;

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    for (int read = 0; text[read] != '\\0'; read++) {
        unsigned char value = (unsigned char) text[read];
        if (!seen[value]) {
            seen[value] = 1;
            text[write++] = text[read];
        }
    }
    text[write] = '\\0';
    printf("Unique characters: %s\\n", text);
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "programming",
    sampleOutput: "Unique characters: progamin",
    method: "Keep the first occurrence of each character using a fixed seen table."
  }),
  stringProgram({
    slug: "string-to-uppercase",
    title: "Convert a String to Uppercase",
    concepts: ["toupper()", "Strings", "Character conversion"],
    source: cMain(`    char text[300];

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\\0'; index++)
        text[index] = (char) toupper((unsigned char) text[index]);
    printf("Uppercase: %s", text);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "Code Bhavya",
    sampleOutput: "Uppercase: CODE BHAVYA",
    method: "Apply toupper() to every character while preserving non-alphabetic characters."
  }),
  stringProgram({
    slug: "string-to-lowercase",
    title: "Convert a String to Lowercase",
    concepts: ["tolower()", "Strings", "Character conversion"],
    source: cMain(`    char text[300];

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\\0'; index++)
        text[index] = (char) tolower((unsigned char) text[index]);
    printf("Lowercase: %s", text);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "CODE Bhavya",
    sampleOutput: "Lowercase: code bhavya",
    method: "Apply tolower() to each character in the string."
  }),
  stringProgram({
    slug: "toggle-string-case",
    title: "Toggle the Case of Every Alphabet",
    concepts: ["isupper()", "tolower()", "toupper()"],
    source: cMain(`    char text[300];

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\\0'; index++) {
        unsigned char value = (unsigned char) text[index];
        if (isupper(value)) text[index] = (char) tolower(value);
        else if (islower(value)) text[index] = (char) toupper(value);
    }
    printf("Toggled: %s", text);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "CodeBHAVYA 2026",
    sampleOutput: "Toggled: cODEbhavya 2026",
    method: "Convert uppercase letters to lowercase and lowercase letters to uppercase."
  }),
  stringProgram({
    slug: "count-words-string",
    title: "Count Words in a Sentence",
    concepts: ["Strings", "isspace()", "State flag"],
    source: cMain(`    char text[500];
    int words = 0, insideWord = 0;

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\\0'; index++) {
        if (isspace((unsigned char) text[index])) {
            insideWord = 0;
        } else if (!insideWord) {
            words++;
            insideWord = 1;
        }
    }
    printf("Word count = %d\\n", words);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "Learning C builds strong foundations.",
    sampleOutput: "Word count = 5",
    method: "Count each transition from whitespace into a non-whitespace sequence."
  }),
  stringProgram({
    slug: "sort-string-characters",
    title: "Sort the Characters in a String",
    difficulty: "Intermediate",
    concepts: ["Strings", "Sorting", "Character codes"],
    time: "O(n²)",
    source: cMain(`    char text[300];

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    int length = (int) strlen(text);
    for (int start = 0; start < length - 1; start++) {
        for (int index = start + 1; index < length; index++) {
            if ((unsigned char) text[start] > (unsigned char) text[index]) {
                char temporary = text[start]; text[start] = text[index]; text[index] = temporary;
            }
        }
    }
    printf("Sorted: %s\\n", text);
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "dcab",
    sampleOutput: "Sorted: abcd",
    method: "Compare character codes and swap them into ascending order."
  }),
  stringProgram({
    slug: "anagram-check",
    title: "Check Whether Two Strings Are Anagrams",
    difficulty: "Intermediate",
    concepts: ["Strings", "Frequency array", "Anagram"],
    time: "O(n+m)",
    space: "O(1)",
    source: cMain(`    char first[300], second[300];
    int frequency[256] = {0};

    fgets(first, sizeof first, stdin);
    fgets(second, sizeof second, stdin);
    for (int index = 0; first[index] != '\\0'; index++) {
        unsigned char value = (unsigned char) first[index];
        if (!isspace(value)) frequency[tolower(value)]++;
    }
    for (int index = 0; second[index] != '\\0'; index++) {
        unsigned char value = (unsigned char) second[index];
        if (!isspace(value)) frequency[tolower(value)]--;
    }
    for (int value = 0; value < 256; value++) {
        if (frequency[value] != 0) { printf("Not anagrams\\n"); return 0; }
    }
    printf("Anagrams\\n");
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "Dormitory\nDirty room",
    sampleOutput: "Anagrams",
    method: "Add character frequencies from the first text and subtract those from the second, ignoring case and spaces."
  }),
  stringProgram({
    slug: "substring-search",
    title: "Find a Substring Without strstr()",
    difficulty: "Intermediate",
    concepts: ["Strings", "Pattern matching", "Nested loops"],
    time: "O(nm)",
    source: cMain(`    char text[300], pattern[100];
    int position = -1;

    fgets(text, sizeof text, stdin);
    fgets(pattern, sizeof pattern, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    pattern[strcspn(pattern, "\\n")] = '\\0';
    for (int start = 0; text[start] != '\\0'; start++) {
        int offset = 0;
        while (pattern[offset] != '\\0' && text[start + offset] == pattern[offset]) offset++;
        if (pattern[offset] == '\\0') { position = start; break; }
    }
    if (position >= 0) printf("Found at position %d\\n", position + 1);
    else printf("Substring not found\\n");
    return 0;`, ["stdio.h", "string.h"]),
    sampleInput: "CodeBhavya programming\nBhavya",
    sampleOutput: "Found at position 5",
    method: "Try every possible start position and compare pattern characters until a mismatch or full match."
  })
];
