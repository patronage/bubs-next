# Linting

To ensure consistent formatting across developres, we include congifurations for Prettier (code formatting), ESLint (JS), and StyleLint (SCSS) to apply consistent styles.

Inside of the `website` folder, you can run `yarn eslint` to list issues, or `yarn eslint:fix` to automatically fix what is possible.

Similarly to lint stylesheets, you can run `yarn stylelint` or `yarn stylelint:fix`.

To lint as you go, we reccomend configuring your editor to use this config and apply fixes on save, and display warnings. For VSCode, you can do that by installing the eslint, prettier and stylelint plugins.

To ensure we're using our project specified configuration, you'll want to open settings via `Preferences: Open Settings (JSON)`, and add the following rules:

```json
// Global default is to use built-in prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  // For our JS and SCSS Files, we want project defined versions
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[scss]": {
    "editor.formatOnSave": false
  },
  "files.associations": {
    "*.js": "javascript",
    "*.scss": "scss"
  },
  // Turn on auto-fixing for project defined linters.
  "editor.codeActionsOnSave": {
    // For ESLint
    "source.fixAll.eslint": true,
    // For TSLint
    "source.fixAll.tslint": true,
    // For Stylelint
    "source.fixAll.stylelint": true
  }
```

In addittion to these editor configurations, we have a githook installed via husky to run prettier on changed files via [pretty-quick](https://github.com/azz/pretty-quick).
