'use strict';
var infowindow, map, i, articleStr, wikiContent;
var initialMarkers = [
	{
		'title' : 'Phils BBQ, San Marcos',
		'location' : 'San Marcos, CA',
		'position' : {lat: 33.131536, lng: -117.185134},
		'image' : 'images/Phils.png'
	},
	{
		'title' : 'Phils BBQ, San Diego',
		'location' : 'San Diego, CA',
		'position' : {lat: 32.754631, lng: -117.215972},
		'image' : 'images/Phils.png'
	},
	{
		'title' : 'Manna Korean BBQ, San Diego',
		'location' : 'San Diego, CA',
		'position' : {lat: 32.821301, lng: -117.156154},
		'image' : 'images/kbbq.png'
	},
	{
		'title' : 'Manna Korean BBQ, Mira Mesa',
		'location' : 'San Diego, CA',
		'position' : {lat: 32.915804, lng: -117.147914},
		'image' : 'images/kbbq.png'
	},
	{
		'title' : 'Lumberyard Tavern and Grill, Encinitas',
		'location' : 'Encinitas, CA',
		'position' : {lat: 33.039829, lng: -117.292110},
		'image' : 'images/tavern.png'
	},
];

var Markers = function(data) {
	this.title = data.title;
	this.location = data.location;
	this.position = data.position;
	this.image = data.image;
	this.marker = data.marker;
};
var Wiki = function(data) {;
	this.title = data;
	this.url = 'http://en.wikipedia.org/wiki/' + data;
};
var ViewModel = function() {	
	var self = this;
	var currentMarker = null;
	//this.model= "test";
		//Bind marker with list.
	self.itemclick = function(markerItem){
		google.maps.event.trigger(this.marker, 'click') 
	};
	//Create google map	
	self.map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});
	//Declare error false/true to hide/show visible bindindg.
	self.error = ko.observable(false);
	self.working = ko.observable(true);

	self.wikiResults = ko.observableArray();
	/*initialWiki.forEach(function(items){
		self.wikiResults().push(new Wiki(items));
	});*/
	console.log(self.wikiResults())
	//Wiki API function
	self.wikiAPI = function(){
			var $wikilist = $('#wikilist');	
			self.working(false);
			//self.error(true);
			//Clear wiki results
			//$wikilist.text('');
		    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiContent + '&format=json&callback=wikiCallback';
	
		    $.ajax({
		    	url: wikiURL,
		    	dataType: 'jsonp'
		    }).done(function(response){
		    	self.wikiResults([]);
	    		console.log(response);
				var articles = response[1];
				console.log(articles)
	            //Append the first 2 article results
	            articleStr = articles[i];
	        	articles.forEach(function(items){
	        		self.wikiResults.push(new Wiki(items));
	        	});
	        	console.log(self.wikiResults());
		    }).fail(function(){
		    	self.error(true);
        			//$wikilist.append('<li>ERROR RETRIEVING INFORMATION FROM WIKIPEDIA.</li>');
		    });
	};

	var content;
	self.infowindow = new google.maps.InfoWindow({
	});
	//Create and add markers into an array
	self.markerList = ko.observableArray([]);
	initialMarkers.forEach(function(markerItem){
		self.markerList().push(new Markers(markerItem));
	});
	self.markerList().forEach(function(markerItem){
		//Create object literal with marker properties.
		var markerPins = {
			map: self.map,
			position: markerItem.position,
			icon: markerItem.image,
			animation: google.maps.Animation.DROP
		};
		//Create markers for each markerItem.
		markerItem.marker = new google.maps.Marker(markerPins);
		markerItem.marker.addListener('click', function(){
			content = markerItem.title;
			wikiContent = markerItem.location;
			self.infowindow.open(self.map, this);
			self.infowindow.setContent(content);
			//Animate marker and stop animation on last clicked marker
			if (currentMarker) {
				currentMarker.setAnimation(null)
			};
			currentMarker = this;
			this.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				currentMarker.setAnimation(null);	
			},1400);
			self.wikiAPI();
		});
	});
	//Filter markers and list items.
	self.searchTerm = ko.observable('');
	self.filter = ko.computed(function(){
		return ko.utils.arrayFilter(self.markerList(), function(item){
			item.marker.setVisible(false);
			if (item.title.toLowerCase().indexOf(self.searchTerm().toLowerCase()) >= 0) {
				item.marker.setVisible(true);
				return true;
			} else {
				item.marker.setVisible(false);
				return false;
			}
		});
	});
};

function init(){
	ko.applyBindings(new ViewModel());
};
function googleError(){
	window.alert('Google maps failed to load');
};
