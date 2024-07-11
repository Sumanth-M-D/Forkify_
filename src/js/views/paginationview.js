import view from "./view";
import icons from 'url:../../img/icons.svg';

class PaginationView extends view{
   _parentElement =document.querySelector('.pagination');

   addHandlerClick(handler) {
      this._parentElement.addEventListener('click', (event)=>{

         const btn = event.target.closest('.btn--inline');
         if(!btn) return;

         const goToPage = +btn.dataset.goto;
         handler(goToPage);

         // if (btn.classList.contains('pagination__btn--prev')) {
         //    this._data.page -= 1;
         //    handler(this._data.page);
         // } 
         // if (btn.classList.contains('pagination__btn--next')) {
         //    this._data.page += 1; 
         //    handler(this._data.page);
         // }

      } )
   }

   _generateMarkup () {
      const curPage = this._data.page;

      const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

      //Page1 , & there are other pages
      if(curPage === 1 && numPages >1) {
         return this._generateMarkupBtnNext(curPage);
      }

      //Last page 
      if(curPage === numPages && numPages >1) {
         return this._generateMarkupBtnPrev(curPage);
      }

      //Between page
      if(curPage > 1 &&  curPage < numPages) {
         return this._generateMarkupBtnPrev(curPage) + this._generateMarkupBtnNext(curPage);
      }

      //Page1, & there are NO other pages
      return '';
   }

   _generateMarkupBtnPrev(curPage) {
      return `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                     <svg class="search__icon">
                     <use href="${icons}#icon-arrow-left"></use>
                     </svg>
                     <span>Page ${curPage - 1}</span>
                  </button>`;
   }

   _generateMarkupBtnNext(curPage) {
      return `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                     <span>page ${curPage + 1}</span>
                     <svg class="search__icon">
                     <use href="${icons}#icon-arrow-right"></use>
                     </svg>
                  </button>`;
   }
}


export default new PaginationView();