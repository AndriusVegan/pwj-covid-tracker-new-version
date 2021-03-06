window.onload = () => {
  getCountriesData();
  getHistoricalData();
  getWorldCoronaData();
  // $('.ui.dropdown').dropdown();

  // document.querySelector(".active-cases-card").addEventListener("click", () => {
  //   console.log("yo we clicked");
  // });
  // use Html inline onclick instead
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
const worldwideSelection = {
  name: "Worldwide",
  value: "www",
  selected: true,
};
var casesTypeColor = {
  cases: "#cc1034",
  active: "#9d80fe",
  recovered: "#7dd71d",
  deaths: "#fb4443",
};
const mapCenter = {
  lat: 34.80746,
  lng: -40.4796,
};
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 3,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (elem, casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);
  setActiveTab(elem);
};

const setActiveTab = (elem) => {
  const activeEL = document.querySelector(".card.active");
  activeEL.classList.remove("active");
  elem.classList.add("active");
};

const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};

const setMapCenter = (lat, long, zoom) => {
  map.setZoom(zoom);
  map.panTo({
    lat: lat,
    lng: long,
  });
};

const initDropdown = (searchList) => {
  $(".ui.dropdown").dropdown({
    values: searchList,
    onChange: function (value, text) {
      if (value !== worldwideSelection.value) {
        getCountryData(value);
      } else {
        getWorldCoronaData();
      }
    },
  });
};

const setSearchList = (data) => {
  let searchList = [];
  searchList.push(worldwideSelection);
  data.forEach((countryData) => {
    searchList.push({
      name: countryData.country,
      value: countryData.countryInfo.iso3,
    });
  });
  initDropdown(searchList);
};

const getCountriesData = () => {
  fetch("https://disease.sh/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
      setSearchList(data);
      showDataOnMap(data);
      showDataInTable(data);
    });
};

const getCountryData = (countryIso) => {
  const url = "https://disease.sh/v3/covid-19/countries/" + countryIso;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMapCenter(data.countryInfo.lat, data.countryInfo.long, 3);
      setStatsData(data);
    });
};

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // let chartData = buildChartData(data);
      // buildPieChart(data);
      //if you don't use pie chart need to comment out as it would not go to next
      setStatsData(data);
      setMapCenter(mapCenter.lat, mapCenter.lng, 2);
    });
};

const setStatsData = (data) => {
  let addedCases = numeral(data.todayCases).format("+00");
  let addedRecovered = numeral(data.todayRecovered).format("+00");
  let addedDeaths = numeral(data.todayDeaths).format("+00");
  let totalCases = numeral(data.cases).format("0.0a");
  let totalRecovered = numeral(data.recovered).format("0.0a");
  let totalDeaths = numeral(data.deaths).format("0.0a");

  document.querySelector(".total-number").innerHTML = addedCases;
  document.querySelector(".recovered-number").innerHTML = addedRecovered;
  document.querySelector(".deaths-number").innerHTML = addedDeaths;
  document.querySelector(".cases-total").innerHTML = `${totalCases} Total`;
  document.querySelector(
    ".recovered-total"
  ).innerHTML = `${totalRecovered} Total`;
  document.querySelector(".deaths-total").innerHTML = `${totalDeaths} Total`;
};

const getHistoricalData = () => {
  fetch("https://disease.sh/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
      // sortTable(data);
    });
};

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data, casesType = "cases") => {
  //="cases" sets default parameters, same as below
  // if (!casesType) {
  //   casesType = "cases";
  // }
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColor[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: casesTypeColor[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });

    mapCircles.push(countryCircle);

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
          <td>${country.country} </td>
          <td><img src="${country.countryInfo.flag}" width="20" height="20"></td>
          <td>${numeral(country.cases).format("0,0")}</td>
          <td>${numeral(country.recovered).format("0.0")}</td>
          <td>${numeral(country.deaths).format("0.0a")}</td>
      </tr>
      `;
  });
  document.getElementById("table-data").innerHTML = html;
};

// const sortTable = () => {
//   var table, rows, switching, i, x, y, shouldSwitch;
//   table = document.getElementById("table-data");
//   switching = true;
//   /* Make a loop that will continue until
//   no switching has been done: */
//   while (switching) {
//     // Start by saying: no switching is done:
//     switching = false;
//     rows = table.rows;
//     /* Loop through all table rows (except the
//     first, which contains table headers): */
//     for (i = 1; i < (rows.length - 1); i++) {
//       // Start by saying there should be no switching:
//       shouldSwitch = false;
//       /* Get the two elements you want to compare,
//       one from current row and one from the next: */
//       x = rows[i].getElementsByTagName("TD")[0];
//       y = rows[i + 1].getElementsByTagName("TD")[0];
//       // Check if the two rows should switch place:
//       if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//         // If so, mark as a switch and break the loop:
//         shouldSwitch = true;
//         break;
//       }
//     }
//     if (shouldSwitch) {
//       /* If a switch has been marked, make the switch
//       and mark that a switch has been done: */
//       rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//       switching = true;
//     }
//   }
// }
