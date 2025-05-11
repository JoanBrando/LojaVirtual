document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const scrollSections = document.querySelectorAll('.scroll-effect');
    const scrollItems = document.querySelectorAll('.scroll-effect-item');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const navbar = document.querySelector('.navbar');

    let cart = []; // Array para armazenar itens do carrinho

    // Menu responsivo
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Altera o ícone do menu hamburguer
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Fechar menu ao clicar em um link (para mobile)
    document.querySelectorAll('.nav-links a:not(.dropbtn)').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Efeito de rolagem para seções
    const animateOnScroll = (elements) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Para animar apenas uma vez
                }
            });
        }, { threshold: 0.1 }); // A animação começa quando 10% do elemento está visível

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    if (scrollSections.length > 0) {
        animateOnScroll(scrollSections);
    }
    if (scrollItems.length > 0) {
        animateOnScroll(scrollItems);
    }

    // Mudar background do navbar ao rolar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'var(--bg-color)';
            navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        }
    });

    // Funcionalidade do Carrinho (básica)
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Limpa os itens atuais
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            checkoutBtn.style.display = 'none';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                // A imagem do produto no carrinho pode ser adicionada aqui se você tiver URLs de imagem para os itens do carrinho
                // <img src="${item.image || 'img/placeholder.jpg'}" alt="${item.name}">
                cartItemElement.innerHTML = `
                    <div class="cart-item-details">
                        <p><strong>${item.name}</strong></p>
                        <p>R$ ${parseFloat(item.price).toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remover</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                total += item.price * item.quantity;
            });
            checkoutBtn.style.display = 'block';
        }

        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        totalPriceElement.textContent = total.toFixed(2);

        // Adiciona event listeners aos botões de remover
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                removeItemFromCart(itemId);
            });
        });
    }

    function addItemToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartDisplay();
        // Feedback visual ao adicionar ao carrinho
        showCartFeedback(`"${item.name}" adicionado ao carrinho!`);
    }

    function removeItemFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartDisplay();
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            const name = event.target.dataset.name;
            const price = parseFloat(event.target.dataset.price);
            // const image = event.target.closest('.product-card').querySelector('img').src; // Para adicionar imagem ao carrinho
            addItemToCart({ id, name, price });
        });
    });

    // Feedback visual (Ex: Toast message simples)
    function showCartFeedback(message) {
        const feedbackElement = document.createElement('div');
        feedbackElement.classList.add('cart-feedback');
        feedbackElement.textContent = message;
        document.body.appendChild(feedbackElement);

        setTimeout(() => {
            feedbackElement.classList.add('show');
        }, 10); // Pequeno delay para garantir a transição

        setTimeout(() => {
            feedbackElement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(feedbackElement);
            }, 300); // Tempo para a transição de saída
        }, 2000); // Mensagem visível por 2 segundos
    }

    // Estilo para o feedback (adicionar ao CSS ou aqui se preferir)
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .cart-feedback {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px); /* Começa fora da tela */
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            font-size: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        .cart-feedback.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    // Inicializar a exibição do carrinho
    updateCartDisplay();
});
