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
  .attr('transform', function(d, i) {
    var xPos = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
    var yPos = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
    return 'translate(' + xPos + ',' + yPos + ')';
  });

  var xScale = d3.scaleTime()
  .domain(dateDomain)
  .range([0, trellisWidth]);

  var yScale = d3.scaleLinear()
  .domain(priceDomain)
  .range([trellisHeight, 0]);

  var lineInterpolate = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price));

companyM
  .append("path")
  .attr("class", "line-plot")
  .attr('d', d=> lineInterpolate(d[1]))
  .style("stroke", "#333");

var xAxis = d3.axisBottom(xScale);

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

var color = d3.scaleOrdinal(d3.schemeDark2)
  .domain(dataset.map(d => d.company));

companyM
  .append("path")
  .attr("class", "line-plot")
  .attr('d', d=> lineInterpolate(d[1]))
  .style("stroke", d => color(d[0]));

});



// Remember code outside of the data callback function will run before the data loads