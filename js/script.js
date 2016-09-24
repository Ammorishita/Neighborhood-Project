var infowindow, map;
var initialMarkers = [
	{
		"title" : "Phils BBQ, San Marcos",
		"location" : "San Marcos, CA",
		"position" : {lat: 33.131536, lng: -117.185134},
		"image" : "images/Phils.png"
	},
	{
		"title" : "Phils BBQ, San Diego",
		"location" : "San Diego, CA",
		"position" : {lat: 32.754631, lng: -117.215972},
		"image" : "images/Phils.png"
	},
	{
		"title" : "Manna Korean BBQ San Diego",
		"location" : "San Diego, CA",
		"position" : {lat: 32.821301, lng: -117.156154},
		"image" : "images/kbbq.png"
	},
	{
		"title" : "Manna Korean BBQ, Mira Mesa",
		"location" : "San Diego, CA",
		"position" : {lat: 32.915804, lng: -117.147914},
		"image" : "images/kbbq.png"
	},
	{
		"title" : "Lumberyard Tavern and Grill, Encinitas",
		"location" : "Encinitas, CA",
		"position" : {lat: 33.039829, lng: -117.292110},
		"image" : "images/tavern.png"
	},
]

var Markers = function(data) {
	this.title = data.title;
	this.location = data.location;
	this.position = data.position;
	this.image =data.image;
	this.marker = ko.observable(data.marker)
}
var ViewModel = function() {	
	var self = this;
	var currentMarker = null;
	//Bind marker with list.
	self.itemclick = function(markerItem){
		google.maps.event.trigger(this.marker, 'click') 
	};	
	self.map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});

	var content;
	self.infowindow = new google.maps.InfoWindow({
	});

	self.markerList = [];
	initialMarkers.forEach(function(markerItem){
		self.markerList.push(new Markers(markerItem));
	});

	self.markerList.forEach(function(markerItem){
		//Create object literal with marker properties.
		var markerPins = {
			map: self.map,
			position: markerItem.position,
			icon: markerItem.image,
			animation: google.maps.Animation.DROP
		};
		//Create markers for each markerItem.
		markerItem.marker = new google.maps.Marker(markerPins)
		markerItem.marker.addListener('click', function(){
			content = markerItem.title;
			wikiContent = markerItem.location;
			self.infowindow.open(self.map, this);
			self.infowindow.setContent(content);
			
			//Animate marker and stop animation on last clicked marker
			if (currentMarker) currentMarker.setAnimation(null);
			currentMarker = this;
			this.setAnimation(google.maps.Animation.BOUNCE)
			setTimeout(function(){
				currentMarker.setAnimation(null)	
			},1400)

			//Wikipedia api
			var $wikilist = $('#wikilist');
			//Clear wiki results
			$wikilist.text('');;
		    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiContent + '&format=json&callback=wikiCallback';
		    $.ajax({
		        url: wikiURL,
		        dataType: "jsonp",
		        success: function(response){
		            console.log(response);
		            var articles = response[1];
		            for (i=0; i<2; i++){
		                articleStr = articles[i];
		                var url = "http://en.wikipedia.org/wiki/" + articleStr;
		                $wikilist.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
		            }
		        }
		    })
		})
	})


}

/*var viewMap = function() {
	var self = this;
	var currentMarker = null;
	infowindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});
	console.log('viewMap')

	//Create all of the map markers.
	for (i=0; i<initialMarkers.length; i++){
		marker = new google.maps.Marker({
		position: initialMarkers[i].position,
		title: initialMarkers[i].title,
		animation: google.maps.Animation.DROP,
		map: map,
		location: initialMarkers[i].location,
		icon: initialMarkers[i].image
		})
		//Load info window data for specific markers on click.
		marker.addListener('click', (function(){
			return function() {
				infowindow.setContent(this.title);
				infowindow.open(map, this);
				content = this.location;
				console.log(content)
				loadData();
				//Set clicked marker to bounce and disable last clicked marker bounce animation.
				if (currentMarker) currentMarker.setAnimation(null);
				currentMarker = this;
				this.setAnimation(google.maps.Animation.BOUNCE)	
				setTimeout(function(){
					currentMarker.setAnimation(null)
				}, 1400)			
			};
		})(this))
	}	
};*/

var loadData = function() {
	console.log('load data')

	var $wikilist = $('#wikilist');
	$wikilist.text('');
	console.log(content);
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + content + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response){
            console.log(response);
            var articles = response[1];
            for (i=0; i<2; i++){
                articleStr = articles[i];
                var url = "http://en.wikipedia.org/wiki/" + articleStr;
                $wikilist.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
        }
    })
}
function init(){
	ko.applyBindings(new ViewModel());
}