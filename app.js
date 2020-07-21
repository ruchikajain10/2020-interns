'use strict';

let dates = [];
let exchange_rate = [];
let randomHexCode = [];
let exch_Currency = "";
/* function*/
const RandomHexCode = () => {
    /*append the random colors*/
    for (let i = 0; i < 31; i++) {
        randomHexCode.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));
    }
    console.log("Hexcode", randomHexCode)
}


const fetchApiData = (startdate, enddate,exchangeCurrency) => {
    debugger
    exch_Currency = (exchangeCurrency)? exchangeCurrency : 'INR';
/*fiter dates    */
    let filteredDates = [];
    let urls = ['http://localhost:3000/rates']
    Promise.all(urls.map(u => fetch(u))).then(responses =>
        Promise.all(responses.map(res => res.json()))
    ).then(data => {
        RandomHexCode()
        console.log('fetched data [1]...', data[0]);
/*object keys enter the start date and end date*/
        if (startdate && enddate) {
            randomHexCode.length = 0;
            dates.length = 0;
            exchange_rate.length = 0;
            RandomHexCode()
            Object.keys(data[0]).filter((date) => {
                if (new Date(date) > new Date(startdate) && new Date(date) < new Date(enddate)) {
                    data.map((item) => {
                        let exchangerate = item[date][exch_Currency] / 1
                        filteredDates.push({ "date": date,"EXH_Rate" : exchangerate})
                    })
                 }
            })
        } else {/* start date should be greater than end date*/ 
            Object.keys(data[0]).filter((date) => {
                if (new Date(date) > new Date("2019-01-31")) { }
                else {
                    data.map((item) => {
                        let exchangerate = item[date][exch_Currency] / 1
                        filteredDates.push({ "date": date,"EXH_Rate": exchangerate})
                    })
                }
            })
        }

        console.log('filteredDates', filteredDates)

        filteredDates.map((item) => {
            dates.push(item.date)
            exchange_rate.push(item.EXH_Rate)
        })

        // Start chart
        var chart = document.getElementById('myChart');
        // Chart.defaults.global.animation.duration = 2000; // Animation duration
        // Chart.defaults.global.title.display = false; // Remove title
        // Chart.defaults.global.title.text = "Chart"; // Title
        // Chart.defaults.global.title.position = 'bottom'; // Title position
        // Chart.defaults.global.defaultFontColor = '#999'; // Font color
        // Chart.defaults.global.defaultFontSize = 10; // Font size for every label

        // // Chart.defaults.global.tooltips.backgroundColor = '#FFF'; // Tooltips background color
        // Chart.defaults.global.tooltips.borderColor = 'white'; // Tooltips border color
        // Chart.defaults.global.legend.labels.padding = 0;
        // Chart.defaults.scale.ticks.beginAtZero = true;
        // Chart.defaults.scale.gridLines.zeroLineColor = 'rgba(255, 255, 255, 0.1)';
        // Chart.defaults.scale.gridLines.color = 'rgba(255, 255, 255, 0.02)';
        // Chart.defaults.global.legend.display = false;

        var myChart = new Chart(chart, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: "Exchange Rate",
                    fill: false,
                    lineTension: 0,
                    data: exchange_rate,
                    pointBorderColor: "#4bc0c0",
                    backgroundColor: randomHexCode,
                    borderColor: '#4bc0c0',
                    borderWidth: 2,
                    showLine: true,
                }]
            },
        });

        //  Chart ( 2 )
        var Chart2 = document.getElementById('myChart2').getContext('2d');
        var chart = new Chart(Chart2, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: "Exchange Rate",
                    backgroundColor: randomHexCode,
                    borderColor: 'rgb(255, 79, 116)',
                    borderWidth: 2,
                    pointBorderColor: false,
                    data: exchange_rate,
                    fill: false,
                    lineTension: .4,
                }]
            },

            // Configuration options
            options: {
                title: {
                    display: false
                }
            }
        });

        var ctx = document.getElementById("myPieChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: dates,
                datasets: [{
                    backgroundColor: randomHexCode,
                    data: exchange_rate
                }]
            }
        });



        var ctx = document.getElementById('myRaceChart').getContext('2d');
        var chart = new Chart(ctx, {

            type: 'horizontalBar',

            data: {

                labels: dates,

                datasets: [{
                    label: '%',

                    backgroundColor: 'rgba(0,153,153,0.5)',
                    hoverBackgroundColor: 'rgba(0,153,153,0.9)',
                    data: exchange_rate,
                }]
            },

            options: {
                title: {
                    display: true,
                    text: 'Internet Use - ESS - Belgium 2018'
                },
                legend: { position: 'right', fontSize: 20, },
                scales: {
                    yAxes: [{ ticks: { fontSize: 20, } }],
                    xAxes: [{ ticks: { fontSize: 20, } }],
                },
            }//options end

        });




    }).catch((err) => {
        console.log('Error fetching...', err)
    })
}

$(function () {
    $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy"
        , duration: "fast"
    });
});
/* datetime pickers for dates*/
$(function () {
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        let startDate = start.format('MM-DD-YYYY');
        let endDate   = end.format('MM-DD-YYYY');
        fetchApiData(startDate, endDate,exch_Currency)
    });
});

/* dropdown list*/
let dropdown = document.getElementById('contry-currency');
dropdown.length = 0;

let defaultOption = document.createElement('option');
defaultOption.text = 'Choose Currency';
/* dynamic*/
dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const url = 'https://api.exchangeratesapi.io/latest';

fetch(url)  
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.warn('Looks like there was a problem. Status Code: ' + 
          response.status);  
        return;  
      }

      // Examine the text in the response  
      response.json().then(function(data) {  
        console.log('Select',data.rates)
        let option;
        Object.keys(data.rates).map((item) =>{
          option = document.createElement('option');
      	  option.text = item;
      	  option.value = item;
      	  dropdown.add(option);
        })   
      });  
    }  
  )  
  .catch(function(err) {  
    console.error('Fetch Error -', err);  
  });
/*currency filter*/


const getCurrency = () =>{
    var e = document.getElementById("contry-currency");
    var Currency = e.options[e.selectedIndex].value;
    exch_Currency = Currency/*global variable*/
    console.log('Currency',exch_Currency)

    randomHexCode.length = 0;
    dates.length = 0;
    exchange_rate.length = 0;
    fetchApiData(null,null,exch_Currency)
}