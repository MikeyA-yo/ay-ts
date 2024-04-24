#!/bin/bash

# Compile TypeScript to JavaScript
tsc semi.ts

# Run the compiled JavaScript file
node semi.js $1
# node out.js
# Clean up the compiled JavaScript file
rm semi.js