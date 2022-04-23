// Fires main.js ONLY when all the DOM content is loaded (images and stylesheets not included)
document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', main) : main()

function main(){
    // Check cart
    console.log("Pagina Cargada")
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
}

// Function add content to all Product <div>


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
