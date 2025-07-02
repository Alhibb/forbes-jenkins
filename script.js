document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('is-visible');
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1
    });

    const animatedElements = document.querySelectorAll('.main-header h1, .main-header .subtitle, .blog-post h2, .blog-post h3, .note-block, .note-block h3, .note-block p, .aws-notes h2, .aws-notes li');
    animatedElements.forEach(el => {
        el.classList.remove('is-visible');
        observer.observe(el);
    });
});