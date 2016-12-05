
// Setting up the canvas
(function() {
  var margin = {top: 40, right: 60, bottom: 40, left: 60},
      width = 860 - margin.left - margin.right,
      height = 1500 - margin.top - margin.bottom;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales

var boxwidth = 100
var dx = boxwidth / 2

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "The population of " + d.city + ", " + d.country + " is " + d.population_city ;
    })

var xPositionScale = d3.scalePoint().domain(["North America", "South America", "Africa", "Europe", "Asia", "Oceania"]).range([0, width]).padding(0.5);
var yPositionScale = d3.scaleLinear().domain([-90,90]).range([height, 0]);
var widthScale = d3.scaleLinear().domain([2000000,22315474]).range([5,boxwidth]);

svg.call(tip)

// Read in the data

d3.queue()
  .defer(d3.csv, 'largest_cities.csv', function(d){
      d.lat = +d.lat
      return d
    })
  .defer(d3.csv, 'continents.csv', function(c) {
      c.latS = +c.latS
      c.latN = +c.latN
      return c
  })
  .await(ready);

// Manipulating the data with d3

function ready(error, datapoints, continents) {

// Drawing the continent boxes
  svg.selectAll(".continents")
    .data(continents)
    .enter().append('rect')
    .attr("class", "continents")
    .attr("width", boxwidth)
    .attr("height", function(c){
      return yPositionScale(c.latS) - yPositionScale(c.latN)
    })
    .attr("x", function(d){
      return xPositionScale(d.continent)
    })
    .attr("y", function(c){
      return yPositionScale(c.latN)
    })
    .attr("fill", "#e8d245")

// Labeling the continent boxes
  svg.selectAll(".continent-label")
    .data(continents)
    .enter().append("text")
    .attr("class", "continent-label")
    .attr("x", function(c){
      return xPositionScale(c.continent)
    })
    .attr("dx", dx)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text(function(c) {
      return c.continent
    })

// Drawing city lines
  svg.selectAll(".cities")
    .data(datapoints)
    .enter().append("rect")
    .attr("class", "cities")
    .attr("width", function(d){
      return widthScale(d.population_city)
    })
    .attr("height", 2)
    .attr("y", function(d){
      return yPositionScale(d.lat)
    })
    .attr("x", function(d){
      return xPositionScale(d.continent)
    })
    .attr("fill", "#404e7c")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

 
// Labeling the city lines

  svg.selectAll(".city-label")
    .data(datapoints)
    .enter().append("text")
    .attr("class", "city-label")
    .attr("y", function(d){
      return yPositionScale(d.lat)
    })
    .attr("x", function(d){
      return xPositionScale(d.continent)
    })
    .attr("text-anchor", "start")
    .text(function(d) {
      if (d.lat < 24) {return d.city}
      if (35 > d.lat && d.lat > 26) {return d.city} 
      if (d.lat > 36) {return d.city} 
      else {return " "}
    })
    .attr("dx", function(d){
      return widthScale(d.population_city) + 3
    })
    .attr("dy", "4px")
    .attr("font-size", "10px")
    .attr("stroke", "#404e7c")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

 }
  // Axis

   var yAxis = d3.axisRight(yPositionScale)
      .tickSize(width)
      .tickValues([90,80,70,60,50,40,30,20,10,0,-10,-20,-30,-40,-50,-60,-70,-80,-90])
      .tickFormat(function(d) {
        return d + "°"
      });

   svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)
        .selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);

})();