document.addEventListener("DOMContentLoaded", function () {
    const ordenarProductos = document.getElementById("ordenar-productos");
    const selectCategoria = document.getElementById("filtro-categoria"); // Añadimos el selector de categoría

    // Función para actualizar el contador de la cesta
    function actualizarContadorCesta() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalProductos = carrito.reduce((suma, item) => suma + item.cantidad, 0);
        if (contadorCesta) {
            contadorCesta.textContent = totalProductos;
        }
    }

    // Función para actualizar la visualización de la cesta
    function actualizarCesta() {
        if (contenedorCesta) {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // Filtrar productos válidos y descartar los nulos
            carrito = carrito.filter(producto => producto && producto.id && producto.nombre && producto.precio && producto.imagen);

            if (carrito.length === 0) {
                contenedorCesta.innerHTML = "<p>La cesta está vacía.</p>";
                localStorage.removeItem("carrito"); // Limpiar el carrito si está vacío
            } else {
                contenedorCesta.innerHTML = ""; // Limpiar el contenedor antes de renderizar

                carrito.forEach(producto => {
                    const item = document.createElement("div");
                    item.classList.add("grid-item");

                    item.innerHTML = `
                        <div class="image-text-container">
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="grid-image">
                            <div class="grid-text">
                                <h3>${producto.nombre}</h3>
                                <p><span class="cantidad">${producto.cantidad}</span> x ${producto.precio}€</p>
                                <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
                            </div>
                        </div>
                    `;
                    contenedorCesta.appendChild(item);
                });

                // Calcular y mostrar el total
                const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
                const totalElemento = document.createElement("p");
                totalElemento.innerHTML = `<strong>Total: ${total.toFixed(2)}€</strong>`;
                contenedorCesta.appendChild(totalElemento);
            }
        }
    }

    // Función para ordenar los productos
    function ordenarProductosPorCriterio(productos, criterio) {
        switch (criterio) {
            case "precio-alto":
                return productos.sort((a, b) => b.precio - a.precio);
            case "precio-bajo":
                return productos.sort((a, b) => a.precio - b.precio);
            case "alfabetico":
                return productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            default:
                return productos;
        }
    }

    // Función para renderizar los productos ordenados
    function renderizarProductosOrdenados() {
        const gridContainer = document.querySelector(".grid-container");
        if (!gridContainer) return; // Asegurarse de que el contenedor existe

        const productos = Array.from(gridContainer.querySelectorAll(".grid-item"));
        const criterio = ordenarProductos.value;

        // Obtener los datos de los productos
        const productosData = productos.map(producto => {
            return {
                elemento: producto,
                precio: parseFloat(producto.querySelector(".grid-text h3").textContent.match(/\d+/)[0]),
                nombre: producto.querySelector(".grid-text h3").textContent
            };
        });

        // Ordenar los productos
        const productosOrdenados = ordenarProductosPorCriterio(productosData, criterio);

        // Limpiar el contenedor antes de renderizar
        gridContainer.innerHTML = "";

        // Renderizar los productos ordenados
        productosOrdenados.forEach(producto => {
            gridContainer.appendChild(producto.elemento);
        });
    }

    // Función para buscar productos
    function buscarProductos() {
        const textoBusqueda = barraBusqueda.value.toLowerCase();
        const gridContainer = document.querySelector(".grid-container");
        if (!gridContainer) return; // Asegurarse de que el contenedor existe

        const productos = Array.from(gridContainer.querySelectorAll(".grid-item"));

        productos.forEach(producto => {
            const nombreProducto = producto.querySelector(".grid-text h3").textContent.toLowerCase();
            if (nombreProducto.includes(textoBusqueda)) {
                producto.style.display = ""; // Mostrar el producto
            } else {
                producto.style.display = "none"; // Ocultar el producto
            }
        });
    }

    // Función para filtrar productos por categoría
    function filtrarPorCategoria() {
        const categoriaSeleccionada = selectCategoria.value.toLowerCase();
        console.log("Categoría seleccionada:", categoriaSeleccionada);
    
        const gridContainer = document.querySelector(".grid-container");
        if (!gridContainer) return;
    
        const productos = Array.from(gridContainer.querySelectorAll(".grid-item"));
    
        productos.forEach(producto => {
            const categoriaProducto = producto.getAttribute("data-categoria").toLowerCase();
            console.log("Categoría del producto:", categoriaProducto);
    
            if (categoriaSeleccionada === "todos" || categoriaProducto === categoriaSeleccionada) {
                producto.style.display = "";
            } else {
                producto.style.display = "none";
            }
        });
    }

    // Evento para ordenar los productos cuando se cambia la opción
    if (ordenarProductos) {
        ordenarProductos.addEventListener("change", renderizarProductosOrdenados);
    }

    // Evento para buscar productos cuando se escribe en la barra de búsqueda
    if (barraBusqueda) {
        barraBusqueda.addEventListener("input", buscarProductos);
    }

    // Evento para filtrar productos por categoría
    if (selectCategoria) {
        selectCategoria.addEventListener("change", filtrarPorCategoria);
    }

    // Inicializar contador de la cesta y actualizarla
    actualizarContadorCesta();
    actualizarCesta();

    // Agregar productos a la cesta
    document.querySelectorAll(".añadirCesta").forEach(boton => {
        boton.addEventListener("click", () => {
            const producto = {
                id: boton.getAttribute("data-id"),
                nombre: boton.getAttribute("data-nombre"),
                precio: parseFloat(boton.getAttribute("data-precio")),
                imagen: boton.getAttribute("data-imagen"),
                cantidad: 1
            };

            // Validar que el producto no tenga valores nulos
            if (producto.id && producto.nombre && producto.precio && producto.imagen) {
                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                const productoExistente = carrito.find(item => item.id === producto.id);

                if (productoExistente) {
                    productoExistente.cantidad++;
                } else {
                    carrito.push(producto);
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));
                alert(`${producto.nombre} añadido a la cesta`);
                actualizarContadorCesta();
                actualizarCesta();
            } else {
                alert("Error: El producto no tiene información válida.");
            }
        });
    });
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '&#9776;';
        document.querySelector('.header-content').appendChild(menuToggle);
    
        menuToggle.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('active');
        });
    });
    // Eliminar productos de la cesta
    contenedorCesta?.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-producto")) {
            const productoId = e.target.getAttribute("data-id");
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // Filtrar solo productos válidos
            carrito = carrito.filter(producto => producto && producto.id && producto.nombre && producto.precio && producto.imagen);

            // Buscar índice del producto
            const productoIndex = carrito.findIndex(item => item.id === productoId);
            if (productoIndex !== -1) {
                if (carrito[productoIndex].cantidad > 1) {
                    carrito[productoIndex].cantidad--;
                } else {
                    carrito.splice(productoIndex, 1);
                }

                // Guardar cambios en localStorage o limpiarlo si está vacío
                if (carrito.length > 0) {
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                } else {
                    localStorage.removeItem("carrito");
                }

                // Volver a actualizar todo
                actualizarContadorCesta();
                actualizarCesta();
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsLimpieza = parseInt(localStorage.getItem('itemsLimpieza')) || 0;

    const contadorLimpieza = document.querySelector('#contadorLimpieza');
    if (contadorLimpieza) {
        contadorLimpieza.textContent = itemsLimpieza;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsCheks = parseInt(localStorage.getItem('itemsCheks')) || 0;

    const contadorCheks = document.querySelector('#contadorCheks');
    if (contadorCheks) {
        contadorCheks.textContent = itemsCheks;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsDecoracion = parseInt(localStorage.getItem('itemsDecoracion')) || 0;

    const contadorDecoracion = document.querySelector('#contadorDecoracion');
    if (contadorDecoracion) {
        contadorDecoracion.textContent = itemsDecoracion;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsDormitorio = parseInt(localStorage.getItem('itemsDormitorio')) || 0;
    const itemsDetallesCama = parseInt(localStorage.getItem('itemsDetallesCama')) || 0;

    const totalItems = itemsDormitorio + itemsDetallesCama;

    const contadorDormitorio = document.querySelector('#contadorDormitorio');
    if (contadorDormitorio) {
        contadorDormitorio.textContent = totalItems;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsHigiene = parseInt(localStorage.getItem('itemsHigiene')) || 0;
    const itemsDetallesHigiene = parseInt(localStorage.getItem('itemsDetallesHigiene')) || 0;

    const totalItems = itemsHigiene + itemsDetallesHigiene;

    const contadorHigiene = document.querySelector('#contadorHigiene');
    if (contadorHigiene) {
        contadorHigiene.textContent = totalItems;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsCocina = parseInt(localStorage.getItem('itemsCocina')) || 0;
    const itemsDetallesKitDeCocina = parseInt(localStorage.getItem('itemsDetallesKitDeCocina')) || 0;
    const itemsDetallesMenaje = parseInt(localStorage.getItem('itemsDetallesMenaje')) || 0;

    const totalItems = itemsCocina + itemsDetallesKitDeCocina + itemsDetallesMenaje;

    const contadorCocina = document.querySelector('#contadorCocina');
    if (contadorCocina) {
        contadorCocina.textContent = totalItems;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const itemsToallas = parseInt(localStorage.getItem('itemsToallas')) || 0;

    const contadorToallas = document.querySelector('#contadorToallas');
    if (contadorToallas) {
        contadorToallas.textContent = itemsToallas;
    }
});