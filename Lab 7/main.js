
var svg = d3.select("svg");



var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

var regionTip = d3
  .tip()
  .attr("class", "d3-tip")
  .html(showRegionTooltip);

function showRegionTooltip(event, d) {
  return  d[0]+  " <strong>:</strong> " + d[1];
}

var schoolTip = d3
  .tip()
  .attr("class", "d3-tip")
  .html(showSchoolTooltip);

  function showSchoolTooltip(event, d) {

  return (
      "<h5>" +
      "<b>" +
      d["Name"] +
      "</b>" +
      "<br />" +
      "Control: " +
      d["Control"] +
      "<br />" +
      "Locale: " +
      d["Locale"] +
      "<br />"
    );
}



var chartG = svg
  .append("g")
  .attr("transform", "translate(" + [50, 50] + ")");


var heightC = svgHeight - 50 - 50;
var chartWidth = svgWidth - 50 - 50;

document.getElementById("backButton").style.display = "none";
document.getElementById("left-selectors").style.display = "none";
document.getElementById("right-selectors").style.display = "none";

var scatterPW = svgWidth / 2 - 50 - 50;



svg.call(regionTip);
svg.call(schoolTip);



var leftBrushScatter = d3
  .brush()
  .extent([
    [0, 0],
    [scatterPW, heightC],
  ])
  .on("brush", scatterPlotLeftBrushed)
  .on("end", brushEnd);

var rightBrushScatter = d3
  .brush()
  .extent([
    [0, 0],
    [scatterPW, heightC],
  ])
  .on("brush", scatterPlotRightBrushed)
  .on("end", brushEnd);


var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
var sizeScale = d3.scaleSqrt().range([00, 100]);
var regionNames = {
  "Far West": { x: 473, y: 47, size: 112 },
  "Mid-Atlantic": { x: 661, y: 94, size: 249 },
  "Great Plains": { x: 831, y: 189, size: 116 },
  "Southeast": { x: 401, y: 236, size: 293 },
  "Southwest": { x: 590, y: 265, size: 85 },
  "Outlying Areas": { x: 713, y: 249, size: 25 },
  "Rocky Mountains": { x: 434, y: 406, size: 34 },
  "New England": { x: 571, y: 420, size: 111 },
  "Great Lakes": { x: 751, y: 396, size: 189 },
};




// var nodes = Object.entries(regionNames).map(([name, properties]) => ({
//   name,
//   x: properties.x,
//   y: properties.y,
//   size: properties.size,
// }));

// sizeScale.domain(d3.extent(nodes, (d) => d.size));


// svg = d3.select("body").append("svg")
//   .attr("width", window.innerWidth)
//   .attr("height", window.innerHeight);



// svg.selectAll("circle")
//   .data(nodes)
//   .enter().append("circle")
//   .attr("r", (d) => sizeScale(d.size))
//   .attr("cx", (d) => d.x)
//   .attr("cy", (d) => d.y)
//   .style("fill", (d, i) => colorScale(i));

// const simulation = d3.forceSimulation(nodes)
//   .force("charge", d3.forceManyBody().strength(-50))
//   .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
//   .force("collision", d3.forceCollide().radius((d) => sizeScale(d.size)))
//   .on("tick", ticked);


// function ticked() {
//   svg.selectAll("circle")
//     .attr("cx", (d) => d.x)
//     .attr("cy", (d) => d.y);
// }


var scatLeftG;
var scatRightG;


var brushCell;

var data;
var regionCount;

d3.csv("colleges.csv").then(function (dataset) {
  data = dataset;

  regionCount = d3.rollup(
    data,(v) => v.length,(d) => d.Region);

  sizeScale.domain([0, d3.max(Array.from(regionCount.values()))]);

  drawBubbles();
});


var leftXAx;
var leftYAx;
var rightXAx;
var rightYAx;


function drawBubbles() {
  const bubbles = chartG.selectAll(".bubble")
    .data(Array.from(regionCount.entries()))
    .enter().append("circle")
    .attr("class", "bubble")
    .attr("cx", (d) => regionNames[d[0]].x)
    .attr("cy", (d) => regionNames[d[0]].y)
    .attr("r", (d) => sizeScale(d[1]))
    .style("fill", (_, i) => colorScale(i))
    .on("mouseover", regionTip.show)
    .on("mouseout", regionTip.hide)
    .on("click", (_, d) => regionClicked(d[0]));

  const labels = chartG.selectAll(".label")
    .data(Array.from(regionCount.entries()))
    .enter().append("text")
    .attr("x", (d) => regionNames[d[0]].x)
    .attr("y", (d) => regionNames[d[0]].y)
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12")
    .text((d) => d[0]);
}



function regionClicked(region) {
  regionTip.hide();

  chartG.selectAll(".bubble").remove();
  chartG.selectAll(".label").remove();

  d3.select("#instructions-text").text("Region: " + region);

  drawScatterPlot(region);
}

var leftXScale;
var leftYScale;
var rightXS;
var rightYS;

function drawScatterPlot(region) {

  document.getElementById("backButton").style.display = "block";
  document.getElementById("left-selectors").style.display = "block";
  document.getElementById("right-selectors").style.display = "block";

  var regionData = data.filter((d) => d.Region === region);

  scatLeftG = chartG
    .append("g")
    .attr("class", "scatterplot-left")
    .attr("transform", `translate(10, 0)`);
  scatRightG = chartG
    .append("g")
    .attr("class", "scatterplot-right")
    .attr(
      "transform",
      `translate(${scatterPW + 50 + 50}, 0)`
    );

  leftXScale = d3.scaleLinear().range([0, scatterPW]);
  leftYScale = d3.scaleLinear().range([heightC, 0]);

  rightXS = d3.scaleLinear().range([0, scatterPW]);
  rightYS = d3.scaleLinear().range([heightC, 0]);

setScaleDomain(leftXScale, "Admission Rate", regionData);
setScaleDomain(leftYScale, "Admission Rate", regionData);


setScaleDomain(rightXS, "Admission Rate", regionData);
setScaleDomain(rightYS, "Admission Rate", regionData);

  createAxesAndBrush(scatLeftG, leftXScale, leftYScale, leftBrushScatter);
  createAxesAndBrush(scatRightG, rightXS, rightYS, rightBrushScatter);


  scatLeftG
    .selectAll(".dot")
    .data(regionData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => leftXScale(d["Admission Rate"]))
    .attr("cy", (d) => leftYScale(d["Admission Rate"]))
    .attr("r", 3.5)
    .style("fill", (d) => (d["Control"] === "Private" ? "red" : "green"))
    .on("mouseover", schoolTip.show)
    .on("mouseout", schoolTip.hide)
    .on("click", (event, d) => {
      highlightDots(d, scatRightG);
    });

  scatRightG
    .selectAll(".dot")
    .data(regionData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => rightXS(d["Admission Rate"]))
    .attr("cy", (d) => rightYS(d["Admission Rate"]))
    .attr("r", 3.5)
    .style("fill", (d) => (d["Control"] === "Private" ? "red" : "green"))
    .on("mouseover", schoolTip.show)
    .on("mouseout", schoolTip.hide)
    .on("click", (event, d) => {
      highlightDots(d, scatLeftG);
    });

  var LeftXPlot = scatLeftG
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${heightC})`);
  var LeftYPlot = scatLeftG
    .append("g")
    .attr("class", "y-axis");

  var RightXPlot = scatRightG
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${heightC})`);
  var RightYPlot = scatRightG
    .append("g")
    .attr("class", "y-axis");


leftXAx = createAxisLabel(
  scatLeftG,
  "Admission Rate",
  scatterPW / 2 + 60,
  heightC + 35
);

leftYAx = createAxisLabel(
  scatLeftG,
  "Admission Rate",
  -heightC / 2 + 75,
  -35,
  true
);

// Right scatter plot
rightXAx = createAxisLabel(
  scatRightG,
  "Admission Rate",
  scatterPW / 2 + 60,
  heightC + 35
);

rightYAx = createAxisLabel(
  scatRightG,
  "Admission Rate",
  -heightC / 2 + 75,
  -35,
  true
);
updateLeftScatterPlot(
  d3.select("#xAxisSelectorLeft").property("value"),
  d3.select("#yAxisSelectorLeft").property("value")
);

updateRightScatterPlot(
  d3.select("#xAxisSelectorRight").property("value"),
  d3.select("#yAxisSelectorRight").property("value")
);


setupAxisChangeHandler("#xAxisSelectorLeft", function (selectedValue) {
  updateLeftScatterPlot(selectedValue, d3.select("#yAxisSelectorLeft").property("value"));
});

setupAxisChangeHandler("#yAxisSelectorLeft", function (selectedValue) {
  updateLeftScatterPlot(d3.select("#xAxisSelectorLeft").property("value"), selectedValue);
});


setupAxisChangeHandler("#xAxisSelectorRight", function (selectedValue) {
  updateRightScatterPlot(selectedValue, d3.select("#yAxisSelectorRight").property("value"));
});

setupAxisChangeHandler("#yAxisSelectorRight", function (selectedValue) {
  updateRightScatterPlot(d3.select("#xAxisSelectorRight").property("value"), selectedValue);
});
}

function createScatterPlot(scatG, xScale, yScale, highlightTarget) {
  scatG
    .selectAll(".dot")
    .data(regionData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d["Admission Rate"]))
    .attr("cy", (d) => yScale(d["Admission Rate"]))
    .attr("r", 3.5)
    .style("fill", (d) => (d["Control"] === "Private" ? "red" : "green"))
    .on("mouseover", schoolTip.show)
    .on("mouseout", schoolTip.hide)
    .on("click", (event, d) => {
      highlightDots(d, highlightTarget);
    });
}

function createAxesAndBrush(container, xScale, yScale, brush) {
  container.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${heightC})`)
    .call(d3.axisBottom(xScale));

  container.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

  container.append("g")
    .attr("class", "brush")
    .call(brush);
}

function createAxisLabel(container, text, x, y, rotate = false) {
  const label = container
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", x)
    .attr("y", y)
    .text(text);

  if (rotate) {
    label.attr("transform", "rotate(-90)");
  }

  return label;
}

function createAxis(container, axisClass, x, y) {
  return container
    .append("g")
    .attr("class", axisClass)
    .attr("transform", `translate(${x}, ${y})`);
}

function setupAxisChangeHandler(axisSelector, updateFunction) {
  d3.select(axisSelector).on("change", function () {
    var selectedValue = d3.select(this).property("value");
    updateFunction(selectedValue);
  });
}

function setScaleDomain(scale, dataKey, data) {
  scale.domain(d3.extent(data, (d) => d[dataKey]));
}

function backToRegions() {

scatLeftG.select(".brush").call(leftBrushScatter.move, null);
scatRightG.select(".brush").call(rightBrushScatter.move, null);


schoolTip.hide();


["backButton", "left-selectors", "right-selectors"].forEach(id => {
  document.getElementById(id).style.display = "none";
});


[d3.select(leftXAx.node()), d3.select(leftYAx.node()), d3.select(rightXAx.node()), d3.select(rightYAx.node())]
  .forEach(label => label.style("display", "none"));


chartG.selectAll(".dot, .x-axis, .y-axis").remove();
svg.selectAll(".legend").remove();

  d3.select("#instructions-text").text("Select a region to start");

  drawBubbles();
}


function scatterPlotBrushed(event, sourceG, targetG, sourceBrush, targetBrush, xSelector, ySelector) {
  if (!event.selection) {
    return;
  }

  targetG.select(".brush").call(targetBrush.move, null);

  var [[x0, y0], [x1, y1]] = event.selection;

  sourceG.selectAll(".dot").style("opacity", 0.4);
  targetG.selectAll(".dot").style("opacity", 0.4);

  var brushedData = new Set();

  sourceG
    .selectAll(".dot")
    .filter((d) => {
    var x, y;

    if (xSelector === 'left') {
        x = leftXScale(d[`${d3.select("#xAxisSelectorLeft").property("value")}`]);
    } else {
        x = rightXS(d[`${d3.select("#xAxisSelectorRight").property("value")}`]);
    }

    if (ySelector === 'left') {
        y = leftYScale(d[`${d3.select("#yAxisSelectorLeft").property("value")}`]);
    } else {
        y = rightYS(d[`${d3.select("#yAxisSelectorRight").property("value")}`]);
    }
      return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    })
    .each((d) => brushedData.add(d.Name))
    .style("opacity", 1);

  targetG
    .selectAll(".dot")
    .style("opacity", (d) => {
    if (brushedData.has(d.Name)) {
        return 1;
    } else {
        return 0.4;
    }
});
}


function scatterPlotLeftBrushed(event) {
  scatterPlotBrushed(event, scatLeftG, scatRightG, leftBrushScatter, rightBrushScatter, 'left', 'right');
}

function scatterPlotRightBrushed(event) {
  scatterPlotBrushed(event, scatRightG, scatLeftG, rightBrushScatter, leftBrushScatter, 'right', 'left');
}



function brushEnd(event) {
  if (!event.sourceEvent) {
    return;
  }
  if (!event.selection) {
    scatLeftG.selectAll(".dot").style("opacity", 0.3);
    scatRightG.selectAll(".dot").style("opacity", 0.3);
  }
}

function updateScatterPlot(
  xScale,
  yScale,
  xArr,
  yArr,
  plotG,
  xAxisLabel,
  yAxisLabel
) {
  xScale.domain(d3.extent(data, (d) => +d[xArr]));
  yScale.domain(d3.extent(data, (d) => +d[yArr]));

  plotG
    .selectAll(".dot")
    .transition()
    .duration(200)
    .attr("cx", (d) => xScale(d[xArr]))
    .attr("cy", (d) => yScale(d[yArr]));

  plotG
    .select(".x-axis")
    .transition()
    .duration(200)
    .call(d3.axisBottom(xScale));

  plotG
    .select(".y-axis")
    .transition()
    .duration(200)
    .call(d3.axisLeft(yScale));

  xAxisLabel.text(xArr);
  yAxisLabel.text(yArr);
}

function updateLeftScatterPlot(xArr, yArr) {
  updateScatterPlot(
    leftXScale,
    leftYScale,
    xArr,
    yArr,
    scatLeftG,
    leftXAx,
    leftYAx
  );
}

function updateRightScatterPlot(xArr, yArr) {
  updateScatterPlot(
    rightXS,
    rightYS,
    xArr,
    yArr,
    scatRightG,
    rightXAx,
    rightYAx
  );
}

function highlightDots(selectedDot) {
  scatLeftG.select(".brush").call(leftBrushScatter.move, null);
  scatRightG.select(".brush").call(rightBrushScatter.move, null);

  scatLeftG
    .selectAll(".dot")
    .style("opacity", 0.3)
    .filter((d) => d.Name === selectedDot.Name)
    .style("opacity", 1);

  scatRightG
    .selectAll(".dot")
    .style("opacity", 0.3)
    .filter((d) => d.Name === selectedDot.Name)
    .style("opacity", 1);
}
