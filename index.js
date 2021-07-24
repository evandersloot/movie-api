const express = require('express'),
      morgan = require('morgan');

const app = express();

//list of movies
let bestMovies = [
  {
    title: 'Captain America',
    director: 'Joe Johnston',
    starring: 'Chris Evans, Tommy Lee Jones, Hayley Atwell, Stanley Tucci',
    released: 'July 22, 2011'
  },
  {
    title: 'Tin Cup',
    director: 'Ron Shelton',
    starring: 'Kevin Costner, Renee Russo, Cheech Marin, Don Johnson',
    released: 'August 16, 1996'
  },
  {
    title: 'Invincible',
    director: 'Ericson Core',
    starring: 'Mark Wahlberg, Greg Kinnear, Elizabeth banks',
    released: 'August 25, 2006'
  },
  {
    title: 'End of Watch',
    director: 'David Ayer',
    starring: 'Jake Gyllenhaal, Michael Pena, Anna Kendrick',
    released: 'September 21, 2012'
  },
  {
    title: 'Good Will Hunting',
    director: 'Gus Van Sant',
    starring: 'Matt Damon, Ben Affleck, Robin Williams, Minnie Driver',
    released: 'December 5, 1997'
  },
  {
    title: 'Gross Pointe Blank',
    director: 'George Armitage',
    starring: 'John Cusak, Joan Cusak, Minnie Driver, Dan Aykroyd',
    released: 'September 21, 2012'
  },
  {
    title: 'Lethal Weapon',
    director: 'Richard Donner',
    starring: 'Mel Gibson, Danny Glover, Gary Busey',
    released: 'March 6, 1987'
  },
  {
    title: 'Lone Survivor',
    director: 'Peter Berg',
    starring: 'Mark Wahlberg, Taylor Kitsch, Eric Bana',
    released: 'January 10, 2014'
  },
  {
    title: 'Star Wars',
    director: 'George Lucas',
    starring: 'Mark Hamill, Harrison Ford, Carrie Fisher',
    released: 'May 25, 1977'
  },
  {
    title: 'The Martian',
    director: 'Ridley Scott',
    starring: 'Matt Damon, Jeff Daniels, Jessica Chastain, Michael Pena',
    released: 'October 2, 2015'
  }
];

//morgan
app.use(morgan('common'));

//Get requests
app.get('/', (req, res) => {
  res.send('Welcome to the world of Movies!');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(bestMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not right!')
})

//request listener
app.listen(8080, () => {
  console.log('App is listening on port 8080');
});
