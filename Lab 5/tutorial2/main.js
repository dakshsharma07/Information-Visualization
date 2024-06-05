	var letter = d3.select('svg').selectAll('.letter')
		.data(['A', 'B', 'C']);// **** Copy and paste the code from the wiki here ****


    var letterEnter = letter.enter()
    .append('g')
    .attr('class', 'letter')
    .attr('transform', function(d,i) {
        return 'translate('+[i * 30 + 50, 50]+')';
    });

	letterEnter.append('circle')
	.attr('r', 10);

	letterEnter.append('text')
	.attr('y', 30)
	.text(function(d) {
	    return d;
	});

	var letterCircle = d3.select('svg').selectAll('.letter circle');
	letterCircle.attr('r', 20);
	var letter = d3.select('svg').selectAll('.letter')
		.data(['A', 'B']);

		letter.exit().remove();