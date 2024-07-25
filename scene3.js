var d3;
var data3;

d3.csv('OccupationSleepData.csv').then(function(dataset){
  data3 = dataset;
  data3.forEach((d) => {
    d["Average Quality of Sleep"] = (+d["Average Quality of Sleep"]).toFixed(1);
    d["Average Stress Level"] = (+d["Average Stress Level"]).toFixed(1);
    d["Average Sleep Duration"] = (+d["Average Sleep Duration"]).toFixed(1);
    d["Average Heart Rate"] = (+d["Average Heart Rate"]).toFixed(1);
    d["Average Daily Steps"] = (+d["Average Daily Steps"]).toFixed(1);
    d["Average Physical Activity Level"] = (+d["Average Physical Activity Level"]).toFixed(1);
  });

  buildChart4();
})

function buildChart4(){
  var margin = {top: 80, right: 460, bottom: 30, left: 300},
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(".container")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
      .domain([d3.min(data3, function(d) { return d["Average Physical Activity Level"]}) - 10, d3.max(data3, function(d) { return d["Average Physical Activity Level"]})+10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Average Physical Activity Level");

    var maxRatio = d3.max(data3, function(d) { return d["Average Quality of Sleep"]/d["Average Physical Activity Level"]});
    var crownX;
    var crownY;
    var crownOcc;
    

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([d3.min(data3, function(d) { return d["Average Quality of Sleep"]})- 1, d3.max(data3, function(d) { return d["Average Quality of Sleep"]}) + 1])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-4em")
      .style("text-anchor", "end")
      .attr("fill", "#5D6971")
      .text("Average Quality of Sleep");

    var colors = ["#ff99c8", "#fcf6bd", "#d0f4de", "#a9def9", "#e4c1f9", "#d9f2b4", "#8093f1", "#a6c7ff", "#e650b3", "#ffdc5e", "#efd9ce"]

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
          d["Occupation"]+ "<br>" 
          + "Average Physical Activity Level:" + d["Average Physical Activity Level"] 
          + "<br>"+ "Average Quality of Sleep: " + d["Average Quality of Sleep"] 
          + "<br>" + "Average Sleep Duration: " + d["Average Sleep Duration"] + "h"
        )
        .style("left", (d3.mouse(this)[0]+400) + "px")
        .style("top", (d3.mouse(this)[1]+150) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }
    // Add dots
    svg.append('g')
      .selectAll("circle")
      .data(data3)
      .enter()
      .append("circle")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .transition()
      .duration(2000)
        .attr("cx", function (d) { return x(d["Average Physical Activity Level"]); } )
        .attr("cy", function (d) { return y(d["Average Quality of Sleep"]); } )
        .attr("id",  function (d) { 
          if(d["Average Quality of Sleep"]/d["Average Physical Activity Level"] === maxRatio){
            crownX=x(d["Average Physical Activity Level"])
            crownY=y(d["Average Quality of Sleep"])
            crownOcc=d["Occupation"]
            return "crown"
          }else{
            return ""
          }
        })
        .attr("r", "23")
        .attr("fill", function(d, i) {return colors[i]})
      

    svg.append('line')
    .style("stroke", "#cda5e0")
    .style("stroke-width", 3)
    .transition()
    .duration(2000)
    .attr("x1", crownX+30)
    .attr("y1", crownY-10)
    .attr("x2", crownX+50)
    .attr("y2", crownY-30)
  


    svg.append("text")
    .style("opacity", .6)
    .transition()
    .duration(2000)
    .attr("x", crownX+20)
    .attr("y",crownY-40)
    .text(crownOcc + "s have high sleep quality without needing to be highly active")


    // Add color scheme
    svg.append('g')
      .selectAll("rect")
      .data(data3)
      .enter()
      .append("rect")
        .attr("x", "-130" )
        .attr("y", function (d, i) { return i * 40 } )
        .attr("width", "20")
        .attr("height", "20")
        .attr("fill", function(d, i) {return colors[i]})

    svg.append('g')
      .selectAll("rect")
      .data(data3)
      .enter()
        .append("text")
        .style("opacity", .6)
    .attr("x", "-300")
    .attr("y",function (d, i) { return i * 40 +15 })
    .text(function(d, i) {return d["Occupation"]})
}
