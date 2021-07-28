const express = require('express'),
      morgan = require('morgan'),
      uuid = require('uuid'),
      bodyParser = require('body-parser');

const app = express();

//list of movies
let bestMovies = [
  {
    title: 'Captain America',
    director: 'Joe Johnston',
    starring: 'Chris Evans, Tommy Lee Jones, Hayley Atwell, Stanley Tucci',
    released: 'July 22, 2011',
    genres: 'Action, Science Fiction'
  },
  {
    title: 'Tin Cup',
    director: 'Ron Shelton',
    starring: 'Kevin Costner, Renee Russo, Cheech Marin, Don Johnson',
    released: 'August 16, 1996',
    genres: 'Sports, Comedy, Drama'
  },
  {
    title: 'Invincible',
    director: 'Ericson Core',
    starring: 'Mark Wahlberg, Greg Kinnear, Elizabeth Banks',
    released: 'August 25, 2006',
    genres: 'Sports, Drama, Inspirational'
  },
  {
    title: 'End of Watch',
    director: 'David Ayer',
    starring: 'Jake Gyllenhaal, Michael Pena, Anna Kendrick',
    released: 'September 21, 2012',
    genres: 'Action, Thriller'
  },
  {
    title: 'Good Will Hunting',
    director: 'Gus Van Sant',
    starring: 'Matt Damon, Ben Affleck, Robin Williams, Minnie Driver',
    released: 'December 5, 1997',
    genres: 'Drama, Romance, Indie'
  },
  {
    title: 'Gross Pointe Blank',
    director: 'George Armitage',
    starring: 'John Cusak, Joan Cusak, Minnie Driver, Dan Aykroyd',
    released: 'September 21, 2012',
    genres: 'Comedy, Romance'
  },
  {
    title: 'Lethal Weapon',
    director: 'Richard Donner',
    starring: 'Mel Gibson, Danny Glover, Gary Busey',
    released: 'March 6, 1987',
    genres: 'Action'
  },
  {
    title: 'Lone Survivor',
    director: 'Peter Berg',
    starring: 'Mark Wahlberg, Taylor Kitsch, Eric Bana',
    released: 'January 10, 2014',
    genres: 'Action, War, Drama'
  },
  {
    title: 'Star Wars',
    director: 'George Lucas',
    starring: 'Mark Hamill, Harrison Ford, Carrie Fisher',
    released: 'May 25, 1977',
    genres: 'Science Fiction, Adventure'
  },
  {
    title: 'The Martian',
    director: 'Ridley Scott',
    starring: 'Matt Damon, Jeff Daniels, Jessica Chastain, Michael Pena',
    released: 'October 2, 2015',
    genres: 'Science Fiction, Drama'
  }
];

//morgan
app.use(morgan('common'));
//Express
app.use(express.static('public'));
//bodyParser
app.use(bodyParser.json());
//Get requests
app.get('/', (req, res) => {
  res.send('Welcome to the world of Movies!');
});
//Get list of movies
app.get('/movies', (req, res) => {
  res.json(bestMovies);
});
//Get single movie
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET of single movie by title.');
});
//Get list of movies by genre
app.get('/genres/:Name', (req, res) => {
  res.send('Successful GET of movie list by genre.');
});
//Get director name and info
app.get('/directors/:Name', (req, res) => {
  res.send('Successful GET of specific director name and information.');
});
//allow new user to register
app.post('/users', (req, res) => {
  res.send('You have signed up for our service!')
});
//allow current user to udate information
app.put('/users/:userName', (req, res) => {
  res.send('Succefully updated your account information.');
});
//allow user to add a movie to favorites listen
app.put('/users/:userName/movies/:movie', (req, res) => {
  res.send('Movie is now in your favorites list.');
});
//allow user to delete a movie from favorites listen
app.delete('/users/:userName/movies/remove/:movie', (req, res) => {
  res.send('Movie has been removed from your favorites.');
});
//allow user to delete account
app.delete('/users/:userName', (req, res) => {
  res.send('You have successfully unregistered.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not right!')
});

//request listener
app.listen(8080, () => {
  console.log('App is listening on port 8080');
});
