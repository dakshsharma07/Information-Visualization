
// **** Functions to call for scaled values ****
//Daksh
function scaleYear(year) {
    return yearScale(year);
}

function scaleHomeruns(homeruns) {
    return hrScale(homeruns);
}

// **** Code for creating scales, axes and labels ****
var yearScale = d3.scaleLinear()
    .domain([1870,2017]).range([60,700]);

var hrScale = d3.scaleLinear()
    .domain([0,75]).range([340,20]);

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(function(d){return d;}));

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(hrScale));
    
// **** Your JavaScript code goes here ****
d3.csv('baseball_hr_leaders.csv').then(data => {
    console.log(data);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', function(d) { return scaleHomeruns(d.homeruns); })
        .attr('cx', function(d) { return scaleYear(d.year); })
        .attr('r', '1.5')
        .style('fill', function(d) {
            if (d.rank == 1 || d.rank == 2 || d.rank == 3){
                return 'orange';
            } else if (d.rank == 9 || d.rank == 10) {
                return 'gray';
            } else {
                return 'lightblue';
            }
        });
});


    svg.append('text').attr('class', 'label')
        .text('MLB Season')
        .attr('x', 360)
        .attr('y', 395);
    svg.append('text').attr('class', 'label')
        .text('Home Runs (HR)')
        .attr('x', -200)
        .attr('y', 15)
        .attr('transform', 'rotate(-90)');

    svg.append('text').attr('class', 'label')
        .text('Top 10 HR Leaders per MLB Season')
        .attr('x', 360)
        .attr('y', 16);

