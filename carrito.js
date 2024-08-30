// Inicializar IndexedDB
let db;
let request = indexedDB.open('TiendaDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let objectStore = db.createObjectStore('productos', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('nombre', 'nombre', { unique: false });
    objectStore.createIndex('precio', 'precio', { unique: false });
    objectStore.createIndex('cantidad', 'cantidad', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    mostrarCarrito();
};

request.onerror = function(event) {
    console.log('Error al abrir la base de datos:', event.target.errorCode);
};

// Función para arrastrar y soltar
function drag(event) {
    event.dataTransfer.setData('producto', JSON.stringify({
        nombre: event.target.getAttribute('data-nombre'),
        precio: parseFloat(event.target.getAttribute('data-precio')),
        cantidad: 1
    }));
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let producto = JSON.parse(event.dataTransfer.getData('producto'));
    agregarOActualizarProducto(producto);
    mostrarCarrito();
}

// Agregar o actualizar producto en IndexedDB
function agregarOActualizarProducto(producto) {
    let transaction = db.transaction(['productos'], 'readwrite');
    let objectStore = transaction.objectStore('productos');
    let index = objectStore.index('nombre');
    let request = index.get(producto.nombre);

    request.onsuccess = function(event) {
        let data = event.target.result;
        if (data) {
            // Si el producto ya existe, actualizar la cantidad y el precio total
            data.cantidad += producto.cantidad;
            data.precio += producto.precio;
            let updateRequest = objectStore.put(data);
            updateRequest.onsuccess = function() {
                console.log('Producto actualizado en el carrito:', data);
            };
        } else {
            // Si el producto no existe, agregarlo
            let addRequest = objectStore.add(producto);
            addRequest.onsuccess = function() {
                console.log('Producto agregado al carrito:', producto);
            };
        }
    };

    request.onerror = function(event) {
        console.log('Error al verificar el producto:', event.target.errorCode);
    };
}

// Mostrar productos en el carrito
function mostrarCarrito() {
    let transaction = db.transaction(['productos'], 'readonly');
    let objectStore = transaction.objectStore('productos');
    let request = objectStore.getAll();

    request.onsuccess = function(event) {
        let carrito = document.getElementById('lista-carrito');
        carrito.innerHTML = '';
        let productos = event.target.result;
        productos.forEach(producto => {
            let li = document.createElement('li');
            li.textContent = `${producto.nombre} - Q${producto.precio} (${producto.cantidad})`;
            carrito.appendChild(li);
        });
    };
}

// Confirmar compra (sin cambios)
document.getElementById('confirmar-compra')?.addEventListener('click', function() {
    let transaction = db.transaction(['productos'], 'readwrite');
    let objectStore = transaction.objectStore('productos');
    let request = objectStore.clear();

    request.onsuccess = function() {
        alert('Compra confirmada');
        mostrarCarrito();
    };
});
