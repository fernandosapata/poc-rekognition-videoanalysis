app.controller('profile', ['$scope', function($scope) {
//    console.log('oi');
//    $scope.profile = 'https://www.shoptab.net/blog/wp-content/uploads/2014/07/profile-circle.png';
//profile
    $scope.profiles = [
        {
            "id": 1,
                     "time": ["1:20", "1:40", "5:50"],
                     "url": "https://lh3.googleusercontent.com/-Ai76BPVK0K4/VzNzaQ83bDI/AAAAAAAACj0/H17NyT8wsMc/s640/Kajol-Dp-profile-pics-586.jpg",
                     "sunglasses": "0",
                     "eyeglasses": "0",
                     "gender": {"name" : "Female", "value": 98},
                     "happy": "90",
                     "angry": "10",
                     "sad": "20",
                     "eyesopen": "98",
                     "smilling": "80",
                     "mouthopen": "30",
                     "mustache": "0",
                     "beard": "0"
                 }, {
                     "id": 2,
                     "time": ["2:20", "3:40", "10:50"],
                     "url": "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/8/000/299/284/05408a2.jpg",
                     "sunglasses": "99",
                     "eyeglasses": "98",
                     "gender": {"name" : "Male", "value": 80},
                     "happy": "90",
                     "angry": "10",
                     "sad": "30",
                     "eyesopen": "98",
                     "smilling": "80",
                     "mouthopen": "50",
                     "mustache": "98",
                     "beard": "95"
                 }, {
                     "id": 3,
                     "time": ["2:20", "3:40", "10:50"],
                     "url": "http://www.design2talk.com/wp-content/uploads/2016/10/cool-girls-dps.jpg",
                     "sunglasses": "94",
                     "eyeglasses": "94",
                     "gender": {"name" : "Female", "value": 90},
                     "happy": "40",
                     "angry": "80",
                     "sad": "40",
                     "eyesopen": "50",
                     "smilling": "30",
                     "mouthopen": "0",
                     "mustache": "0",
                     "beard": "0"
                 }, {
                     "id": 4,
                     "time": ["1:20", "1:40", "5:50"],
                     "url": "https://lh3.googleusercontent.com/-oAglOSE-aeI/AAAAAAAAAAI/AAAAAAAAAAA/WH5wh6dMNXo/photo.jpg",
                     "sunglasses": "0",
                     "eyeglasses": "0",
                     "gender": {"name" : "Female", "value": 98},
                     "happy": "90",
                     "angry": "10",
                     "sad": "20",
                     "eyesopen": "98",
                     "smilling": "80",
                     "mouthopen": "30",
                     "mustache": "0",
                     "beard": "0"
                 }, {
                     "id": 5,
                     "time": ["2:20", "3:40", "10:50"],
                     "url": "https://2.bp.blogspot.com/-NsFAvNPs4as/VtAlXYIH0tI/AAAAAAAAAx4/VqdHonnrkAE/s1600/Cute%2BCouple%2BLoving%2BHusband%2Band%2BWife%2BProfile%2BPics%2BWhatsApp%2BDp%252C%2BHappy%2BBirthday%2BLove%2BQuotes%2BSms%2BWishes%252C%2BGift%2BIdeas%252C%2BMessages%2BImages%2BPhotos%2BWallpapers%2BLovers%2BRomantic%2B%252823%2529.jpg",
                     "sunglasses": "99",
                     "eyeglasses": "98",
                     "gender": {"name" : "Male", "value": 80},
                     "happy": "90",
                     "angry": "10",
                     "sad": "30",
                     "eyesopen": "98",
                     "smilling": "80",
                     "mouthopen": "50",
                     "mustache": "98",
                     "beard": "95"
                 }, {
                     "id": 6,
                     "time": ["2:20", "3:40", "10:50"],
                     "url": "https://static1.squarespace.com/static/51882e59e4b00d33ee9bf77b/t/5568ad0be4b01c525344b697/1432923433734/chin+implant+NYC?format=500w",
                     "sunglasses": "94",
                     "eyeglasses": "94",
                     "gender": {"name" : "Female", "value": 90},
                     "happy": "40",
                     "angry": "80",
                     "sad": "40",
                     "eyesopen": "50",
                     "smilling": "30",
                     "mouthopen": "0",
                     "mustache": "0",
                     "beard": "0"
                 }
    ];
//    console.log($scope.profiles[1].sunglasses);

    // Bar
    angular.forEach($scope.profiles, function(value, key){
        console.log(value.beard);
//        console.log(key);
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
                name: 'Personal',
                colorByPoint: true,
                data: [{
                    name: 'Wearing sunglasses',
                    y: parseInt(value.sunglasses),
                    color: '#FF8201'
                }, {
                    name: 'Wearing eyeglasses',
                    y: parseInt(value.eyeglasses),
                    color: '#F37252'
                }, {
                    name: 'Appears to be '+ value.gender.name,
                    y: parseInt(value.gender.value),
                    color: '#C72C3A'
                }, {
                    name: 'Eyes are open',
                    y: parseInt(value.eyesopen),
                    color: '#EA3E70'
                }, {
                    name: 'Smilling',
                    y: parseInt(value.smilling),
                    color: '#954567'
                }, {
                    name: 'Mouth is open',
                    y: parseInt(value.mouthopen),
                    color: '#4BC4D5'
                },{
                    name: 'Does not have a mustache',
                    y: parseInt(value.mustache),
                    color: '#0180B5'
                },{
                    name: 'Does not have a beard',
                    y: parseInt(value.beard),
                    color: '#02B5A0'
                }]
            }]
        });


    ////    line
        Highcharts.chart('emotions', {
            chart: {
                type: 'line',
                height: 150
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Lorem ipsum dolor sit amet'
            },
            xAxis: {
                categories: ['Happy', 'Angry', 'Sad']
            },
            yAxis: {
                title: {
                    text: 'Percentage'
                }
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
            series: [{
                name: 'Emotions',
                data: [
                        parseInt(value.happy),
                        parseInt(value.angry),
                        parseInt(value.sad)
                      ],
                showInLegend: false,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }]
        });
    });
}]);