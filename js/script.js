'use strict';
var infowindow, content, content2, map, i, articleStr, wikiContent, google, ko, $;
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
		'image' : 'images/Phils.png',
		'search' : 'Phils BBQ'
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
var Wiki = function(data) {
	this.title = data;
	this.url = 'http://en.wikipedia.org/wiki/' + data;
};
var ViewModel = function() {	
	var self = this;
	var currentMarker = null;
	var 
	remove = function(){
		self.wikiResults([]);
	}
	//this.model= "test";
		//Bind marker with list.
	self.itemclick = function(markerItem){
		google.maps.event.trigger(this.marker, 'click'); 
	};
	//Create google map	
	self.map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});
	//Declare error false/true to hide/show visible bindindg.
	self.error = ko.observable(false);
	self.working = ko.observable(true);
	//Observable array for the wiki api results.
	self.wikiResults = ko.observableArray();
	console.log(self.wikiResults());
	//Wiki API function
	self.wikiAPI = function(){
			self.working(false);
		    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiContent + '&format=json&callback=wikiCallback';
	
		    $.ajax({
		    	url: wikiURL,
		    	dataType: 'jsonp'
		    }).done(function(response){
		    	self.wikiResults([]);
	    		console.log(response);
				var articles = response[1];
				console.log(articles);
	            //Add the first 2 wiki results into the observable array.
	        	for (i=0; i<2; i++) {
	        		self.wikiResults.push(new Wiki(articles[i]));
	        	}
	        	console.log(self.wikiResults());
		    }).fail(function(){
		    	self.error(true);
		    });
	};

	self.yelpAPI = function(){
		function nonce_generate() {
  			return (Math.floor(Math.random() * 1e12).toString());
		}
		var YELP_BASE_URL = 'https://api.yelp.com/v2/search/';
		var YELP_KEY_SECRET = 'YJgc-BtCt9ogrrDXz5ptbkFJ3mo';
		var YELP_TOKEN_SECRET = 'gK1IB6E7txoJUpH3AK7p52iF8MQ';
		var yelp_url = YELP_BASE_URL; //+ 'business/' + self.selected_place().Yelp.business_id;

	    var parameters = {
	      oauth_consumer_key: 'REfQ41eJe5W6cOXEKbedIw',
	      oauth_token: 'yXeLtJ768XlAbLUoLwPJAnRqCSZv5MI_',
	      oauth_nonce: nonce_generate(),
	      oauth_timestamp: Math.floor(Date.now()/1000),
	      oauth_signature_method: 'HMAC-SHA1',
	      oauth_version : '1.0',
	      callback: 'cb', 
	      limit: 1,
	      term: content,
	      location: 'San+Diego'
	    };
    	var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    	parameters.oauth_signature = encodedSignature;
	    var settings = {
	      url: yelp_url,
	      data: parameters,
	      cache: true,
	      dataType: 'jsonp',
	      callback: 'cb'
	    };

	    $.ajax(settings).done(function(results){
	    	console.log(results);
	    	console.log(results.businesses[0].image_url);
	    	content2 = results.businesses[0].id;
	    }).fail(function(){

	    });
	};

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
			animation: google.maps.Animation.DROP,
		};
		//Create markers for each markerItem.
		markerItem.marker = new google.maps.Marker(markerPins);
		markerItem.marker.addListener('click', function(){
			content = markerItem.title;
			wikiContent = markerItem.location;
			self.map.setZoom(11);
			self.map.setCenter(this.position);
			self.infowindow.open(self.map, this);
			self.infowindow.setContent(content + content2);
			//Animate marker and stop animation on last clicked marker
			if (currentMarker) {
				currentMarker.setAnimation(null);
			}
			currentMarker = this;
			this.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				currentMarker.setAnimation(null);	
			},1400);
			self.wikiAPI();
			self.yelpAPI();
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
}
function googleError(){
	window.alert('Google maps failed to load');
}