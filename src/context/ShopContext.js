
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Client from 'shopify-buy';
import {Buffer} from 'buffer';

export default function ShopContext() {

  const [ProductsArray, setProductsArray] = useState([]);
 
  const lineItemsToAdd = [
    {
      merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNjYwNzg2OTA1OQ==', //Buffer.from('42319866593538').toString('base64')  Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNjYwNzg2OTA1OQ==,
      quantity: 5,
      attributes: [
        {
        key: 'Color',
        value: 'Grey'
      },
      {
        key: 'Designer',
        value: 'Jahangeer'
      },
    ]
  
    }
  ];

  let inputObject = {
    lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNjYwNzg2OTA1OQ==", quantity: 1 }]
  }
  
  const client = Client.buildClient({
    storefrontAccessToken: "dd4d4dc146542ba7763305d71d1b3d38",
    domain: "graphql.myshopify.com",
    });
    
  client.product.fetchAll().then((products) => {
    // Do something with the products
    console.log(products);
  });

  const cartCreate = () =>{
    return axios.post(
      `https://graphql.myshopify.com/api/2021-10/graphql.json`,
      {
        query: `mutation cartCreate {
          cartCreate {
            cart {
              id
            }
            userErrors {
              code
              field
              message
            }
          }
        }`,
      },
      {
        headers: {
          'X-Shopify-Storefront-Access-Token': 'dd4d4dc146542ba7763305d71d1b3d38',
        },
      },
    )
  }
          

      
  const addCartItems = (cartId, lines) => {
    return axios.post(
      `https://graphql.myshopify.com/api/2021-10/graphql.json`,
      {
        query: `mutation cartLinesAdd($lines: [CartLineInput!]!, $cartId: ID!) {
          cartLinesAdd(lines: $lines, cartId: $cartId) {
            cart {
              id
              checkoutUrl
              attributes {
                key
                value
              }
            }
            userErrors {
              code
              field
              message
            }
          }
        }`,
        variables: {
          lines: lines,
          cartId: cartId,
        },
      },
      {
        headers: {
          'X-Shopify-Storefront-Access-Token': 'dd4d4dc146542ba7763305d71d1b3d38',
        },
      },
    )
  }



  const checkoutPage = (inputObject) => {
      
    return axios.post(
      `https://graphql.myshopify.com/api/2021-10/graphql.json`,
      {
        query : `
        mutation {
          checkoutCreate(input: $inputObject) {
            checkout {
               id
               webUrl
               lineItems(first: 5) {
                 edges {
                   node {
                     title
                     quantity
                   }
                 }
               }
            }
          }
        }`,
        variables: {
          input : inputObject
        },
        
         
      },
      {
      headers: {
        'X-Shopify-Storefront-Access-Token': 'dd4d4dc146542ba7763305d71d1b3d38',
      },
    }
      
      )
  }
  

const handleCart = ()=>{

    cartCreate().then((checkout) => {
      console.log('checkout.data.data.cartCreate.cart.id _____', checkout.data.data.cartCreate.cart.id)
      addCartItems(checkout.data.data.cartCreate.cart.id, lineItemsToAdd).then(items => {
        console.log('addCartItems', items)
      }).catch(error => {
        console.log('error', error)
      })
    }).catch(error => {
      console.log('error', error)
    })
}

const customCheckoutHandler = () => {
  checkoutPage(inputObject)
}




  return <div>
      <h1>Shop Context</h1>
      <button
      onClick={handleCart}
      >Add to Cart</button>

<button
      onClick={customCheckoutHandler}
      >Custom Checkout </button>
  </div>;
}