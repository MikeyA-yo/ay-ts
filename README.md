# AY Language Compiler

## Introduction
AY is a simple, custom programming language designed for experimentation and learning. This compiler translates AY programs into JavaScript, allowing you to run your AY code in any JavaScript environment.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MikeyA-yo/ay-ts.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ay-ts
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
To compile and run an AY program:
1. Write your AY code in a file with the `.ay` extension (e.g., `myprogram.ay`).
2. Compile the program:
   ```bash
   node index.js myprogram.ay
   ```
3. The compiler will generate a JavaScript file (e.g., `myprogram.js`).
4. Run the generated JavaScript file using Node.js:
   ```bash
   node myprogram.js
   ```

## Language Features

### Variable Declaration
Variables are declared using the `l` keyword and are block-scoped:
```ay
l a = "hello";
l b = 42;
```

### Functions
Functions are declared using the `f` keyword:
```ay
f add(a, b) {
    l c = a + b;
    return c;
}
```

### Control Flow
#### If-Else
```ay
if (a == b) {
    return true;
} else if (c == b) {
    return "true";
} else {
    return false;
}
```

#### Loops
**While Loop**:
```ay
l i = 0;
while (i < 5) {
    print(i);
    i++;
}
```

**For Loop**:
```ay
for (l i = 0; i < 8; i++) {
    print(i);
}
```

### Comments
Single-line comments:
```ay
// This is a single-line comment
```

Multi-line comments:
```ay
/*
This is a multi-line comment.
*/
```

### Standard Library
The AY language includes a standard library with the following functions:
- `print(value)`: Prints a value to the console.
- `rand()`: Returns a random number between 0 and 1.
- `round(value)`: Rounds a number to the nearest integer.

### Example Program
```ay
l a = "my program variables are nicely scoped"; 
l b = "hello world";

l c = 3 + 3;

l d = round(rand() * 12);

l arr = [
    1,
    3,
    5,
    7,
];

f add(a, b) {
    l c = a + b;
    return c;
}

if (a == b) {
    return true;
} else if (c == b) {
    return "true";
} else {
    return false;
}

f foo(a) {
    if (a > 0) {
        l result = add(a, a);
        return result;
    }
}

l i = 0;
while (i < 5) {
    print(i);
    i++;
}

for (l i = 0; i < 8; i++) {
    print(i);
}

foo(20);
```

## Extending the Language
To add new features to the AY language:
1. Modify the parser in `parser/` to recognize new syntax.
2. Update the AST compiler in `parser/astcompiler.ts` to handle new AST nodes.
3. (Optional) Add new functions to the standard library in `functions/`.

## License
This project is licensed under the MIT License.
