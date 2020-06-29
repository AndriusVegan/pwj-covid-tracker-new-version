window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
  
  document.querySelector('.active-cases-card').addEventListener('click', () =>{
      console.log("yo we clicked")
  })
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 53.345, lng: 23.065 },
    zoom: 3,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}
const changeDataSelection = (casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);

}

const clearTheMap = () => {
  for(let circle of mapCircles) {
    circle.setMap(null);
  }

}

const getCountryData = () => {
  fetch("https://disease.sh/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
      showDataOnMap(data);
      showDataInTable(data);
    });
};

const getHistoricalData = () => {
  fetch("https://disease.sh/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // let chartData = buildChartData(data);
      buildChart(data);
    });

}

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data, casesType="cases") => {
  //="cases" sets default parameters 
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
      radius: country[casesType]
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
          <td>${country.country}</td>
          <td>${country.cases}</td>
          <td>${country.recovered}</td>
          <td>${country.deaths}</td>
      </tr>
      `;
  });
  document.getElementById("table-data").innerHTML = html;
};
