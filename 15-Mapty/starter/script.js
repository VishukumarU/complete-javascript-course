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

        /* 
            233: Displaying a Map using leaflet library
        */
        const coords = [latitude, longitude];
        const map = L.map('map').setView(coords, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(map);

        map.on('click', e => {
            const {lat, lng} = e.latlng;
            L.marker([lat, lng]).addTo(map)
                .bindPopup(L.popup({
                    maxWidth: 200,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup'
                }))
                .setPopupContent('Workout!!')
                .openPopup();
        })
    },
    (error) => {
        console.log(error);
    }, {
    // enableHighAccuracy: true,
    // maximumAge: 2,
    // timeout: 1
});
