const express = require('express'),
      morgan = require('morgan'),
      uuid = require('uuid'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      models = require('./models.js');

const Movies = models.Movie;
const Users = models.User;
const Genres = models.Genre;
const Directors = models.Director;

mongoose.connect('mongodb://localhost:27017/FlixSpotter', {
  useNewUrlParser: true, useUnifiedTopology: true
});

const app = express();
//morgan
app.use(morgan('common'));
//Express
app.use(express.static('public'));
//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Get requests
app.get('/', (req, res) => {
  res.send('Welcome to the world of Movies!');
});
//Get list of movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get single movie
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get data about film genres
app.get('/genres', (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get data about a genre by name
app.get('/genres/:Name', (req, res) => {
  Genres.findOne({ 'Name': req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get list of all directors with information
app.get('/directors', (req, res) => {
  Directors.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get director name and info
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//allow new user to register
app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists');
      } else {
        Users
          .create({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
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
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Get info on a specific user based on userName
app.get('/users/:username', (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//allow user to update information by username
app.put('/users/:username', (req, res) => {
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
//allow user to add a movie to favorites listen
app.post('/users/:username/movies/:movieID', (req, res) => {
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
//allow user to delete a movie from favorites listen
app.delete('/users/:username/movies/remove/:movieID', (req, res) => {
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
//allow user to delete account
app.delete('/users/:username', (req, res) => {
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
app.listen(8080, () => {
  console.log('App is listening on port 8080');
});
