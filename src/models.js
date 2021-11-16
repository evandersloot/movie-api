const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

/**
 * Defines the schema of the movies collection created in the database
 * Genre and director are documents that hold additional information about each
 * Addition of a new movie requires Title and Description to be strings.
 */
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

/**
 * Defines the schema of the users collection in the database
 * name, username, password, and email are required for a new user to register
 * * must be strings
 * FavoriteMovies is an array of IDs refferring to the specific document in the movies collection
 */
let userSchema = mongoose.Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
