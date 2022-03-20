const db = require('./db');

async function getAllRecipes(search = '') {
  const query = await db.query({
    text: 'select * from recipe where lower(name) like lower($1) ORDER BY created_at DESC;',
    values: [`%${search}%`],
  });

  return query.rows;
}

async function getOneRecipe(id) {
  const query = await db.query({
    text: `select recipe.*,
      recipe_ingredient.amount,
      measure.name AS measure_name, 
      measure.id AS measure_id,
      ingredient.name AS ingredient
      from recipe 
                LEFT JOIN recipe_ingredient on recipe.id = recipe_ingredient.recipe_id 
                LEFT JOIN ingredient on ingredient.id = recipe_ingredient.ingredient_id 
                LEFT JOIN measure on measure.id = measure_id
                where recipe.id = $1;`,
    values: [id],
  });

  return mapRowsToNestedData(query.rows);
}

async function insertIngredients(ingredients) {
  const lowerCaseIngredients = ingredients.map((i) => i.toLowerCase());
  const query = await db.query(
    'INSERT INTO ingredient (name) SELECT * FROM UNNEST ($1::text[]) ON CONFLICT DO NOTHING;',
    [lowerCaseIngredients]
  );

  return query;
}

async function getIngredients(names) {
  const query = await db.query('SELECT * FROM ingredient WHERE name = ANY($1::text[])', [names]);

  return query.rows;
}

async function insertRecipeIngredients(recipeIds, ingredientsIds, measuresIds, amounts) {
  measuresIds = measuresIds.map((m) => m || null);
  const query = await db.query(
    'INSERT INTO recipe_ingredient (recipe_id, ingredient_id, measure_id, amount) SELECT * FROM UNNEST ($1::int[], $2::int[], $3::int[], $4::int[])',
    [recipeIds, ingredientsIds, measuresIds, amounts]
  );

  return query;
}

async function getAllMeasures() {
  const query = await db.query('select * from measure');

  return query.rows;
}

async function insertRecipe(name, description, instructions, image) {
  const query = await db.query(
    'INSERT INTO recipe (name, description, instructions, image) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, description, instructions, image]
  );

  return query.rows[0];
}

function mapRowsToNestedData(rows) {
  const { id, name, description, image, instructions } = rows[0];
  const recipe = { id, name, description, image, instructions };

  rows.forEach((row) => {
    if (!recipe.ingredients) {
      recipe.ingredients = [];
    }

    recipe.ingredients.push({
      measure: {
        id: row.measure_id,
        name: row.measure_name,
      },
      amount: row.amount,
      ingredient: row.ingredient,
    });
  });

  return recipe;
}

module.exports = {
  getAllRecipes,
  getAllMeasures,
  getOneRecipe, 
  insertRecipe,
  insertIngredients,
  getIngredients,
  insertRecipeIngredients
};