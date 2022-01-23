CREATE DATABASE cookbook;

create table recipe (id SERIAL PRIMARY KEY, 
	name VARCHAR(25), 
	description VARCHAR(250),
    image VARCHAR(250), 
	instructions text,
	created_at timestamp NOT NULL DEFAULT NOW());

create table ingredient (id SERIAL PRIMARY KEY, 
	name VARCHAR(100) UNIQUE); 

create table measure (id SERIAL PRIMARY KEY, 
	name VARCHAR(100) UNIQUE); 

create table recipe_ingredient (recipe_id INT NOT NULL, 
	ingredient_id INT NOT NULL, 
	measure_id INT, 
	amount INT, 
	CONSTRAINT fk_recipe FOREIGN KEY(recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE, 
	CONSTRAINT fk_ingredient FOREIGN KEY(ingredient_id) REFERENCES Ingredient(id),
	CONSTRAINT fk_measure FOREIGN KEY(measure_id) REFERENCES Measure(id));



INSERT INTO measure (name) VALUES('cup'), ('teaspoon'), ('tablespoon'), ('grams');

INSERT INTO ingredient (name) VALUES('egg'), ('canola oil'), ('salt'), ('sugar'), ('chocolate'), ('vanilla extract'), ('flour');

INSERT INTO recipe (name, description, instructions, image) VALUES('Carrot cake', 'Delicious and suitable for all occasions.', 
'Set the oven to 175 degrees.

Whisk eggs and powdered sugar. Add the oil and whisk together.

Mix wheat flour, bicarbonate, baking powder, ground cinnamon, ground ginger and salt in a separate bowl.

Mix the dry ingredients into the egg batter. Finish by turning down the grated carrots and grated coconut.

Pour the batter into the mold and bake the cake for about 45-50 minutes until a toothpick comes out clean. Allow the cake to cool completely before spreading the frosting.

Whisk butter until the frosting is really creamy, add cream cheese and whisk together well, about 3-5 min. Sift over the icing sugar and whisk together until a creamy frosting.

Spread the frosting over the carrot cake.
', 
'carrot-cake.jpg');

INSERT INTO recipe (name, description, instructions, image) VALUES('Cheese pizza', 'Yummy pizza with extra cheese', 'Add eggs, flour, to a pan. Bake at 200 for 1 hour', 'pizza.jpg');

INSERT INTO recipe (name, description, instructions, image) VALUES('Thai green curry', 'Hot and spicy', 'Stir chicken and vegetables in a pan.', 'green-curry.jpg');

INSERT INTO recipe_ingredient (recipe_id, ingredient_id, measure_id, amount) VALUES (1, 1, NULL, 3);
INSERT INTO recipe_ingredient (recipe_id, ingredient_id, measure_id, amount) VALUES (1, 2, 1, 1);
INSERT INTO recipe_ingredient (recipe_id, ingredient_id, measure_id, amount) VALUES (1, 4, 4, 200);

INSERT INTO recipe_ingredient (recipe_id, ingredient_id, measure_id, amount)  VALUES (2, 1, NULL, 3);
INSERT INTO recipe_ingredient (recipe_id, ingredient_id, measure_id, amount)  VALUES (2, 3, 1, 2);