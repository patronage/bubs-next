# BUBS - A Wordpress Development Environment

Bubs is Patronage's open-source Wordpress development environment. 

## Getting Started (Docker)

### Prerequisites 

You should have the following installed and ready in your development environment:

* `composer`
* `Node.js`
* `nvm`
* `Yarn Package Manager`
* `Sequel Pro` or a SQL GUI to import site database

### 1. Install Docker

Install Docker on your computer. [Here's a link to the Desktop Installer](https://www.docker.com/products/docker-desktop).

### 2. Checkout this repo and prepare local dependencies

Run the following in your terminal

* `composer install`
* `yarn`

### 3. Start Docker and development environment

Run in Terminal

* `docker-compose up`

### 4. Get Started

* Open a browser tab to (http://localhost:3000)[http://localhost:3000]. When you make a CSS or Twig change, the site should live reload the changes!

### 5. Wrapping up development

* Open Docker Desktop, and click the "stop" button to turn off Docker and make your computer a little faster and less warm:

![image](https://user-images.githubusercontent.com/525011/77448037-c5573380-6dc6-11ea-8bdd-e9d4025d671d.png)

### 6. Updating SQL database with newer SQL

First save your new DB file (.sql, .zip, or .gz) to the `_data` folder. to check the option to drop tables. Then run `yarn db` to import.

Alternatively, you can use Sequel Pro or another client and import manually.

To connect from Sequel Pro to explore the database, use the following settings:

Host: `127.0.0.1`
User: `wordpress`
Pass: `wordpress`
Port: `3307`

## Development

Note that you must use Yarn, and not NPM to manage client-side dependencies. This is because certain libraries which formerly used bower aren't in NPM, and only Yarn can install packages from any github repo.

### Setting up the theme

The default setup has two commands:

* `gulp` -- starts a dev task with dev versions of assets, and live reloading via BrowserSync and watch
* `gulp release` -- builds production versions of all assets, including asset-hashed files

All assets are stored in `wp-content/themes/timber`.

### Deploying

The `_build` folder has our deploy scripts:

* to manually deploy to staging from your current branch, run `./_build/deploy.sh staging`
* to manually deploy to production from your current branch, run `./_build/deploy.sh production`

During the deploy process `gulp release` will run using JSHint which will alert you in the terminal for any warnings/errors. We are only looking at js files in the `build:js` block of `layout.twig` and we have it set to skip any `/vendor` js files.

Gulp will fail if there are any warnings/errors, some of which you may want to ignore which you can do with the following comments:

```
A directive for telling JSHint to ignore a block of code.

// Code here will be linted with JSHint.
/* jshint ignore:start */
// Code here will be ignored by JSHint.
/* jshint ignore:end */

All code in between ignore:start and ignore:end won't be passed to JSHint so you can use any language extension such as Facebook React. Additionally, you can ignore a single line with a trailing comment:

ignoreThis(); // jshint ignore:line
```

You can read more about [JSHint here](https://jshint.com/docs/)

### Based on Bubs

This project is based on [Bubs](https://github.com/patronage/bubs/) by [Patronage](http://www.patronage.org/).

For more docs on getting started with local hosting, multi-site, etc. visit the wiki:
https://github.com/patronage/bubs/wiki
