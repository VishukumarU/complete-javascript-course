
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
import add, { cart } from './clean.js';       // not a good practice to mix the styles of imports. Done here for demo

// add('pizza', 2);
// add('chapati', 5);
// add('dose', 6);

// // variables in the import point to the same place in memory as in the exported file
// console.log(cart);

/*
    273: Top-level await(ES2022)
*/

// // console.log('start fetching');

// // const res = await fetch('https://jsonplaceholder.typicode.com/posts');
// // const data = await res.json();
// // console.log(data);

// // console.log('fetch complete');

// const getLastPost = async () => {
//     const res = await fetch('https://jsonplaceholder.typicode.com/posts');
//     const data = await res.json();
//     console.log(data);
//     return { title: data.at(-1).title, text: data.at(-1).body }
// };

// const lastPost = getLastPost();
// console.log(lastPost);  // async function will return a promise

// // Not clean
// lastPost.then((post) => console.log(post));

// // cleaner with top level await
// const lastPost2 = await getLastPost();
// console.log(lastPost2);

/* 
    274: The module pattern
*/

const ShippingCartModule = (() => {
    const shippingCost = 10;
    const cart = [];
    const totalPrice = 237;
    const totalQuantity = 23;

    const addToCart = (product, quantity) => {
        cart.push({ product, quantity });
        console.log(`${ quantity } ${ product } added to the cart(shipping cost is ${ shippingCost })`);
    };

    const order = (product, quantity) => {
        console.log(`${ quantity } ${ product } ordered`);
    };

    return {
        totalPrice,
        totalQuantity,
        addToCart,
        cart
    };
})();

ShippingCartModule.addToCart('dose', 5);
ShippingCartModule.addToCart('pizza', 2);