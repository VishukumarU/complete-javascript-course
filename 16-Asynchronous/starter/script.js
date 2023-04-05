'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const baseUrl = `https://restcountries.com/v3.1`;
const imageContainer = document.querySelector('.images');

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
    countriesContainer.style.opacity = 1;
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

// const request = fetch(`${baseUrl}/name/india?fullText=true`);
// console.log(request);

// /* 
//     252: Consuming promises
// */

const renderError = (msg) =>
    countriesContainer.insertAdjacentText('afterend', msg);

// const getJSON = (url, errorMessage = 'Something went wrong!') => {
//     return fetch(url)
//         .then((response) => {

//             /* 
//                 255:Throwing errors manually
//             */
//             if (!response.ok) {
//                 throw new Error(`${errorMessage} (${response.status})`);
//             }
//             return response.json();
//         });
// };

const getCountryData = (country) => {
    getJSON(`${baseUrl}/name/${country}?fullText=true`, 'Country not found')
        .then((data) => {
            renderCountry(data[0]);
            if (!data[0]?.borders) {
                throw new Error('No neighbour found');
            };
            const [neighbour] = data[0]?.borders;
            return getJSON(`${baseUrl}/alpha?codes=${neighbour}`, 'Neighbor not found');
        })
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

// btn.addEventListener('click', () => {
//     // getCountryData('sdhjfj');
//     getCountryData('germany');
//     // getCountryData('Australia');

// });

// getCountryData('germany');

/* 
    256: Coding Challenge #1
*/

/* 
    In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. 
    For that, you will use a second API to geocode coordinates.

    Here are your tasks:

    PART 1
    1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) 
        (these are GPS coordinates, examples are below).
    2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, 
        like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
        The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json.
        Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
    3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location.
        Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
    4. Chain a .catch method to the end of the promise chain and log errors to the console
    5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403.
        This is an error with the request. Remember, fetch() does NOT reject the promise in this case.
        So create an error to reject the promise yourself, with a meaningful error message.

    PART 2
    6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, 
        and plug it into the countries API that we have been using.
    7. Render the country and catch any errors, just like we have done in the last lecture 
        (you can even copy this code, no need to type the same code)

    TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
    TEST COORDINATES 2: 19.037, 72.873
    TEST COORDINATES 2: -33.933, 18.474

    GOOD LUCK 😀
*/

const getJSON = (url, errorMsg = 'Something went wrong!!') => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Exceeded the limit of up to 1 per second.');
                }

                throw new Error(`${errorMsg} (${response.status})`)
            }
            return response.json();
        })
};

const whereAmI = (lat, lng) => {
    console.log(lat, lng);
    getJSON(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        .then((response) => {
            if (response.error) {
                throw new Error('Coords are not valid');
            }
            console.log(`(${lat}, ${lng}) -- You are in ${response.city}, ${response.country}`);
            return response.country;
        })
        .then(country => getCountryData(country))
        .catch(err => {
            console.error(`${err.message} Try again!!`);
        })

};

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// whereAmI(-33.933, -1200.474);

/*
    258: The event loop in practice
*/

// console.log('Test start');

// // callback will be executed after the microtasks are complete
// setTimeout(() => {
//     console.log('0 sec timer');
// }, 0);
// // Microtask queue -- so will be executed first
// Promise.resolve('Resolved promise 1').then(res => console.log(res));
// Promise.resolve('Resolved promise 2').then(res => {
//     // For loop is to simulate time taken by the mircotask
//     for (let index = 0; index < 1000000000; index++) { }
//     console.log(res);
// });
// console.log('test end');

/* 
    259: Building a simple promise
*/

// const lotteryPromise = new Promise((resolve, reject) => {

//     console.log('Lottery draw is happening!!');
//     setTimeout(() => {
//         (Math.random() >= 0.5) ? resolve('You win 😎') : reject(new Error(`You lost your money!! 🚫`))
//     }, 2000);
// });

// lotteryPromise
//     .then((res) => console.log(res))
//     .catch(err => console.error(err))

// Promisifying setTimeout

const wait = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
};

// wait(1).then(() => {
//     console.log(`1 second passed`);
//     return wait(1);
// }).then(() => {
//     console.log(`2 second passed`);
//     return wait(1);
// }).then(() => {
//     console.log(`3 second passed`);
//     return wait(1);
// }).then(() => {
//     console.log(`4 second passed`);
// });


/* 
    260: Promisifying the Geolocation API
*/


// navigator.geolocation.getCurrentPosition(
//     (position) => {
//         console.log(position);
//     },
//     (err) => {
//         console.error(err)
//     }
// );

const getPosition = () => {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
};

const whereAmINew = () => {
    getPosition()
        .then((res) => {
            console.log(res);
            const {latitude: lat, longitude: lng} = res.coords;

            return getJSON(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        })
        .then((response) => {
            if (response.error) {
                throw new Error('Coords are not valid');
            }
            console.log(`You are in ${response.city}, ${response.country}`);
            return response.country;
        })
        .then(country => getCountryData(country))
        .catch(err => {
            console.error(`${err.message} Try again!!`);
        })
}

// btn.addEventListener('click', whereAmINew);


/*
    261: Coding Challenge #2

    Build the image loading functionality that I just showed you on the screen.

    Tasks are not super-descriptive this time, so that you can figure out some stuff on your own.
    Pretend you're working on your own 😉

    PART 1
    1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a 
        new image (use document.createElement('img')) and sets the .src attribute to the provided image path. 
        When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. 
        The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

    If this part is too tricky for you, just watch the first part of the solution.

    PART 2
    2. Comsume the promise using .then and also add an error handler;
    3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
    4. After the 2 seconds have passed, hide the current image (set display to 'none'), 
        and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image.
        You will need a global variable for that 😉);
    5. After the second image has loaded, pause execution for 2 seconds again;
    6. After the 2 seconds have passed, hide the current image.

    TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path.
    Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

    GOOD LUCK 😀
*/

let currentImg;

const createImage = (imgPath) => {
    return new Promise((resolve, reject) => {
        const image = document.createElement('img');
        image.src = imgPath;

        if (image) {


            image.addEventListener('load', () => {
                imageContainer.append(image);
                return resolve(image);
            });

            image.addEventListener('error', () => {
                return reject(new Error('Error!! Path not found'));
            })
        }
    });
};

const success = (img) => {
    currentImg = img;
    return wait(2);
};

const loadNextImage = (path) => {
    currentImg.style.display = 'none';
    return createImage(path);
}

// createImage('img/img-1.jpg')
//     .then((img) => success(img))
//     .then(() => loadNextImage('img/img-2.jpg'))
//     .then((img) => success(img))
//     .then(() => loadNextImage('img/img-3.jpg'))
//     .then((img) => success(img))
//     .then(() => loadNextImage('img/img-4.jpg'))
//     .catch(err => console.error(err));

/* 
    262: Consuming promises with async/await
*/

const whereAmIAsync = async () => {

    const position = await getPosition();
    const {latitude: lat, longitude: lng} = position.coords;
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    const dataGeo = await resGeo.json();

    console.log(dataGeo);

    const response = await fetch(`${baseUrl}/name/${dataGeo.country}?fullText=true`);
    const data = await response.json();
    renderCountry(data[0]);

};

console.log('First');
// whereAmIAsync('india');
console.log('second');

btn.addEventListener('click', whereAmIAsync)

// getCountryData('india')


