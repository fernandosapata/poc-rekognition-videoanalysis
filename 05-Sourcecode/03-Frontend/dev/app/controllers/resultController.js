app.controller('results', ['$scope', function($scope) {
//column
    var chart = Highcharts.chart('column', {
        exporting: {
            enabled: false
        },
        title: {
            text: 'Overview'
        },
        subtitle: {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in vehicula lacus.'
        },
        tooltip: {
            shared: false
        },
//        colors:['#244566', '#2e567f', '#376799', '#4079b2', '#498acc', '#529be5', '#5cadff', '#6cb5ff'],
        color: '#5cadff',
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
//                colorByPoint: true
            },
            series: {
//                borderRadius: 5,
                dataLabels: {
                  enabled: true,
                  format: '{point.y:.1f}%',
                  style: {
                      color: '#535353',
                      fontWeight: '100',
                      strokeWidth: '0'
                  }
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
            data: [29, 71, 96, 39, 54, 45, 60, 90],
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
        subtitle: {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in vehicula lacus.'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                size:'60%',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: '#535353',
                        fontWeight: '500'
                    }
                }
            }
        },
        series: [{
            name: 'Gender',
            data: [
                { name: 'Female', y: 100, color: '#fd665f'},
                { name: 'Male', y: 24, color: '#5cadff'},
            ]
        }]
    });

}]);