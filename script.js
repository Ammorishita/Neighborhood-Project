

var setMarkers = function(data) {
		this.title = ko.observable(data.clickCount);
		this.position = ko.observable(data.position);
		this.map = ko.observable(data.clickCount);
};

var viewModel = {
	init: function() {
		var map;
		map = new google.maps.Map(document.getElementById('map'),{
			center: {lat: 32.921186, lng: -117.167509},
			zoom: 11
		});	
		var marker = new google.maps.Marker({
			position:{lat: 32.921186, lng: -117.167509},
			title: "house",
			map: map
		})
	}
};
