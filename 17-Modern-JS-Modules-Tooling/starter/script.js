
/* 
    272: Exporting and importing in ES6 modules
*/

// import {addToCart, totalPrice as price, tq} from './clean.js';

// addToCart('bread', 5);
// console.log(price, tq);
console.log('Importing module');

// import * as ShoppingCart from './clean.js';
// ShoppingCart.addToCart('bread', 5);
// console.log(ShoppingCart.totalPrice, ShoppingCart.tq);

// default import
import add, {cart} from './clean.js';       // not a good practice to mix the styles of imports. Done here for demo

add('pizza', 2);
add('chapati', 5);
add('dose', 6);

// variables in the import point to the same place in memory as in the exported file
console.log(cart);