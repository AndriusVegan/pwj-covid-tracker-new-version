window.onload = () => {
  getCountryData();
  getHistoricalData();
  myChart();
};

var map;
var infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 53.345, lng: 23.065 },
    zoom: 3,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}

const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data);
      showDataInTable(data);
    });
};

const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

const buildChartData = (data) => {
  let chartData = [];
  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }
  return chartData;
};

const buildChart = (chartData) => {
  console.log("All if good");
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "#1d2c4d",
          borderColor: "#1d2c4d",
          data: chartData,
        },
      ],
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
      },
    },
  });
};

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data) => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country.cases,
    });

    var html = `
          <div class="info-container">
              <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
              </div>
              <div class="info-name">
                  ${country.country}
              </div>
              <div class="info-confirmed">
                  Total: ${country.cases}
              </div>
              <div class="info-recovered">
                  Recovered: ${country.recovered}
              </div>
              <div class="info-deaths">   
                  Deaths: ${country.deaths}
              </div>
          </div>
      `;

    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
      <tr>
          <td>${country.country}</td>
          <td>${country.cases}</td>
          <td>${country.recovered}</td>
          <td>${country.deaths}</td>
      </tr>
      `;
  });
  document.getElementById("table-data").innerHTML = html;
};

// var myPieChart = new Chart(ctx, {
//   type: 'pie',
//   data: data,
//   options: options
// });

// new Chart(document.getElementById("pie-chart"), {
//   type: "pie",
//   data: {
//     labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
//     datasets: [
//       {
//         label: "Population (millions)",
//         backgroundColor: [
//           "#3e95cd",
//           "#8e5ea2",
//           "#3cba9f",
//           "#e8c3b9",
//           "#c45850",
//         ],
//         data: [2478, 5267, 734, 784, 433],
//       },
//     ],
//   },
//   options: {
//     title: {
//       display: true,
//       text: "Predicted world population (millions) in 2050",
//     },
//   },
// });

// let myChart = document.getElementById("pie-chart").getContext("2d");

// let myChart = new Chart(ctx, {
//   type: "pie",
//   data: {
//     datasets: [
//       {
//         data: [30, 10, 40, 20],
//         backgroundColor: colorHex,
//       },
//     ],
//     labels: labels,
//   },
//   options: {
//     responsive: true,
//     legend: {
//       position: "bottom",
//     },
//     plugins: {
//       datalabels: {
//         color: "#fff",
//         anchor: "end",
//         align: "start",
//         offset: -10,
//         borderWidth: 2,
//         borderColor: "#fff",
//         borderRadius: 25,
//         backgroundColor: (context) => {
//           return context.dataset.backgroundColor;
//         },
//         font: {
//           weight: "bold",
//           size: "10",
//         },
//         formatter: (value) => {
//           return value + " %";
//         },
//       },
//     },
//   },
// });
