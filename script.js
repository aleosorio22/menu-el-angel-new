document.addEventListener('DOMContentLoaded', function() {
    // Navbar color change on scroll
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '0';
            }
        } else {
            navbar.classList.remove('navbar-scrolled');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (mobileMenuButton && navbarCollapse) {
        mobileMenuButton.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navbarCollapse.contains(event.target) || mobileMenuButton.contains(event.target);
        if (!isClickInside && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });

    // Add animation to sections when they come into view
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

     // Load content from JSON
     fetch('data/index.json')
        .then(response => response.json())
        .then(data => {
            loadCarouselContent('cakesContainer', data.pasteles, createCakeItem);
            loadCarouselContent('bakeryContainer', data.panaderia, createBakeryItem);
            loadCarouselContent('pastryContainer', data.reposteria, createPastryItem);
        })
        .catch(error => console.error('Error loading JSON:', error));

    function loadCarouselContent(containerId, items, createItemFunc) {
        const container = document.getElementById(containerId);
        items.forEach((item, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item${index === 0 ? ' active' : ''}`;
            carouselItem.innerHTML = createItemFunc(item);
            container.appendChild(carouselItem);
        });
    }

    function createCakeItem(cake) {
        return `
            <div class="cake-item">
                <img src="${cake.imagen}" alt="${cake.nombre}" class="d-block w-100">
                <div class="cake-description">
                    <h3>${cake.nombre}</h3>
                    <p>${cake.descripcion}</p>
                    <p>Sabores: ${cake.sabores}</p>
                    <p>Porciones: ${cake.porciones}</p>
                    <p>Precio: Q${cake.precio}</p>
                    <button type="button" class="btn btn-primary btn-reserve-cake" 
                        data-nombre="${cake.nombre}" 
                        data-sabores="${cake.sabores}" 
                        data-porciones="${cake.porciones}" 
                        data-precio="${cake.precio}">
                        Ordenar
                    </button>
                </div>
            </div>
        `;
    }

    function createPastryItem(pastryItem) {
        return `
            <div class="pastry-item">
                <img src="${pastryItem.imagen}" alt="${pastryItem.nombre}" class="d-block w-100">
                <div class="pastry-description">
                    <h3>${pastryItem.nombre}</h3>
                    <p>${pastryItem.descripcion}</p>
                    <p>Precio: Q${pastryItem.precio}</p>
                    <button type="button" class="btn btn-primary btn-reserve-pastry" data-nombre="${pastryItem.nombre}">
                        Ordenar
                    </button>
                </div>
            </div>
        `;
    }

    function createBakeryItem(bakeryItem) {
        return `
            <div class="bakery-item">
                <img src="${bakeryItem.imagen}" alt="${bakeryItem.nombre}" class="d-block w-100">
                <div class="bakery-description">
                    <h3>${bakeryItem.nombre}</h3>
                    <p>${bakeryItem.descripcion}</p>
                </div>
            </div>
        `;
    }

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Image gallery modal (if implemented)
    const galleryImages = document.querySelectorAll('.bakery-gallery img, .pastry-gallery img');
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close');

    if (galleryImages.length > 0 && modal && modalImg && closeModal) {
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                modal.style.display = "block";
                modalImg.src = this.src;
            });
        });

        closeModal.addEventListener('click', function() {
            modal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');
    const indicators = carousel.querySelector('.carousel-indicators');

    let currentIndex = 0;

    // Create indicators
    carouselItems.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateIndicators();
    }

    function updateIndicators() {
        const activeIndicator = indicators.querySelector('.active');
        if (activeIndicator) activeIndicator.classList.remove('active');
        indicators.children[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        updateCarousel();
    }

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Auto-advance carousel
    setInterval(nextSlide, 10000);
});