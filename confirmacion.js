// Inicializar IndexedDB
let db;
let request = indexedDB.open('TiendaDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
};

request.onsuccess = function(event) {
    db = event.target.result;
    mostrarResumenCompra();
};

request.onerror = function(event) {
    console.log('Error al abrir la base de datos:', event.target.errorCode);
};

// Mostrar el resumen de la compra
function mostrarResumenCompra() {
    let transaction = db.transaction(['productos'], 'readonly');
    let objectStore = transaction.objectStore('productos');
    let request = objectStore.getAll();

    request.onsuccess = function(event) {
        let productos = event.target.result;
        let resumenCompra = document.getElementById('resumen-compra');
        resumenCompra.innerHTML = ''; // Limpiar la lista actual
        let total = 0;

        productos.forEach(producto => {
            // Calcula el precio total del producto basado en su cantidad
            let subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            let li = document.createElement('li');
            li.innerHTML = `
                ${producto.nombre} - Q${producto.precio.toFixed(2)} x ${producto.cantidad} = Q${subtotal.toFixed(2)}
                <button onclick="actualizarCantidad(${producto.id}, -1)">-</button>
                <button onclick="actualizarCantidad(${producto.id}, 1)">+</button>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            `;
            resumenCompra.appendChild(li);
        });

        document.getElementById('total').textContent = total.toFixed(2);
    };
}

// Actualizar la cantidad de un producto
function actualizarCantidad(id, cambio) {
    let transaction = db.transaction(['productos'], 'readwrite');
    let objectStore = transaction.objectStore('productos');
    let request = objectStore.get(id);

    request.onsuccess = function(event) {
        let producto = event.target.result;

        // Aumentar o disminuir la cantidad, pero no permitir cantidades negativas o cero
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            eliminarProducto(id);
        } else {
            let updateRequest = objectStore.put(producto);
            updateRequest.onsuccess = function() {
                mostrarResumenCompra();
            };
        }
    };
}

// Eliminar un producto del carrito
function eliminarProducto(id) {
    let transaction = db.transaction(['productos'], 'readwrite');
    let objectStore = transaction.objectStore('productos');
    let request = objectStore.delete(id);

    request.onsuccess = function() {
        mostrarResumenCompra();
    };
}

// Confirmar compra (sin cambios)
document.getElementById('confirmar-compra').addEventListener('click', function() {
    let transaction = db.transaction(['productos'], 'readwrite');
    let objectStore = transaction.objectStore('productos');
    let request = objectStore.clear();

    request.onsuccess = function() {
        alert('Compra confirmada');
        mostrarResumenCompra();
    };
});
