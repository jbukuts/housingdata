var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 700 - margin.top - margin.bottom,
    width = 900 - margin.left - margin.right;


d3.csv("data/data.csv").then(function (data) {
	// json data
	var jData = [];

	// different neighborhoods
	var neighborhoods = [];

	// mean vals for each neighborhood
	var means = [];

	for (var i=0;i<data.length;i++){
		// find new neighborhoods
		if(!neighborhoods.includes(data[i]["Neighborhood"])){
			// create object for new neighborhood
			var tmp = new Object();
			// give properties
			tmp.Neighborhood = data[i]["Neighborhood"];
			tmp.Houses = [];
			// push to array
			jData.push(tmp);
			neighborhoods.push(data[i]["Neighborhood"]);
			means.push(0);
		}

		// add new house to proper neighborhood json
		for (var j=0;j<jData.length;j++){
			if (jData[j].Neighborhood == data[i]["Neighborhood"]){
				var tmp = new Object();
				tmp.Price = parseInt(data[i]["SalePrice"]);
				jData[j].Houses.push(tmp);
			}
		}
	}

	console.log(jData);

	// calculate means
	// actual calculation
	for (var i=0;i<jData.length;i++){
		means[i] = (jData[i].Houses.reduce(function (sum, price) { return sum + price.Price;},0))/jData[i].Houses.length;
		console.log(means[i]);
	}

	// range of the y axis
	console.log(Math.min(...means)+", "+Math.max(...means));


	var g = d3.select("#chart-area")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left +
		", " + margin.top + ")");


	// adds the title for the chart
    g.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Mean Sale Price By Neighborhood");

    // x axis label
	var xLabel = g.append("text")
		.attr("y", height + 75)
		.attr("x", width/2)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Neighborhood");


	// y axis label
	var yLabel = g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -60)
		.attr("x", -(height/2))
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Mean Sale Price");

	// scale for the x axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(neighborhoods);


    // scale for the y axis
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([Math.min(...means),Math.max(...means)]);

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

	
	var colorScheme = d3.scaleOrdinal()
		.domain(neighborhoods)
		.range(d3.schemeDark2 );
	console.log(colorScheme);




	g.selectAll(".bar")
		.data(jData)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(s,i) { return i*(width/jData.length)})
		.attr("width", x.bandwidth())
		.attr("y", function(d,i) { return y(means[i]);})
		.attr("height", function(d,i) { return height - y(means[i]); })
		.attr("fill", function (s) {
        	return colorScheme(s.Neighborhood);
        });











});