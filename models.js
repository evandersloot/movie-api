const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

// let genreSchema = mongoose.Schema({
//   Name: {type: String, required: true},
//   Description: {type: String, required: true}
// });

// let directorSchema = mongoose.Schema({
//   Name: {type: String, required: true},
//   Bio: {type: String, required: true},
//   Birth: {type: Date},
//   Death: {type: Date}
// })

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//let Genre = mongoose.model('Genre', genreSchema);
//let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
//module.exports.Genre = Genre;
//module.exports.Director = Director;
