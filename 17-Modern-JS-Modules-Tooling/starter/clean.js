const budget = [
    { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
    { value: -45, description: 'Groceries 🥑', user: 'jonas' },
    { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
    { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
    { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
    { value: -20, description: 'Candy 🍭', user: 'matilda' },
    { value: -125, description: 'Toys 🚂', user: 'matilda' },
    { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
];

const spendingLimits = Object.freeze({
    jonas: 1500,
    matilda: 100,
});

getLimit = (user) => spendingLimits?.[user] ?? 0;

const addExpense = function (value, description, user = ' ') {
    user = user.toLowerCase();
    const limit = getLimit(user);
    (value <= limit) && budget.push({ value: -value, description, user });
};
addExpense(10, 'Pizza 🍕');
addExpense(110, 'Going to movies 🍿', 'Matilda');
addExpense(200, 'Stuff', 'Jay');
console.log(budget);

const checkExpenses = function () {
    budget.forEach(entry => {
        if (entry.value < -getLimit(entry.user)) {
            entry.flag = 'limit';
        }
    });
};
checkExpenses();


const logBigExpenses = function (bigLimit) {
    let output = '';
    for (const { value, description } of budget) {
        output += value <= -bigLimit ? `${ description.slice(-2) } / ` : '';
    }
    output = output.slice(0, -2); // Remove last '/ '
    console.log(output);
};


console.log(budget);
logBigExpenses(1000);