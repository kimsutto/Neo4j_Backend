require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
var Location = require('./models/Location');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
//local neo4j id, pass
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1004"));

function searchLocations(queryString) {
  var session = driver.session();
  return session 
    .run(
      'MATCH (location:Location) \
      WHERE location.label =~ $label \
      RETURN location',
      {label: '(?i).*' + queryString + '.*'}

    )
    .then(result => {
      session.close();
      return result.records.map(record => {
        return new Location(record.get('location'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function getDetail(label) {
  var session = driver.session();
  return session
    .run(
      'MATCH (location:Location) \
      WHERE location.label =~ $label \
      RETURN location LIMIT 1', {label})
    .then(result => {
      session.close();

      if (_.isEmpty(result.records))
        return null;

      var record = result.records[0];
      return new Location(record.get('location'));
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function getGraph() {
  var session = driver.session();
  return session.run(
    'MATCH (l:Location) \
    RETURN l.label AS label, l.category AS category, l.total AS total  \
    LIMIT toInteger($limit)', {limit : 200})
    .then(results => {
      session.close();
      var nodes = [], rels = [], i = 0;
      results.records.forEach(res => {
        nodes.push({title: res.get('label'), label: 'label', category : res.get('category'), total : res.get('total')});
        var target = i;
        i++;
      });

      return {nodes, links: rels};
    });
}

exports.searchLocations = searchLocations;
exports.getDetail = getDetail;
exports.getGraph = getGraph;

