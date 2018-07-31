require("dotenv").config();
var key = require("./key");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(key.spotify);
var fs = require("fs");
//console.log(spotify);

var argumentArr = process.argv.slice(3);
var argument = argumentArr.join(" ");
//console.log(argumentArr);
var command = process.argv[2];
var result = "";

if(argument.length === 0 && command === "spotify-this-song"){
    argument = "track:the sign artist:ace of base"; 
}
else if(argument.length === 0 && command === "movie-this"){
    argument = "Mr. Nobody";
}
//console.log(argument.length);
function checkCommand(){
    if(command === "spotify-this-song"){
        spotifyThis();
    }
    else if(command === "movie-this"){
        movieThis();
    }
    else if(command === "do-what-it-says"){
        doThis();
    }
    else{
        result = "Please provide a valid command!";
        console.log(result);
        logResults();
    }
}
//console.log(argument);

function spotifyThis(){
    spotify.search({ type: 'track', query: argument, limit: 1 }, function(err, data) {
        if (err) {
            result = "'" + argument + "' Song Not Found";
            logResults();
            return console.log(result);
        }
       
        //console.log(data); 
        //console.log(JSON.stringify(data.tracks, null, 2));
        result = "---------------------------------------------------------------------" + 
        "\nArtist Name: " + data.tracks.items[0].artists[0].name + 
        "\nSong Name: " + data.tracks.items[0].name + 
        "\nSpotify URL: " + data.tracks.items[0].external_urls.spotify + 
        "\nAssociated Album: " + data.tracks.items[0].album.name + 
        "\n---------------------------------------------------------------------";

        console.log(result);
        logResults();
    });
}
//data.tracks.items[0].album.artists[0].name

//spotifyThis();
function movieThis(){
    var queryUrl = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=" + key.omdb.key;
    //console.log(key.omdb.key);

    request(queryUrl, function(error, response, body){

        if(!error && response.statusCode === 200){
            
            var json = JSON.parse(body);
            //console.log(json);
            if(json.Response !== "False"){
                var rottenRating = (json.Ratings.length > 1) ? json.Ratings[1].Value : "";
                var rotten = (json.Ratings.length > 1) ? json.Ratings[1].Source : "No Rotten Tomatoes";
                
                
                result = "---------------------------------------------------------------------"+
                "\nTitle: " + json.Title +
                "\nYear Released: " + json.Year +
                "\nIMBD Rating: " + json.imdbRating +
                "\n" + rotten + " rating: " + rottenRating +
                "\nCountry Produced: " + json.Country +
                "\nMain Language: " + json.Language +
                "\nPlot: \n" + json.Plot + "\n" +
                "\nActors: " + json.Actors +
                "\n---------------------------------------------------------------------";
            
                console.log(result);
                
                
            }
            else{
                result = "'" + argument + "' Movie Not Found";
                console.log(result);
            }
            logResults();
        }

    })
}

function doThis(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");
        //console.log(dataArr[0]);
        logResults();
        command = dataArr[0];
        argument = dataArr[1]
        checkCommand();
        
    });
}

function logResults(){
    var text = "************************************************************************" + 
    "\nCommand: " + command + "\n" + "Argument: " + argument + "\n" + "Result: \n" + result + 
    "\n************************************************************************\n";
    fs.appendFile("log.txt", text, function(err) {

        if (err) {
          console.log(err);
        }
      
        else {
          console.log("Logged");
        }
      
    });
}

checkCommand();