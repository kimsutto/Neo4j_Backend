var api = require('./neo4jApi');

$(function () {
  renderGraph();
  search();

  $("#search").submit(e => {
    e.preventDefault();
    search();
  });
});

function stringNumberToInt(stringNumber){
  return parseInt(stringNumber.replace(/,/g , ''));
}

function showDetail(label) {
  api
    .getDetail(label)
    .then(location => {
      if (!location) return;

      $("#title").text(location.label);
      var $list = $("#crew").empty();
      $list.append($("<li>" + "분류 : " + location.category + "</li> " + "<li>" + "주소 : " +location.address + "</li>" + "<li>" + "위도 : " + location.latitude + "</li>" + "<li>" + "경도 : " + location.longitude + "</li>"));
    }, "json");
}


function search() {
  var query = $("#search").find("input[name=search]").val();
  api
    .searchLocations(query)
    .then(locations => {
      var t = $("table#results tbody").empty();

      if (locations) {
        locations.forEach(Location => {
          $("<tr><td class='location'>" + Location.label + "</td><td>" + Location.category + "</td><td>" + Location.total + "</td></tr>").appendTo(t)
            .click(function() {
              showDetail($(this).find("td.location").text());
            })
        });
      }
    });
}



function renderGraph() {
  var width = 800, height = 800;
  var force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  var svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("pointer-events", "all");

  api
    .getGraph()
    .then(graph => {
      force.nodes(graph.nodes).links(graph.links).start();
      //force.nodes(graph.nodes).start();
      var link = svg.selectAll(".link")
        .data(graph.links).enter()
        .append("line").attr("class", "link");

      var node = svg.selectAll(".node")
        .data(graph.nodes).enter()
        .append("circle")
        .attr("class", d => {
          return "node " + d.category
        })
        //.attr("r", 10)
        .attr("r", d => {
          //console.log(stringNumberToInt(d.total)/100000);
          return stringNumberToInt(d.total)/100000
        })
        .call(force.drag);

      node.append("title")
        .text(d => {
          return d.title;
        });

      force.on("tick", () => {
        /*
        link.attr("x1", d => {
          return d.source.x;
        }).attr("y1", d => {
          return d.source.y;
        }).attr("x2", d => {
          return d.target.x;
        }).attr("y2", d => {
          return d.target.y;
        });*/

        node.attr("cx", d => {
          return d.x;
        }).attr("cy", d => {
          return d.y;
        });
      });
    });
}
