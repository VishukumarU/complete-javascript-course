'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/* 
    232: Using the GeoLocation API
*/

navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log(position);
        const {latitude, longitude} = position.coords;
        console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
    },
    (error) => {
        console.log(error);
    }, {
    // enableHighAccuracy: true,
    // maximumAge: 2,
    // timeout: 1
})
