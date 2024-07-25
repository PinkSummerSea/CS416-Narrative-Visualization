var d3;
var data2;



d3.csv('SleepQualityAndStressLevelByAge.csv').then(function(dataset){
  data2 = dataset;
  data2.forEach((d) => {
    d["Average Quality of Sleep"] = (+d["Average Quality of Sleep"]).toFixed(1);
    d["Average Stress Level"] = (+d["Average Stress Level"]).toFixed(1);
    d["Age"] = (+d["Age"]);
  });

  buildChart("Average Quality of Sleep");
  buildChart("Average Stress Level");
})

function transition(path) {
    path.transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash) ;
}

function tweenDash() {
  const l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t) };
}



function buildChart(type) {
  var margin = {top: 30, right: 300, bottom: 30, left: 50},
    width = 1500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
  var svg = d3.select(".container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", type)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
    .domain([d3.min(data2, function(d) { return d["Age"]}), d3.max(data2, function(d) { return d["Age"]})])
    .range([ 0, width ]);

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Age");

    var y = d3.scaleLinear()
    .domain([0, d3.max(data2, function(d) { return d[type]; })])
    .range([ height, 0 ]);

    svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-4em")
    .style("text-anchor", "end")
    .attr("fill", "gray")
    .text(type);

    var tooltip = d3.select(".container")
    .append("div")
    .attr("class", "tooltip2")

    var male =svg.append("path")
      .datum(data2.filter(d => d["Gender"]==="Male"))
      .attr("fill", "none")
      .attr("stroke", "rgb(128, 147, 241)")
      .attr("class", "my-line")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d["Age"]) })
        .y(function(d) { return y(d[type]) })
        )
      .call(transition);


    var female = svg.append("path")
    .datum(data2.filter(d => d["Gender"]==="Female"))
    .attr("fill", "none")
    .attr("stroke", "rgb(255, 153, 200)")
    .attr("class", "my-line")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(function(d) { return x(d["Age"]) })
      .y(function(d) { return y(d[type]) })
      )
    .call(transition);

    var circle = svg.append("circle")
    .attr("r", 0)
    .attr("fill", "grey")
    .style("stroke", "white")
    .attr("opacity", .70)
    .style("pointer-events", "none");

    male.on("mousemove", function(event){
        var xCoor = d3.mouse(this)[0];
        var b = d3.bisector(d => d["Age"]).left;
        var x0 = x.invert(xCoor);
        var i = b(data2.filter(d => d["Gender"]==="Male"), x0, 1);
        var d0 = data2.filter(d => d["Gender"]==="Male")[i-1];
        var d1 = data2.filter(d => d["Gender"]==="Male")[i];
        var d = x0 - d0["Age"] > d1["Age"] - x0 ? d1 : d0;
        var xPos = x(d["Age"]);
        var yPos = y(d[type]);
  
        circle.attr("cx", xPos)
        .attr("cy", yPos);
  
        circle.transition()
        .duration(50)
        .attr("r", 10);
  
        tooltip
        .style("display", "block")
        .style("left", `${xPos+200}px`)
        .style("top", `${580}px`)
        .html(`Age: ${d["Age"]}<br>${type}: ${d[type]}`)
      })
  
    male.on("mouseleave", function () {
        circle.transition()
          .duration(50)
          .attr("r", 0);
    
        tooltip.style("display", "none");
      })
    
    female.on("mousemove", function(event){
        var xCoor = d3.mouse(this)[0];
        var b = d3.bisector(d => d["Age"]).left;
        var x0 = x.invert(xCoor);
        var i = b(data2.filter(d => d["Gender"]==="Female"), x0, 1);
        var d0 = data2.filter(d => d["Gender"]==="Female")[i-1];
        var d1 = data2.filter(d => d["Gender"]==="Female")[i];
        var d = x0 - d0["Age"] > d1["Age"] - x0 ? d1 : d0;
        var xPos = x(d["Age"]);
        var yPos = y(d[type]);
  
        circle.attr("cx", xPos)
        .attr("cy", yPos);
  
        circle.transition()
        .duration(50)
        .attr("r", 10);
  
        tooltip
        .style("display", "block")
        .style("left", `${xPos+200}px`)
        .style("top", `${550}px`)
        .html(`Age: ${d["Age"]}<br>${type}: ${d[type]}`)
      })
  
    female.on("mouseleave", function () {
        circle.transition()
          .duration(50)
          .attr("r", 0);
    
        tooltip.style("display", "none");
      })

    
      svg.append('rect')
      .attr("x", 1100)
      .attr("y", 400)
      .attr("width", "20")
      .attr("height", "20")
      .attr("fill",  "rgb(128, 147, 241)");
    
      svg
        .append("text")
        .attr("x", "1130")
        .attr("y","415")
        .text("Male")
        .attr("class","small-text")
      
      svg.append('rect')
        .attr("x", 1100)
        .attr("y", 430)
        .attr("width", "20")
        .attr("height", "20")
        .attr("fill",  "rgb(255, 153, 200)");
      
      svg
        .append("text")
        .attr("x", "1130")
        .attr("y","445")
        .text("Female")
        .attr("class","small-text")
}