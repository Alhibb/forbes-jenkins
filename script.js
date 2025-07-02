document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const headerLogo = document.querySelector('.animated-logo');
    const heroImage = document.querySelector('.animated-image');

    if (headerLogo) {
        headerLogo.style.animation = 'bounceIn 1s ease-out forwards';
    }
    if (heroImage) {
        heroImage.style.animation = 'floatImage 4s ease-in-out infinite';
    }
});