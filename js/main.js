// This JavaScript file includes functions of common use to all .js files in this proyect

// main() function. Execute everything
function main(){
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
function removeCartItem(event){
    let buttonClicked = event.target
    let productId = buttonClicked.parentElement.parentElement.id
    buttonClicked.parentElement.parentElement.remove()
    let cart = JSON.parse(localStorage.getItem("cart"))
    cart = cart.filter(product => product.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartTotal()
}
// Cart Item quantity check (check if <input> value is not anything else than a positive value and corrects it)
function quantityChanged(input){
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateCartTotal()
}
// Function to update the cart total price (inside Modal and "coming soon" in totalCart value inside localStorage)
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
        cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
        return
    }
    else if(cart.length == 0){
        return
    }
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

export {main, removeCartItem, quantityChanged, updateCartTotal, checkCart, buyCartCicked, productCheck, checkProductPrice}