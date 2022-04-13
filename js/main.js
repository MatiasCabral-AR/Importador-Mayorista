if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', main)
}else{
    main()
}

function main(){
    // Load Content in Product <div>
    let productsArray = document.getElementsByClassName("product-grid")
    for (let i = 0; i < productsArray.length; i++){
        let product = productsArray[i]
        product.setAttribute('id', products[i].id)
        productCreation(product, products[i])
    }
    // Delete cart product Event Listener
    const deleteProduct = document.getElementsByClassName("btn-danger");
    for (let i = 0; i < deleteProduct.length; i++){
        let button = deleteProduct[i]
        button.addEventListener("click", removeCartItem)
    }
    // Product quantity change (input) Event Listener
    let quantityInputs = document.getElementsByClassName("cart-quantity-input")
    for (let i = 0; i < quantityInputs.length; i++){
        let input = quantityInputs[i]
        input.addEventListener("change", quantityChanged)
    }
    // Add to cart button Event Listener
    let addToCartButtons = document.getElementsByClassName("add-cart")
    for (let i = 0; i < addToCartButtons.length; i++){
        let button = addToCartButtons[i]
        button.addEventListener("click", addToCartClick)
    }
    // Buy cart button Event Listener
    const buyCart = document.getElementsByClassName("btn-primary")[0].addEventListener("click", buyCartCicked);
}

// Function add content to all Product <div>
function productCreation(product, products){
    let price = products.price
    let discount = ""
    let spanClass = "d-none"
    let realPrice = ""
    let id = products.id
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
                            <a href="pages/shop/product.html" data-tip="Ver Producto" class="d-flex justify-content-center align-items-center">
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

// Remove cart item function
function removeCartItem(event){
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

// Cart Item quantity update 
function quantityChanged(event){
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateCartTotal()
}

// Add Product to Cart BUTTON function
function addToCartClick(event){
    let button = event.target
    let productInfo = button.parentElement.parentElement.parentElement.parentElement.lastElementChild
    let productImg = button.parentElement.parentElement.parentElement.getElementsByClassName("pic-1")[0].src
    let name = productInfo.getElementsByClassName("title")[0].innerText
    let price = productInfo.getElementsByClassName("price")[0].innerText
    addToCart(name, price, productImg)
}

// Add to Cart (CREATE ROW) function
function addToCart(name, price, productImg){
    let row = document.createElement("div")
    row.classList = "cart-product";
    let modalBody = document.getElementsByClassName("modal-body")[0]
    let cartItemNames = modalBody.getElementsByClassName("cart-product-name")
    for (let i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == name){
            alert("Este producto ya esta en su carrito")
            return
        }
    }
    let rowContent = `
                <hr>
                <p class="cart-product-name w-100 text-center fw-bold">${name}</p>
                <hr>
                <div class="cart-product-info">
                    <img class="product-img" src="${productImg}" alt="Imagen de Producto">
                    <div class="product-unitPrice">
                        <p class="text-center">Precio Unitario : </p>
                        <p class="text-center price"id="price">${price}</p>
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
    modalBody.appendChild(row)
    row.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem)
    row.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged)
    updateCartTotal()

}

// Objeto Producto (Not used yet)
function Product(id, name, price, discount){
    this.id = id;
    this.name = name;
    this.price = price;
    this.discount = discount;
    this.salePrice = () => this.price - (this.price * this.discount / 100)
}

// Function to update the cart total price
function updateCartTotal(){
    let cartProductsContainer = document.getElementsByClassName("modal-body")[0]
    let cartProductsInfo = cartProductsContainer.getElementsByClassName("cart-product")
    let total = 0
    for (let i = 0; i < cartProductsInfo.length ; i++){
        let cartProductInfo = cartProductsInfo[i]
        let priceElement = cartProductInfo.getElementsByClassName("price")[0]
        let quantitylElement = cartProductInfo.getElementsByClassName("cart-quantity-input")[0]
        let price = parseFloat(priceElement.innerHTML.replace("$", ""))
        let quantity = parseFloat(quantitylElement.value)
        total = total + (price * quantity)
    }
    document.getElementById("cart-total").innerText = "$" + total


}

// Cart purchase
function buyCartCicked(){
    let cart = document.getElementsByClassName("modal-body")[0]
    console.log(cart.hasChildNodes())
    if (cart.hasChildNodes()){
        while (cart.hasChildNodes()){
            cart.removeChild(cart.firstChild)
        }
        alert("Muchas Gracias por su Compra !")
    }else{
        alert("El carrito esta vacio")
    }
    updateCartTotal();
}