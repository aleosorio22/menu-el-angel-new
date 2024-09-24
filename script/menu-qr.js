// Función para obtener el menú automáticamente según la hora actual
function getMenuBasedOnTime() {
    const currentHour = new Date().getHours();

    console.log('Hora actual:', currentHour); 

    // Horarios para cada menú
    if ((currentHour >= 0 && currentHour < 11) || (currentHour === 10 && currentMinute < 59)) {
        console.log('Cargando menú de desayunos');
        return 'desayunos';  // 12:00 AM - 10:59 AM
    } else if (currentHour === 11 && currentMinute >= 0 && currentMinute < 30) {
        console.log('Cargando menú de refacciones');
        return 'refacciones';  // 11:00 AM - 11:30 AM (Solo refacciones)
    } else if ((currentHour === 11 && currentMinute >= 30) || (currentHour >= 12 && currentHour < 15)) {
        console.log('Cargando menú de almuerzos y refacciones');
        return ['almuerzos', 'refacciones'];  // 11:30 AM - 3:00 PM (Ambos menús)
    } else if (currentHour >= 15 && currentHour < 24) {
        console.log('Cargando menú de refacciones hasta cierre');
        return 'refacciones';  // 3:00 PM - 11:59 PM (Solo refacciones)
    } else {
        return 'desayunos';  // Fallback a desayunos por seguridad
    }
}

// Cargar el menú desde el archivo JSON correspondiente
async function fetchMenuData() {
    try {
        const menuType = getMenuBasedOnTime();  // Obtener el tipo de menú según la hora
        let menuFiles = [];

        // Si `menuType` es un array, cargamos ambos menús
        if (Array.isArray(menuType)) {
            menuType.forEach(type => {
                if (type === 'almuerzos') {
                    menuFiles.push('../data/almuerzos.json');
                } else if (type === 'refacciones') {
                    menuFiles.push('../data/refacciones.json');
                }
            });
        } else {
            // Si `menuType` es un string, seleccionamos un solo archivo
            if (menuType === 'desayunos') {
                menuFiles.push('../data/desayunos.json');
            } else if (menuType === 'refacciones') {
                menuFiles.push('../data/refacciones.json');
            } else if (menuType === 'almuerzos') {
                menuFiles.push('../data/almuerzos.json');
            }
        }

        let menuItems = [];

        // Cargar los archivos de menú
        for (const file of menuFiles) {
            const menuResponse = await fetch(file);
            const menuData = await menuResponse.json();
            menuItems = menuItems.concat(Object.values(menuData)[0]);  // Combinar los menús
        }

        console.log('Datos del menú cargado:', menuItems);

        // Ahora cargamos el archivo de bebidas y postres
        const extrasResponse = await fetch('../data/bebidas_y_postres.json');
        const extrasData = await extrasResponse.json();
        
        // Combinamos el menú seleccionado con las bebidas y postres
        const combinedMenu = [...menuItems, ...extrasData.bebidas, ...extrasData.postres];

        console.log('Menú combinado:', combinedMenu);

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

    function updateScrollIndicators() {
        const canScrollLeft = menuNav.scrollLeft > 0;
        const canScrollRight = menuNav.scrollLeft < menuNav.scrollWidth - menuNav.clientWidth;

        fadeLeft.style.opacity = canScrollLeft ? '1' : '0';
        fadeRight.style.opacity = canScrollRight ? '1' : '0';
        
        // Siempre mostrar el indicador si hay contenido para desplazar
        if (menuNav.scrollWidth > menuNav.clientWidth) {
            scrollIndicator.style.opacity = '0.5';
        } else {
            scrollIndicator.style.opacity = '0';
        }
    }

    // Llamar a updateScrollIndicators inmediatamente después de que se cargue la página
    updateScrollIndicators();

    // Volver a llamar a updateScrollIndicators después de un breve retraso
    // para asegurarse de que todos los elementos se han renderizado correctamente
    setTimeout(updateScrollIndicators, 100);

    menuNav.addEventListener('scroll', updateScrollIndicators);
    window.addEventListener('resize', updateScrollIndicators);

    // En dispositivos móviles, ocultar el indicador después de 10 segundos
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            scrollIndicator.style.opacity = '0';
        }, 10000);
    }
});

// Inicializar el menú al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    createCategoryButtons();
});
