var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load the data
d3.csv("data/data.csv").then(function (data) {
  	console.log(data[0]["MSZoning"]);

  	// x axis for graph
 	var neighborhoods = [];
 	var zones = [];
 	var maxPrice = data[0]["SalePrice"];
 	var minPrice = data[0]["SalePrice"];

	for (var i=0;i<data.length;i++){
		if(!neighborhoods.includes(data[i]["Neighborhood"])){
			neighborhoods.push(data[i]["Neighborhood"]);
			console.log(data[i]["Neighborhood"]);
		}


		if(!zones.includes(data[i]["MSZoning"])){
			zones.push(data[i]["MSZoning"]);
			console.log(data[i]["MSZoning"]);
		}

		if(data[i]["SalePrice"] > parseInt(maxPrice)){
			console.log("new max");
			maxPrice = data[i]["SalePrice"];
		}

		if(parseInt(data[i]["SalePrice"]) < parseInt(minPrice)){
			minPrice = data[i]["SalePrice"];
		}
	}

	console.log("Highest Sell: "+maxPrice);
	console.log("Lowest Sell: "+minPrice);

	var g = d3.select("#chart-area")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left +
		", " + margin.top + ")");


	// x axis label
	var xLabel = g.append("text")
		.attr("y", height + 50)
		.attr("x", width / 2)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Neighborhood");

	// y axis label
	var yLabel = g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -40)
		.attr("x", -170)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Sale Price")



	// scale for the x axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(neighborhoods);

    // scale for the y axis
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([minPrice, maxPrice]);

     // x axis call
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");

    // y axis call
    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));



    g.selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (s) {
            return x(s["Neighborhood"]);
        })
        .attr("cy", function (s) {
            return y(s["SalePrice"]);
        })
        .attr("r", 2);

});