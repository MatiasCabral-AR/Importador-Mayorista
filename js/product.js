// Importing ALL functions from main.js
import {main, removeCartItem, quantityChanged, updateCartTotal, checkCart, buyCartCicked, productCheck, checkProductPrice, addToCart, addToCartClick} from "./main.js";
// Fires product.js ONLY when all the DOM content is loaded (images and stylesheets not included)
document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', main) : productMain()

//----------------------------- product.js Core Functions -----------------------------

function loadProduct(id){
    let product = productos.find(object => object.id === id)
    let productContainer = document.getElementsByClassName("product-info")
    document.getElementsByClassName("product-img")[0].innerHTML =  `<img src="${product.src1}" alt="Imagen de Producto">`
    productContainer[0].children[0].innerHTML = product.name
    productContainer[0].children[1].innerHTML = `$ ${product.price}`
    return product
}
//----------------------------- Main Function -----------------------------

function productMain(){
    main()
    let productId = localStorage.getItem("productData")
    let product = loadProduct(productId)
    document.getElementsByClassName("btn-secondary")[0].addEventListener("click", () => {
        addToCartClick(product, JSON.parse(localStorage.getItem("cart")))
        
    })
    
};

    

