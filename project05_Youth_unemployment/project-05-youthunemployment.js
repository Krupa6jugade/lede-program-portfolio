// Setting up the canvas
(function() {
  var margin = {top: 20, right: 120, bottom: 40, left: 25},
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


 // Scales & Variables

 var regionStorage = d3.map()

 var parseDate = d3.timeParse("%Y-%m-%d")

 var xPositionScale = d3.scaleTime()
 	.domain([parseDate("2009-01-01"), parseDate("2016-10-01")])
 	.range([0,width])
 
 var yPositionScale = d3.scaleLinear()
 	.domain([0,70])
 	.range([height,0])


 var colorScale = d3.scaleOrdinal()
 	.domain(["N","W","S","E","X"])
 	.range(["#3a4a7c","#318F86","#ff5347","#e8d03a","#824884"])

 var line = d3.line()
 	.x(function(d){ return xPositionScale(d.datetime); })
 	.y(function(d){ return yPositionScale(d.Value); })
 	.curve(d3.curveMonotoneX)


 // Read in data

 d3.queue()
 	.defer(d3.csv, "Eurostat_Youth_Unemployment_data.csv", 
 		function(d){
 		d.datetime = parseDate(d.TIME)
 		d.Value = +d.Value
 		return d
 	}
 	)
 	.defer(d3.csv, 'regional.csv', function(c){
 		regionStorage.set(c.GEO, c)
 		return c
 	})
 	.await(ready)

 // Maniupulate data

 function ready (error, datapoints, regions){

// filter NaN out
 	datapoints = datapoints.filter(function(d){
 		return !isNaN(d.Value)
 	})

// group data by country
 	var nested = d3.nest()
 		.key(function(d){
 			return d.GEO
 		})
 		.entries(datapoints);

// draw lines and implement mouseover
 	svg.selectAll(".country-line")
 		.data(nested)
 		.enter().append("path")
 		.attr("d", function(d){
 				return line(d.values)
 		})
 		.attr("fill", "none")
 		.attr("id", function(d){
 			return d.key.replace(/ /g, "-")
 		})
 		.attr("class", function(c){
 			var regionalinfo = regionStorage.get(c.key)
 			return "country-line " + regionalinfo.Flag

 		})
 		.attr("stroke", function(d){
 			if(d.key === "Greece") { 
 				return "#ff5347"
 			} if(d.key === "Spain") { 
 				return "#ff5347"
 			} if(d.key === "EU-28"){
 				return "grey"
 			} else {
 				return "#CEC8EF"
 			}
 		})
 		.attr("stroke-width", "1.5px")
 // define hover effect
 		.on('mouseover', function(d){

 			d3.select(this)
 			 	.attr("stroke-width", "2.5px")
 			 	.attr("stroke", function(c){
 			 		var regionalinfo = regionStorage.get(c.key)
 					return colorScale(regionalinfo.Flag)
 			 	})
 			 	.raise()

 			d3.selectAll(".extra-label")
 				.remove()

          	d3.select("#label-"+d.key)
          		.classed("non-highlighted-label", false)
		 		.classed("highlighted-label", true)
 		})
    	.on('mouseout', function(d){
    		d3.select(this)
    			.attr("stroke-width", "1.5px")
    			.attr("stroke", function(d){
		 			if(d.key == "EU-28"){
		 				return "grey"
		 			} else {
		 				return "#CEC8EF"
		 			}
		 		})
		 		.raise()

          	d3.select("#label-"+d.key)
          		.classed("non-highlighted-label", true)
		 		.classed("highlighted-label", false)

		})

    	d3.select("#EU-28").raise()

// adding labels and not having them displayed by default
	svg.selectAll(".country-label")
		.data(nested)
		.enter().append("text")
		.attr("class", "country-label")
		.attr("id", function(d){
			return "label-" + d.key.replace(/ /g, "-")
		})
		.text(function(d){
			return d.key
		})
		.classed("non-highlighted-label", true)
		.attr("x", width)
		.attr("y", function(d){
			lastValue = d.values[d.values.length - 1]
			return yPositionScale(lastValue.Value)
		})
		.style("fill", function(c){
	 		var regionalinfo = regionStorage.get(c.key)
			return colorScale(regionalinfo.Flag)
	 	})
	 	.style("font-weight", "bold")


// adding default labels for Spain and Greece, that dissappear after first interaction

	svg.append("text")
		.text("EU-28")
		.attr("class", "extra-label")
		.attr("x", width)
		.attr("y", height-110)
		.style("fill", "grey")

	svg.append("text")
		.attr("class", "extra-label")
		.text("Greece")
		.attr("x", width)
		.attr("y", height-290)
		.style("fill", "#ff5347")
		.style("font-weight", "bold")


	svg.append("text")
		.attr("class", "extra-label")
		.text("Spain")
		.attr("x", width)
		.attr("y", height-260)
		.style("fill", "#ff5347")
		.style("font-weight", "bold")
		

// on clicking buttons, highlight all coutnries with the selected regional class
	    function highlight_region(regionclass){
	   		
	   		svg.selectAll(".extra-label")
	   			.classed("non-highlighted-label", true)

	   		svg.selectAll(".country-label")
	   			.classed("non-highlighted-label", true)

	   		svg.selectAll(".country-line")
				.attr("stroke", function(d){
					if(d.key === "EU-28"){
						return "grey"
					} else {
						return "#CEC8EF"
					}
			})
				.attr("stroke-width", "1.5px")
				.classed("highlighted", false)
				.lower()

			d3.select("#EU-28").raise()

	    	svg.selectAll("." + regionclass)
	    		.attr("stroke", colorScale(regionclass))
	    		.attr("stroke-width", "2.5px")
	    		.classed("highlighted", true)
	    		.raise()
	    }


	    d3.select("#northern")
	    	.on("click", function(){
	    		highlight_region("N")
	    	})

	    d3.select("#western")
	    	.on("click", function(){
	    		highlight_region("W")
	    	})


	    d3.select("#southern")
	    	.on("click", function(){
	    		highlight_region("S")
	    	})


	    d3.select("#eastern")
	    	.on("click", function(){
	    		highlight_region("E")
	    	})


	    d3.select("#others")
	    	.on("click", function(){
	    		highlight_region("X")
	    	})

	   	d3.select("#reset")
	   		.on("click", function(){
	   			svg.selectAll(".country-line")
	   				.classed("highlighted", false)
	   				.attr("stroke", function(d){
 						if(d.key === "EU-28"){
 							return "grey"
 						} else {
 							return "#CEC8EF"
 						}
 					})

 				d3.select("#EU-28").raise()

 				svg.selectAll(".country-label")
 					.classed("non-highlighted-label", true)
	   		})

// dropdown menu effects: Highlight selected country's line and add a label
	
	d3.select("#selection-one")
		.on("change", function(){
			var result_one = this.value

			d3.select("#EU-28").raise()

			d3.select("#"+result_one)
				.attr("stroke-width", "2.5px")
				.classed("highlighted", true)
				.raise()	

			d3.select("#label-"+result_one)
				.classed("non-highlighted-label", false)
				.classed("highligted-label", true)
		})


	d3.select("#selection-two")
		.on("change", function(){
			d3.select("#EU-28").raise()

			var result_two = this.value

			d3.select("#"+result_two)
				.attr("stroke-width", 2.5)
				.classed("highlighted", true)
				.raise()

			d3.select("#label-"+result_two)
				.classed("non-highlighted-label", false)
				.classed("highligted-label", true)

		})


// Axes
	var xAxis = d3.axisBottom(xPositionScale)
		.tickArguments([d3.timeYear.every(1)])
		.tickFormat(d3.timeFormat("%Y"))

      svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale)
      	.ticks(7)

      svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 12)
        .attr("text-anchor", "end")
        .text("Unemployment Rate [%]");

 }

})();