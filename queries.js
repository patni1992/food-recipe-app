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
  getOneRecipe
};