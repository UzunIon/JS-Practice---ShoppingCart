"use strict"

function getProductTemplate(product) {
    return `<div class="col mb-5">
                <div class="card h-100" id="product-${product.id}">
                    <!-- Product image-->
                    <img class="card-img-top h-50" src="${product.image}" alt="..." />
                    <!-- Product details-->
                    <div class="card-body">
                        <div class="text-center">
                            <!-- Product name-->
                            <h5 class="fw-bolder">Popular Item</h5>
                            <!-- Product price-->
                            ${product.price}$
                        </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer p-4 pt-0 text-center border-top-0 bg-transparent">
                        <button class="add-to-cart btn btn-outline-dark mt-auto" href="#">Add to cart</button></button>
                    </div>
                </div>
            </div>`
}


async function fetchProducts() {
    let products = localStorage.getItem('products');

    if ( products === null ) {
        const response = await fetch('https://fakestoreapi.com/products')
        const result = await response.json()

        products = result.map(product => {
            return {
                id: product.id,
                title: product.title,
                image:product.image,
                price: product.price,
                count: 1,
            };
        });
       
        localStorage.setItem('products', JSON.stringify(products))
    } else{
        products = JSON.parse(products);
    }
    // let prod = Object.keys(products)
    // console.log(prod)
    return products;
   
}

function addToCart(product){
    let cart = localStorage.getItem('cart')
    if (cart === null) {
        localStorage.setItem('cart', JSON.stringify([product]))
        cart = localStorage.getItem('cart')
    }else{
        let cartProducts = JSON.parse(cart)
        let productExist = cartProducts.some(item => item.id === product.id)
        
        if (productExist) {
            cartProducts.forEach( item => {
                if (item.id === product.id) {
                    item.count++
                }
            })
        }else{
            cartProducts.push(product)
        }
    
        localStorage.setItem('cart',JSON.stringify(cartProducts));
        cart = localStorage.getItem("cart");
    }
	cart = JSON.parse(cart);
    let cartCounter = document.querySelector(".cartCounter");
    cartCounter.textContent = cart.length;
}

fetchProducts().then(( products ) => {
    const productsRow = document.querySelector('[data-products-row]');

    products.forEach( product => {
        productsRow.innerHTML += getProductTemplate(product);
    });

    products.forEach( product => {
        const addToCartButton = productsRow.querySelector(`#product-${product.id} button.add-to-cart`)
        addToCartButton.addEventListener('click', () =>{
            addToCart(product);
        })
    });
});