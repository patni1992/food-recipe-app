const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const helpers = require('handlebars-helpers');
const queries = require('./queries');

const app = express();
const port = 3000;

app.engine('handlebars', exphbs({ helpers: [helpers.comparison()] }));
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const search = req.query.search || '';
  const recipes = await queries.getAllRecipes(search);

  res.render('home', { recipes, search });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});