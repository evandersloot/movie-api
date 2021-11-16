const express = require('express'),
      morgan = require('morgan'),
      uuid = require('uuid'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      models = require('./models.js'),
      { check, validationResult } = require('express-validator');

const Movies = models.Movie;
const Users = models.User;
const Genres = models.Genre;
const Directors = models.Director;

// mongoose.connect('mongodb://localhost:27017/FlixSpotter', {
//   useNewUrlParser: true, useUnifiedTopology: true
// });

mongoose.connect(process.env.CONNECTION_URI, {
  userNewUrlParser: true, useUnifiedTopology: true
});

const app = express();
//morgan
app.use(morgan('common'));

/**
 * returns documentation.html about the api endpoints
 */
app.use(express.static('public'));

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * defines origins to be used by CORs
 */
const cors = require('cors');
app.use(cors());

//authorization
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

//Get requests
app.get('/', (req, res) => {
  res.send('Welcome to the world of Movies!');
});

/**
 * GETs all movies
 * @method GET
 * @param {string} endpoint
 * @returns {object} all movies and all data
 * @requires JWT authentication
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GETs data of a single movie
 * @method GET
 * @param {string} (title) endpoint
 * @returns {object} data of the movie
 * @requires JWT authentication
 */
//Get single movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get list of all genres
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GETs information of a specific genre
 * @method GET
 * @param {string} (:name) endpoint
 * @returns {object} description of genre
 * @requires JWT authentication
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre.Name': req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get list of all directors with information
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GETs information of a specific director (name, bio, DOB, DOD)
 * @method Get
 * @param {string} (:name) endpoint
 * @returns {object} information about the director
 * @requires JWT authentication
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Director.Name': req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Allows new users to register
 * Expected JSON
 * {
 * username: String,
 * password: String,
 * email: String,
 * birthday: date
 * }
 * checks the username is correct length and only alphanumeric for security purposes
 * checks that a password is added and proper length
 * checks the email is valid format
 * @method POST
 * @param {object} object containing users account information
 * @returns {object} JSON-object added user
 * @requires nothing, is public
 */
app.post('/users',
  [
    check('username', 'Username is required').isLength({min: 5}),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('password', 'Password is required.').isLength({min: 8}),
    check('email', 'Email does not appear to be valid.').isEmail()
  ], (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.password);

  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists');
      } else {
        Users
          .create({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday,
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    })
});
//Get all user
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET user by username
 * @method GET 
 * @param {string} (:username) endpoint
 * @returns {object} containing user's profile
 * @requires JWT authentication
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {


  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Allows new users to edit their account details
 * Expected JSON
 * {
 * username: String,
 * password: String,
 * email: String,
 * birthday: date
 * }
 * checks the username is correct length and only alphanumeric for security purposes
 * checks that a password is added and proper length
 * checks the email is valid format
 * @method PUT
 * @param {object} object containing users account information
 * @returns {object} JSON-object added user
 * @requires JWT authentication
 */
app.put('/users/:username',
[
  check('username', 'Username is required').isLength({min: 5}),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required.').not().isEmpty(),
  check('email', 'Email does not appear to be valid.').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  Users.findOneAndUpdate({ username: req.params.username }, { $set:
    {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * Allows user to add a favorite movie to their collection
 * @method POST
 * @param {string} (:username, :movieID) endpoint
 * @returns {statusMessage} success/fail
 * @requires JWT authentication
 */
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { FavoriteMovies: req.params.movieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * Allows user to delete a favorite movie from their collection
 * @method DELETE
 * @param {string} (:username, :movieID) endpoint
 * @returns {statusMessage} success/fail
 * @requires JWT authentication
 */
app.delete('/users/:username/movies/remove/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { FavoriteMovies: req.params.movieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * Allows a user to delete their account
 * @method DELETE
 * @param {string} (:username) endpoint
 * @returns (statusMessage) success/fail
 * @requires JWT authentication
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not right!')
});

//request listener
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
