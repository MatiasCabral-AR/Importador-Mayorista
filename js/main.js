if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', main)
}else{
    main()
}

function main(){

    // Check cart
    console.log("Pagina Cargada")
    checkCart();

    // Load Content in Product <div>
    let productsGrid = document.getElementsByClassName("product-grid")
    for (let i = 0; i < productsGrid.length; i++){
        let products = JSON.parse(localStorage.getItem("products"))
        let product = productsGrid[i]
        product.setAttribute('id', products[i].id)
        productCreation(product, products[i])
        console.log(`Producto ${i}, creado`)
    }
    // Delete cart product Event Listener
    const deleteProduct = document.getElementsByClassName("btn-danger");
    for (let i = 0; i < deleteProduct.length; i++){
        let button = deleteProduct[i]
        button.addEventListener("click",removeCartItem)
    }
    // Product quantity change (input) Event Listener
    let quantityInputs = document.getElementsByClassName("cart-quantity-input")
    for (let i = 0; i < quantityInputs.length; i++){
        let input = quantityInputs[i]
        input.addEventListener("change", function(){
            quantityChanged(input)
        })
    }
    // Add to cart button Event Listener
    let addToCartButtons = document.getElementsByClassName("add-cart")
    for (let i = 0; i < addToCartButtons.length; i++){
        let button = addToCartButtons[i]
        let productContainer = button.parentElement.parentElement.parentElement
        button.addEventListener("click", function(){
            addToCartClick2(productContainer, JSON.parse(localStorage.getItem("products")), JSON.parse(localStorage.getItem("cart")))
        })
    }
    // Buy cart button Event Listener
    document.getElementsByClassName("btn-primary")[0].addEventListener("click", buyCartCicked);
}

// Function add content to all Product <div>
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
                            <a href="pages/product.html" data-tip="Ver Producto" class="d-flex justify-content-center align-items-center">
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
    let productId = buttonClicked.parentElement.parentElement.id
    buttonClicked.parentElement.parentElement.remove()
    let cart = JSON.parse(localStorage.getItem("cart"))
    cart = cart.filter(product => product.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    console.log("Boton Borrar presionado")
    updateCartTotal()
}

// Cart Item quantity update 
function quantityChanged(input){
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
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
    let cartProductsInfo = document.getElementsByClassName("cart-product")
    let total = 0
    for (let i = 0; i < cartProductsInfo.length ; i++){
        let cart = JSON.parse(localStorage.getItem("cart"))
        let product = cart.find(element => element.id == cartProductsInfo[i].id )
        let quantitylElement = cartProductsInfo[i].getElementsByClassName("cart-quantity-input")[0]
        let quantity = parseFloat(quantitylElement.value)
        product.quantity = quantity
        cart[cart.findIndex(object => object.id === product.id)] = product;
        localStorage.setItem("cart", JSON.stringify(cart))
        total = total + (product.price * quantity)
    }
    document.getElementById("cart-total").innerText = "$" + total
}

// Update cart (New)
function checkCart(){
    let cart = JSON.parse(localStorage.getItem("cart"))
    if(!cart){
        console.log("Carrito no existe, vamos a crearlo")
        cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
        return
    }
    else if(cart.length == 0){
        console.log("Carrito Vacio")
        return
    }
    console.log("Carrito tiene algo, vamos a cargarlo")
    for(let i = 0; i < cart.length; i++){
        addToCart2(cart[i])
    }
    console.log("Carrito creado")
}

// Cart purchase (New)
function buyCartCicked(){
    let cart = JSON.parse(localStorage.getItem("cart"))
    if (cart.length > 0){
        while (document.getElementsByClassName("modal-body")[0].hasChildNodes()){
            document.getElementsByClassName("modal-body")[0].removeChild(document.getElementsByClassName("modal-body")[0].firstChild)
        }
        localStorage.removeItem("cart")
        alert("Muchas Gracias por su Compra !")
    }else{
        alert("El carrito esta vacio")
    }
    checkCart();
    updateCartTotal();
}

function addToCartClick2(productContainer, products, cart){
    let productId = productContainer.getAttribute('id')
    let product = products.find(object => object.id === productId)
    if(productCheck(cart, product)){
        alert("Este producto ya esta en carrito")
        return
    }
    addToCart2(product)
       
}

function addToCart2(product){
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
    if(cart.find(element => element.id === product.id)){
        updateCartTotal()
        return
    }
    cart.push(product)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartTotal()
}

function productCheck(array, element){
    for(let i = 0; i < array.length; i++){
        if(array[i].id === element.id){
            return true
        }
    }
    return false
}

function checkProductPrice(product){
    if(product.discount > 0){
        product.price = product.price - (product.price * product.discount / 100)
        delete product.discount;
    }
    return product
}