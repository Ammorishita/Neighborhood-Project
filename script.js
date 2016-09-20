
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

var Markers = function(data) {
	this.title = ko.observable(data.title);
}
var viewMarkers = function() {
	var self = this;
	this.markerList = ko.observableArray([]);
	initialMarkers.forEach(function(markerItem){
		self.markerList.push(new Markers(markerItem));
	});
	this.currentMarker = ko.observable(this.markerList()[0]);
}

ko.applyBindings(new viewMarkers());

var viewMap = function() {
	var self = this;
	var map;
	var currentMarker = null;
	var infowindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});
	//Load all of the map markers.
	for (i=0; i<initialMarkers.length; i++){
		var marker = new google.maps.Marker({
		position: initialMarkers[i].position,
		title: initialMarkers[i].title,
		animation: google.maps.Animation.DROP,
		map: map,
		})
		//Load info window data for specific markers on click.
		marker.addListener('click', (function(){
			return function() {
				infowindow.setContent(this.title);
				infowindow.open(map, this);
				//Set clicked marker to bounce and disable last clicked marker bounce animation.
				if (currentMarker) currentMarker.setAnimation(null);
				currentMarker = this;
				this.setAnimation(google.maps.Animation.BOUNCE)				
			};
		})(this))
	}	
};


var loadData = function() {
	console.log('test')

}
