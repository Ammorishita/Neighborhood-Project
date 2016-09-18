
var initialMarkers = [
	{
		"title" : "Phils BBQ San Marcos",
		"position" : {lat: 33.131536, lng: -117.185134}
	},
	{
		"title" : "Phils BBQ San Diego",
		"position" : {lat: 32.754631, lng: -117.215972}
	},
	{
		"title" : "Manna Korean BBQ San Diego",
		"position" : {lat: 32.821301, lng: -117.156154}
	},
	{
		"title" : "Manna Korean BBQ Mira Mesa",
		"position" : {lat: 32.915804, lng: -117.147914}
	},
	{
		"title" : "Lumberyard Tavern and Grill",
		"position" : {lat: 33.039829, lng: -117.292110}
	},
]

var viewModel = function() {
	var self = this;
	var map;
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});
	//Load all of the map markers.
	for (i=0; i<initialMarkers.length; i++){
		marker = new google.maps.Marker({
		position: initialMarkers[i].position,
		title: initialMarkers[i].title,
		map: map,
		})

		marker.addListener('click', (function(){
			var infowindow = new google.maps.InfoWindow({
			content: initialMarkers[i].title
			});
			return function() {
				infowindow.open(map, this)
			};
		})(this))
	}	
	/*this.markerList = ko.observableArray([]);
	initialMarkers.forEach(function(item){
		self.markerList.push(new Markers(item));
	});
	this.currentMarker = ko.observable(this.markerList()[0]);
	console.log(this.currentMarker)*/
};


var viewList = function() {

}
ko.applyBindings(new viewModel());