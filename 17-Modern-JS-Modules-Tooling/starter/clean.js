'strict mode';

const budget = Object.freeze([
    { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
    { value: -45, description: 'Groceries 🥑', user: 'jonas' },
    { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
    { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
    { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
    { value: -20, description: 'Candy 🍭', user: 'matilda' },
    { value: -125, description: 'Toys 🚂', user: 'matilda' },
    { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
]);

// Object is immutable
const spendingLimits = Object.freeze({
    jonas: 1500,
    matilda: 100,
});

getLimit = (user, limits) => limits?.[user] ?? 0;


// pure function
const addExpense = function (state, limits, value, description, user = 'jonas') {
    const clenaUser = user.toLowerCase();
    const limit = getLimit(clenaUser, limits);
    return (value <= limit) ?
        [...state, { value: -value, description, clenaUser }] : state;
};

const budget1 = addExpense(budget, spendingLimits, 10, 'Pizza 🍕');
const budget2 = addExpense(budget1, spendingLimits, 90, 'Going to movies 🍿', 'Matilda');
const budget3 = addExpense(budget2, spendingLimits, 200, 'Stuff', 'Jay');
console.log(budget3);

// pure function
const checkExpenses = (state, limits) => state.map(entry => entry.value < -getLimit(entry.user, limits) ? { ...entry, flag: 'limit' } : entry);
const finalBudget = checkExpenses(budget3, spendingLimits);
console.log(finalBudget);


const logBigExpenses = (state, bigLimit) => state
    .filter(({ value }) => value <= -bigLimit)
    // .map(({ description }) => `${ description.slice(-2) }`)
    // .join(' / ')
    //  reduce to get a string -->
    .reduce((str, curent) => `${ str } ${ str.length ? '/' : '' } ${ curent.description.slice(-2) }`, '')


    // let output = '';
    // for (const { value, description } of budget) {
    //     output += value <= -bigLimit ? `${ description.slice(-2) } / ` : '';
    // }
    // output = output.slice(0, -2); // Remove last '/ '
    // console.log(output);

    ;


// console.log(budget);
const bigExpenses = logBigExpenses(finalBudget, 1000);
console.log(bigExpenses);