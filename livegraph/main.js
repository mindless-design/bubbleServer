
// Data samples are stored here
var dataSet = [];



$(document).ready(function() {
	var chart = c3.generate({
        bindto: '#cpu',
        padding: {
            left: 50,
            right: 50
        },
        point: {
            show: false
        },

        data: {
            type: "spline",
            columns: [
                //['x', (new Date().getTime()), (new Date().getTime()) - 10000, (new Date().getTime()), (new Date().getTime()) - 20000, (new Date().getTime()), (new Date().getTime()) - 30000, (new Date().getTime()), (new Date().getTime()) - 40000, (new Date().getTime()), (new Date().getTime()) - 50000, (new Date().getTime()), (new Date().getTime()) - 60000, (new Date().getTime()) - 70000, (new Date().getTime()) - 80000, (new Date().getTime()) - 90000, (new Date().getTime()) - 100000, (new Date().getTime()) - 110000, (new Date().getTime()) - 120000, (new Date().getTime()) - 130000, (new Date().getTime()) - 140000],
                //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],

                ['Voltage', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
            ],
            connectNull: true
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%M:%S'
                },
                label: {
                    text: 'Time',
                    position: 'outer-center',
                }

            },
            y: {
                label: {
                    text: '%',
                    position: 'outer-middle',
                }
            }

        }
    });
	
	console.log('It is working');
	// Run this once after the DOM is loaded
	if (!!window.EventSource) {
		// Good example on using SSE
		// http://www.html5rocks.com/en/tutorials/eventsource/basics/

		var source = new EventSource('data');
		source.addEventListener('message', function(e) {
			// e.data is the SSE data
			//console.log(">>", e);
			// e.lastEventId
			
			// We're passing the full 0-4095 value up to here, but we really
			// only want 0-255 in the graph
            data = parseInt(e.data) / 4095;
			console.log(data);
	
			// Add to the data set, remove from the left if it gets wider than the canvas
			dataSet.push(data);
	
			chart.flow({
            columns: [
                //['x', (new Date().getTime())],
                ['Voltage', 3.3*data]
				],
			});
			
            
		}, false);
	}
	else {
		console.log('sse not supported');
	}
});



