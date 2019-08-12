
// Data samples are stored here
var voltageData = [];


$(document).ready(function() {
	
	var prevTime = Date.now();
	
	var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
	};
	
	function randomScalingFactor() {
		return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	}

	function onRefresh(chart) {
		chart.config.data.datasets.forEach(function(dataset) {
			for(var i = 0; i<voltageData.length; i++) {
				dataset.data.push(voltageData[i]);
			}
			// dataset.data.push({
				// x: Date.now(),
				// y: randomScalingFactor()
			// });
			console.log(dataset.data);
			voltageData = [];
		});
	}

	var color = Chart.helpers.color;
	var config = {
		type: 'line',
		data: {
			datasets: [{
				label: 'Voltage Data (Cubic Interpolation)',
				backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
				borderColor: chartColors.red,
				fill: false,
				data: []
			}]
		},
		options: {
			events: [],
			title: {
				display: true,
				text: 'Real Time Voltage Data'
			},
			scales: {
				xAxes: [{
					type: 'realtime',
					realtime: {
						duration: 20000,
						refresh: 16,
						delay: 3000,
						onRefresh: onRefresh
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Voltage'
					}
				}]
			},
			showLines: false,
			animation: {
				duration: 0                        // general animation time
			},
			responsiveAnimationDuration: 0, 
			// animation duration after a resize
			elements: {
				line: {
					tension: 0 // disables bezier curves
				}
			}
		}
	};

	window.onload = function() {
		var ctx = document.getElementById('myChart').getContext('2d');
		window.myChart = new Chart(ctx, config);
	};
	
	
	if (!!window.EventSource) {
		// Good example on using SSE
		// http://www.html5rocks.com/en/tutorials/eventsource/basics/
		
		var source = new EventSource('data');
		source.addEventListener('message', function(e) {
			// e.data is the SSE data
			//console.log(">>", e);
			// e.lastEventId
			
			// We're passing the full 0-4095 value up to here, but we really
            //data = parseInt(e.data) / 4095;
			//console.log(e.data);
			//console.log(data);
			
			
			var lines = e.data.split('\n');
			var deltaTime = (Date.now() - prevTime)/lines.length;
			
			for (var xx = 0; xx < lines.length; xx++) {	
				voltageData.push({
					x: deltaTime*(xx) + prevTime,
					y: 3.3*(lines[xx]/4095)
				});
			}
			
			prevTime = Date.now();
            
		}, false);
	}
	else {
		console.log('sse not supported');
	}
});



