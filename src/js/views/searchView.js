import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highLightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });

  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active");
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, curr) => {
      if (acc + curr.length <= limit) {
        newTitle.push(curr);
      }
      return acc + curr.length;
    }, 0);

    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

// https://www.eda.com/#recipe_09b4dbdf0c7244c462a4d2622d88958e =>  09b4dbdf0c7244c462a4d2622d88958e
const getIdFromUrl = (url) => url.slice(url.indexOf("#recipe_") + 8);

const renderRecipe = (recipe) => {
  const markup = `
        <li>
            <a class="results__link" href="#${getIdFromUrl(recipe.uri)}">
                <figure class="results__fig">
                    <img src="${recipe.image}" alt="${recipe.label}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(
                      recipe.label
                    )}</h4>
                    <p class="results__author">${recipe.source}</p>
                </div>
            </a>
        </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto="${
  type === "prev" ? page - 1 : page + 1
}">
            <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${
                  type === "prev" ? "left" : "right"
                }"></use>
            </svg>
        </button>
`;

export const renderPageButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if (page === 1 && pages > 1) {
    // Show only Button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Show Both Buttons prev & next
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    // Show only Button to go to prev page
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderPageButtons(page, recipes.length, resPerPage);
};
