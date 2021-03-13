//Deklarerar paket till variabler
var express = require("express");
var mongoose = require("mongoose");

//Anslut till databasen
var mongoDB = "mongodb+srv://hillevi54321:to7NPYkovJkO3kMw@movies.31v95.mongodb.net/MoviesDB?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Instansierar Express
var app = express();

//För att kunna hantera requests (istället för body-parser)
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   

//För att kunna använda schemat
var Movies = require("./app/movies.js");

//Middleware, gör webbplatsen tillgänglig utifrån
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
	next();
});

//Anger port och startar server
var port = 3000;
app.listen(port, function() {
	console.log("Porten är startad");
});

//GET -- Hämtar in alla filmer
app.get("/movies", function(req, res) {
    
    Movies.find(function (errorMessage, Movies) {
        if (errorMessage) {
            res.json(errorMessage);
        } else {
            res.send(Movies);
        }
    });
});

//GET -- Hämtar in specifik film
app.get("/movies/:id", function(req, res) {

    //Hämtar in id på medskickad film
    var specificMovie = req.params.id;

    //Söker efter kurs med id
    Movies.findById({_id: specificMovie}, function(errorMessage, movie){

        if (errorMessage) {
            res.json(errorMessage);
        } else {
            res.send(movie);
        }
    });
});

//POST -- Lägger till ny film
app.post("/movies/add", function(req, res) {

    //Instaniserar Movies 
    var movie = new Movies();

    //Skapar objekt av Movies
    movie.title = req.body.title;
    movie.genre = req.body.genre;
    movie.releaseYear = req.body.releaseYear;
    movie.viewDate = req.body.viewDate;
    movie.raiting = req.body.raiting;

    //Sparar och skickar respons
    movie.save(function (errorMessage) {
        if(errorMessage) {
            res.send(errorMessage);    
        }
        else {
            res.send( { "message" : "Filmen är tillagd"});
        }
    });
});

//DELETE -- Tar bort film
app.delete("/movies/delete/:id", function(req, res) {

    var deleteId = req.params.id;

    Movies.deleteOne({_id: deleteId}, function (errorMessage, Movies) {
        if (errorMessage) {
            res.send(errorMessage);
        } else {
            res.send( { "message" : "Filmen är borttagen"});
        }
    });
});

//PUT -- Uppdaterar film
app.put("/movies/update/:id", function(req, res) {

    moiveID = req.params.id;

    Movies.findOne({_id: moiveID}, function(errorMessage, foundMovie) {
        if(errorMessage) {
            res.status(500).send();
            res.send( { "message" : "Fungerar inte"});
        } else {
            if(!foundMovie) {
                res.status(404).send();
                res.send( { "message" : "Film ej hittad"});
            } else {
                //Kontrollerar vad som skickats med
                if (req.body.title) {
                    foundMovie.title = req.body.title;
                }
                if (req.body.genre) {
                    foundMovie.genre = req.body.genre;
                }
                if (req.body.releaseYear) {
                    foundMovie.releaseYear = req.body.releaseYear;
                }
                if (req.body.viewDate) {
                    foundMovie.viewDate = req.body.viewDate;
                }
                if (req.body.raiting) {
                    foundMovie.raiting = req.body.raiting;
                }

                //Sparar och skickar respons
                foundMovie.save(function (errorMessage) {

                    if(errorMessage) {
                        res.send(errorMessage);
                    }
                    else {
                        res.send( { "message" : "Filmen är uppdaterad"});
                    }
                    
                });
            }
            
        }
    });
});

