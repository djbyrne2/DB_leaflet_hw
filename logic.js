//Set up map object variable
var myMap = L.map("map", {
    center: [37,-95],
    zoom: 3,
  });

    //Add a tile layer
    L.tileLayer("https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?" +
    "access_token=pk.eyJ1IjoiZGpieXJuZSIsImEiOiJjamtpejZyZ20xYTltM2tvOXFzOWQwcGp4In0.MMRSc8XPci_MOXuYkzyfYg").addTo(myMap);

//Establish queryURL and retrieve the geojson data from usgs.gov
  var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
  d3.json(queryUrl, function(response) {


  //Function for markersize
  function markerSize(num) {
    return num;
  }
  //Color array for magnitudes
   var colors = ['green','blue','yellow','orange','red','purple']

  //Loop through the geojson data and create markers for the earthquakes
  //bind a popup containing magnitude, depth, time and color code based on magnitude
    for (var i = 0; i < response.features.length; i++) {
      var feature = response.features[i];
      var time
      var properties = feature.properties;
      var magnitude = properties.mag;
      var location = feature.geometry.coordinates;
      var depth = feature.geometry.coordinates[2];
    if (magnitude < 1){
      color = colors[0]
    } else if (magnitude >= 1 && magnitude < 2){
      color = colors[1]
    } else if (magnitude >= 2 && magnitude < 3){
      color = colors[2]
    } else if (magnitude >= 3 && magnitude < 4){
      color = colors[3]
    } else if (magnitude >= 4 && magnitude < 5){
      color = colors[4]
    } else {
      color = colors[5]
    }
    L.circleMarker([location[1], location[0]], {
      fillOpacity: .6,
      color: "black",
      fillColor: color,
      weight: 1,
      radius: markerSize(magnitude) * 2
    }).bindPopup("<h3>Magnitude : " + magnitude + "</h3>"+"<strong>Depth: </strong>" + depth + ' kilometers'+
        '<br>'+new Date(feature.properties.time) )
      .addTo(myMap);
  }

  //Place the legend in the bottom right hand corner of the map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),

          grades = [0,1,2,3,4,5];
          div.innerHTML = '<h3>Earthquake Magnitude</h3>'
      //Loop through intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
    }
    return div;
  };

legend.addTo(myMap);
});
