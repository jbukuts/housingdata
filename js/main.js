var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("data/data.csv").then(function (data) {
  console.log(data[0]["SalePrice"]);

  // min and max amount of breaches per state
  var min = Math.min(...states_amount);
  var max = Math.max(...states_amount);


});