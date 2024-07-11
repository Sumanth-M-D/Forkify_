import icons from 'url:../../img/icons.svg';

export default class view {
   _data;

   renderSpinner() {
      const markup = `<div class="spinner">
                        <svg>
                          <use href="${icons}#icon-loader"></use>
                        </svg>
                      </div>`;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    } 

    renderError(message = this._errorMessage){
      const markup = `<div class="error">
                        <div>
                           <svg>
                              <use href="${icons}#icon-alert-triangle"></use>
                           </svg>
                        </div>
                        <p>${message}</p>
                     </div>`;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }


    renderMessage(message = this._message){
      const markup = `<div class="error">
                        <div>
                           <svg>
                              <use href="${icons}#icon-smile"></use>
                           </svg>
                        </div>
                        <p>${message}</p>
                     </div>`;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

   /**
    * Render the received objects to DOM
    * @param {Object | Object[]} data the data to be rendered(eg: recipe) 
    * @param {boolean} [render=true] if false, create markUp string Instead of rendering it to the DOM 
    * @returns [undefined | string] A markup is returned if render = false
    * @this {Object} view instance
    * @author sumanth
    * @todo finish the implementation
    */
   render(data, render = true) {
      if(!data || (Array.isArray(data)) && data.length === 0) return this.renderError();

      this._data = data;
      const markup = this._generateMarkup();

      if(!render) return markup;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
   }



   // Updating only the changed elements
   update(data) {
      this._data = data;
      const newMarkup = this._generateMarkup();

         //Creating DOM elements from the markup
         const newDOM = document.createRange().createContextualFragment(newMarkup);
         const newElements = Array.from(newDOM.querySelectorAll('*'));

         //dom elements of existing markup
         const curElements = Array.from(this._parentElement.querySelectorAll('*'));
         
         newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            //updating changed text
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
               curEl.textContent = newEl.textContent;
            }

            //updating changed attributes
            if(!newEl.isEqualNode(curEl)) {
               Array.from(newEl.attributes).forEach(attr =>
                  curEl.setAttribute(attr.name, attr.value)
               )
            }
         })
   }

   _clear() {
      this._parentElement.innerHTML = '';
   }
}






