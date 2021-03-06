// const buildChartData = (data, casesType) => {
//   let chartData = [];
//   let lastDataPoint;
//   for(let date in data.cases){
//     if(lastDataPoint){
//       let newDataPoint = {
//         x: date,
//         y: data[casesType][date] - lastDataPoint
//       }
//       chartData.push(newDataPoint);
//     }
//     lastDataPoint = data[casesType][date];
//   }
//   return chartData;
// };
// nor working so put simple one below 

const buildChartData = (data) => {
  let chartData = [];
  let lastDataPoint;
  for(let date in data.cases){
      if(lastDataPoint){
          let newDataPoint = {
              x: date,
              y: data.cases[date] - lastDataPoint
          }
          chartData.push(newDataPoint);
      }
      lastDataPoint = data.cases[date];
  }
  return chartData;
}

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
          backgroundColor: "rgba(204, 16, 52, 0.5)",
          borderColor: "#cc1034",
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
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "all",
              //need to check if all is correct
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0a");
              },
            },
          },
        ],
      },
    },
  });
};
const buildPieChart = (data) => {
  var ctx = document.getElementById("myPieChart").getContext("2d");
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [data.active, data.recovered, data.deaths],
          backgroundColor: ["#9d80fe", "#7dd71d", "#fb4443"],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Active", "Recovered", "Deaths"],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};
