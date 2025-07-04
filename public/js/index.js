//Conectar websockets del lado cliente 
const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(formNewProduct);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });

    //Enviar los datos del producto al servidor
    socket.emit("newProduct", productData);

});


socket.on ("productAdded", (newProduct) => {
    const productsList = document.getElementById("productsList");

    productsList.innerHTML += 
    `<div class="col">
        <div class="card h-100" style="width: 18rem;">
        <img src="${newProduct.thumbnail}" class="card-img-top" alt="${newProduct.title}">
        <div class="card-body">
            <h5 class="card-title">${newProduct.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${newProduct.category}</h6>
            <p class="card-text">${newProduct.description}</p>
            <h6 class="card-subtitle mb-2 text-body-secondary">
            $${Number(newProduct.price).toLocaleString("es-AR")}
            </h6>
            <a href="#" class="btn btn-primary">Comprar</a>
        </div>
        </div>
    </div>`;
});

