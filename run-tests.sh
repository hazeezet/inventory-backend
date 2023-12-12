#!/bin/bash

# Get the user input for the group to run
read -p "Enter the test group to run (default: all): " group

# If the user input is 'all' or nothing, run all groups
if [ "$group" = "all" ] || [ -z "$group" ]; then
  ts-mocha -p test/tsconfig.json "test/**/*.test.ts"
else
  ts-mocha -p test/tsconfig.json "test/routes/$group/**/*.test.ts"
fi
