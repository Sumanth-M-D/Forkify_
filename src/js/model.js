import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";


export const state = { 
   recipe: {},
   search: {
      query: '',
      results: [],
      resultsPerPage: RES_PER_PAGE,
      page:1,
   },
   bookmarks: [],

};



function createRecipeObject(data) {
       let {recipe} = data.data;
       
       return { 
         id: recipe.id,
         title: recipe.title,
         publisher: recipe.publisher,
         image: recipe.image_url,
         sourceUrl: recipe.source_url,
         servings: recipe.servings,
         cookingTime: recipe.cooking_time,
         ingredients: recipe.ingredients,
         ...(recipe.key && {key:recipe.key})
       };
}




export async function loadRecipe(id) {
   try {   
      const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
      state.recipe = createRecipeObject(data);

      if(state.bookmarks.some(bookmark => bookmark.id === id))
         state.recipe.bookmarked = true;
      else 
         state.recipe.bookmarked = false;

   } catch(err) {
      throw err;
   }
}


export async function loadSearchResults(query) {
   try {
      let data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

      state.search.query = query;
      state.search.results =  data.data.recipes.map(recipe => {
         return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            ...(recipe.key && {key:recipe.key})
         }
      })
      state.search.page =1;

   } catch(err) {
      throw err;
   }
}


export function getSearchResultsPage(page = state.search.page) {
   state.search.page = page;
   const start = (page-1) * state.search.resultsPerPage;
   const end = (page * state.search.resultsPerPage) ;

   return state.search.results.slice(start, end);
}



export function updateServings(newServings) {

   for(let ing of state.recipe.ingredients) {
      if(ing.quantity === null) continue;

      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
   }

   // state.recipe.ingredients.forEach(ing => {
   //    // if(ing.quantity === null) continue;

   //    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
   //    console.log('updateServings yes');
   // });
   
   state.recipe.servings = newServings;
}






function persistBookmark() {
   localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}




export function addBookmark(recipe) {
   //add bookmark
   state.bookmarks.push(recipe);

   //mark current recipe as bookmarked
   if(recipe.id === state.recipe.id) 
      state.recipe.bookmarked = true;

   persistBookmark();
}



export function deleteBookmark(id) {
   //delete bookmark
   const recipeIndex = state.bookmarks.findIndex(bookmark => bookmark.id === id);
   state.bookmarks.splice(recipeIndex, 1);

   //mark current recipe as NOT bookmarked
   if(id === state.recipe.id) 
      state.recipe.bookmarked = false;

   persistBookmark();
}



function init() {
   const storage = localStorage.getItem('bookmarks');
   if(storage) state.bookmarks = JSON.parse(storage);
}
init();



function clearBookmarks() {
   localStorage.clear('bookmark')
}
// clearBookmarks();




export async function uploadRecipe(newRecipe) {
   try{
      console.log( Object.entries(newRecipe));
      const ingredients = Object.entries(newRecipe)
         .filter(([key, val]) => key.startsWith('ingredient') && val !== '')
         .map(ing => {
            const ingArray =  ing[1].split(',').map(el => el.trim());
            const [quantity, unit, description] = ingArray;
            if(ingArray.length !== 3) throw new Error('Wrong ingredient format. Please use the correct format');

            return {quantity : quantity? +quantity : null, 
                     unit, 
                     description}
         })

      const recipe = {
         title: newRecipe.title,
         source_url :newRecipe.sourceUrl,
         image_url: newRecipe.image,
         publisher: newRecipe.publisher,
         cooking_time: +newRecipe.cookingTime,
         servings: +newRecipe.servings,
         ingredients,
      }
      console.log(recipe);

      const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
      console.log(data);
      state.recipe = createRecipeObject(data);
      addBookmark(state.recipe);

   } catch (err) {
      throw err;
   }
}





// {"title":"TEST","source_url":"TEST","publisher":"TEST","cooking_time":23,"servings":23,"ingredients":[{"quantity":0.5,"unit":"kg","description":"Rice"},{"quantity":1,"unit":"","description":"Avocado"},{"quantity":null,"unit":"","description":"salt"}]}