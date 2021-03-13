//Schema för movies
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    title: String,
    genre: String,
    releaseYear: String,
    viewDate: String,
    raiting: String
});

module.exports = mongoose.model("Movies", movieSchema);