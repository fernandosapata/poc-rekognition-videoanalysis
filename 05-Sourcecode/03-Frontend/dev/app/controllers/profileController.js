app.controller('profile', ['$scope', function($scope) {
//    console.log('oi');
//    $scope.profile = 'https://www.shoptab.net/blog/wp-content/uploads/2014/07/profile-circle.png';
//profile
    $scope.profiles = [
        {
            "id": 1,
            "time": ["1:20", "1:40", "5:50"],
            "url": "https://lh3.googleusercontent.com/-Ai76BPVK0K4/VzNzaQ83bDI/AAAAAAAACj0/H17NyT8wsMc/s640/Kajol-Dp-profile-pics-586.jpg",
            "Sunglasses": "0",
            "Eyeglasses": "0",
            "Gender": "Female",
            "Happy": "90",
            "Angry": "10",
            "EyesOpen": "98",
            "Smilling": "80",
            "MouthOpen": "30",
            "Mustache": "0"
        }, {
            "id": 2,
            "time": ["2:20", "3:40", "10:50"],
            "url": "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/8/000/299/284/05408a2.jpg",
            "Sunglasses": "99",
            "Eyeglasses": "98",
            "Gender": "Male",
            "Happy": "90",
            "Angry": "10",
            "EyesOpen": "98",
            "Smilling": "80",
            "MouthOpen": "50",
            "Mustache": "98"
        }, {
            "id": 3,
            "time": ["2:20", "3:40", "10:50"],
            "url": "https://lh3.googleusercontent.com/-Ai76BPVK0K4/VzNzaQ83bDI/AAAAAAAACj0/H17NyT8wsMc/s640/Kajol-Dp-profile-pics-586.jpg",
            "Sunglasses": "94",
            "Eyeglasses": "94",
            "Gender": "Female",
            "Happy": "40",
            "Angry": "80",
            "EyesOpen": "50",
            "Smilling": "30",
            "MouthOpen": "0",
            "Mustache": "0"
        }
    ];

    $(function () {
        // Create the chart
        Highcharts.chart('profile', {
            chart: {
                type: 'bar'
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Lorem ipsum dolor sit amet, consectetur'
            },
            subtitle: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in vehicula lacus.'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Lorem ipsum dolor sit amet'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Microsoft Internet Explorer',
                    y: 56.33
                }, {
                    name: 'Chrome',
                    y: 24.03
                }, {
                    name: 'Firefox',
                    y: 10.38
                }, {
                    name: 'Safari',
                    y: 4.77
                }, {
                    name: 'Opera',
                    y: 0.91
                }, {
                    name: 'Proprietary or Undetectable',
                    y: 0.2
                }]
            }]
        });
    });
}]);