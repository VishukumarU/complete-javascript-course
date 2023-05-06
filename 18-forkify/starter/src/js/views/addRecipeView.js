import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _message = `Recipe successfully uploaded`;

    constructor () {
        super();
        this._addShowWindowHandler();
        this._addHideWindowHandler();
    }


    _generateMarkup () {

    }

    toggleWindow () {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addShowWindowHandler () {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHideWindowHandler () {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addUploadHandler (handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log(this);
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }
}

export default new AddRecipeView();