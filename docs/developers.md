# Linting

To ensure consistent formatting across developres, we include congifurations for Prettier (code formatting), ESLint (JS), and StyleLint (SCSS) to apply consistent code style.

## Via CLI

Inside of the `website` folder, you can run `yarn eslint` to list issues, or `yarn eslint:fix` to automatically fix what is possible. Similarly to lint stylesheets, you can run `yarn stylelint` or `yarn stylelint:fix`.

These commands will be run as a pre-commit hook using [Husky](https://github.com/typicode/husky/) + [lint-staged](https://github.com/okonet/lint-staged#configuration).

## Via Editor

To lint as you go, we reccomend configuring your editor to use this config and apply fixes on save, and display warnings. For VSCode, you can do that by installing the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [StyleLint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) plugins.

In our project we have a project level [.vscode](../.vscode) configuration that reccomends and configures these plugins for you. You can also optionally take that configuration, and save it to your own global vscode by opening `Preferences: Open Settings (JSON)`, and adding those rules:

For other editors, you'll want to use their versions of these plugins, making sure they are configured to use the project level congigurations.

## Confirming it's working

Paste and save this into a `.js` file. ESLint should fix formatting, and also make suggestions in the Problems panel.

```
function sayHello(name) {
  alert("Hello " + name);
}

name = "Douglas Crockford";
sayHello(name);
```

Paste and save this into a `.scss` file. StyleLint should fix formatting, and also make suggestions in the Problems panel.

```
a { & b { /* nesting depth 1 */ & .foo { /* nesting depth 2 */ @media print { /* nesting depth 3 */ & .baz { /* nesting depth 4 */color: pink;}}}}}.
```
