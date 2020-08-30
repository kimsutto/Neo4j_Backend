# Location Graph Webpage using Neo4j 

## Stack
* [Neo4j Bolt JavaScript Driver](https://github.com/neo4j/neo4j-javascript-driver)
* Neo4j
* Frontend: ES6, jquery, bootstrap, [d3.js](http://d3js.org/)
* Webpack for building web assets

### Setup
```bash
$ npm install
```

### Run locally

* Start Neo4j ([Download & Install](http://neo4j.com/download)) locally and open the [Neo4j Browser](http://localhost:7474). 
* Make Location dataset
* Clone this project from GitHub
* Run the App inside the Webpack Dev Server:

```bash
$ npm run dev

$ npm run build
```

When running in "dev" mode navigate to [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) to see the application.

After executing the `npm run build` command,  open local file "build/index.html" in your browser.

### Load CSV

```cypher
LOAD CSV WITH HEADERS FROM "file:///rank_geo.csv" AS row

WITH row.Total as Total, 
row.TourAttraction as Attraction,
row.Foreign as Foreign,
row.Alien as Alien,
row.Big_col as Big_col

Return Total, Attraction
```
