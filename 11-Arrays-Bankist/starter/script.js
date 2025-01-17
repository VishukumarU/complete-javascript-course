'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const updateUI = (account) => {
    displayMovements(account.movements);
    calcDisplayBalance(account);
    calcDisplaySummary(account);
}

const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach((movement, i) => {
        const type = movement > 0 ? 'deposit' : 'withdrawal'
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
                <div class="movements__date">3 days ago</div>
                <div class="movements__value">₹${Math.abs(movement)}</div>
            </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}


/*
    151: Computing Usernames
*/


const name1 = 'Steven Thomas Williams';

const calculateUserName = (accounts) =>

    accounts.forEach(account => {
        account.username = account.owner.toLowerCase()
            .split(' ')
            .map(word => word[0])
            .join('');

    });

calculateUserName(accounts);

/* 
    153: The reduce method
*/
const calcDisplayBalance = (account) => {
    account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
    labelBalance.textContent = `₹${account.balance}`;
};

/* 
    155: The magic of chaining methods
*/

const calcDisplaySummary = account => {
    const income = account.movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `₹${income}`;
    const out = account.movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `₹${Math.abs(out)}`;
    const interest = account.movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * account.interestRate / 100)
        .filter(interest => interest >= 1)
        .reduce((acc, interest) => acc + interest, 0);
    labelSumInterest.textContent = `₹${interest}`;
}


/* 
    158: Implementing Login
*/

let currentAccount;
btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
    console.log(currentAccount);
    if (currentAccount?.pin === +inputLoginPin.value) {
        labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 1;
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        updateUI(currentAccount);
    }

});

/* 
    159: Implementing transfers
*/

btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

    if (amount > 0 && receiverAccount && receiverAccount?.username !== currentAccount.username && currentAccount.balance > amount) {
        receiverAccount.movements.push(amount);
        currentAccount.movements.push(-Math.abs(amount));
        updateUI(currentAccount);
    }
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
});

/* 
    160: The findIndex method
*/

btnClose.addEventListener('click', (e) => {
    e.preventDefault();

    const username = inputCloseUsername.value;
    const pin = +inputClosePin.value;

    if (username === currentAccount.username && pin === currentAccount.pin) {
        accounts.splice(accounts.findIndex((acc) => acc.username === currentAccount.username), 1);
        currentAccount = null;
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

/* 
    161: some and every
*/

btnLoan.addEventListener('click', (e) => {
    e.preventDefault();
    const loanAmount = +inputLoanAmount.value;
    if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
        currentAccount.movements.push(loanAmount);
        updateUI(currentAccount);
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
    }
});

/* 
    163: Sorting Arrays
*/
let sorted = false;
btnSort.addEventListener('click', (e) => {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
    142: Simple Array Methods
*/


// // SLICE
// const arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -3));

// // SPLICE -- modifies the array
// console.log(arr);
// console.log(arr.splice(2, 2));  // start position & deletecount
// console.log(arr);

// // REVERSE -- modifies the array
// const arr1 = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];

// console.log(arr2.reverse());

// // CONCAT
// const letters = arr1.concat(arr2);
// console.log(letters);
// console.log([...arr1, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

/*
    143: The new 'at' method -- ES2022
*/

// const arr = [23, 34, 45, 56, 766];
// console.log(arr[2]);
// console.log(arr.at(2));

// // Get last element without knowing the length
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1));
// console.log(arr.at(-1));

/*
    144: Looping Arrays: forEach
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for-of

// for (const [i, movement] of movements.entries()) {
//     if (movement > 0) {
//         console.log(`Movement ${i + 1}: You deposited ${movement}`);
//     } else {
//         console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//     }
// }

// // foreach is the higher order function which calls the callback function for each of the element in the array
// console.log(`---- FOREACH ----`);
// movements.forEach((movement, i, array) => {
//     if (movement > 0) {
//         console.log(`Movement ${i + 1}: You deposited ${movement}`);
//     } else {
//         console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//     }
// });

/*
    145: forEach with Maps and Sets
*/

// // Map
// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((value, key, map) => {
//     console.log(`${key}: ${value}`);
// });

// // SET
// const uniqueCurrencies = new Set(['USD', 'EUR', 'INR', 'GBP', 'USD', 'YEN']);
// console.log(uniqueCurrencies);

// // Key not available in set. So, value appears in that place
// uniqueCurrencies.forEach((value, _, set) => {
//     console.log(value, _, set);
// })

/*
    148: Coding Challenge #1
*/


/*
    Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age,
    and stored the data into an array (one array for each).
    For now, they are just interested in knowing whether a dog is an adult or a puppy.
    A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

    Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

    1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs!
        So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
    2. Create an array with both Julia's (corrected) and Kate's data
    3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
    4. Run the function for both test datasets

    HINT: Use tools from all lectures in this section so far 😉

    TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
    TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//     const dogsJuliaCorrect = dogsJulia.slice(1, 3);
//     const allDogs = dogsJuliaCorrect.concat(dogsKate);
//     console.log(dogsJuliaCorrect, dogsKate, allDogs);
//     allDogs.forEach((dog, i) => {
//         if (dog >= 3) {
//             console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//         } else {
//             console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//         }
//     });
// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

/*
    150: The map method
*/

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;
// const movementsUSD = movements.map((mov) => mov * euroToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//     movementsUSDfor.push(mov * euroToUsd);
// }
// console.log(movementsUSDfor);

// const movementsDescription = movements.map((mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`);
// console.log(movementsDescription);

/*
    152: The filter method
*/

// const deposits = movements.filter((movement) => movement > 0);
// const withdrawals = movements.filter((movement) => movement < 0);
// console.log(deposits, withdrawals);

/*
    153: The reduce method
*/
// console.log(movements);
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);
// // Find largest using reduce
// const max = movements.reduce((acc, prev) => {
//     return prev > acc ? prev : acc
// }, movements[0]);

// const min = movements.reduce((acc, prev) => prev < acc ? prev : acc, movements[0])
// console.log(max);
// console.log(min);

/*
    154: Coding Challenge #2
*/
/*
    Let's go back to Julia and Kate's study about dogs.
    This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

    Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

    1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge.
        If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
    2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
    3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
    4. Run the function for both test datasets

    TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
    TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/

// const calcAverageHumanAge = (ages) => {
//     console.log(ages);
//     const humanAge = ages.map((age) => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age >= 18);
//     console.log(humanAge);
//     // const avghumanAge = (humanAge.reduce((acc, prev) => acc + prev, 0)) / humanAge.length;

//     // divide each element by the array length and then add it to accumalator
//     const avghumanAge = humanAge.reduce((acc, prev, i, arr) => acc + prev / arr.length, 0);
//     return avghumanAge;
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

/*
    155: The magic of chaining methods
*/

// const totalDepositInUsd = movements
//     .filter((movement) => movement > 0)
//     .map((mov) => mov * euroToUsd)
//     .reduce((acc, cur) => acc + cur, 0);

// console.log(totalDepositInUsd);

/*
    156: Coding Challenge #3
*/

// // Use chaining

// const calcAverageHumanAge = (ages) => {
//     const avgHumanAge = ages
//         .map((age) => age <= 2 ? 2 * age : 16 + age * 4).
//         filter(age => age >= 18)
//         .reduce((acc, prev, i, arr) => acc + prev / arr.length, 0);
//     return avgHumanAge;
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

/*
    157: The find method
*/

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(firstWithdrawal);

// const account = accounts.find((account) => account.owner === 'Jessica Davis');
// console.log(account);

// let ofAccount;
// for (const account1 of accounts) {
//     if (account1.owner === 'Jessica Davis') {
//         ofAccount = account1;
//     }
// }
// console.log(ofAccount);


/*
    161: some and every
*/

// console.log(movements);
// const isAnyDeposit = movements.some(mov => mov > 0);
// console.log(isAnyDeposit);
// const largeDeposit = movements.some(mov => mov > 5000);
// console.log(largeDeposit);

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

/*
    162: flat and flatMap: ES2019
*/

// const arr = [[1, 2, 3], [4, 5], 6, 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, 5], [[[6, 7]]], [8, 9]];
// console.log(arrDeep.flat(3));

// const overAllBalance = accounts
//     .map(acc => acc.movements)
//     .flat()
//     .reduce((acc, cur) => acc + cur, 0);
// console.log(overAllBalance);

// const overAllBalanceFlatMap = accounts
//     .flatMap(acc => acc.movements)      // combines map and flat
//     .reduce((acc, cur) => acc + cur, 0);
// console.log(overAllBalanceFlatMap);

/*
    163: Sorting Arrays
*/

// const owners = ['Vishu', 'Vasudha', 'Savitha', 'Kishan', 'Sneha'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);
// console.log(movements.sort((a, b) => a - b));   // ascending order
// console.log(movements.sort((a, b) => b - a));   // descending order

/*
    164: More ways of creating and filling arrays
*/

// // Empty array + fill method
// const x = new Array(7);
// console.log(x);
// console.log(x.fill(1, 2));
// console.log(x);
// console.log(x.fill(23, 1, 3));  // element, start,end
// console.log(x);

// // array.from()
// const y = Array.from({length: 7}, () => 1);
// console.log(y);
// const z = Array.from({length: 7}, (cur, i) => i + 1);
// console.log(z);


// // 100 random dice rolls

// const rolls = Array.from({length: 100}, (cur, i) => {
//     return Math.floor(Math.random() * 100) + 1;
// });
// console.log(rolls);

// // Array from nodelist

// labelBalance.addEventListener('click', () => {
//     const movementsFromUINodes = document.querySelectorAll('.movements__value');
//     const movementsFromUI = Array.from(movementsFromUINodes).map(el => +el.textContent.replace('₹', ''))
//     console.log(movementsFromUI);
// });

/*
    166: Array methods practice
*/

// //1:
// const bankDepositsSum = accounts
//     .flatMap(acc => acc.movements)
//     .filter(mov => mov > 0)
//     .reduce((sum, cur) => sum + cur, 0)
// console.log(bankDepositsSum);

// // // 2:
// // const numDeposits1000 = accounts
// //     .flatMap(acc => acc.movements)
// //     .filter(mov => mov >= 1000).length

// const numDeposits1000 = accounts
//     .flatMap(acc => acc.movements)
//     .reduce((count, cur) => cur >= 1000 ? ++count : count, 0)
// console.log(numDeposits1000);

// // 3:
// const {deposits, withdrawals} = accounts
//     .flatMap(acc => acc.movements)
//     .reduce((sums, cur) => {
//         cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
//         return sums;
//     }, {deposits: 0, withdrawals: 0});
// console.log(deposits, withdrawals);

// // 4: Convert to titleCase

// const convertToTitleCase = (title) => {
//     const exceptions = ['a', 'an', 'on', 'with', 'the', 'but', 'or'];
//     const titleCase = title
//         .toLowerCase()
//         .split(' ')
//         .map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1))
//         .join(' ')
//     return titleCase;
// };

// console.log(
//     convertToTitleCase('this is a nice function')
// );
// console.log(
//     convertToTitleCase('this is a nice FUNCTION BUT A TOO LONG one')
// );

/* 
    167: Coding challenge #4
*/

/* 
    Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
    Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
    Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

    1. Loop over the array containing dog objects, and for each dog, calculate the 
        recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. 
        Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
    2. Find Sarah's dog and log to the console whether it's eating too much or too little. 
        HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
    3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') 
        and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
    4. Log a string to the console for each array created in 3., 
        like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
    5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
    6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
    7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
    8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

    HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
    HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.



GOOD LUCK 😀
*/

// TEST DATA:
const dogs = [
    {weight: 22, curFood: 250, owners: ['Alice', 'Bob']},
    {weight: 8, curFood: 200, owners: ['Matilda']},
    {weight: 13, curFood: 275, owners: ['Sarah', 'John']},
    {weight: 32, curFood: 340, owners: ['Michael']}
];
// 1.
dogs.forEach(dog => {
    dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
// 2.
const dogSarah = dogs.find(dog => dog.owners.some(owner => owner === 'Sarah'));
console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'}`);

// 3.

const ownersEatTooMuch = dogs
    .filter(dog => dog.curFood > dog.recommendedFood)
    .flatMap(dog => dog.owners)
const ownersEatTooLittle = dogs
    .filter(dog => dog.curFood < dog.recommendedFood)
    .flatMap(dog => dog.owners)

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.
const okayFoodCheck = (dog) => dog.curFood > (dog.recommendedFood * 0.9) && dog.curFood < (dog.recommendedFood * 1.1);
console.log(dogs.some(okayFoodCheck));

// 7.
const dogsEatingOkayFood = dogs.filter(okayFoodCheck);
console.log(dogsEatingOkayFood);

// 8.
const dogsInOrder = dogs
    .slice()
    .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsInOrder);

console.log(dogs);