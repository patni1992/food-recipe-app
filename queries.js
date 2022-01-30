const db = require('./db');

async function getAllRecipes(search = '') {
  const query = await db.query({
    text: 'select * from recipe where lower(name) like lower($1) ORDER BY created_at DESC;',
    values: [`%${search}%`],
  });

  return query.rows;
}

module.exports = {
  getAllRecipes,
};