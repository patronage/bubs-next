#!/bin/bash

echo "start husky post merge hook"

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
  echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

# Example usage
check_run yarn.lock "yarn install"

echo "acf permissions check"
yarn acf
git config --local core.fileMode false

echo "end husky post merge hook"
