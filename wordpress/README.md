# BUBS - A Wordpress Development Environment

Bubs is Patronage's open-source Wordpress development environment.

## Getting Started (Docker)

### Prerequisites

You should have the following installed and ready in your development environment:

- `composer`
- `Node.js`
- `nvm`
- `Yarn Package Manager`
- `Sequel Ace` or a SQL GUI to import site database

### 1. Install Docker

Install Docker on your computer. [Here's a link to the Desktop Installer](https://www.docker.com/products/docker-desktop).

### 2. Checkout this repo and prepare local dependencies

From the /wordpress directory, run the following in your terminal:

- `composer install`
- `yarn`

### 3. Start Docker and development environment

From the /wordpress directory, run the following in your terminal:

- `docker-compose up`

### 4. Get Started

- Open a browser tab to (http://localhost:8000/wp-login.php)[http://localhost:8000/wp-login.php].

### 5. Wrapping up development

- Open Docker Desktop, and click the "stop" button to turn off Docker and make your computer a little faster and less warm:

![image](https://user-images.githubusercontent.com/525011/77448037-c5573380-6dc6-11ea-8bdd-e9d4025d671d.png)

### 6. Updating SQL database with newer SQL

First save your new DB file (.sql, .zip, or .gz) to the `_data` folder. to check the option to drop tables. Then run `yarn db` to import.

Alternatively, you can use Sequel Pro or another client and import manually.

To connect from Sequel Pro to explore the database, use the following settings:

Host: `127.0.0.1`
User: `root`
Pass: `somewordpress`
Port: `3307`

Docker is configured to persist the database, and each project will use it's own DB name.

### Deploying

The `_build` folder has our deploy scripts:

- to manually deploy to staging from your current branch, run `./_build/deploy.sh staging`
- to manually deploy to production from your current branch, run `./_build/deploy.sh production`

### Based on Bubs

This project is based on [Bubs](https://github.com/patronage/bubs-next/) by [Patronage](http://www.patronage.org/).
