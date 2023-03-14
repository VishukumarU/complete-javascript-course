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


class App {

    #map;
    #mapEvent;

    constructor () {
        this._addEventListeners();
        this._getPosition();
    }

    _addEventListeners () {
        // This keyword will point to the object on which we are attaching the eventlistener
        // So, bind the class
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationFields)
    }

    _getPosition () {
        /* 
            232: Using the GeoLocation API
        */

        navigator.geolocation && navigator.geolocation.getCurrentPosition(
            this._loadMap.bind(this),
            (error) => alert(`Couldn't get the co-ordinates`),
            {});
    }

    _loadMap (position) {
        const {latitude, longitude} = position.coords;

        /* 
            233: Displaying a Map using leaflet library
        */

        this.#map = L.map('map').setView([latitude, longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this));
    }

    /* 
        235: Rendering input workout form
    */
    _showForm (event) {
        this.#mapEvent = event;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField () {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout (e) {
        e.preventDefault();
        this._clearInputFields();

        /* 
           234: Displaying a map marker
        */
        const {lat, lng} = this.#mapEvent.latlng;
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 200,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup'
            }))
            .setPopupContent('Workout!!')
            .openPopup();
    }

    _clearInputFields () {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    }
}

const app = new App();





