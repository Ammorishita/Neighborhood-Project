	self.weatherAPI = function(){
		self.working(false);
		self.weather(true);
		self.weatherResults([]);
		var key = '1c2345da8528da89ff0071bcdd221cce';
		var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + key +'&q=' + thisLocation + '&units=metric';
		weatherIconURL = 'http://openweathermap.org/img/w/';
		$.ajax({
			url: weatherURL,
			dataType: 'json'
		}).done(function(response){
			console.log(response);
			self.weatherResults.push(new Weather(response));
			
			console.log(self.weatherResults());
		}).fail(function(){
			self.error(true);
		});

	};

	/*self.wikiAPI = function(){
		self.working(false);
	    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiContent + '&format=json&callback=wikiCallback';

	    $.ajax({
	    	url: wikiURL,
	    	dataType: 'jsonp'
	    }).done(function(response){
	    	self.wikiResults([]);
	    	var articles = response[1];
			var snippets = response[2];
    		console.log(response);
    		//self.wikiResults2().push(snippets);
    		console.log(self.wikiResults2())
			console.log(articles);
            //Add the first 2 wiki results into the observable array.
        	for (i=0; i<1; i++) {
        		self.wikiResults.push(new Wiki(articles[i]));
        		self.wikiResults2.push(new Wiki2(snippets[i]));
        	}
        	console.log(self.wikiResults());
	    }).fail(function(){
	    	self.error(true);
	    });
	};*/

	self.yelpAPI = function(){
		function nonce_generate() {
  			return (Math.floor(Math.random() * 1e12).toString());
		}
		var YELP_BASE_URL = 'https://api.yelp.com/v2/search/';
		var YELP_KEY_SECRET = 'YJgc-BtCt9ogrrDXz5ptbkFJ3mo';
		var YELP_TOKEN_SECRET = 'gK1IB6E7txoJUpH3AK7p52iF8MQ';
		var yelp_url = YELP_BASE_URL;

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
	    	//var newresults = results.businesses[0];
	    	var yelpID = results.businesses[0].id;
	    	var yelpImage = results.businesses[0].image_url;
	    	var yelpSnippet = results.businesses[0].snippet_text;
	    	var yelpURL = results.businesses[0].url;
	    	//Set content of infowindow.
	    	var infoContent = '<div id="infowindow"><div class="infowindow-title center"><h2>'+ content + '</h2>' + '</div><div class="infowindow-image"><img src="' + yelpImage + '"></img></div><div class="infowindow-snippet"><p>"' + yelpSnippet + '"</p></div><div class="infowindow-link center"><a href="' + yelpURL + '" alt="Yelp Image" target="_new">Find ' + content +' on Yelp!</a></p></div></div>';
	    	//self.yelpResults.push(new Yelp(newresults));
			self.infowindow.setContent(infoContent);		    	
	    }).fail(function(){
	    	window.alert('Could not find results from Yelp.com');
	    });
	};