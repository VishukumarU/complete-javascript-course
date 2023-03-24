'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

/* 
    248: Our first AJAX call: XMLHTTPRequest()
*/

const baseUrl = `https://restcountries.com/v3.1`;
const getCountryData = (country) => {
    const request = new XMLHttpRequest();
    request.open('GET', `${baseUrl}/name/${country}?fullText=true`);
    request.send();
    request.addEventListener('load', function () {
        let [data] = JSON.parse(this.responseText);
        const html = `
            <article class="country">
                <img class="country__img" src="${data.flags.svg}" />
                <div class="country__data">
                    <h3 class="country__name">${data.name.common}</h3>
                    <h4 class="country__region">${data.region}</h4>
                    <p class="country__row"><span>👫</span>${(+data.population / 100000).toFixed(1)} million</p>
                    <p class="country__row"><span>🗣️</span>${Object.values(data.languages)}</p>
                    <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name}</p>
                </div>
            </article>`;

        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
    });
};

getCountryData('india');
getCountryData('portugal');
