// Función para obtener los parámetros de la URL
function getMenuFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('menu');  // Devolver el valor del parámetro 'menu'
}

// Cargar el menú desde el archivo JSON correspondiente
async function fetchMenuData() {
    try {
        const menuType = getMenuFromURL(); // Obtenemos el tipo de menú de la URL
        let menuFile = '';
        
        // Seleccionamos el archivo JSON correcto según el parámetro de la URL
        if (menuType === 'desayunos') {
            menuFile = 'data/desayunos.json';
        } else if (menuType === 'refacciones') {
            menuFile = 'data/refacciones.json';
        } else if (menuType === 'almuerzos') {
            menuFile = 'data/almuerzos.json';
        } else {
            menuFile = 'data/desayunos.json';  // Fallback a desayunos si no se pasa parámetro
        }
        
        const menuResponse = await fetch(menuFile);
        const menuData = await menuResponse.json();
        const menuItems = Object.values(menuData)[0];  // Devolver solo el array de productos del menú

        // Ahora cargamos el archivo de bebidas y postres
        const extrasResponse = await fetch('data/bebidas_y_postres.json');
        const extrasData = await extrasResponse.json();
        
        // Combinamos el menú seleccionado con las bebidas y postres
        const combinedMenu = [...menuItems, ...extrasData.bebidas, ...extrasData.postres];

        return combinedMenu;  // Devolver el menú combinado
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// Crear los botones de categorías dinámicamente
async function createCategoryButtons() {
    const menuData = await fetchMenuData();
    const categories = [...new Set(menuData.map(item => item.categoria))];  // Extraer categorías únicas
    const menuNav = document.getElementById('menu-nav');
    menuNav.innerHTML = ''; // Limpiar botones existentes
    
    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.textContent = category || 'Sin Categoría';  // Muestra 'Sin Categoría' si está vacía
        button.classList.add('category-btn');
        if (index === 0) button.classList.add('active');
        button.addEventListener('click', () => showCategory(menuData, category));
        menuNav.appendChild(button);
    });

    // Mostrar la primera categoría por defecto
    showCategory(menuData, categories[0]);
}

// Mostrar los elementos de una categoría seleccionada
function showCategory(menuData, category) {
    const menuItems = document.getElementById('menu-items');
    menuItems.innerHTML = ''; // Limpiar elementos existentes
    
    const filteredItems = menuData.filter(item => item.categoria === category);
    const menuItemsContainer = document.createElement('div');
    menuItemsContainer.classList.add('menu-items-container');
    
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item', 'fade-in');
        itemElement.innerHTML = `
            <div class="menu-item-image-container">
                <img src="img/${item.imagen}" alt="${item.nombre}" class="menu-item-image">
            </div>
            <div class="menu-item-info">
                <h3 class="menu-item-name">${item.nombre}</h3>
                <p class="menu-item-description">${item.descripcion}</p>
                <p class="menu-item-price">Q${item.precio.toFixed(2)}</p>
                <button class="view-more-btn">Ver más</button>
            </div>
        `;
        menuItemsContainer.appendChild(itemElement);
        
        const viewMoreBtn = itemElement.querySelector('.view-more-btn');
        viewMoreBtn.addEventListener('click', () => showItemDetails(item));
    });
    
    menuItems.appendChild(menuItemsContainer);

    // Actualizar el botón activo
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) btn.classList.add('active');
    });
}

// Mostrar detalles de un elemento en el modal
function showItemDetails(item) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2>${item.nombre}</h2>
        <div style="width: 100%; max-width: 400px; aspect-ratio: 1 / 1; margin: 0 auto 1rem; overflow: hidden;">
            <img src="img/${item.imagen}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <p>${item.descripcion}</p>
        <p><strong>Precio:</strong> Q${item.precio.toFixed(2)}</p>
    `;
    modal.style.display = 'block';
     // Agregar eventos de cierre del modal
     setupModalEvents(modal);
}

// Función para configurar los eventos del modal
function setupModalEvents(modal) {
    const closeButton = document.querySelector('.close');
    
    // Cerrar modal al hacer clic en el botón de cerrar
    closeButton.addEventListener('click', closeModal);

    // También agregar evento touchstart para móviles
    closeButton.addEventListener('touchstart', closeModal);

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Agregar soporte para eventos táctiles en móviles
    window.addEventListener('touchstart', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const menuNav = document.getElementById('menu-nav');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const fadeLeft = document.querySelector('.fade-left');
    const fadeRight = document.querySelector('.fade-right');
    let scrollIndicatorTimeout;

    function updateScrollIndicators() {
        const canScrollLeft = menuNav.scrollLeft > 0;
        const canScrollRight = menuNav.scrollLeft < menuNav.scrollWidth - menuNav.clientWidth;

        fadeLeft.style.opacity = canScrollLeft ? '1' : '0';
        fadeRight.style.opacity = canScrollRight ? '1' : '0';

        // Mostrar el indicador si hay contenido para desplazar
        if (menuNav.scrollWidth > menuNav.clientWidth) {
            scrollIndicator.style.opacity = '0.5';
        } else {
            scrollIndicator.style.opacity = '0';
        }

        // Configurar el temporizador para ocultar el indicador después de 3 segundos
        clearTimeout(scrollIndicatorTimeout); // Limpiar cualquier temporizador anterior
        scrollIndicatorTimeout = setTimeout(() => {
            scrollIndicator.style.opacity = '0';
        }, 4000);
    }

    // Llamar a updateScrollIndicators inmediatamente después de que se cargue la página
    updateScrollIndicators();

    // Volver a llamar a updateScrollIndicators después de un breve retraso
    setTimeout(updateScrollIndicators, 100);

    menuNav.addEventListener('scroll', updateScrollIndicators);
    window.addEventListener('resize', updateScrollIndicators);
});

// Inicializar el menú
document.addEventListener('DOMContentLoaded', () => {
    createCategoryButtons();
});
