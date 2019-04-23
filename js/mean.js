var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 950 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;


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
	for (var i=0;i<jData.length;i++){
		// actual calculation
		means[i] = (jData[i].Houses.reduce(function (sum, price) { return sum + price.Price;},0))/jData[i].Houses.length;
		console.log(means[i]);
	}

	
	var colorScheme = d3.scaleOrdinal()
		.domain(neighborhoods)
		.range(d3.schemeDark2 );
	console.log(colorScheme);










});