
// **** Your JavaScript code goes here ****
d3.csv('baseball_hr_leaders_2017.csv').then(function(data) {
	console.log(data);

 var homeRunners = d3.select('#homerun-leaders').selectAll('p')
      .data(data)
      .enter()
      .append('p');

    homeRunners.text(function(d) {
      return 'Rank ' + d.rank + ': ' + d.name + ' - ' + d.homeruns + ' Home Runs';
    });

    homeRunners.style('color', function(d) {
		if (d.rank <= 3) {
			return 'green';
		} else {
			return 'black';
		}
	});

	var tbody = d3.select('#table-body');


      var rows = d3.select('#homerun-table tbody').selectAll('tr')
      .data(data)
      .enter()
      .append('tr');

      rows.append('td')
          .text(function(d) { return d.rank;})
          .style('text-align', 'center')
      rows.append('td')
          .text(function(d) {return d.name; })
      rows.append('td')
          .text(function(d) {return d.homeruns; })
          .style('text-align', 'center');

});