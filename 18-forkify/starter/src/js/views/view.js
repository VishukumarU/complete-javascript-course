import icons from 'url:../../img/icons.svg';

export default class View {

    _data;

    render (data, isRender = true) {
        if (!data || (Array.isArray(data) && !data.length)) {
            return this.renderError();
        }
        this._data = data;
        const markup = this._generateMarkup();
        if (!isRender) {
            return markup;
        }
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update (data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = currentElements[i];
            if (!newEl.isEqualNode(curEl)) {
                // Update the changed attributes
                Array.from(newEl.attributes).forEach((attr) => {
                    curEl.setAttribute(attr.name, attr.value);
                });
                if (newEl.firstChild?.nodeValue.trim()) {
                    // Update the TEXT
                    curEl.textContent = newEl.textContent;
                }
            }


            if (!newEl.isEqualNode(curEl)) {

            }

        });
    }

    renderSpinner () {
        const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError (message = this._errorMsg) {
        const markup = `
        <div class="error">
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

    renderMessage (message = this._message) {
        const markup = `
        <div class="message">
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

    _clear () {
        this._parentElement.innerHTML = '';
    }

}