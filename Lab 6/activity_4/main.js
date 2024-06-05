var data;
var x0, x1, y0, y1;

var defaultX = "cylinders";
var defaultY = "power (hp)";

// Real drop down options
var realOptions = [
    "cylinders",
    "economy (mpg)",
    "displacement (cc)",
    "power (hp)",
    "weight (lb)",
    "0-60 mph (s)",
    "year"
];

// Making the drop down options
d3.select("#xdropdown").selectAll("option")
    .data(realOptions)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

d3.select("#ydropdown").selectAll("option")
    .data(realOptions)
    .enter()
    .append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });



d3.select("#xdropdown").on("change", function() {
    defaultX = "cylinders";
    updateScatterplot(); 
});

d3.select("#ydropdown").on("change", function() {
    defaultY = "power (hp)";
    updateScatterplot(); 
});



//making the SVG
var sWidth = 700 - 55;
var sHeight = 500 - 55;

var scatX = d3.scaleLinear().range([0, sWidth]);
var scatY = d3.scaleLinear().range([sHeight, 0]);


var Scatsvg = d3.select("#scatterplot").append("svg")
    .attr("height", sHeight + 55)
    .attr("width", sWidth + 55)
    .append("g")
    .attr("transform", "translate(" + 40 + "," + 15 + ")");

// Set up SVG for bar chart
var barWidth = 700 - 55;

var barHeight = 500 - 55;

var barX = d3.scaleBand().rangeRound([0, 645]).padding(0.1);
var barY = d3.scaleLinear().rangeRound([445, 0]);

var svgBar = d3.select("#barchart").append("svg")
    .attr("height", 500)
    .attr("width", 700)
    .append("g")
    .attr("transform", "translate(" + 40 + "," + 15 + ")");

function callMultipleFunctions(...functions) {
    return function () {
        functions.forEach(func => func());
    };
}

// calling and ending brush feature
var brushScatter = d3.brush().extent([[0, 0], [sWidth, sHeight]])
    .on("brush", brushedS)
    .on("end", callMultipleFunctions(endBrush));
    
var brushBar = d3.brush().extent([[0, 0], [barWidth, barHeight]])
    .on("brush", brushedB)
    .on("end", callMultipleFunctions(endBrush));



function brushedS(event) {
    if (d3.event.selection) {
        const [[x0, y0], [x1, y1]] = d3.event.selection;
        Scatsvg.selectAll('.dot')
            .classed("hidden", d => {
                return !(x0 <= scatX(d[defaultX]) && scatX(d[defaultX]) <= x1
                    && y0 <= scatY(d[defaultY]) && scatY(d[defaultY]) <= y1);
            });
        svgBar.selectAll('.bar')
            .classed("hidden", d => !(d.key >= scatX.invert(x0) && d.key <= scatX.invert(x1)));
    } else {
        done();
    }
}

function done() {
        Scatsvg.selectAll('.dot').classed("hidden", false); 
        svgBar.selectAll('.bar').classed("hidden", false);
}



function brushedB() {
    if (d3.event.selection) {
        const [[x0, y0], [x1, y1]] = d3.event.selection;
        Scatsvg.selectAll('.dot')
            .classed("hidden", d => {
                return !(x0 <= scatX(d.cylinders) && scatX(d.cylinders) <= x1
                    && y0 <= scatY(d['power (hp)']) && scatY(d['power (hp)']) <= y1);
            });

        svgBar.selectAll('.bar')
            .classed("hidden", d => !(d.key >= scatX.invert(x0) && d.key <= scatX.invert(x1)));
    } else {
        done();
    }
}

function doneBrushBar() {
     Scatsvg.selectAll('.hidden').classed("hidden", false);
     svgBar.selectAll('.hidden').classed("hidden", false);

}


function endBrush(event) {
    if (!d3.event.selection) {
        Scatsvg.selectAll('.hidden').classed("hidden", false);
        svgBar.selectAll('.hidden').classed("hidden", false);
        Scatsvg.call(brushScatter.move, null);
        svgBar.call(brushBar.move, null);
    }
        if (!d3.event.sourceEvent) return;
}

function brushendedScatter() {
    if (!d3.event.selection) {
        Scatsvg.selectAll('.hidden').classed("hidden", false);
        Scatsvg.call(brushScatter.move, null);
    }
    if (!d3.event.sourceEvent) return;
}

function brushendedBar() {
    if (!d3.event.selection) {
        svgBar.selectAll('.hidden').classed("hidden", false);
        svgBar.call(brushBar.move, null);
    }
    if (!d3.event.sourceEvent) return;
}

function barChart(data) {

        svgBar.selectAll(".x-ticker")
        .data(barX.domain())
        .enter()
        .append("text")
        .attr("class", "x-ticker")
        .attr("x", function(d) { return barX(d) + barX.bandwidth() / 2; })
        .attr("y", barHeight + 10) 
        .text(function(d) { return d; });

    var barD = d3.nest()
        .key(function(d) { return d.cylinders; })
        .rollup(function(v) { return v.length; })
        .entries(data)
        .map(function(group) {
            return { key: group.key, value: group.value };
    });

    // domains for the bar
    barX.domain(barD.map(d => d.key)
        .sort((a, b) => a - b));
    barY.domain([0, d3.max(barD, d => d.value )])


    svgBar.selectAll(".bar")
        .data(barD)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => barX(d.key))
        .attr("y", d => barY(d.value))
        .attr("width", barX.bandwidth())
        .attr("height", function(d) { return barHeight - barY(d.value); })
        .style("fill", function(d) { return colorScale(d.key); });

    svgBar.append("g")
        .attr("class", "brush")
        .call(brushBar);
}

function scatterplot(data) {
    
    var xEx = d3.extent(data, function(d) { return d[defaultX] });
    var yEx = d3.extent(data, function(d) { return d[defaultY] });

    scatX.domain(xEx).nice();
    scatY.domain(yEx).nice();


    Scatsvg.selectAll(".dot")
        .attr("class", "dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => scatX(d[defaultX]))
        .attr("cy", d => scatY(d[defaultY]))
        .attr("r", 3.5)
        .style("fill", d => colorScale(d[defaultX]));

    Scatsvg.append("g")
        .attr("class", "brush")
        .call(brushScatter);
}



function updateScatterplot() {
    Scatsvg.selectAll(".x.axis, text, .dot").remove();

    
    var xEx = d3.extent(data, function(d) { return d[defaultX] });
    var yEx = d3.extent(data, function(d) { return d[defaultY] });

    scatX.domain(xEx).nice();
    scatY.domain(yEx).nice();

     var yAxisScatter = d3.axisLeft(scatY);
     var xAxisScatter = d3.axisBottom(scatX);

    var xAttr = d3.select('#xdropdown').node().value;
    var yAttr = d3.select('#ydropdown').node().value;

    //y title
    Scatsvg.append("text").attr("text-anchor", "middle")
        .attr("x", -(sHeight / 2) - 50 )
        .attr("y", -30) 
        .attr("transform", "rotate(-90)")
        .text(defaultY);

    //x title
    Scatsvg.append("text").attr("text-anchor", "middle")
        .attr("x", sWidth / 2)
        .attr("y", sHeight + 30)
        .text(defaultX);

    Scatsvg.selectAll('.dot')
        .classed("hidden", d => {
            return !(x0 <= scatX(d[defaultX]) && scatX(d[defaultX]) <= x1
                && y0 <= scatY(d[defaultY]) && scatY(d[defaultY]) <= y1);
        });

         //y axis
    Scatsvg.append("g")
        .call(yAxisScatter);
    // x axis
    Scatsvg.append("g")
        .attr("transform", "translate(0," + sHeight + ")")
        .call(xAxisScatter);

    scatterplot(data);
}

var customColors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'];
var colorScale = d3.scaleOrdinal(customColors);


// Add the updates here
d3.csv('cars.csv', dataPreprocessor).then(function(csv) {
    data = csv;

    var xEx = d3.extent(data, function(d) { return d[defaultX] });
    var yEx = d3.extent(data, function(d) { return d[defaultY] });

    scatX.domain(xEx).nice();
    scatY.domain(yEx).nice();


    var yAxisScatter = d3.axisLeft(scatY);
    var xAxisScatter = d3.axisBottom(scatX);


    Scatsvg.append("g").attr("transform", "translate(0," + sHeight + ")")
        .call(xAxisScatter);

    Scatsvg.append("g").call(yAxisScatter);
    
    Scatsvg.append("text").attr("text-anchor", "middle")
        .attr("x", sWidth / 2)
        .attr("y", sHeight + 30)
        .text(defaultX);

    Scatsvg.append("text").attr("text-anchor", "middle")
        .attr("x", -(sHeight / 2))
        .attr("y", -30) 
        .attr("transform", "rotate(-90)")
        .text(defaultY);

    // where you create the bar
    var xB = d3.axisBottom(barX);
    var yB = d3.axisLeft(barY).ticks(null, "s");

    // this is the x axis
    svgBar.append("text")
        .attr("text-anchor", "middle")
        .attr("x", barWidth / 2)
        .attr("y", barHeight + 35) 
        .text("cylinders");

    // this is the y axis
    svgBar.append("text")
        .attr("text-anchor", "middle")
        .attr("x", -(barHeight / 2))
        .attr("y", -30) 
        .attr("transform", "rotate(-90)")
        .text("count");

    // SVG
    svgBar.append("g")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(xB);

    svgBar.append("g").call(yB);
    barChart(data);
    scatterplot(data);

});


function dataPreprocessor(row) {
    return {
        'name': row['name'],
        'economy (mpg)': +row['economy (mpg)'],
        'cylinders': +row['cylinders'],
        'displacement (cc)': +row['displacement (cc)'],
        'power (hp)': +row['power (hp)'],
        'weight (lb)': +row['weight (lb)'],
        '0-60 mph (s)': +row['0-60 mph (s)'],
        'year': +row['year']
    };
}
