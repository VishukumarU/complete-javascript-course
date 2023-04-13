
/* 
    273: Top-level await(ES2022)
    * added blocking code
*/

// console.log('Start fetching users');
// await fetch('https://jsonplaceholder.typicode.com/users');
// console.log('finished fetching users');

console.log('Exported module');

const shippingCost = 10;
export const cart = [];

export const addToCart = (product, quantity) => {
    cart.push({ product, quantity });
    console.log(`${ quantity } ${ product } added to the cart`);
};

const totalPrice = 237;
const totalQuantity = 23;

export { totalPrice, totalQuantity as tq };

// default export
export default (product, quantity) => {
    cart.push({ product, quantity });
    console.log(`${ quantity } ${ product } added to the cart`);
};