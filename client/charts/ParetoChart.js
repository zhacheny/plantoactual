/*
 * Function to draw the column chart
 */
var firstRendered = false;
// var units = {
//     'isPareto': function(name){
//         console.log(name);
//         return name == 'Pareto' ? '%':'Minutes';
//     }
// };

function builtColumn() {

    $('#container-column').highcharts({
        
        chart: {
            type: 'column'
        },
        
        title: {
            text: 'Downtime Reason',
            style: {
              fontSize: 30 + 'px'
            }
        },
        
        subtitle: {
            text: 'For All Operators'

        },
        
        credits: {
            enabled: false
        },
        
        xAxis: {
            categories: [
                'Meeting/Training',
                'Machine Down',
                'Quality Isssue',
                'Safety',
                'Waiting on Material',
                'Write in'
            ],
            crosshair: true
        },
        
        yAxis: [{
            min: 0,
            title: {
                text: 'Lost Minutes (min)'
            }
        },{
            title: {
                text: ''
            },
            minPadding: 0,
            maxPadding: 0,
            max: 100,
            min: 0,
            opposite: true,
            labels: {
                format: "{value}%"
            }
        }],
        
        tooltip: {
            headerFormat: '<span style="font-size:15px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}'+
                '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                 dataLabels: {
                    enabled: true
                }
            }
        },
        // series: [{
        //     type: 'spline',
        //     name: 'Pareto',
        //     data: [755, 222, 151, 86, 72, 51, 36, 10]
        //   }, {
        //     name: 'Complaints',
        //     type: 'column',
        //     data: [755, 222, 151, 86, 72, 51, 36, 10]
        //   }]
        // series: [{
        //     name: 'All',
        //     data: All_data

        // }]
    });
}
function renderCharts() {
    var All_data = Session.get('lostMin')[0];
    var operator = Session.get('lostMin-per-operator')[0];
    var date_per_operator = Session.get('lostMin-per-operator')[1];
    var lostMin_percentage =Session.get('lostMin_percentage');
    // builtColumn(All_data,operator,date_per_operator);
    builtColumn();
    $('#container-column').highcharts().xAxis[0].setCategories(Session.get('lostMin')[1]);

    if(!Session.get('hasOperator')[0]){
        var series = {
            name: 'All',
            data: All_data,
            yAxis: 0,
        };
        var spline_series = {
            type: 'spline',
            name: 'Pareto',
            baseSeries: 1,
            yAxis: 1,
            data: lostMin_percentage,
        };
    $('#container-column').highcharts().addSeries(series);
    $('#container-column').highcharts().addSeries(spline_series);
        for (var i = operator.length - 1; i >= 0; i--) {
            if(Session.get('hasOperator')[1] != operator[i]){
                var series_per_operator = {
                    name: operator[i],
                    data: date_per_operator[i],
                    visible: false,
                }; 
            }else{
                var series_per_operator = {
                    name: operator[i],
                    data: date_per_operator[i],
                }; 
            }

            $('#container-column').highcharts().addSeries(series_per_operator);
        }
    }else{
        var subtitle = 'For ' + Session.get('hasOperator')[1];
        $('#container-column').highcharts().setTitle(null, { text: subtitle});
        for (var i = operator.length - 1; i >= 0; i--) {
            if(Session.get('hasOperator')[1] == operator[i]){
                var series_per_operator = {
                    name: operator[i],
                    data: date_per_operator[i],
                }; 
            }
        }
        var spline_series = {
            type: 'spline',
            name: 'Pareto',
            baseSeries: 0,
            yAxis: 1,
            data: lostMin_percentage,
        };
    $('#container-column').highcharts().addSeries(series_per_operator);
    $('#container-column').highcharts().addSeries(spline_series);

    }

};
//reactively change the charts
Tracker.autorun(function() {
    
    if(Session.get('lostMin') != null && firstRendered == true){ 
       var val = Session.get('lostMin')[0];
       renderCharts(); 
    }
});

/*
 * Call the function to built the chart when the template is rendered
 */
Template.ParetoChart.rendered = function() {
    renderCharts();
    firstRendered = true;
    // builtColumn();
}


