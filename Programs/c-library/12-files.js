"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "File Handling";

module.exports = [
  makeProgram({
    slug: "write-and-read-text-file",
    title: "Write to and Read from a Text File",
    topic,
    difficulty: "Intermediate",
    concepts: ["FILE pointer", "fputs()", "fgets()"],
    source: cMain(`    char message[300], stored[300];

    printf("Enter a message: ");
    fgets(message, sizeof message, stdin);
    FILE *file = fopen("message.txt", "w");
    if (file == NULL) { perror("message.txt"); return 1; }
    fputs(message, file);
    fclose(file);

    file = fopen("message.txt", "r");
    if (file == NULL) { perror("message.txt"); return 1; }
    if (fgets(stored, sizeof stored, file) != NULL) printf("Stored message: %s", stored);
    fclose(file);
    return 0;`),
    sampleInput: "Learning file handling",
    sampleOutput: "Stored message: Learning file handling",
    time: "O(n)",
    space: "O(n)",
    method: "Open a file in write mode, close it, reopen it in read mode and display the stored line."
  }),
  makeProgram({
    slug: "count-file-characters-words-lines",
    title: "Count Characters, Words and Lines in a File",
    topic,
    difficulty: "Advanced",
    concepts: ["FILE pointer", "fgetc()", "Text statistics"],
    source: cMain(`    const char *sample = "C programming is powerful.\\nPractice builds confidence.\\n";
    FILE *file = fopen("sample.txt", "w");
    if (file == NULL) return 1;
    fputs(sample, file);
    fclose(file);

    file = fopen("sample.txt", "r");
    if (file == NULL) return 1;
    long characters = 0, words = 0, lines = 0;
    int character, insideWord = 0, last = '\\0';
    while ((character = fgetc(file)) != EOF) {
        characters++;
        if (character == '\\n') lines++;
        if (isspace((unsigned char) character)) insideWord = 0;
        else if (!insideWord) { words++; insideWord = 1; }
        last = character;
    }
    if (characters > 0 && last != '\\n') lines++;
    fclose(file);
    printf("Characters = %ld\\nWords = %ld\\nLines = %ld\\n", characters, words, lines);
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleOutput: "Characters = 55\nWords = 7\nLines = 2",
    time: "O(n)",
    space: "O(1)",
    method: "Read one character at a time, count newlines and detect transitions into words."
  }),
  makeProgram({
    slug: "copy-text-file",
    title: "Copy the Contents of One File to Another",
    topic,
    difficulty: "Intermediate",
    concepts: ["FILE pointer", "Binary-safe copy", "fgetc()/fputc()"],
    source: cMain(`    FILE *source = fopen("source.txt", "w");
    if (source == NULL) return 1;
    fputs("CodeBhavya file-copy example.\\n", source);
    fclose(source);

    source = fopen("source.txt", "rb");
    FILE *destination = fopen("destination.txt", "wb");
    if (source == NULL || destination == NULL) {
        if (source != NULL) fclose(source);
        if (destination != NULL) fclose(destination);
        return 1;
    }
    int byte;
    while ((byte = fgetc(source)) != EOF) fputc(byte, destination);
    fclose(source);
    fclose(destination);
    printf("File copied to destination.txt\\n");
    return 0;`),
    sampleOutput: "File copied to destination.txt",
    time: "O(n)",
    space: "O(1)",
    method: "Read each byte from the source and write it to the destination until EOF."
  })
];
