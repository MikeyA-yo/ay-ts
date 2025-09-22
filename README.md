# AY Language Compiler

## Introduction
AY is a simple, custom programming language designed for experimentation and learning. This compiler translates AY programs into JavaScript, allowing you to run your AY code in any JavaScript environment.

## Installation

### Option 1: Install from npm (Recommended)
Install the AY compiler globally using npm:
```bash
npm install -g ayscript
```

### Option 2: Install from source
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
4. Build the project:
   ```bash
   npx tsc
   ```

## Usage
To compile and run an AY program:

### Using the global installation:
1. Write your AY code in a file with the `.ay` extension (e.g., `myprogram.ay`).
2. Compile the program:
   ```bash
   ayc myprogram.ay
   ```
3. The compiler will generate a JavaScript file (e.g., `myprogram.js`).
4. Run the generated JavaScript file using Node.js:
   ```bash
   node myprogram.js
   ```

### Using the source installation:
1. Write your AY code in a file with the `.ay` extension (e.g., `myprogram.ay`).
2. Compile the program:
   ```bash
   node dist/index.js myprogram.ay
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

### Aliases with `def` Keyword
The `def` keyword allows you to create aliases for language constructs, making your code more readable:
```ay
// Create aliases for common keywords
def var -> l
def fn -> f
def brk -> break
def cnt -> continue

// Now use your custom aliases
var userName = "Alice"
fn greet(name) {
    return "Hello, " + name + "!"
}

var message = greet(userName)
print(message)

// Use in control flow
var counter = 0
while (counter < 10) {
    if (counter == 5) {
        brk  // Using the alias for break
    }
    counter++
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
The AY language includes a comprehensive standard library with the following functions:

#### Core Functions
- `print(value)`: Prints a value to the console
- `rand()`: Returns a random number between 0 and 1
- `round(value)`: Rounds a number to the nearest integer

#### Math Functions
- `abs(x)`: Returns absolute value
- `max(a, b)`: Returns the larger of two numbers
- `min(a, b)`: Returns the smaller of two numbers
- `pow(base, exponent)`: Returns base raised to exponent
- `sqrt(x)`: Returns square root
- `floor(x)`: Rounds down to nearest integer
- `ceil(x)`: Rounds up to nearest integer

#### String Functions
- `len(str)`: Returns length of string
- `upper(str)`: Converts to uppercase
- `lower(str)`: Converts to lowercase
- `substr(str, start, length)`: Returns substring
- `replace(str, search, replace)`: Replaces text in string
- `split(str, delimiter)`: Splits string into array

#### Array Functions
- `push(arr, ...items)`: Adds items to array and returns modified array
- `pop(arr)`: Removes last item and returns modified array
- `sort(arr, compareFn?)`: Sorts array and returns it
- `reverse(arr)`: Reverses array and returns it
- `filter(arr, callback)`: Returns new filtered array
- `map(arr, callback)`: Returns new mapped array
- `slice(arr, start, end)`: Returns new sliced array
- `splice(arr, start, deleteCount, ...items)`: Modifies array and returns it
- `len(arr)`: Returns array length

#### File System Functions
- `readFile(path)`: Reads file content
- `writeFile(path, content)`: Writes content to file
- `exists(path)`: Checks if file exists

#### HTTP Functions
- `httpGet(url)`: Makes HTTP GET request
- `httpPost(url, data)`: Makes HTTP POST request
- `awaitPromise(promise, onSuccess, onError)`: Handles async operations

#### Date/Time Functions
- `now()`: Returns current timestamp
- `formatDate(date, format)`: Formats date string
- `parseDate(dateString)`: Parses date from string

### Example Using Built-in Functions
```ay
// Math operations
l numbers = [5, 2, 8, 1, 9]
l maxNum = max(5, 10)  // 10
l rounded = round(3.7) // 4

// String operations
l text = "Hello World"
l upperText = upper(text)        // "HELLO WORLD"
l textLength = len(text)         // 11
l words = split(text, " ")       // ["Hello", "World"]

// Array operations
l fruits = ["apple", "banana"]
l moreFruits = push(fruits, "orange", "grape")  // ["apple", "banana", "orange", "grape"]
l sortedFruits = sort(moreFruits)               // ["apple", "banana", "grape", "orange"]
l firstTwo = slice(sortedFruits, 0, 2)          // ["apple", "banana"]

// Using def with built-ins
def log -> print
def length -> len

log("Array length: " + length(sortedFruits))
```

### Example Program
```ay
// Define custom aliases for better readability
def var -> l
def fn -> f

// Variables and basic operations
var message = "Welcome to AY Language!"
var numbers = [3, 1, 4, 1, 5, 9]

// String operations
var upperMessage = upper(message)
print(upperMessage)

// Array operations
var sortedNumbers = sort(numbers)
var arrayLength = len(sortedNumbers)
print("Sorted array: " + sortedNumbers)
print("Length: " + arrayLength)

// Math operations
var randomValue = round(rand() * 100)
var maxValue = max(randomValue, 50)
print("Random value: " + randomValue)
print("Max of random and 50: " + maxValue)

// Functions with multiple parameters
fn calculate(a, b, c, d) {
    var sum = a + b + c + d
    var average = sum / 4
    return average
}

var result = calculate(10, 20, 30, 40)  // 25
print("Average: " + result)

// Control flow
var counter = 0
while (counter < 5) {
    if (counter == 3) {
        print("Halfway there!")
    }
    print("Counter: " + counter)
    counter++
}

// HTTP operations (async)
var promise = httpGet("https://api.github.com/users/octocat")
awaitPromise(promise, fn(data) {
    print("GitHub user data received!")
}, fn(error) {
    print("Error: " + error)
})
```

## Extending the Language
To add new features to the AY language:
1. Modify the parser in `parser/` to recognize new syntax.
2. Update the AST compiler in `parser/astcompiler.ts` to handle new AST nodes.
3. (Optional) Add new functions to the standard library in `functions/`.

## License
This project is licensed under the MIT License.
