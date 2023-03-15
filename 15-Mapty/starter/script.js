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
    238: Managing workout data: Creating Classes
*/
class Workout {

    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor (coords, distance, duration) {
        this.coords = coords;           // [lat,lng]
        this.distance = distance;     // in km
        this.duration = duration;       // in min
    }
}

class Running extends Workout {

    type = 'running';

    constructor (coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace () {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}
class Cycling extends Workout {

    type = 'cycling';
    constructor (coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed () {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

// const run1 = new Running([39, -12], 5.2, 54, 178);
// const cycle1 = new Cycling([39, -12], 27, 95, 400);
// console.log(run1);
// console.log(cycle1);

class App {

    #map;
    #mapEvent;
    #workouts = [];

    constructor () {
        this._addEventListeners();
        this._getPosition();
    }

    _addEventListeners () {
        // This keyword will point to the object on which we are attaching the eventlistener
        // So, bind the class
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField)
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
        const validInputs = (...inputs) => inputs.every(input => !!input);
        const allPositve = (...inputs) => inputs.every(input => input > 0);

        /* 
            239: Creating a new workout
        */

        // Get data from the form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        let workout;
        const {lat, lng} = this.#mapEvent.latlng;

        // Check if data is valid
        if (type === 'running') {
            const cadence = +inputCadence.value;
            if (!validInputs(distance, duration, cadence) || !allPositve(distance, duration, cadence)) {
                return alert('Inputs have to be positive numbers!!')
            }
            //create a running obj
            workout = new Running([lat, lng], distance, duration, cadence);
        }

        if (type === 'cycling') {
            const elevationGain = inputElevation.value;
            if (!validInputs(distance, duration, elevationGain) || !allPositve(distance, duration)) {
                return alert('Inputs have to be positive numbers!!')
            }
            // create a cycling obj
            workout = new Cycling([lat, lng], distance, duration, elevationGain);
        }
        this.#workouts.push(workout);
        this.renderWorkoutMarker(workout)

        // Render workout on list

        // Hide form + clear input fields


        this._clearInputFields();
    }

    _clearInputFields () {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    }

    /* 
       234: Displaying a map marker
    */
    renderWorkoutMarker (workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 200,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            }))
            .setPopupContent(`${workout.distance}`)
            .openPopup();
    }
}

const app = new App();





