// ==============================
// READ LOCATION FROM URL
// ==============================

const params = new URLSearchParams(window.location.search);
const selectedLocation = params.get("loc");


// ==============================
// CAMPUS CENTER
// ==============================

var campusCenter = [11.101913428434077, 77.02674873495141];

var map = L.map('map', {
    minZoom: 16,
    maxZoom: 19,
    maxBoundsViscosity: 1.0
});


// ==============================
// SATELLITE MAP
// ==============================

L.tileLayer(
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
{
maxZoom: 19,
minZoom: 16,
attribution: 'Tiles © Esri'
}).addTo(map);


// ==============================
// LIMIT MAP AREA
// ==============================

var northWest = [11.104419699256983, 77.02475124086786];
var southEast = [11.09946715267202, 77.02880615919835];

var campusBounds = L.latLngBounds(northWest, southEast);

map.setMaxBounds(campusBounds);
map.fitBounds(campusBounds, {padding:[20,20]});


// ==============================
// EVENT LOCATIONS
// ==============================

var eventRegistration = [11.100261802149884, 77.02604122912348];
var foodCourt = [11.101073886506136, 77.02756351996702];
var openAuditorium = [11.102406270397992, 77.02785596360869];
var dBlock = [11.101344583295718, 77.02718835241961];
var aiCampus = [11.103846879113547, 77.0273386927205];
var dtPlayhouse = [11.104053035850212, 77.02783131695519];
var aBlock = [11.100178229783424, 77.02661652485841];
var bBlock = [11.099920487823539, 77.02639490920224];
var cBlock = [11.099686908975901, 77.02664935680747];


// ==============================
// ICON FUNCTION
// ==============================

function createIcon(color, size){

return new L.Icon({
iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

iconSize: [size, size*1.6],
iconAnchor: [size/2, size*1.6],
popupAnchor: [0, -size]

});

}


// ==============================
// MARKER DATA
// ==============================

var locations = [

{coord:eventRegistration, name:"Event Registration", color:"red"},
{coord:foodCourt, name:"Food Court", color:"green"},
{coord:openAuditorium, name:"Open Auditorium", color:"orange"},
{coord:dBlock, name:"D Block", color:"blue"},
{coord:aiCampus, name:"AI Campus", color:"violet"},
{coord:dtPlayhouse, name:"DT Playhouse", color:"red"},
{coord:aBlock, name:"A Block", color:"blue"},
{coord:bBlock, name:"B Block", color:"green"},
{coord:cBlock, name:"C Block", color:"orange"}

];


// ==============================
// CREATE MARKERS
// ==============================

var markerObjects = [];

locations.forEach(function(loc){

var marker = L.marker(loc.coord,{
icon:createIcon(loc.color,35)
}).addTo(map).bindPopup(loc.name);

markerObjects.push({
marker:marker,
color:loc.color
});

});


// ==============================
// DRAW ROUTE FROM REGISTRATION
// ==============================

if(selectedLocation){

locations.forEach(function(loc){

if(loc.name === selectedLocation){

var routeLine = L.polyline(
[
eventRegistration,
loc.coord
],
{
color:"blue",
weight:6,
opacity:0.9
}
).addTo(map);

// zoom map to route
map.fitBounds(routeLine.getBounds(),{padding:[80,80]});

// open popup
L.marker(loc.coord)
.addTo(map)
.bindPopup(loc.name)
.openPopup();

}

});

}


// ==============================
// ZOOM BASED MARKER SIZE
// ==============================

map.on("zoomend", function(){

var zoom = map.getZoom();

var size;

if(zoom >= 19) size = 65;
else if(zoom >= 18) size = 55;
else if(zoom >= 17) size = 45;
else size = 35;

markerObjects.forEach(function(obj){

obj.marker.setIcon(createIcon(obj.color,size));

});

});