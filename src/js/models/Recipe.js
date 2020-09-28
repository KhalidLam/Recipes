import axios from "axios";
import { api } from "../apiConfig";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const url = `${api.proxy}https://api.edamam.com/search?r=${api.r}${this.id}&app_id=${api.id}&app_key=${api.key}`;

    try {
      const res = await axios(url);
      const recipe = res.data[0];

      this.title = recipe.label;
      this.author = recipe.source;
      this.image = recipe.image;
      this.ingredients = recipe.ingredients;
      this.url = recipe.url;
      this.servings = recipe.yield;
    } catch (error) {
      console.error(error);
    }
  }

  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespons",
      "tablespon",
      "ounces",
      "ounce",
      "teaspons",
      "teaspon",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitShort, "kg", "g"];

    const newIngredients = this.ingredients.map((el) => {
      // 1 - Uniform units
      let ingredient = el.text.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      // 2 - Remove parentheses, dot & comma
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      ingredient = ingredient.replace(/[.,]/g, "");

      // 3 - Parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el) => units.includes(el));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") => 4.5
        // EX. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0])) {
        // There is NO unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0]),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is NO unit & NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServing = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServing / this.servings;
    });

    this.servings = newServing;
  }
}
