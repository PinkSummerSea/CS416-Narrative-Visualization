var d3;
var data;

d3.csv('OccupationSleepData.csv').then(function(dataset){
  data = dataset;
  data.forEach((d) => {
    d["Average Sleep Duration"] = (+d["Average Sleep Duration"]).toFixed(1);
    d["Average Quality of Sleep"] = (+d["Average Quality of Sleep"]).toFixed(1);
  });
  

  buildChart1("desc");
})

function buildChart1(order){
  d3.select(".container").html("");
  order === "desc" ? 
  data.sort((a,b) => b["Average Sleep Duration"] - a["Average Sleep Duration"]) 
  : 
  data.sort((a,b) => a["Average Sleep Duration"] - b["Average Sleep Duration"]);

  var margin = {top: 30, right: 250, bottom: 30, left: 60},
    width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom
  var svg = d3.select(".container")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear().domain([5.4, 8.2]).range([0,width])
  svg.append('g')
  .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  svg.append("text")
  .attr("class", "axis-label")
  .attr("text-anchor", "end")
  .attr("x", width/2 + 100)
  .attr("y", height + 50)
  .text("Sleep Duration (Hours)");
      
  var y = d3.scaleBand().domain(data.map(d=>d["Occupation"])).range([0, height]).padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  var colorScale = d3.scaleLinear().domain([d3.min(data, function(d) { return d["Average Quality of Sleep"]}), d3.max(data, function(d) { return d["Average Quality of Sleep"]})]).range(['rgb(230, 80, 179)','rgb(169, 222, 249)'])

  // create a tooltip
  var Tooltip = d3.select(".container")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position", "absolute");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html(
        d["Occupation"]
        + "<br>"+ "Average Quality of Sleep: " + d["Average Quality of Sleep"] 
        + "<br>" + "Average Sleep Duration: " + d["Average Sleep Duration"] + "h"
      )
      .style("left", (d3.mouse(this)[0]+300) + "px")
      .style("top", (d3.mouse(this)[1]+250) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr("x", x(5.4) )
    .attr("y", function(d) { return y(d["Occupation"]); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .transition()
    .duration(2000)
    .attr("width", function(d) { return x(d["Average Sleep Duration"]); })
    .attr("height", y.bandwidth() )
    .attr("fill", function(d) { return colorScale(d["Average Quality of Sleep"]) })

  
  var defs = svg.append("defs");

  var gradient = defs.append("linearGradient")
  .attr("id", "svgGradient")
  .attr("x1", "100%")
  .attr("x2", "100%")
  .attr("y1", "0%")
  .attr("y2", "100%");

  gradient.append("stop")
  .attr('class', 'start')
  .attr("offset", "0%")
  .attr("stop-color", 'rgb(169, 222, 249)')
  .attr("stop-opacity", 1);

  gradient.append("stop")
  .attr('class', 'end')
  .attr("offset", "100%")
  .attr("stop-color", 'rgb(230, 80, 179)')
  .attr("stop-opacity", 1);

  svg.append('rect')
  .attr("x", 1200)
  .attr("y", 200)
  .attr("width", "20")
  .attr("height", "180")
  .attr("class", "color-scale-bar")
  .attr("fill",  "url(#svgGradient)");

  svg
    .append("text")
    .attr("x", "1090")
    .attr("y","380")
    .text("Low Sleep Quality")
    .attr("class","small-text")

  svg
    .append("text")
    .attr("x", "1085")
    .attr("y","210")
    .text("High Sleep Quality")
    .attr("class","small-text")
  
  order === "desc" ?
  svg.append('line')
    .style("stroke", "#cda5e0")
    .style("stroke-width", 3)
    .transition()
    .duration(2000)
    .attr("x1", 1120)
    .attr("y1", 20)
    .attr("x2", 1139)
    .attr("y2", -6)
  :
  svg.append('line')
    .style("stroke", "#cda5e0")
    .style("stroke-width", 3)
    .transition()
    .duration(2000)
    .attr("x1", 220)
    .attr("y1", 20)
    .attr("x2", 239)
    .attr("y2", -6)
  
  order === "desc" ? 
  svg.append("text")
    .transition()
    .duration(2000)
    .attr("x", 700)
    .attr("y",-10)
    .text("Engineers have both the longest sleep duration and highest sleep quality.")
    .style("opacity", .6)
  :
  svg.append("text")
    .transition()
    .duration(2000)
    .attr("x", 100)
    .attr("y",-10)
    .text("Sales Representitives have both the shortest sleep duration and lowest sleep quality.")
    .style("opacity", .6)
}
