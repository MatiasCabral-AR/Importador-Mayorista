// Fires index.js ONLY when all the DOM content is loaded (images and stylesheets not included)
document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', main) : indexMain()
// Importing ALL functions from main.js
import {main, removeCartItem, quantityChanged, updateCartTotal, checkCart, buyCartCicked, productCheck, checkProductPrice} from "./main.js";

//----------------------------- index.js Core Functions -----------------------------

// HTML Product Creation
function productCreation(product, products){
    let price = products.price
    let discount = ""
    let spanClass = "d-none"
    let realPrice = ""
    if (parseInt(products.discount) > 0){
        discount = `% ${products.discount}`
        spanClass = "" 
        realPrice = `$${price}`
        price = parseInt(products.price) - (parseInt(products.price) * parseInt(products.discount) / 100)
    }
    let productContent = `
                        <div class="product-image">
                            <a href="javascript:void(0)">
                                <img class="pic-1" alt="Imagen de Producto" src="${products.src1}">
                                <img class="pic-2" alt="Imagen de Producto" src="${products.src2}">
                            </a>
                            <div class="product-buy w-100 d-flex justify-content-center align-items-center position-absolute">
                            <a href="pages/product.html" data-tip="Ver Producto" class="product-show d-flex justify-content-center align-items-center">
                                <i class="fas fa-search text-dark ver"></i>
                            </a>
                            <a class="add-cart" href="javascript:void(0)" data-tip="Agregar a Carrito" class="d-flex justify-content-center align-items-center">
                                <i class="fas fa-shopping-cart text-dark agregar"></i>
                            </a>
                            </div> 
                            <span class="product-new-label ${spanClass}">Sale</span>
                            <span class="product-discount-label ${spanClass}">${discount}</span>
                        </div>
                        <div class="product-content">
                            <p class="title"><a href="pages/shop/product.html">${products.name}</a></p>
                            <div class="price">${price}<span class="discount">${realPrice}</span></div>
                        </div>`
    product.innerHTML = productContent
}
// Add to Cart Button "click" (get Product by Id, Toastify Notification & run addToCart function)
function addToCartClick(productContainer, products, cart){
    let productId = productContainer.getAttribute('id')
    let product = products.find(object => object.id === productId)
    if(productCheck(cart, product)){
        Toastify({
            text : "Este producto ya esta en carrito",
            duration : 1500 ,
            gravity : "top",
            position : "center",
            offset : {
                y : "2rem"
            },
            style : {
                background : "red",
                color : "black",
                fontWeight : "500",
            }

        }).showToast();
        return
    }
    Toastify({
        text : "Producto agregado a carrito",
        duration : 1500 ,
        gravity : "top",
        position : "center",
        offset :{
            y : "2rem"
        },
        style : {
            background : "rgb(255,222,89)",
            color : "black",
            fontWeight : "500",
            
        }

    }).showToast();
    addToCart(product)       
}
// Add to Cart (Full Product <div> creation inside Modal, update localStorage "cart" array)
function addToCart(product){
    let row = document.createElement("div")
    row.classList = "cart-product";
    row.setAttribute("id", product.id)
    product = checkProductPrice(product)
    let rowContent = `
                <hr>
                <p class="cart-product-name w-100 text-center fw-bold">${product.name}</p>
                <hr>
                <div class="cart-product-info">
                    <img class="product-img" src="${product.src1}" alt="Imagen de Producto">
                    <div class="product-unitPrice">
                        <p class="text-center">Precio Unitario : </p>
                        <p class="text-center price"id="price">${product.price}</p>
                    </div>
                    <div class="cart-products-quantity d-flex flex-column">
                        <label for="cantidad" class="text-center cart-product-quantity-title">Cantidad de docenas</label>
                        <input class="cart-quantity-input" type="number" id="cantidad" name="cantidad" min="1" max="10" value="1">
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-danger">Borrar</button>
                </div>
                <hr>`
    row.innerHTML = rowContent
    let modalBody = document.getElementsByClassName("modal-body")[0]
    modalBody.appendChild(row)
    row.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem)
    row.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged)
    let cart = JSON.parse(localStorage.getItem("cart"))
    // NEED to check !! , addToCartClick have a Toastify Notification and uses productCheck() that does the same.
    if(cart.find(element => element.id === product.id)){
        updateCartTotal()
        return
    }
    cart.push(product)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartTotal()
}

//----------------------------- Main Function -----------------------------

function indexMain(){
    // Run main() function from main.js 
    main()
    // Create products in HTML based on data from data.js
    let productsGrid = document.getElementsByClassName("product-grid")
    for (let i = 0; i < productsGrid.length; i++){
        let products = JSON.parse(localStorage.getItem("products"))
        let product = productsGrid[i]
        product.setAttribute('id', products[i].id)
        productCreation(product, products[i])
    }
    // Event Listener for Add to Cart button in every product
    let addToCartButtons = document.getElementsByClassName("add-cart")
    for (let i = 0; i < addToCartButtons.length; i++){
        let button = addToCartButtons[i]
        let productContainer = button.parentElement.parentElement.parentElement
        button.addEventListener("click", function(){
            addToCartClick(productContainer, JSON.parse(localStorage.getItem("products")), JSON.parse(localStorage.getItem("cart")))
        })
    }
    // Event Listener for Show Product button in every product
    let productShowButton = document.getElementsByClassName("product-show")
    for (let i = 0; i < productShowButton.length ; i++){
        let button = productShowButton[i]
        let productId = button.parentElement.parentElement.parentElement.id
        button.addEventListener("click", ()=>{
            localStorage.setItem("productData", productId)
        })
    }
}