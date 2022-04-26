// Importing ALL functions from main.js
import {main, removeCartItem, quantityChanged, updateCartTotal, checkCart, buyCartCicked, productCheck, checkProductPrice, addToCart, addToCartClick} from "./main.js";
// Fires index.js ONLY when all the DOM content is loaded (images and stylesheets not included)
document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', main) : indexMain()

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

//----------------------------- Main Function -----------------------------

function indexMain(){
    // Run main() function from main.js 
    main()
    // Clear localStorage "productData"
    localStorage.removeItem("productData") 
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
        let productId = button.parentElement.parentElement.parentElement.getAttribute("id")
        button.addEventListener("click", function(){
            let product = productos.find(object => object.id == productId)
            addToCartClick(product, JSON.parse(localStorage.getItem("cart")))
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