document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                menuToggle.innerHTML = '✕';
                menuToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });

        const navLinksClose = mainNav.querySelectorAll('a');
        navLinksClose.forEach(link => {
            link.addEventListener('click', () => {
                // Verifique se o menu está ativo e se o link é para a mesma página (âncora ou mesmo path)
                if (mainNav.classList.contains('active')) {
                    // Para links âncora ou links na mesma página, feche o menu
                    if (link.getAttribute('href').startsWith('#') || 
                        (link.pathname === window.location.pathname && link.origin === window.location.origin)) {
                        
                        // Se for um link para uma âncora na mesma página,
                        // ou um link para a mesma página (ex: empresa.html -> empresa.html)
                        // não previna o default se o link não for só '#'
                        if (link.getAttribute('href') !== '#') {
                             mainNav.classList.remove('active');
                             menuToggle.innerHTML = '☰';
                             menuToggle.setAttribute('aria-expanded', 'false');
                             menuToggle.setAttribute('aria-label', 'Abrir menu');
                        } else { // Se for um link href="#" apenas, previna o default e feche
                            event.preventDefault(); 
                            mainNav.classList.remove('active');
                            menuToggle.innerHTML = '☰';
                            menuToggle.setAttribute('aria-expanded', 'false');
                            menuToggle.setAttribute('aria-label', 'Abrir menu');
                        }
                    }
                    // Se for um link para uma página diferente, o menu será fechado pela recarga da página.
                    // No entanto, se a navegação for muito rápida (SPA-like, não é o caso aqui)
                    // ou se quiser garantir, pode-se adicionar lógica para fechar sempre.
                    // Mas para navegação tradicional, a recarga da página resolve.
                }
            });
        });
    }

    // --- Atualizar ano no rodapé ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Marcar link de navegação ativo ---
    const currentPagePath = window.location.pathname.split('/').pop() || 'index.html'; // Garante que a raiz seja 'index.html'
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        let linkPath = linkHref.split('/').pop().split('#')[0] || 'index.html'; // Garante que a raiz seja 'index.html'
        const linkHash = link.hash;

        link.classList.remove('active');

        // Verifica se o caminho do link corresponde ao caminho da página atual
        if (linkPath === currentPagePath) {
            // Se também houver um hash e ele corresponder, marca como ativo
            if (linkHash && linkHash === currentHash) {
                link.classList.add('active');
            // Se não houver hash no link E não houver hash na URL, marca como ativo (para páginas sem ancoragem)
            } else if (!linkHash && !currentHash) {
                link.classList.add('active');
            // Caso especial: Se a URL atual tiver um hash, mas o link for para a página base sem hash (ex: index.html#planos e o link é index.html)
            // e não for o link de "Planos" especificamente, o link da página base (Início) não deve ficar ativo se um hash específico estiver ativo.
            // A lógica abaixo já tenta lidar com isso, mas pode precisar de refinamento dependendo do comportamento exato desejado.
            } else if (!linkHash && currentHash && linkHref === 'index.html' && currentHash === '#planos' && linkPath === 'index.html' && linkHref !== 'index.html#planos') {
                // Não faz nada, para que "Início" não fique ativo se "#planos" está ativo
            }
        }
    });
    
    // Lógica adicional para garantir que "Início" fique ativo na home, a menos que um hash como #planos esteja ativo
    if (currentPagePath === 'index.html') {
        const inicioNavLink = document.querySelector('.main-nav a[href="index.html"]');
        const planosNavLink = document.querySelector('.main-nav a[href="index.html#planos"]');

        if (currentHash === '#planos' && planosNavLink) {
            if(inicioNavLink) inicioNavLink.classList.remove('active'); // Garante que Início não esteja ativo
            planosNavLink.classList.add('active');
        } else if (!currentHash && inicioNavLink) {
            if(planosNavLink) planosNavLink.classList.remove('active'); // Garante que Planos não esteja ativo
            inicioNavLink.classList.add('active');
        }
    }


    // --- Inicialização do Swiper para o Carrossel de Planos ---
    if (document.querySelector('.planos-swiper')) { 
        const planosSwiper = new Swiper('.planos-swiper', {
            loop: false, 
            grabCursor: true,
            
            slidesPerView: 1, 
            spaceBetween: 15,

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            breakpoints: {
                576: { 
                    slidesPerView: 1.8, 
                    spaceBetween: 20
                },
                768: { 
                    slidesPerView: 2.5, 
                    spaceBetween: 25
                },
                992: { 
                    slidesPerView: 3, 
                    spaceBetween: 30
                },
                1200: { 
                    slidesPerView: 3.5, 
                    spaceBetween: 30
                },
                1400: { 
                    slidesPerView: 4, 
                    spaceBetween: 30
                }
            }
        });
    }
    
    const contratarBtns = document.querySelectorAll('.plano-card .btn-primary');
    contratarBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            const planoCard = this.closest('.plano-card');
            const planoTituloElement = planoCard ? planoCard.querySelector('h3') : null;
            const planoTitulo = planoTituloElement ? planoTituloElement.textContent : "Plano Desconhecido";
            // console.log(`Botão "Assine Já" clicado para o ${planoTitulo}. Redirecionando para: ${this.href}`); // Comentado para não poluir console
        });
    });

});