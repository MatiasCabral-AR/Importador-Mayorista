// This JavaScript file includes functions of common use to all .js files in this proyect

// main() function. Execute everything
export function main(){
    // Check cart
    
    checkCart();
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
    // Buy cart button Event Listener
    document.getElementsByClassName("btn-primary")[0].addEventListener("click", buyCartCicked);
    console.log("main() finalizada")
}

// Remove cart item from <modal> and from cart array
export function removeCartItem(event){
    let buttonClicked = event.target
    let productId = buttonClicked.parentElement.parentElement.id
    buttonClicked.parentElement.parentElement.remove()
    let cart = JSON.parse(localStorage.getItem("cart"))
    cart = cart.filter(product => product.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartTotal()
}
// Cart Item quantity check (check if <input> value is not anything else than a positive value and corrects it)
export function quantityChanged(input){
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateCartTotal()
}
// Function to update the cart total price (inside Modal and "coming soon" in totalCart value inside localStorage)
export function updateCartTotal(){
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
export function checkCart(){
    let cart = JSON.parse(localStorage.getItem("cart"))
    if(!cart){
        cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
        return
    }
    else if(cart.length == 0){
        return
    }
    for(let i = 0; i < cart.length; i++){
        addToCart(cart[i])
    }
    console.log("Carrito creado")
}

// Cart purchase (New)
export function buyCartCicked(){
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

export function productCheck(array, element){
    for(let i = 0; i < array.length; i++){
        if(array[i].id === element.id){
            return true
        }
    }
    return false
}

export function checkProductPrice(product){
    if(product.discount > 0){
        product.price = product.price - (product.price * product.discount / 100)
        delete product.discount;
    }
    return product
}
// Add to Cart (Full Product <div> creation inside Modal, update localStorage "cart" array)
export function addToCart(product){
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
// Add to Cart Button "click" (get Product by Id, Toastify Notification & run addToCart function)
export function addToCartClick(product, cart){
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
//export {main, removeCartItem, quantityChanged, updateCartTotal, checkCart, buyCartCicked, productCheck, checkProductPrice}