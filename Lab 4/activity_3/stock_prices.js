// **** Example of how to create padding and spacing for trellis plot****
var svg = d3.select('svg');

// Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
// This will space out the trellis subplots
var padding = {t: 20, r: 20, b: 60, l: 60};

// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots
svg.selectAll('.background')
    .data(['A', 'B', 'C', 'C']) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

var parseDate = d3.timeParse('%b %Y');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];

// **** How to properly load data ****

d3.csv('stock_prices.csv').then(function(dataset) {

// **** Your JavaScript code goes here ****

dataset.forEach(function(d) {
    d.date = parseDate(d.date);
});

nestCompanies = d3.group(dataset, d => d.company);
console.log(nestCompanies);

var companyM = svg.selectAll("g.company")
  .data(d3.group(dataset, d => d.company))
  .enter()
  .append("g")
  .attr("class", "trellis")
  .attr("transform", function(d, i) {
    var xPos = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
    var yPos = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
    return "translate(" + xPos + "," + yPos + ")";
  });

  //grid-lines

  var xScale = d3.scaleTime()
  .domain(dateDomain)
  .range([0, trellisWidth]);

  var yScale = d3.scaleLinear()
  .domain(priceDomain)
  .range([trellisHeight, 0]);

  var lineInterpolate = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price));

  var xGrid = d3.axisTop(xScale)
    .tickSize(-trellisHeight, 0, 0)
    .tickFormat("");

var yGrid = d3.axisLeft(yScale)
    .tickSize(-trellisWidth, 0, 0)
    .tickFormat("");
companyM
  .append("g")
  .attr("class", "x grid")
  .call(xGrid)
  .append("g");

companyM
  .append("g")
  .attr("class", "y grid")
  .call(yGrid)
  .append("g");

d3.selectAll(".x.grid line")
  .style("fill", "#868686");

d3.selectAll(".y.grid line")
  .style("fill", "#868686");

//Axis numbers (X)
companyM
  .append("path")
  .attr("class", "line-plot")
  .attr("d", d=> lineInterpolate(d[1]))
  .style("stroke", "#333");

var xAxis = d3.axisBottom(xScale);

//Axis numbers (Y)
companyM
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + trellisHeight + ")")
  .call(xAxis);

var yAxis = d3.axisLeft(yScale);

companyM
  .append("g")
  .attr("class", "y axis")
  .call(yAxis);

//color of lines
var color = d3.scaleOrdinal(d3.schemeDark2)
  .domain(dataset.map(d => d.company));

companyM
  .append("path")
  .attr("class", "line-plot")
  .attr("d", d=> lineInterpolate(d[1]))
  .style("stroke", d => color(d[0]));

//company name
   companyM
  .append("text")
  .attr("class", "company-label")
  .text(function(d) {
    return d[0];
  })
  .attr("x", trellisWidth / 2)
  .attr("y", trellisHeight / 2)
  .attr("text-anchor", "middle")
  .style("font-size", 15)
  .style("font-family", "Verdana")
  .style("fill", d => {
    return color(d[0]); 
  });

//x-axis
companyM
  .append("text")
  .attr("class", "x axis-label")
  .text("Date (by Month)")
  .attr("text-anchor", "middle")
  .style("font-size", 10)
  .style("font-family", 'Verdana')
  .attr("x", trellisWidth / 2) 
  .attr("y", trellisHeight + 34); 

//y-axis
  companyM
   .append("text")
   .attr("class", "y axis-label")
   .text("Stock Price (USD)")
   .style("font-size", 10)
   .style("font-family", "Verdana")
   .attr("transform", "rotate(-90)")
   .attr("x", -120) 
   .attr("y", (trellisHeight / 2) - 140);


});



// Remember code outside of the data callback function will run before the data loads