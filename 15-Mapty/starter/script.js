'use strict';

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

    _setDescription () {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // Running on April 23
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`

    }
}

class Running extends Workout {

    type = 'running';

    constructor (coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
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
        this._setDescription();
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
    #mapZoomLevel = 15;
    #workouts = [];

    constructor () {
        this._addEventListeners();
        this._getPosition();
        this._getLocalStorage();
    }

    _addEventListeners () {
        // This keyword will point to the object on which we are attaching the eventlistener
        // So, bind the class
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
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

        this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this));
        this.#workouts.forEach(workout => this._renderWorkoutMarker(workout));
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
        this._renderWorkoutMarker(workout)
        this._renderWorkout(workout);
        this._clearInputFields();
        this._hideForm();
        this._setLocalStorage();
    }

    _clearInputFields () {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    }

    _moveToPopup (e) {
        const workoutEl = e.target.closest('.workout');
        if (!workoutEl) {
            return;
        }
        const workout = this.#workouts.find(workout => workout.id === workoutEl.dataset.id)
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1
            }
        });
    }

    /* 
       234: Displaying a map marker
    */
    _renderWorkoutMarker (workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 200,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkout (workout) {
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>`;

        if (workout.type === 'running') {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace.toFixed(1)}</span>
                    <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
            </li>`;
        }
        if (workout.type === 'cycling') {
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
            </li>`;
        }

        form.insertAdjacentHTML('afterend', html);
    }

    _hideForm () {
        // Handle the transition animation which uses 1s
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => {
            form.style.display = 'grid';
        }, 1000);
    }

    _setLocalStorage () {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage () {
        this.#workouts = JSON.parse(localStorage.getItem('workouts')) ?? [];
        this.#workouts.length && this.#workouts.forEach(workout => this._renderWorkout(workout));
    }

    reset () {
        localStorage.clear();
        location.reload();
    }
}

const app = new App();





