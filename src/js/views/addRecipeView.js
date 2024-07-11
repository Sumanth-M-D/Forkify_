import view from "./view";
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends view{
   _parentElement =document.querySelector('.upload');
   _message = 'Recipe was successfully uploaded';

   _window = document.querySelector('.add-recipe-window');
   _overlay = document.querySelector('.overlay');
   _btnOpen = document.querySelector('.nav__btn--add-recipe');
   _btnClose = document.querySelector('.btn--close-modal');
   
   constructor() {
      super();
      this._addHandlerShowWIndow();
      this._addHandlerHideWIndow();
   }

   toggleWindow() {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
   }

   _addHandlerShowWIndow() {
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
   }

   _addHandlerHideWIndow() {
      this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
      this._overlay.addEventListener('click', this.toggleWindow.bind(this));

   }

   addHandlerUpload(handler) {
      this._parentElement.addEventListener('submit', function(event) {
         event.preventDefault();
         const formData = new FormData(this);
         const dataArray = [...formData];
         const data = Object.fromEntries(dataArray);
         handler(data);
      })
   }

   _generateMarkup () {
      
   }

   

   
}


export default new AddRecipeView();