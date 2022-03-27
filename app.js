const express = require('express');
const multer = require('multer');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const helpers = require('handlebars-helpers');
const queries = require('./queries');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.engine('handlebars', exphbs({ helpers: [helpers.comparison()] }));
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const search = req.query.search || '';
  const recipes = await queries.getAllRecipes(search);

  res.render('home', { recipes, search });
});

app.post('/recipes', upload.single('image'), async (req, res) => {
  const { ingredients, measures, amounts, name, description, instructions } = req.body;
  await queries.insertIngredients(ingredients);
  const allIngredients = await queries.getIngredients(ingredients);

  const recipe = await queries.insertRecipe(
    name,
    description,
    instructions,
    req.file.filename
  );

  await queries.insertRecipeIngredients(
    new Array(ingredients.length).fill(recipe.id),
    allIngredients.map((ingredient) => ingredient.id),
    measures,
    amounts
  );

  res.redirect('/');
});

app.put('/recipes/:id', upload.single('image'), async (req, res) => {
  const { ingredients, measures, amounts, name, description, instructions } = req.body;
  const filename = req.file ? req.file.filename : null;

  await queries.insertIngredients(ingredients);
  const allIngredients = await queries.getIngredients(ingredients);
  const ingredientsIds = allIngredients.map((ingredient) => ingredient.id);

  await queries.removeRecipeIngredients(req.params.id);
  await queries.insertRecipeIngredients(
    new Array(ingredients.length).fill(req.params.id),
    ingredientsIds,
    measures,
    amounts
  );

  await queries.updateRecipe(req.params.id, [name, description, instructions, filename]);

  res.redirect('/');
});

app.get('/recipes/:id', async (req, res) => {
  const recipe = await queries.getOneRecipe(req.params.id);
  res.render('recipe', { recipe });
});

app.delete('/recipes/:id', async (req, res) => {
  queries.removeRecipe(req.params.id);
  res.redirect('/');
});

app.get('/recipes/:id/edit', async (req, res) => {
  const recipe = await queries.getOneRecipe(req.params.id);
  const measurements = await queries.getAllMeasures();

  res.render('editRecipe', { recipe, measurements });
});

app.get('/add-recipe', async (req, res) => {
  const measurements = await queries.getAllMeasures();
  res.render('addRecipe', { measurements });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});