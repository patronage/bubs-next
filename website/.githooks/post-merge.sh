#!/bin/sh

function changed {
  git diff --name-only HEAD@{1} HEAD | grep "^$1" > /dev/null 2>&1
}

if changed 'yarn.lock'; then
  echo "📦 yarn.lock changed. Run yarn install to bring your dependencies up to date."
fi

# todo: check for changes to acf-json folder
chmod -R 777 ../wordpress/wp-content/themes/headless/acf-json
