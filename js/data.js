const productos = [
    {"id":"1", "name":"Bombachita de Nena", "price": 1800, "discount":0, "src1":"/resources/img/product-images/bombachita1.jpg", "src2": "/resources/img/product-images/bombachita2.jpg", "quantity" : "1"},
    {"id":"2", "name":"Boxer Algodon de Hombre", "price": 3200, "discount":20, "src1":"/resources/img/product-images/boxer1.jpg", "src2":"/resources/img/product-images/boxer2.jpg", "quantity" : "1"},
    {"id":"3", "name":"Calzoncillos Slip de Niño", "price": 1800, "discount":5, "src1":"/resources/img/product-images/calzoncillo2.jpg", "src2":"./resources/img/product-images/calzoncillo1.jpg", "quantity" : "1"},
    {"id":"4", "name":"Medias Caña de Hombre", "price": 850, "discount":0, "src1":"/resources/img/product-images/media-h2.jpg", "src2":"/resources/img/product-images/media-h1.jpg", "quantity" : "1"},
    {"id":"5", "name":"Soquetes de Hombre", "price": 780, "discount":0, "src1":"/resources/img/product-images/soquete-h1.jpg", "src2":"/resources/img/product-images/soquete-h2.jpg", "quantity" : "1"},
    {"id":"6", "name":"Medias Caña de Niño", "price": 780, "discount":0, "src1":"/resources/img/product-images/media-nino.jpg", "src2":"/resources/img/product-images/media-nino.jpg", "quantity" : "1"},
    {"id":"7", "name":"Vedetinas de dama", "price": 1500, "discount":5, "src1":"/resources/img/product-images/vedetina-c1.jpg", "src2":"/resources/img/product-images/vedetina-c2.jpg", "quantity" : "1"},
    {"id":"8", "name":"Vedetinas de dama (sin costura)", "price": 2500, "discount":10, "src1":"/resources/img/product-images/vedetina-sc1.jpg", "src2":"/resources/img/product-images/vedetina-sc2.jpg", "quantity" : "1"}
]

localStorage.setItem("products", JSON.stringify(productos))