var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 700 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load the data
d3.csv("data/data.csv").then(function (data) {
  	
  	// x axis for graph
 	var neighborhoods = [];
 	var zones = [];
 	var maxPrice = data[0]["SalePrice"];
 	var minPrice = data[0]["SalePrice"];

	for (var i=0;i<data.length;i++){
		if(!neighborhoods.includes(data[i]["Neighborhood"])){
			neighborhoods.push(data[i]["Neighborhood"]);
			//console.log(data[i]["Neighborhood"]);
		}


		if(!zones.includes(data[i]["MSZoning"])){
			zones.push(data[i]["MSZoning"]);
			//console.log(data[i]["MSZoning"]);
		}

		if(data[i]["SalePrice"] > parseInt(maxPrice)){
			//console.log("new max");
			maxPrice = data[i]["SalePrice"];
		}

		if(parseInt(data[i]["SalePrice"]) < parseInt(minPrice)){
			minPrice = data[i]["SalePrice"];
		}
	}

	for (var i=0;i<zones.length;i++){
		console.log(zones[i]);
	}

	var select = document.getElementById("drop-down");
	for (var i=0;i<zones.length;i++){
		select.options[select.options.length] = new Option(zones[i],zones[i]);
	}

	var colorScheme = d3.scaleOrdinal()
		.domain(zones)
		.range(d3.schemeDark2 );
	console.log(colorScheme);

	console.log("Highest Sell: "+maxPrice);
	console.log("Lowest Sell: "+minPrice);

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
        .text("House Sale Price By Neighborhood");

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


    // add the legend
    var legend = g.append("g")
        .attr("class", "legend")
        .attr("x", 0)
        .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);

    // rectangles for legend
    legend.selectAll('g')
        .data(zones)
        .enter()
        .append("rect")
        .attr("y", function(d,i) {
        	return i * 25;
        })
        .attr("x", width)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) {
        	return colorScheme(d);
        });

    // text for legend
    legend.selectAll('g')
        .data(zones)
        .enter()
        .append("text")
        .attr("y", function(d,i) {
        	return (i * 25)+12;
        })
        .attr("x", width - 50)
        .text(function (d) {
            return d
        });

    function drawAll() {
    	g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (s) {
            return 15+x(s["Neighborhood"]);
        })
        .attr("cy", function (s) {
            return y(s["SalePrice"]);
        })
        .attr("r", 4)
        .attr("fill", function (s) {
        	return colorScheme(s["MSZoning"]);
        });
    }
    
    drawAll();
    circleHover();

    // on dropdown change
    d3.select("#drop-down")
        .on("change", function (d) {
            var zoneSelect = d3.select("#drop-down").node().value;
            console.log(zoneSelect);

            g.selectAll("circle")
            	.remove()
            	.exit();

           	g.selectAll("circle")
           		.data(data)
           		.enter()
	           	.append("circle")
	        	.attr("cx", function (s) {
	        		if (s["MSZoning"] == zoneSelect || zoneSelect == "All")
	            		return 15+x(s["Neighborhood"]);
	        	})
	        	.attr("cy", function (s) {
	        		if (s["MSZoning"] == zoneSelect || zoneSelect == "All")
	            		return y(s["SalePrice"]);
	        	})
	        	.attr("r", 4)
	        	.attr("fill", function (s) {
        			return colorScheme(s["MSZoning"]);
        		})
        		.attr("opacity",0)
        		.transition()
            	.duration(500)
        		.attr("opacity", function(s) {
        			if (s["MSZoning"] == zoneSelect || zoneSelect == "All")
        				return 1;
        			return 0;
        		});

	        	circleHover();           
        })

    // ensure hover capability
    function circleHover(){
    	g.selectAll("circle")
            .on("mouseover", function (s) {
                // bring to view
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                div.html("Sale Price was $"+s["SalePrice"]+"\n"+"Neighborhood is "+s["Neighborhood"]+"\n"+"Zoning: "+s["MSZoning"])
                	.style("left", (d3.event.pageX) + "px")
                	.style("top", (d3.event.pageY - 28) + "px");
                $(".tooltip").digits();
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
  
});

// Thanks @Paul Creasey for the regex
$.fn.digits = function () {
    return this.each(function () {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    })
}