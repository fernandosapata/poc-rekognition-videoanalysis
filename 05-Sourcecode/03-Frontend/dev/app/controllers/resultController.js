app.controller('results', ['$scope', function($scope) {
//column
    var chart = Highcharts.chart('column', {

        exporting: {
            enabled: false
        },

        title: {
            text: 'Overview'
        },

        tooltip: {
            shared: false
        },

        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            },
            series: {
                dataLabels: {
                  enabled: true,
                  format: '{point.y:.1f}%',
                  color: '#535353',
                  fontWeight: 'normal'
                }
            }
        },

        yAxis: {
            max: '100'
        },

        xAxis: {
            categories: ['Eyeglasses', 'Sunglasses', 'Eyes Open', 'Smilling', 'Mouth Open', 'Mustache', 'Happy', 'Angry']
        },

        series: [{
            name: 'Percentage',
            type: 'column',
            colorByPoint: true,
            data: [29, 71, 96, 39, 54, 45, 60, 90],
//            color:['#02B5A0', '#0180B5', '#4BC4D5', '#954567', '#EA3E70', '#C72C3A', '#F37252', '#FF8201'],
            tooltip: {
                valueSuffix: '%'
            },
            showInLegend: false
        }]

    });


    $scope.plain = function () {
        chart.update({
            chart: {
                inverted: false,
                polar: false
            },
            subtitle: {
                text: 'Plain'
            }
        });
    };

    $scope.inverted = function () {
        chart.update({
            chart: {
                inverted: true,
                polar: false
            },
            subtitle: {
                text: 'Inverted'
            }
        });
    };

    $scope.polar = function () {
        chart.update({
            chart: {
                inverted: false,
                polar: true
            },
            subtitle: {
                text: 'Polar'
            }
        });
    };

// pie
    // Make monochrome colors and set them as default for all pies
    Highcharts.getOptions().plotOptions.pie.colors = (function () {
        var colors = [],
            base = Highcharts.getOptions().colors[0],
            i;

        for (i = 0; i < 10; i += 1) {
            // Start out with a darkened base color (negative brighten), and end
            // up with a much brighter color
            colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
        }
        return colors;
    }());

    // Build the chart
    Highcharts.chart('pie', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Total Gender'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Gender',
            data: [
                { name: 'Female', y: 56.33 },
                { name: 'Male', y: 24.03 },
            ]
        }]
    });

}]);