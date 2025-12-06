document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleccionar todos los botones de filtro y las tarjetas de producto
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // 2. Añadir un 'event listener' a cada botón de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover la clase 'active' de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir la clase 'active' al botón clickeado
            button.classList.add('active');

            // Obtener la categoría del botón clickeado
            const category = button.getAttribute('data-category');
            
            // 3. Iterar sobre las tarjetas de producto para filtrar
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Si la categoría es 'all' (Todo) o si la categoría de la tarjeta coincide
                if (category === 'all' || cardCategory === category) {
                    // Mostrar la tarjeta
                    card.classList.remove('hidden');
                } else {
                    // Ocultar la tarjeta
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // NOTA: Para implementar completamente el formulario del club o el carrito,
    // necesitarías código JS más complejo para manejar la interacción con el servidor.
});