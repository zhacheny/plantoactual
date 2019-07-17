/*
 * Function to draw the column chart
 */
var firstRendered = false;
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
            ]
        },
        
        yAxis: {
            min: 0,
            title: {
                text: 'Lost Minutes (min)'
            }
        },
        
        tooltip: {
            headerFormat: '<span style="font-size:15px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} minutes</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        
        // series: [{
        //     name: 'All',
        //     data: All_data

        // }]
    });
}
function renderCharts() {
    var All_data = Session.get('lostMin');
    var operator = Session.get('lostMin-per-operator')[0];
    var date_per_operator = Session.get('lostMin-per-operator')[1];
    // builtColumn(All_data,operator,date_per_operator);
    builtColumn();

    if(!Session.get('hasOperator')[0]){
        var series = {
            name: 'All',
            data: All_data

        };
        $('#container-column').highcharts().addSeries(series);
    }else{
        var subtitle = 'For ' + Session.get('hasOperator')[1];
        $('#container-column').highcharts().setTitle(null, { text: subtitle});
    }
    
    for (var i = operator.length - 1; i >= 0; i--) {
        var series_per_operator = {
            name: operator[i],
            data: date_per_operator[i],

        };
        $('#container-column').highcharts().addSeries(series_per_operator);
    }

};
//reactively change the charts
Tracker.autorun(function() {
    if(Session.get('lostMin') != null && firstRendered == true){
       var val = Session.get('lostMin');
       renderCharts(); 
    }
});

/*
 * Call the function to built the chart when the template is rendered
 */
Template.columnDemo.rendered = function() {
    renderCharts();
    firstRendered = true;
}

