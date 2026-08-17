// Script para a Landing Page corporativa da OathIA

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling para os links da navbar
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Ajuste para não ficar embaixo da navbar fixa
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Interceptação do formulário (Envio real para o Netlify Forms)
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            const formData = new FormData(contactForm);
            
            // Obrigatório para o Netlify reconhecer o AJAX
            formData.append('form-name', contactForm.getAttribute('name'));
            
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                btn.innerText = 'Mensagem Enviada!';
                btn.style.backgroundColor = '#24a148'; // Verde sucesso padrão corporativo
                btn.style.borderColor = '#24a148';
                btn.style.opacity = '1';
                
                contactForm.reset();
                
                // Retorna ao estado original após 3 segundos
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch((error) => {
                btn.innerText = 'Erro de Conexão';
                btn.style.backgroundColor = '#da1e28'; // Vermelho erro
                btn.style.borderColor = '#da1e28';
                btn.style.opacity = '1';
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }
});
