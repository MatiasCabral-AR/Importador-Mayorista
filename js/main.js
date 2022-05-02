// This JavaScript file includes functions of common use to all .js files in this proyect
//----------------------------- Main Function -----------------------------
export function main(){
    // Check cart
    checkCart();
    // Delete cart product Event Listener
    const deleteProduct = document.getElementsByClassName("btn-outline-danger");
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
    // Delete cart button Event listener
    //document.getElementsByClassName("btn-danger")[0].addEventListener("click", deleteCart)
}

//----------------------------- main.js Core Functions -----------------------------

// Remove cart item from <modal> and from cart array
export function removeCartItem(event){
    let buttonClicked = event.target
    let productId = buttonClicked.parentElement.parentElement.id
    buttonClicked.parentElement.parentElement.remove()
    let cart = JSON.parse(localStorage.getItem("cart"))
    cart = cart.filter(product => product.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    showToastify("Producto eliminado", "red")
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

// Create an empty cart in localStorage if this does not exist, and if it exist load it in modal
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
}

// Cart purchase button function (delete all items in cart (modal and localStorage), and show alert)
export function buyCartCicked(){
    let cart = JSON.parse(localStorage.getItem("cart"))
    if (cart.length > 0){
        while (document.getElementsByClassName("modal-body")[0].hasChildNodes()){
            document.getElementsByClassName("modal-body")[0].removeChild(document.getElementsByClassName("modal-body")[0].firstChild)
        }
        localStorage.removeItem("cart")
        showAlert("success", "Listo !", "Muchas Gracias por tu compra.")
    }else{
        showAlert("error", "Error", "El carrito esta vacio !")
    }
    checkCart();
    updateCartTotal();
}
// Check if a Product is inside an Array by checking his Id
export function productCheck(array, element){
    for(let i = 0; i < array.length; i++){
        if(array[i].id === element.id){
            return true
        }
    }
    return false
}
// Apply discount to the price of a product Object if it has a discount attribute > 0
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
                    <button class="btn btn-outline-danger">Borrar Articulo</button>
                </div>
                <hr>`
    row.innerHTML = rowContent
    let modalBody = document.getElementsByClassName("modal-body")[0]
    modalBody.appendChild(row)
    row.getElementsByClassName("btn-outline-danger")[0].addEventListener("click", removeCartItem)
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
        showToastify("Este producto ya esta en el carrito", "red")
        return
    }
    showToastify("Producto agregado al carrito", "lightgreen")
    addToCart(product)       
}
// Fetching dollar value through API and executing showDollar
export function dollarBlue(oficialCompra, oficialVenta, blueCompra, blueVenta){
    fetch("https://api.bluelytics.com.ar/v2/latest")
    .then(response => response.json())
    .then((json) => {showDollar(json, oficialCompra, oficialVenta, blueCompra, blueVenta)})
}
// Get dollar values from API and insert them into DOM
export function showDollar(object, oficialCompra, oficialVenta, blueCompra, blueVenta){
    oficialCompra[0].innerHTML = `$ ${object.oficial.value_buy}`
    oficialVenta[0].innerHTML = `$ ${object.oficial.value_sell}`
    blueCompra[0].innerHTML = `$ ${object.blue.value_buy}`
    blueVenta[0].innerHTML = `$ ${object.blue.value_sell}`
}
// Show Toastify function
export function showToastify(msj, background){
    Toastify({
        text : msj,
        duration : 1500 ,
        gravity : "top",
        position : "center",
        offset :{
            y : "2rem"
        },
        style : {
            background : background,
            color : "black",
            fontWeight : "500",
            
        }

    }).showToast();
}
// SweetAlert function
export function showAlert(icon, title, text){
    Swal.fire({
        icon: `${icon}`,
        title: `${title}`,
        text: `${text}`,
      })
}
// Delete full cart function
export function deleteCart(){

}

