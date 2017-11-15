var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var search = "";
var dataArr = [];

function npmSearch(){
	for(var i = 3; i < process.argv.length; i++){
		search = search + process.argv[i] + " ";
	}
}
 
function postTweets(){
	var keysForTwitter = require('./keys.js')
	var client = new Twitter({
  		consumer_key: keysForTwitter.consumer_key,
  		consumer_secret: keysForTwitter.consumer_secret,
  		access_token_key: keysForTwitter.access_token_key,
  		access_token_secret: keysForTwitter.access_token_secret
	});
	var params = {screen_name: 'bigbert836'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
  		if (!error) {
  			for(var i = 0; i < 20; i++){
	    		console.log("On " + tweets[i].created_at + " GMT");
	    		console.log(tweets[i].user.name + " tweeted:");
	    		console.log("'" + tweets[i].text + "'");
	    		console.log(" ");
	    	}
  		}
	});
}

function songSearch(){
	if(search === ""){
		search = "The Sign Ace of Base";
	}
	var spotify = new Spotify({
  		id: '243d2b8aa3e14bf6981fbe3a56bb187a',
  		secret: '8ac659e69640484dbcee6f34e4e2e7f0'
	});
	spotify.search({ type: 'track', query: search }, function(err, data) {
		if (err) {
	    	return console.log('Error occurred: ' + err);
	  	}
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Track: " + data.tracks.items[0].name);
		console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
		console.log("Album: " + data.tracks.items[0].album.name);
	});
}

function movieSearch(){
	if(search === ""){
		search = "Mr. Nobody";
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body){
		if (!error && response.statusCode === 200){
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country of Production: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
}

function readTextFile(){
	fs.readFile("./random.txt", "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		} else{
  			dataArr = data.split(",");
  		}
		search = dataArr[1];
		if(dataArr[0] === "spotify-this-song"){
			songSearch();
		} else if(dataArr[0] === "movie-this"){
			movieSearch();
		}
	})
}

if(process.argv[2] === "spotify-this-song"){
	npmSearch();
	songSearch();
} else if(process.argv[2] === "my-tweets"){
	postTweets();
} else if(process.argv[2] === "movie-this"){
	npmSearch();
	movieSearch();
} else if(process.argv[2] === "do-what-it-says"){
	readTextFile();
}