// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}

// Recall that when data is loaded into memory, numbers are loaded as Strings
// This function converts numbers into Strings during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');
var letters;
// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// A map with arrays for each category of letter sets
var lettersMap = {
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split(''),
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
};

var svg = d3.select('svg');
var chartG = svg.append('g').attr('transform', 'translate(' + padding.l + ',' + padding.t + ')');

var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

var xScale = d3.scaleLinear()
    .range([0, chartWidth]); // Define the output range

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    letters = dataset;

    // **** Your JavaScript code goes here ****

    xScale.domain([0, d3.max(letters, function (d) { return d.frequency; })])
    // Update the chart for all letters to initialize
    updateChart('all-letters');
});

function cutoffVal() {
    var cutoff = d3.select('#cutoff').node().value;
    return cutoff /= 100;
}


function updateChart(filterKey, cutoff = cutoffVal()) {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0 && d.frequency >= cutoff;

    });
    // **** Draw and Update your chart here ****
   var bars = chartG.selectAll('.bar')
        .data(filteredLetters, function(d) {
            return d.letter;
        });

    var chartTitle = svg.append('g')
    .attr('transform', 'translate(' + (svgWidth / 2) + ',' + padding.t + ')'); // Adjust the position as needed



// Add the chart title text
chartTitle.append('text')
    .text('Letter Frequency (%)')
    .attr('text-anchor', 'middle')
    .attr('font-size', '15px') 
    .attr('font-weight', 'bold') 
    .attr('transform', 'translate(0, -33)');




//Scales
var topS = d3.scaleLinear()
    .domain([0, d3.max(letters, function(d) { return d.frequency; })])
    .range([0, chartWidth])
var bottomS = d3.scaleLinear()
    .domain([0, d3.max(letters, function(d) { return d.frequency; })])
    .range([0, chartWidth]);

// Create a group for the top scale
var topSGroup = chartG.append('g')
    .attr('transform', 'translate(0, -8)');

// Create a group for the bottom scale
var bottomSGroup = chartG.append('g')
    .attr('transform', 'translate(0, ' + chartHeight + ')');

// Create and append axis elements for the scales
var topAxis = d3.axisTop(topS)
    .tickFormat(function(d) {
        return (d * 100) + '%';
    })
    .ticks(7);
var bottomAxis = d3.axisBottom(bottomS)
    .tickFormat(function(d) {
        return (d * 100) + '%';
    })
    .ticks(7);

topSGroup.call(topAxis);
bottomSGroup.call(bottomAxis);




// Making Bars
    // Create new bars for new data

    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .merge(bars)
        .attr('x', 0)
        .attr('y', function(d, i) {
            return i * barBand;
        })
        .attr('width', function(d) {
            return xScale(d.frequency);
        })
        .attr('height', barHeight)
        .attr('fill', 'black');
    
    bars.exit().remove();
    



    // Update or create text labels (similar pattern to bars)
    var labels = chartG.selectAll('.bar-label')
        .data(filteredLetters, function(d) {
            return d.letter;
        });

    labels.enter()
        .append('text')
        .attr('class', 'bar-label')
        .merge(labels)
        .attr('x', -20)
        .attr('y', function(d, i) {
            return i * barBand + barBand / 2;
        })
        .text(function(d) {
            return d.letter;
        })
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'black');

    labels.exit().remove();


}

    d3.select(main)
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Filter Data')
        .on('click', cutoffVal);


// Remember code outside of the data callback function will run before the data loads