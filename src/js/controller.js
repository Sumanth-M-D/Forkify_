import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationview from './views/paginationview.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if(module.hot) {
  module.hot.accept();
}

/*----------------
  Functions 
---------------- */

async function controlRecipe () {
  try{
    //Getting the id of the selected recipe from the path parameter of the url
    const id = window.location.hash.slice(1);
    if(!id) return;

    recipeView.renderSpinner();


    //0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    
    //3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //1) Loading recipe
    await model.loadRecipe(id);    
    
    //2) rendering the recipe
    recipeView.render(model.state.recipe);   
    
    
  } catch(err) {
    console.error(err.message);   
    recipeView.renderError();
  } 
}



async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    //1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    //2) Load search results
    await model.loadSearchResults(query); 

    //3) Render search results
    resultsView.render(model.getSearchResultsPage());

    //4)Render initial pagination
    paginationview.render(model.state.search); 

  } catch (err) {
    console.log(err);
  }
}


function controlPagination(page) {
  //Render new search results
  resultsView.render(model.getSearchResultsPage(page));

  //Render new pagination
  paginationview.render(model.state.search); 
}





function controllServings(newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}







function controllAddBookmark() {
  //1) add or remove book mark
  if(!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2) Update recipeview
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}






function controllBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}




async function controllAddRecipe(newRecipe) {
  try {
    //Show spinner
     addRecipeView.renderSpinner();
  
    //Uploading the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render Recipe
    recipeView.render(model.state.recipe);
    
    //success message 
    addRecipeView.renderMessage();

    //render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change the id in the url(history api)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC *1000);

  } catch (err) {
    console.error('💥💥 ' + err);
    addRecipeView.renderError(err.message)
  }
}





function init() {
  bookmarksView.addHandlerRender(controllBookmarks)
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controllServings);
  recipeView.addHandlerAddBookmark(controllAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationview.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controllAddRecipe);
}
init();




