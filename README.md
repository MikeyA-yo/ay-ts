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

Clone the repository:

```bash
git clone https://github.com/MikeyA-yo/ay-ts.git
```

Navigate to the project directory:

```bash
  cd ay-ts
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npx tsc
```

## Usage

To compile and run an AY program:

### Using the global installation

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

### Using the source installation

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
- `max(...numbers)`: Returns the largest of given numbers
- `min(...numbers)`: Returns the smallest of given numbers
- `pow(base, exponent)`: Returns base raised to exponent
- `sqrt(x)`: Returns square root
- `floor(x)`: Rounds down to nearest integer
- `ceil(x)`: Rounds up to nearest integer
- `exp(x)`: Returns e raised to the power of x
- `log(x)`: Returns natural logarithm
- `log10(x)`: Returns base-10 logarithm
- `log2(x)`: Returns base-2 logarithm

**Trigonometric Functions:**

- `sin(x)`: Returns sine (radians)
- `cos(x)`: Returns cosine (radians)
- `tan(x)`: Returns tangent (radians)
- `asin(x)`: Returns arcsine
- `acos(x)`: Returns arccosine
- `atan(x)`: Returns arctangent
- `atan2(y, x)`: Returns arctangent of y/x

**Trigonometric Identities:**

- `sec(x)`: Returns secant (1/cos(x))
- `csc(x)`: Returns cosecant (1/sin(x))
- `cot(x)`: Returns cotangent (1/tan(x))

**Degree-based Trigonometry:**

- `sind(degrees)`: Returns sine of degrees
- `cosd(degrees)`: Returns cosine of degrees
- `tand(degrees)`: Returns tangent of degrees
- `toRadians(degrees)`: Converts degrees to radians
- `toDegrees(radians)`: Converts radians to degrees

**Hyperbolic Functions:**

- `sinh(x)`: Returns hyperbolic sine
- `cosh(x)`: Returns hyperbolic cosine
- `tanh(x)`: Returns hyperbolic tangent
- `asinh(x)`: Returns inverse hyperbolic sine
- `acosh(x)`: Returns inverse hyperbolic cosine
- `atanh(x)`: Returns inverse hyperbolic tangent

**Mathematical Constants:**

- `pi()`: Returns π (3.14159...)
- `e()`: Returns Euler's number (2.71828...)

#### String Functions

- `len(str)`: Returns length of string
- `upper(str)`: Converts to uppercase
- `lower(str)`: Converts to lowercase
- `split(str, delimiter)`: Splits string into array
- `reverse(str)`: Reverses a string
- `join(arr, delimiter)`: Joins array elements into a string

#### Array Functions

- `push(arr, ...items)`: Adds items to array and returns modified array
- `pop(arr)`: Removes last item and returns modified array
- `sort(arr, compareFn?)`: Sorts array and returns it
- `reverse(arr)`: Reverses array and returns it
- `filter(arr, callback)`: Returns new filtered array
- `map(arr, callback)`: Returns new mapped array
- `slice(arr, start, end)`: Returns new sliced array
- `splice(arr, start, deleteCount, ...items)`: Modifies array and returns it
- `len(arr)`: Returns array length (also works with strings)
- `includes(arr, value)`: Checks if array contains value (also works with strings)
- `newArr(arr, size, fillValue?)`: Creates new array from existing with specified size and fill value

#### File System Functions

- `readFile(path)`: Reads file content
- `writeFile(path, content)`: Writes content to file
- `exists(path)`: Checks if file exists

#### HTTP Functions

- `httpGet(url)`: Makes HTTP GET request
- `httpPost(url, data)`: Makes HTTP POST request
- `awaitPromise(promise, onSuccess, onError)`: Handles async operations
- `awaitPromiseWithTimeout(promise, onSuccess, onError, timeout?)`: Handles promises with timeout
- `awaitAll(promises, onSuccess, onError)`: Handles multiple promises
- `logPromise(promise, label?, varName?)`: Logs promise execution

#### Date/Time Functions

- `now()`: Returns current timestamp
- `formatDate(date, format)`: Formats date string
- `parseDate(dateString)`: Parses date from string

### Example Using Built-in Functions

````ay
// Math operations
l numbers = [5, 2, 8, 1, 9]
l maxNum = max(5, 10)  // 10
l rounded = round(3.7) // 4

// String operations
l text = "Hello World"
l upperText = upper(text)        // "HELLO WORLD"
l textLength = len(text)         // 11
l words = split(text, " ")       // ["Hello", "World"]

// User input (synchronous)
l userName = inputSync("Enter your name: ")
print("Hello, " + userName + "!")

l age = inputSync("Enter your age: ")
l ageNum = parseInt(age)
if (ageNum >= 18) {
    print("You are an adult!")
} else {
    print("You are a minor!")
}

### Example Using Built-in Functions
```ay
// Math operations
l numbers = [5, 2, 8, 1, 9]
l maxNum = max(5, 10)  // 10
l rounded = round(3.7, 1) // 3.7 (rounded to 1 decimal place)

// String operations
l text = "Hello World"
l upperText = upper(text)        // "HELLO WORLD"
l textLength = len(text)         // 11
l words = split(text, " ")       // ["Hello", "World"]
l reversedText = reverse(text)   // "dlroW olleH"

// User input (synchronous)
l userName = input("Enter your name: ")
print("Hello, " + userName + "!")

l age = input("Enter your age: ")
l ageNum = parseInt(age)
if (ageNum >= 18) {
    print("You are an adult!")
} else {
    print("You are a minor!")
}

// Array operations
l fruits = ["apple", "banana"]
l moreFruits = push(fruits, "orange", "grape")  // ["apple", "banana", "orange", "grape"]
l sortedFruits = sort(moreFruits)               // ["apple", "banana", "grape", "orange"]
l firstTwo = slice(sortedFruits, 0, 2)          // ["apple", "banana"]
l hasApple = includes(sortedFruits, "apple")    // true

// Using def with built-ins
def log -> print
def length -> len
def ask -> input

log("Array length: " + length(sortedFruits))
l hobby = ask("What's your hobby? ")
log("Cool! You enjoy " + hobby)

// Math with new functions
l angle = 45
l radians = toRadians(angle)
l sineValue = sin(radians)
l randomBetween = randInt(1, 100)  // Random integer between 1-100
log("sin(45°) = " + sineValue)
log("Random number: " + randomBetween)
````

````

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
````

## Extending the Language

To add new features to the AY language:

1. Modify the parser in `parser/` to recognize new syntax.
2. Update the AST compiler in `parser/astcompiler.ts` to handle new AST nodes.
3. (Optional) Add new functions to the standard library in `functions/`.

## License

This project is licensed under the MIT License.
