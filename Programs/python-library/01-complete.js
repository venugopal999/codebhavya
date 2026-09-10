"use strict";

const { makePython } = require("./helpers");
const code = (...lines) => lines.join("\n");
const e = (slug, title, topic, source, sampleOutput, concepts, extra = {}) => makePython({
  slug: `python-${slug}`,
  title: `${title} in Python`,
  topic,
  source,
  sampleOutput,
  concepts,
  ...extra
});

const programs = [
  // 01. Basics and input/output
  e("hello-world", "Display Hello World", "Basics & Input/Output", "print('Hello, World!')", "Hello, World!", ["print()", "Program structure"], { featured: true }),
  e("print-multiple-values", "Print Multiple Values", "Basics & Input/Output", "name = 'Bhavya'\nage = 18\nprint(name, age)", "Bhavya 18", ["print()", "Variables"]),
  e("formatted-output-fstring", "Format Output with an f-string", "Basics & Input/Output", "course = 'Python'\nlevel = 1\nprint(f'{course} Level {level}')", "Python Level 1", ["f-string", "Formatting"]),
  e("read-name", "Read and Greet a User", "Basics & Input/Output", "name = input()\nprint(f'Welcome, {name}!')", "Welcome, Venu!", ["input()", "f-string"], { sampleInput: "Venu" }),
  e("read-two-integers", "Read Two Integers", "Basics & Input/Output", "a, b = map(int, input().split())\nprint(a, b)", "12 8", ["input()", "map()", "Unpacking"], { sampleInput: "12 8" }),
  e("sum-user-input", "Add Two User Inputs", "Basics & Input/Output", "a = int(input())\nb = int(input())\nprint(a + b)", "25", ["input()", "int()", "Addition"], { sampleInput: "10\n15" }),
  e("custom-separator", "Use a Custom Print Separator", "Basics & Input/Output", "print('2026', '09', '10', sep='-')", "2026-09-10", ["print()", "sep"]),
  e("custom-end", "Use the Print End Parameter", "Basics & Input/Output", "print('Code', end='')\nprint('Bhavya')", "CodeBhavya", ["print()", "end"]),
  e("escape-sequences", "Display Escape Sequences", "Basics & Input/Output", "print('Name:\\tBhavya\\nCourse:\\tPython')", "Name:\tBhavya\nCourse:\tPython", ["Escape sequences", "print()"]),
  e("comments-docstring", "Use a Function Docstring", "Basics & Input/Output", "def greet():\n    \"\"\"Return a short greeting.\"\"\"\n    return 'Keep learning!'\n\nprint(greet())", "Keep learning!", ["Comments", "Docstring", "Function"]),

  // 02. Variables and data types
  e("variable-assignment", "Assign and Update a Variable", "Variables & Data Types", "score = 70\nscore += 5\nprint(score)", "75", ["Variables", "Assignment"]),
  e("multiple-assignment", "Perform Multiple Assignment", "Variables & Data Types", "x, y, z = 2, 4, 6\nprint(x + y + z)", "12", ["Multiple assignment", "Unpacking"]),
  e("swap-values", "Swap Two Values", "Variables & Data Types", "a, b = 5, 9\na, b = b, a\nprint(a, b)", "9 5", ["Tuple unpacking", "Swap"]),
  e("display-types", "Display Built-in Data Types", "Variables & Data Types", "values = [10, 3.5, 'AI', True]\nprint([type(value).__name__ for value in values])", "['int', 'float', 'str', 'bool']", ["type()", "Data types", "List comprehension"]),
  e("type-conversion", "Convert Between Numeric Types", "Variables & Data Types", "text = '42'\nnumber = int(text)\nprint(number + 8, float(number))", "50 42.0", ["int()", "float()", "Type conversion"]),
  e("complex-number", "Work with a Complex Number", "Variables & Data Types", "value = 3 + 4j\nprint(value.real, value.imag, abs(value))", "3.0 4.0 5.0", ["complex", "real", "imag"]),
  e("boolean-values", "Evaluate Boolean Values", "Variables & Data Types", "print(bool(1), bool(0), bool('Python'), bool(''))", "True False True False", ["bool()", "Truth values"]),
  e("none-value", "Check the None Value", "Variables & Data Types", "result = None\nprint(result is None)", "True", ["None", "is operator"]),
  e("bytes-value", "Encode Text as Bytes", "Variables & Data Types", "data = 'AI'.encode('utf-8')\nprint(data, data.decode('utf-8'))", "b'AI' AI", ["bytes", "encode()", "decode()"]),
  e("constant-convention", "Use the Constant Naming Convention", "Variables & Data Types", "PI = 3.14159\nradius = 2\nprint(round(PI * radius ** 2, 2))", "12.57", ["Constants", "Naming convention"]),

  // 03. Operators and numbers
  e("arithmetic-operators", "Demonstrate Arithmetic Operators", "Operators & Numbers", "a, b = 17, 5\nprint(a + b, a - b, a * b, a / b)", "22 12 85 3.4", ["Arithmetic operators"]),
  e("floor-division-modulus", "Use Floor Division and Modulus", "Operators & Numbers", "a, b = 17, 5\nprint(a // b, a % b)", "3 2", ["//", "%"]),
  e("power-operator", "Calculate a Power", "Operators & Numbers", "base, exponent = 3, 4\nprint(base ** exponent)", "81", ["Exponentiation", "**"]),
  e("comparison-operators", "Demonstrate Comparison Operators", "Operators & Numbers", "a, b = 8, 12\nprint(a < b, a == b, a != b)", "True False True", ["Comparison", "Boolean"]),
  e("logical-operators", "Demonstrate Logical Operators", "Operators & Numbers", "age, has_id = 20, True\nprint(age >= 18 and has_id, age < 18 or not has_id)", "True False", ["and", "or", "not"]),
  e("bitwise-operators", "Demonstrate Bitwise Operators", "Operators & Numbers", "a, b = 6, 3\nprint(a & b, a | b, a ^ b, a << 1)", "2 7 5 12", ["Bitwise operators"]),
  e("operator-precedence", "Apply Operator Precedence", "Operators & Numbers", "print(2 + 3 * 4, (2 + 3) * 4)", "14 20", ["Precedence", "Parentheses"]),
  e("absolute-round", "Use Absolute Value and Round", "Operators & Numbers", "value = -12.678\nprint(abs(value), round(value, 2))", "12.678 -12.68", ["abs()", "round()"]),
  e("divmod", "Find Quotient and Remainder with divmod", "Operators & Numbers", "quotient, remainder = divmod(29, 6)\nprint(quotient, remainder)", "4 5", ["divmod()", "Unpacking"]),
  e("min-max-sum", "Use min max and sum", "Operators & Numbers", "values = [7, 2, 9, 4]\nprint(min(values), max(values), sum(values))", "2 9 22", ["min()", "max()", "sum()"]),

  // 04. Decision making
  e("positive-negative-zero", "Classify a Number", "Decision Making", "number = -7\nif number > 0:\n    print('Positive')\nelif number < 0:\n    print('Negative')\nelse:\n    print('Zero')", "Negative", ["if", "elif", "else"]),
  e("even-or-odd", "Check Even or Odd", "Decision Making", "number = 18\nprint('Even' if number % 2 == 0 else 'Odd')", "Even", ["Conditional expression", "Modulus"]),
  e("largest-three", "Find the Largest of Three Values", "Decision Making", "a, b, c = 12, 27, 19\nprint(max(a, b, c))", "27", ["max()", "Comparison"]),
  e("leap-year", "Check a Leap Year", "Decision Making", "year = 2024\nis_leap = year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)\nprint(is_leap)", "True", ["Nested condition", "Logical operators"]),
  e("grade-calculator", "Calculate a Grade", "Decision Making", "mark = 84\nif mark >= 90:\n    grade = 'A+'\nelif mark >= 80:\n    grade = 'A'\nelif mark >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint(grade)", "A", ["if-elif", "Range classification"]),
  e("vowel-check", "Check a Vowel", "Decision Making", "letter = 'e'\nprint('Vowel' if letter.lower() in 'aeiou' else 'Consonant')", "Vowel", ["Membership", "Conditional expression"]),
  e("triangle-validity", "Check Triangle Validity", "Decision Making", "a, b, c = 3, 4, 5\nprint(a + b > c and a + c > b and b + c > a)", "True", ["Logical operators", "Triangle inequality"]),
  e("match-case-menu", "Use Match Case for a Menu", "Decision Making", "choice = 2\nmatch choice:\n    case 1:\n        print('Add')\n    case 2:\n        print('View')\n    case _:\n        print('Exit')", "View", ["match", "case"], { difficulty: "Intermediate" }),
  e("nested-if-eligibility", "Check Eligibility with Nested If", "Decision Making", "age, mark = 19, 78\nif age >= 18:\n    if mark >= 60:\n        print('Eligible')\n    else:\n        print('Improve mark')\nelse:\n    print('Age not eligible')", "Eligible", ["Nested if"]),
  e("short-circuit", "Demonstrate Short-circuit Evaluation", "Decision Making", "items = []\nprint(bool(items and items[0]))\nprint(bool(items or ['default']))", "False\nTrue", ["Short circuit", "and", "or"]),

  // 05. Loops
  e("for-range", "Print a Range with for", "Loops", "for number in range(1, 6):\n    print(number, end=' ')", "1 2 3 4 5", ["for", "range()"]),
  e("while-countdown", "Create a While Countdown", "Loops", "number = 5\nwhile number > 0:\n    print(number, end=' ')\n    number -= 1", "5 4 3 2 1", ["while", "Loop update"]),
  e("sum-natural", "Sum Natural Numbers", "Loops", "total = 0\nfor number in range(1, 11):\n    total += number\nprint(total)", "55", ["for", "Accumulator"]),
  e("multiplication-table", "Print a Multiplication Table", "Loops", "number = 5\nfor value in range(1, 6):\n    print(f'{number} x {value} = {number * value}')", "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25", ["for", "f-string"]),
  e("break-loop", "Stop a Loop with break", "Loops", "for number in range(1, 10):\n    if number == 5:\n        break\n    print(number, end=' ')", "1 2 3 4", ["break", "for"]),
  e("continue-loop", "Skip Values with continue", "Loops", "for number in range(1, 8):\n    if number % 2 == 0:\n        continue\n    print(number, end=' ')", "1 3 5 7", ["continue", "for"]),
  e("loop-else", "Use the Loop else Clause", "Loops", "target = 7\nfor number in [2, 4, 6]:\n    if number == target:\n        print('Found')\n        break\nelse:\n    print('Not found')", "Not found", ["for-else", "break"]),
  e("enumerate", "Iterate with enumerate", "Loops", "courses = ['C', 'DSA', 'Python']\nfor index, course in enumerate(courses, start=1):\n    print(index, course)", "1 C\n2 DSA\n3 Python", ["enumerate()", "Unpacking"]),
  e("zip-loop", "Iterate over Two Lists with zip", "Loops", "names = ['Asha', 'Ravi']\nmarks = [82, 91]\nfor name, mark in zip(names, marks):\n    print(name, mark)", "Asha 82\nRavi 91", ["zip()", "for"]),
  e("nested-loops", "Generate Coordinate Pairs", "Loops", "for row in range(2):\n    for column in range(3):\n        print((row, column), end=' ')", "(0, 0) (0, 1) (0, 2) (1, 0) (1, 1) (1, 2)", ["Nested loops"]),

  // 06. Patterns and number problems
  e("right-triangle-pattern", "Print a Right Triangle Pattern", "Patterns & Number Problems", "for row in range(1, 5):\n    print('*' * row)", "*\n**\n***\n****", ["for", "String repetition"]),
  e("inverted-triangle-pattern", "Print an Inverted Triangle Pattern", "Patterns & Number Problems", "for row in range(4, 0, -1):\n    print('*' * row)", "****\n***\n**\n*", ["range()", "Pattern"]),
  e("number-triangle", "Print a Number Triangle", "Patterns & Number Problems", "for row in range(1, 5):\n    print(' '.join(str(number) for number in range(1, row + 1)))", "1\n1 2\n1 2 3\n1 2 3 4", ["Nested iteration", "join()"]),
  e("factorial-loop", "Find Factorial with a Loop", "Patterns & Number Problems", "number = 5\nresult = 1\nfor value in range(2, number + 1):\n    result *= value\nprint(result)", "120", ["for", "Factorial"]),
  e("fibonacci-series", "Generate a Fibonacci Series", "Patterns & Number Problems", "a, b = 0, 1\nfor _ in range(8):\n    print(a, end=' ')\n    a, b = b, a + b", "0 1 1 2 3 5 8 13", ["for", "Multiple assignment"]),
  e("prime-check", "Check a Prime Number", "Patterns & Number Problems", "number = 29\nis_prime = number > 1 and all(number % divisor for divisor in range(2, int(number ** 0.5) + 1))\nprint(is_prime)", "True", ["all()", "Prime", "Generator expression"]),
  e("armstrong-number", "Check an Armstrong Number", "Patterns & Number Problems", "number = 153\ndigits = str(number)\npower = len(digits)\nprint(sum(int(digit) ** power for digit in digits) == number)", "True", ["Generator expression", "Number conversion"]),
  e("palindrome-number", "Check a Palindrome Number", "Patterns & Number Problems", "number = 1221\nprint(str(number) == str(number)[::-1])", "True", ["Slicing", "Type conversion"]),
  e("gcd-math", "Find GCD with math.gcd", "Patterns & Number Problems", "from math import gcd\nprint(gcd(48, 18))", "6", ["math module", "gcd()"]),
  e("decimal-binary", "Convert Decimal to Binary", "Patterns & Number Problems", "number = 25\nprint(bin(number)[2:])", "11001", ["bin()", "Slicing"]),

  // 07. Strings
  e("string-length", "Find String Length", "Strings", "text = 'CodeBhavya'\nprint(len(text))", "10", ["String", "len()"]),
  e("string-reverse", "Reverse a String", "Strings", "text = 'Python'\nprint(text[::-1])", "nohtyP", ["Slicing", "String"]),
  e("palindrome-string", "Check a Palindrome String", "Strings", "text = 'level'\nprint(text == text[::-1])", "True", ["Palindrome", "Slicing"]),
  e("count-vowels", "Count Vowels in a String", "Strings", "text = 'Artificial Intelligence'\ncount = sum(character.lower() in 'aeiou' for character in text)\nprint(count)", "10", ["Generator expression", "Membership"]),
  e("character-frequency", "Count Character Frequency", "Strings", "text = 'banana'\nprint({character: text.count(character) for character in sorted(set(text))})", "{'a': 3, 'b': 1, 'n': 2}", ["Dictionary comprehension", "count()"]),
  e("replace-word", "Replace a Word in Text", "Strings", "text = 'I learn C'\nprint(text.replace('C', 'Python'))", "I learn Python", ["replace()", "String"]),
  e("split-join", "Split and Join Words", "Strings", "text = 'learn build share'\nwords = text.split()\nprint('-'.join(words))", "learn-build-share", ["split()", "join()"]),
  e("remove-spaces", "Remove Spaces from a String", "Strings", "text = 'Code Bhavya Python'\nprint(text.replace(' ', ''))", "CodeBhavyaPython", ["replace()", "Whitespace"]),
  e("title-case", "Convert Text to Title Case", "Strings", "text = 'python for everyone'\nprint(text.title())", "Python For Everyone", ["title()", "String method"]),
  e("substring-search", "Find a Substring", "Strings", "text = 'Learn Python at CodeBhavya'\nword = 'Python'\nprint(text.find(word), word in text)", "6 True", ["find()", "in operator"]),

  // 08. Lists
  e("list-create-access", "Create and Access a List", "Lists", "values = [10, 20, 30, 40]\nprint(values[0], values[-1])", "10 40", ["List", "Indexing"]),
  e("list-append-extend", "Append and Extend a List", "Lists", "values = [1, 2]\nvalues.append(3)\nvalues.extend([4, 5])\nprint(values)", "[1, 2, 3, 4, 5]", ["append()", "extend()"]),
  e("list-insert-remove", "Insert and Remove List Items", "Lists", "values = [1, 3, 4]\nvalues.insert(1, 2)\nvalues.remove(4)\nprint(values)", "[1, 2, 3]", ["insert()", "remove()"]),
  e("list-slicing", "Slice a List", "Lists", "values = [0, 1, 2, 3, 4, 5]\nprint(values[1:5:2])", "[1, 3]", ["List", "Slicing"]),
  e("list-comprehension-squares", "Create Squares with List Comprehension", "Lists", "squares = [number ** 2 for number in range(1, 6)]\nprint(squares)", "[1, 4, 9, 16, 25]", ["List comprehension", "range()"]),
  e("filter-even-list", "Filter Even Values from a List", "Lists", "values = [7, 2, 8, 3, 10]\neven = [value for value in values if value % 2 == 0]\nprint(even)", "[2, 8, 10]", ["Conditional comprehension", "List"]),
  e("list-sort", "Sort a List", "Lists", "values = [8, 1, 6, 3]\nprint(sorted(values))\nprint(sorted(values, reverse=True))", "[1, 3, 6, 8]\n[8, 6, 3, 1]", ["sorted()", "reverse"]),
  e("second-largest-list", "Find the Second Largest List Value", "Lists", "values = [9, 2, 7, 9, 5]\nunique = sorted(set(values), reverse=True)\nprint(unique[1])", "7", ["set()", "sorted()", "List"]),
  e("flatten-matrix", "Flatten a Nested List", "Lists", "matrix = [[1, 2], [3, 4], [5, 6]]\nflat = [value for row in matrix for value in row]\nprint(flat)", "[1, 2, 3, 4, 5, 6]", ["Nested comprehension", "Matrix"]),
  e("copy-list", "Copy a List Safely", "Lists", "original = [1, 2, 3]\ncopy = original.copy()\ncopy.append(4)\nprint(original, copy)", "[1, 2, 3] [1, 2, 3, 4]", ["copy()", "Mutability"]),

  // 09. Tuples, sets and dictionaries
  e("tuple-pack-unpack", "Pack and Unpack a Tuple", "Tuples, Sets & Dictionaries", "student = ('Asha', 82)\nname, mark = student\nprint(name, mark)", "Asha 82", ["Tuple", "Unpacking"]),
  e("tuple-single-item", "Create a Single-item Tuple", "Tuples, Sets & Dictionaries", "value = (5,)\nprint(type(value).__name__, len(value))", "tuple 1", ["Tuple", "Comma"]),
  e("tuple-count-index", "Use Tuple Count and Index", "Tuples, Sets & Dictionaries", "values = (2, 4, 2, 6)\nprint(values.count(2), values.index(6))", "2 3", ["count()", "index()"]),
  e("set-remove-duplicates", "Remove Duplicates with a Set", "Tuples, Sets & Dictionaries", "values = [3, 1, 3, 2, 1]\nprint(sorted(set(values)))", "[1, 2, 3]", ["set", "Duplicates"]),
  e("set-operations", "Perform Set Operations", "Tuples, Sets & Dictionaries", "a = {1, 2, 3}\nb = {3, 4, 5}\nprint(sorted(a | b), sorted(a & b), sorted(a - b))", "[1, 2, 3, 4, 5] [3] [1, 2]", ["Union", "Intersection", "Difference"]),
  e("set-subset", "Check a Subset", "Tuples, Sets & Dictionaries", "required = {'Python', 'DSA'}\nlearned = {'C', 'Python', 'DSA'}\nprint(required <= learned)", "True", ["Subset", "Set comparison"]),
  e("dictionary-create-access", "Create and Access a Dictionary", "Tuples, Sets & Dictionaries", "student = {'name': 'Ravi', 'mark': 91}\nprint(student['name'], student.get('mark'))", "Ravi 91", ["dict", "get()"]),
  e("dictionary-update", "Update a Dictionary", "Tuples, Sets & Dictionaries", "student = {'name': 'Asha', 'mark': 80}\nstudent['mark'] = 85\nstudent['grade'] = 'A'\nprint(student)", "{'name': 'Asha', 'mark': 85, 'grade': 'A'}", ["Dictionary", "Update"]),
  e("dictionary-iterate", "Iterate over Dictionary Items", "Tuples, Sets & Dictionaries", "marks = {'C': 80, 'Python': 90}\nfor course, mark in marks.items():\n    print(course, mark)", "C 80\nPython 90", ["items()", "Dictionary iteration"]),
  e("dictionary-comprehension", "Create a Dictionary Comprehension", "Tuples, Sets & Dictionaries", "squares = {number: number ** 2 for number in range(1, 5)}\nprint(squares)", "{1: 1, 2: 4, 3: 9, 4: 16}", ["Dictionary comprehension"]),

  // 10. Functions and recursion
  e("function-no-arguments", "Define a Simple Function", "Functions & Recursion", "def message():\n    return 'Practice daily'\n\nprint(message())", "Practice daily", ["def", "return"]),
  e("function-arguments", "Pass Function Arguments", "Functions & Recursion", "def add(a, b):\n    return a + b\n\nprint(add(12, 8))", "20", ["Parameters", "Arguments", "return"]),
  e("default-argument", "Use a Default Argument", "Functions & Recursion", "def greet(name='Student'):\n    return f'Hello, {name}'\n\nprint(greet())\nprint(greet('Bhavya'))", "Hello, Student\nHello, Bhavya", ["Default argument", "Function"]),
  e("keyword-arguments", "Use Keyword Arguments", "Functions & Recursion", "def profile(name, course):\n    return f'{name}: {course}'\n\nprint(profile(course='Python', name='Venu'))", "Venu: Python", ["Keyword arguments"]),
  e("variable-arguments", "Use Variable-length Arguments", "Functions & Recursion", "def total(*numbers):\n    return sum(numbers)\n\nprint(total(2, 4, 6, 8))", "20", ["*args", "sum()"]),
  e("keyword-variable-arguments", "Use Keyword Variable Arguments", "Functions & Recursion", "def show(**details):\n    return ', '.join(f'{key}={value}' for key, value in details.items())\n\nprint(show(name='Asha', mark=88))", "name=Asha, mark=88", ["**kwargs", "Dictionary"]),
  e("lambda-square", "Create a Lambda Function", "Functions & Recursion", "square = lambda number: number ** 2\nprint(square(7))", "49", ["lambda", "Function"]),
  e("recursive-factorial", "Find Factorial Recursively", "Functions & Recursion", "def factorial(number):\n    return 1 if number <= 1 else number * factorial(number - 1)\n\nprint(factorial(5))", "120", ["Recursion", "Base case"], { difficulty: "Intermediate", time: "O(n)", space: "O(n)" }),
  e("recursive-fibonacci", "Find a Fibonacci Value Recursively", "Functions & Recursion", "def fibonacci(number):\n    return number if number < 2 else fibonacci(number - 1) + fibonacci(number - 2)\n\nprint(fibonacci(8))", "21", ["Recursion", "Fibonacci"], { difficulty: "Intermediate", time: "O(2^n)", space: "O(n)" }),
  e("function-annotations", "Add Function Type Annotations", "Functions & Recursion", "def area(length: float, width: float) -> float:\n    return length * width\n\nprint(area(4.0, 2.5))", "10.0", ["Type annotations", "Function"]),

  // 11. Object-oriented programming
  e("class-object", "Create a Class and Object", "Object-Oriented Programming", "class Student:\n    pass\n\nstudent = Student()\nstudent.name = 'Asha'\nprint(student.name)", "Asha", ["class", "Object"], { difficulty: "Intermediate" }),
  e("constructor", "Initialize an Object with a Constructor", "Object-Oriented Programming", "class Student:\n    def __init__(self, name):\n        self.name = name\n\nprint(Student('Ravi').name)", "Ravi", ["__init__", "self"], { difficulty: "Intermediate" }),
  e("instance-method", "Define an Instance Method", "Object-Oriented Programming", "class Rectangle:\n    def __init__(self, length, width):\n        self.length = length\n        self.width = width\n\n    def area(self):\n        return self.length * self.width\n\nprint(Rectangle(5, 3).area())", "15", ["Method", "Object state"], { difficulty: "Intermediate" }),
  e("class-variable", "Use a Class Variable", "Object-Oriented Programming", "class Student:\n    college = 'CodeBhavya'\n\nprint(Student.college)", "CodeBhavya", ["Class variable", "Attribute"], { difficulty: "Intermediate" }),
  e("inheritance", "Demonstrate Inheritance", "Object-Oriented Programming", "class Person:\n    def role(self):\n        return 'Person'\n\nclass Student(Person):\n    pass\n\nprint(Student().role())", "Person", ["Inheritance", "Base class"], { difficulty: "Intermediate" }),
  e("method-overriding", "Override a Method", "Object-Oriented Programming", "class Person:\n    def role(self):\n        return 'Person'\n\nclass Student(Person):\n    def role(self):\n        return 'Student'\n\nprint(Student().role())", "Student", ["Method overriding", "Polymorphism"], { difficulty: "Intermediate" }),
  e("super", "Call a Parent Constructor with super", "Object-Oriented Programming", "class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Student(Person):\n    def __init__(self, name, mark):\n        super().__init__(name)\n        self.mark = mark\n\nstudent = Student('Asha', 92)\nprint(student.name, student.mark)", "Asha 92", ["super()", "Inheritance"], { difficulty: "Intermediate" }),
  e("encapsulation-property", "Use a Property for Encapsulation", "Object-Oriented Programming", "class Account:\n    def __init__(self, balance):\n        self._balance = balance\n\n    @property\n    def balance(self):\n        return self._balance\n\nprint(Account(5000).balance)", "5000", ["property", "Encapsulation"], { difficulty: "Advanced" }),
  e("class-method", "Define a Class Method", "Object-Oriented Programming", "class Course:\n    platform = 'CodeBhavya'\n\n    @classmethod\n    def label(cls, name):\n        return f'{cls.platform}: {name}'\n\nprint(Course.label('Python'))", "CodeBhavya: Python", ["classmethod", "cls"], { difficulty: "Advanced" }),
  e("static-method", "Define a Static Method", "Object-Oriented Programming", "class Calculator:\n    @staticmethod\n    def add(a, b):\n        return a + b\n\nprint(Calculator.add(7, 8))", "15", ["staticmethod", "Class"], { difficulty: "Advanced" }),

  // 12. Exceptions and files
  e("try-except", "Handle Division by Zero", "Exceptions & Files", "try:\n    print(10 // 0)\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')", "Cannot divide by zero", ["try", "except", "ZeroDivisionError"], { difficulty: "Intermediate" }),
  e("multiple-exceptions", "Handle Multiple Exception Types", "Exceptions & Files", "value = 'abc'\ntry:\n    print(int(value))\nexcept (ValueError, TypeError) as error:\n    print(type(error).__name__)", "ValueError", ["Exception tuple", "ValueError"], { difficulty: "Intermediate" }),
  e("try-else-finally", "Use try else and finally", "Exceptions & Files", "try:\n    result = 10 // 2\nexcept ZeroDivisionError:\n    print('Error')\nelse:\n    print(result)\nfinally:\n    print('Finished')", "5\nFinished", ["try", "else", "finally"], { difficulty: "Intermediate" }),
  e("raise-exception", "Raise a Custom Validation Error", "Exceptions & Files", "mark = -1\ntry:\n    if not 0 <= mark <= 100:\n        raise ValueError('Mark must be 0 to 100')\nexcept ValueError as error:\n    print(error)", "Mark must be 0 to 100", ["raise", "Validation"], { difficulty: "Intermediate" }),
  e("custom-exception", "Create a Custom Exception", "Exceptions & Files", "class AttendanceError(Exception):\n    pass\n\ntry:\n    raise AttendanceError('Attendance is below 75%')\nexcept AttendanceError as error:\n    print(error)", "Attendance is below 75%", ["Custom exception", "Inheritance"], { difficulty: "Advanced" }),
  e("write-read-file", "Write and Read a Text File", "Exceptions & Files", "from pathlib import Path\npath = Path('lesson.txt')\npath.write_text('Learn Python', encoding='utf-8')\nprint(path.read_text(encoding='utf-8'))", "Learn Python", ["pathlib", "File write", "File read"], { difficulty: "Intermediate" }),
  e("append-file", "Append Text to a File", "Exceptions & Files", "from pathlib import Path\npath = Path('notes.txt')\npath.write_text('C\\n', encoding='utf-8')\nwith path.open('a', encoding='utf-8') as file:\n    file.write('Python\\n')\nprint(path.read_text(encoding='utf-8').strip().replace('\\n', ', '))", "C, Python", ["with", "Append mode", "File"]),
  e("count-file-lines", "Count Lines in a File", "Exceptions & Files", "from pathlib import Path\npath = Path('topics.txt')\npath.write_text('Basics\\nLoops\\nFunctions\\n', encoding='utf-8')\nwith path.open(encoding='utf-8') as file:\n    print(sum(1 for _ in file))", "3", ["File iteration", "Generator"]),
  e("file-exists", "Check Whether a File Exists", "Exceptions & Files", "from pathlib import Path\npath = Path('created.txt')\npath.touch()\nprint(path.exists(), path.is_file())", "True True", ["pathlib", "exists()"]),
  e("stringio", "Use an In-memory Text File", "Exceptions & Files", "from io import StringIO\nbuffer = StringIO()\nbuffer.write('Python')\nbuffer.write(' Practice')\nprint(buffer.getvalue())", "Python Practice", ["StringIO", "File-like object"], { difficulty: "Advanced" }),

  // 13. Modules, dates and regular expressions
  e("math-module", "Use the Math Module", "Modules, Dates & Regular Expressions", "import math\nprint(math.sqrt(81), math.ceil(4.2), math.floor(4.8))", "9.0 5 4", ["math", "sqrt()"]),
  e("seeded-random", "Generate a Reproducible Random Number", "Modules, Dates & Regular Expressions", "import random\nrandom.seed(7)\nprint(random.randint(1, 10))", "6", ["random", "seed()"]),
  e("statistics-module", "Calculate Statistics", "Modules, Dates & Regular Expressions", "from statistics import mean, median, mode\nvalues = [2, 3, 3, 8]\nprint(mean(values), median(values), mode(values))", "4 3.0 3", ["statistics", "mean", "median"]),
  e("decimal-module", "Perform Exact Decimal Addition", "Modules, Dates & Regular Expressions", "from decimal import Decimal\nprint(Decimal('0.1') + Decimal('0.2'))", "0.3", ["Decimal", "Precision"]),
  e("fraction-module", "Add Rational Fractions", "Modules, Dates & Regular Expressions", "from fractions import Fraction\nprint(Fraction(1, 3) + Fraction(1, 6))", "1/2", ["Fraction", "Rational number"]),
  e("date-format", "Format a Date", "Modules, Dates & Regular Expressions", "from datetime import date\nvalue = date(2026, 9, 10)\nprint(value.strftime('%d-%m-%Y'))", "10-09-2026", ["datetime", "strftime()"]),
  e("date-difference", "Find the Difference Between Dates", "Modules, Dates & Regular Expressions", "from datetime import date\nstart = date(2026, 9, 1)\nend = date(2026, 9, 10)\nprint((end - start).days)", "9", ["date", "timedelta"]),
  e("regex-find-numbers", "Find Numbers with a Regular Expression", "Modules, Dates & Regular Expressions", "import re\ntext = 'C 200, DSA 106, ADS 112'\nprint(re.findall(r'\\d+', text))", "['200', '106', '112']", ["re", "findall()", "Regex"]),
  e("regex-email", "Validate an Email Pattern", "Modules, Dates & Regular Expressions", "import re\nemail = 'student@example.com'\npattern = r'^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$'\nprint(bool(re.fullmatch(pattern, email)))", "True", ["fullmatch()", "Regex"]),
  e("regex-replace-spaces", "Replace Repeated Spaces with Regex", "Modules, Dates & Regular Expressions", "import re\ntext = 'Learn   Python  daily'\nprint(re.sub(r'\\s+', ' ', text))", "Learn Python daily", ["re.sub()", "Whitespace"]),

  // 14. Functional and advanced Python
  e("map-function", "Transform Values with map", "Functional & Advanced Python", "values = [1, 2, 3, 4]\nprint(list(map(lambda value: value ** 2, values)))", "[1, 4, 9, 16]", ["map()", "lambda"], { difficulty: "Intermediate" }),
  e("filter-function", "Select Values with filter", "Functional & Advanced Python", "values = [1, 2, 3, 4, 5, 6]\nprint(list(filter(lambda value: value % 2 == 0, values)))", "[2, 4, 6]", ["filter()", "lambda"], { difficulty: "Intermediate" }),
  e("reduce-function", "Combine Values with reduce", "Functional & Advanced Python", "from functools import reduce\nvalues = [1, 2, 3, 4]\nprint(reduce(lambda a, b: a * b, values))", "24", ["reduce()", "functools"], { difficulty: "Intermediate" }),
  e("iterator-next", "Use an Iterator Explicitly", "Functional & Advanced Python", "iterator = iter(['C', 'DSA', 'Python'])\nprint(next(iterator))\nprint(next(iterator))", "C\nDSA", ["iter()", "next()"], { difficulty: "Intermediate" }),
  e("generator-function", "Create a Generator Function", "Functional & Advanced Python", "def countdown(number):\n    while number > 0:\n        yield number\n        number -= 1\n\nprint(list(countdown(4)))", "[4, 3, 2, 1]", ["yield", "Generator"], { difficulty: "Advanced" }),
  e("generator-expression", "Create a Generator Expression", "Functional & Advanced Python", "squares = (number ** 2 for number in range(1, 5))\nprint(tuple(squares))", "(1, 4, 9, 16)", ["Generator expression", "Lazy evaluation"], { difficulty: "Intermediate" }),
  e("decorator", "Create a Function Decorator", "Functional & Advanced Python", "def uppercase(function):\n    def wrapper():\n        return function().upper()\n    return wrapper\n\n@uppercase\ndef message():\n    return 'keep learning'\n\nprint(message())", "KEEP LEARNING", ["Decorator", "Closure"], { difficulty: "Advanced" }),
  e("closure", "Create a Closure", "Functional & Advanced Python", "def multiplier(factor):\n    def multiply(number):\n        return number * factor\n    return multiply\n\ndouble = multiplier(2)\nprint(double(12))", "24", ["Closure", "Nested function"], { difficulty: "Advanced" }),
  e("walrus-operator", "Use the Assignment Expression", "Functional & Advanced Python", "values = [2, 4, 6]\nif (total := sum(values)) > 10:\n    print(total)", "12", ["Walrus operator", "Assignment expression"], { difficulty: "Advanced" }),
  e("dataclass", "Create a Data Class", "Functional & Advanced Python", "from dataclasses import dataclass\n\n@dataclass\nclass Student:\n    name: str\n    mark: int\n\nprint(Student('Asha', 90))", "Student(name='Asha', mark=90)", ["dataclass", "Type annotation"], { difficulty: "Advanced" }),

  // 15. JSON, CSV and collections
  e("json-encode", "Encode a Dictionary as JSON", "JSON, CSV & Collections", "import json\ndata = {'course': 'Python', 'level': 1}\nprint(json.dumps(data, sort_keys=True))", "{\"course\": \"Python\", \"level\": 1}", ["json.dumps()", "Serialization"], { difficulty: "Intermediate" }),
  e("json-decode", "Decode a JSON String", "JSON, CSV & Collections", "import json\ntext = '{\"name\": \"Asha\", \"mark\": 90}'\ndata = json.loads(text)\nprint(data['name'], data['mark'])", "Asha 90", ["json.loads()", "Deserialization"], { difficulty: "Intermediate" }),
  e("csv-write-read", "Write and Read CSV Data", "JSON, CSV & Collections", "import csv\nwith open('marks.csv', 'w', newline='', encoding='utf-8') as file:\n    csv.writer(file).writerows([['name', 'mark'], ['Asha', 90]])\nwith open('marks.csv', newline='', encoding='utf-8') as file:\n    print(list(csv.reader(file)))", "[['name', 'mark'], ['Asha', '90']]", ["csv", "reader", "writer"], { difficulty: "Intermediate" }),
  e("counter", "Count Items with Counter", "JSON, CSV & Collections", "from collections import Counter\nprint(Counter('banana'))", "Counter({'a': 3, 'n': 2, 'b': 1})", ["Counter", "collections"], { difficulty: "Intermediate" }),
  e("defaultdict", "Group Values with defaultdict", "JSON, CSV & Collections", "from collections import defaultdict\ngroups = defaultdict(list)\nfor name in ['Asha', 'Anu', 'Ravi']:\n    groups[name[0]].append(name)\nprint(dict(groups))", "{'A': ['Asha', 'Anu'], 'R': ['Ravi']}", ["defaultdict", "Grouping"], { difficulty: "Intermediate" }),
  e("deque", "Use a Double-ended Queue", "JSON, CSV & Collections", "from collections import deque\nqueue = deque([2, 3])\nqueue.appendleft(1)\nqueue.append(4)\nprint(list(queue), queue.popleft())", "[1, 2, 3, 4] 1", ["deque", "appendleft", "popleft"], { difficulty: "Intermediate" }),
  e("namedtuple", "Create a Named Tuple", "JSON, CSV & Collections", "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\npoint = Point(3, 4)\nprint(point.x, point.y)", "3 4", ["namedtuple", "Attribute access"], { difficulty: "Intermediate" }),
  e("chainmap", "Combine Mappings with ChainMap", "JSON, CSV & Collections", "from collections import ChainMap\ndefaults = {'theme': 'light', 'size': 12}\nuser = {'theme': 'dark'}\nsettings = ChainMap(user, defaults)\nprint(settings['theme'], settings['size'])", "dark 12", ["ChainMap", "Mapping"], { difficulty: "Advanced" }),
  e("heapq", "Use a Priority Queue with heapq", "JSON, CSV & Collections", "import heapq\nvalues = [7, 2, 5, 1]\nheapq.heapify(values)\nprint([heapq.heappop(values) for _ in range(4)])", "[1, 2, 5, 7]", ["heapq", "Priority queue"], { difficulty: "Intermediate", time: "O(n log n)" }),
  e("bisect", "Insert into a Sorted List with bisect", "JSON, CSV & Collections", "from bisect import insort\nvalues = [1, 3, 5, 7]\ninsort(values, 4)\nprint(values)", "[1, 3, 4, 5, 7]", ["bisect", "insort()"], { difficulty: "Intermediate", time: "O(n)" })
];

if (programs.length !== 150) {
  throw new Error(`Expected 150 Python programs, received ${programs.length}.`);
}

module.exports = programs;
