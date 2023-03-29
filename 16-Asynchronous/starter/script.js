'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const baseUrl = `https://restcountries.com/v3.1`;

///////////////////////////////////////

/*
    248: Our first AJAX call: XMLHTTPRequest()
*/

// const getCountryData = (country) => {
//     const request = new XMLHttpRequest();
//     request.open('GET', `${baseUrl}/name/${country}?fullText=true`);
//     request.send();
//     request.addEventListener('load', function () {
//         let [data] = JSON.parse(this.responseText);
//         const html = `
//             <article class="country">
//                 <img class="country__img" src="${data.flags.svg}" />
//                 <div class="country__data">
//                     <h3 class="country__name">${data.name.common}</h3>
//                     <h4 class="country__region">${data.region}</h4>
//                     <p class="country__row"><span>👫</span>${(+data.population / 100000).toFixed(1)} million</p>
//                     <p class="country__row"><span>🗣️</span>${Object.values(data.languages)}</p>
//                     <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name}</p>
//                 </div>
//             </article>`;

//         countriesContainer.insertAdjacentHTML('beforeend', html);
//         countriesContainer.style.opacity = 1;
//     });
// };

// getCountryData('india');
// getCountryData('portugal');

/*
    250: Welcome to callback Hell 🤫
*/

const renderCountry = (data, className = '') => {
    const html = `
            <article class="country ${className}">
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
}

// const getCountryAndNeighbour = (country) => {
//     const request = new XMLHttpRequest();
//     request.open('GET', `${baseUrl}/name/${country}?fullText=true`);
//     request.send();
//     request.addEventListener('load', function () {
//         let [data] = JSON.parse(this.responseText);
//         renderCountry(data);

//         const [neighbour] = data.borders;
//         const request2 = new XMLHttpRequest();
//         request2.open('GET', `${baseUrl}/alpha?codes=${neighbour}`);
//         request2.send();
//         request2.addEventListener('load', function () {
//             let [data] = JSON.parse(this.responseText);
//             renderCountry(data, 'neighbour');
//         });
//     });
// };

// getCountryAndNeighbour('india');

// setTimeout(() => {
//     console.log(`1 second`);
//     setTimeout(() => {
//         console.log(`2 second`);
//         setTimeout(() => {
//             console.log(`3 second`);
//             setTimeout(() => {
//                 console.log(`4 second`);
//             }, 1000)
//         }, 1000)
//     }, 1000);
// }, 1000);

/* 
    251: Promises and the fetch API
*/

const request = fetch(`${baseUrl}/name/india?fullText=true`);
console.log(request);

/* 
    252: Consuming promises
*/

const renderError = (msg) =>
    countriesContainer.insertAdjacentText('afterend', msg);

const getCountryData = (country) => {
    fetch(`${baseUrl}/name/${country}?fullText=true`)
        .then((response) => response.json())
        .then((data) => {
            renderCountry(data[0]);
            const [neighbour] = data[0]?.borders;

            if (!neighbour) return;
            return fetch(`${baseUrl}/alpha?codes=${neighbour}`)
        })
        .then((response) => response.json())
        .then((data) => renderCountry(data[0], 'neighbour'))
        /* 
            254: Handling rejected promises
        */
        .catch(error => {
            console.error(`${error} 🚫`);
            renderError(`Something went wrong 🚫🔴 ${error.message}. Try again!!`);
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        })
}

btn.addEventListener('click', () => {
    getCountryData('sdhjfj');

});

// getCountryData('germany');