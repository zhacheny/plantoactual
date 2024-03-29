/*
 * Function to draw the area chart
 */
function builtArea() {

    $('#container-area').highcharts({
        
        chart: {
            type: 'area'
        },
        
        title: {
            text: 'Efficiency  Trend',
            style: {
              fontSize: 30 + 'px'
            }
        },
        
        credits: {
            enabled: false
        },
        
        // subtitle: {
        //     text: ''
        // },
        
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    return 'Day ' + this.value; // clean, unformatted number for year
                }
            }
        },
        
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        
        tooltip: {
            // pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            pointFormat: '{series.name} earned <b>{point.y}</b><br/>efficiency in Day {point.x}'
        },
        
        plotOptions: {
            area: {
                pointStart: 1,
                dataLabels: {
                    enabled: true
                },
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        
        // series: [{
        //     name: 'USA',
        //     data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
        //         1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
        //         27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
        //         26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
        //         24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
        //         22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
        //         10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
        // },
        //  {
        //     name: 'USSR/Russia',
        //     data: [null, null, null, null, null, null, null, null, null, null,
        //         5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
        //         4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
        //         15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
        //         33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
        //         35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
        //         21000, 20000, 19000, 18000, 18000, 17000, 16000]
        // }]
    });
}

function renderCharts() {
    //get trend data from the session
    var All_data = Session.get('eff-trend');
    var shift_1_data = Session.get('eff-trend_shift_1');
    var shift_2_data = Session.get('eff-trend_shift_2');
    // console.log(All_data);
    // builtColumn(All_data,operator,date_per_operator);
    builtArea();
     if(Session.get('hasOperator')[0]){
        var series_All  = {
            name: Session.get('hasOperator')[1],
            data: All_data

        };
         
    }else{
        var series_All  = {
            name: 'All',
            data: All_data

        };
    }
    var series_shift_1  = {
            name: 'shift 1',
            data: shift_1_data,
            visible: false,
        };
    var series_shift_2  = {
        name: 'shift 2',
        data: shift_2_data,
        visible: false,
    };
    $('#container-area').highcharts().addSeries(series_All);
    $('#container-area').highcharts().addSeries(series_shift_1);
    $('#container-area').highcharts().addSeries(series_shift_2);
    var subtitle = 'from ' + Session.get('dateRange')[0] + ' to ' + Session.get('dateRange')[1];
    $('#container-area').highcharts().setTitle(null, { text: subtitle});
};

/*
 * Call the function to built the chart when the template is rendered
 */
Template.areaDemo.rendered = function() {
    renderCharts();
}