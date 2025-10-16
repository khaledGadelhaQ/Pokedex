# Pokedex

### Assignment Overview:

Your task is to develop a fullstack application using the following technologies:
- Backend: Nest.js 
- Frontend: Vue.js
- Architecture: Monorepo setup (backend and frontend in the same repository)

Please make sure:
- The frontend uses your own backend as the data source.
- Follow the instructions strictly in the assignment
- Your solution includes clear setup instructions in a README file so we can run the project.
- You provide access to the repository (GitHub, GitLab, Bitbucket, or similar).

### Front-End

#### Description
The client has always been a big fan of the original 151 Pokémon, and would like to have an app that can serve as their Pokédex. They’d like to browse through the Pokemon, search, manage their favourites, and more.

The’ve provided a list of things they want in the app (required), and also some extra’s (nice to have) if time allows it.

Additionally they want this app to:

Be published in an online Git repository (Github, Bitbucket, …)

Have clean commits

Uses some open source packages (don’t reinvent the wheel), but be able to explain why.

#### UI

the Figma Design is available here:
https://www.figma.com/file/QeWa9FEHrAO6lqa5V6pQ8K/Sollicitatie-test?node-id=2%3A23

IMPORTANT: this figma design include the UI/UX for an app and IPad and not a web version so we need to 
implement the IPad version as the main page of the website and when the user access the website from a small
screen like phone it should be switched to the phone UI/UX aka Responsive Design

#### Network

A custom API is provided, based on the official PokéAPI(https://pokeapi.co/), although with some differences. An OpenAPI documentation can be found here(https://appwise-be.stoplight.io/docs/pokemon/52335a540da77-front-end).

Most importantly, use these calls:

List of Pokémon: https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon

Details of a Pokémon: https://pokeapi.co/api/v2/pokemon/133 (replace 133 by ID of your item)

NOTE: do NOT embed the list JSON into your project, it must be fetched via network.


#### Requirements

A basic list of functionality the app should have:

Trainers can see a list of Pokémon with some general information, such as name, number, picture and types.

Trainers can search for Pokémon by name and number.

Trainers can see the details of a Pokémon, with the general info (name, number, picture, types) but also things like abilities, move set and stats.

Trainers can see a bigger version of the picture of a Pokémon (from the details of one). Include zoom & pan. (for web: we’re looking for a lightbox component)

Trainers can mark a Pokémon as favourite (or remove it from favourites).

Trainers have a separate list with only their favourite Pokémon.


#### Nice to have:

Besides their favourites, trainers would also like to manage their team of Pokémon. A trainer’s team is limited to 6 Pokémon.

Trainers would like to see more than one picture for Pokémon if available on the detail screen (think carousel like UI).

Trainers would like to see the evolutions of a Pokémon if available, from the detail screen. Given a details API response, you’ll need to get the species detail first using https://pokeapi.co/api/v2/pokemon-species/133, from which you can get the evolution chain using https://pokeapi.co/api/v2/evolution-chain/67.

Trainers are always on the road in search of new Pokémon so they don’t always have the best connection. The customer would like to have loading and error indicators when data can not be found or it takes long too long. 

Some trainers have large devices. Your implementation should scale gracefully to larger screens. Even better would be to have a “split view”, with the list of Pokémon on the left, and the details of one on the right.

Some trainers are forgetful, and don’t remember the name or number of a pokemon. Searching by type (such as “fire”) should also be possible.

Trainers are used to seeing the stats of a Pokémon in the typical hexagon graph.


#### Specific requirements for web

Working with a JS Framework Vue

Usage of a package manager npm

Make use of routing to reflect the currently selected Pokémon in the URL.

Make sure the correct Pokémon is displayed when navigating directly to said URL.

Make the website responsive for different screen sizes (mobile first)

Make the mobile design a priority

Make sure the user-specific data (eg: liked Pokémon, etc…) persist between browser sessions

Make use of the essentials of your framework (when applicable) such as :

Components

Lifecycle hooks

Global state management (e.g. Getting Started | Vuex, Pinia 🍍)

Reactivity

Data binding

Props / slots

Routing

Use of external libraries when applicable (Don’t reinvent the wheel) (e.g. Axios)


Configure a linter to keep your code clean and consistent

Use Typescript and consistently type all of your functions and custom objects

Use of utility based css frameworks (e.g. Tailwind CSS - Rapidly build modern websites without ever leaving your HTML., Windi CSS)

Create a ‘404’ page for navigating to URL’s that don’t exist or are invalid

Use event debouncing/throttling when applicable

Make sure there is an indicator when loading new data, and make sure no old data is visible when changing selected Pokémon

### Backend

#### Description

The client has always been a big fan of the original 151 Pokémon, and would like to have an app that can serve as their Pokédex. They’d like to browse through the Pokemon, search, manage their favourites, and more. The app needs a REST api which needs to be developed.

The’ve provided a list of things they want in the app (required), and also some extra’s (nice to have) if time allows it.

Additionally they want this API to:

Be published in an online Git repository (Github, Bitbucket, …)

Have clean commits

Uses some open source packages (don’t reinvent the wheel), but be able to explain why.


#### Requirements

A basic list of functionality the back-end should have:

Implement the pre-defined OpenAPI spec. document (see attachment). This includes calls to:

Get a list of Pokémon

A Pokémon’s details

CRUD calls to manage a team (limited to 6)

Store Pokémons' information in a database

Use an ORM (we will be using Prisma) with clearly defined models for each entity

Use migrations as needed

Provide a command to import a dump / seed of Pokémon (see attachment).

You may need to transform this data before importing it into your database.

Provide a command to import a Pokémon from an external service (see docs), given an external ID or name as parameter.

#### Nice to have 

There are some extra’s the client would like (in order of preference):

Relations in Database

Testing

Authorization for the team routes using a hardcoded token (in Authorization header)

Save images from import (local file storage, database or S3)

Run in Docker

### Attachments 

pokemons.json
openapi.yaml

### Stack
Nest.js - Typescript - PostgreSQL - Prisma ORM 