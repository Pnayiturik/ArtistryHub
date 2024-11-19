<script>
document.addEventListener("DOMContentLoaded", function() {
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 100) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // Carousel functionality
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    let currentIndex = 0;

    function showSlide(index) {
        if (slides.length > 0 && dots.length > 0) {
            const offset = -index * 100;
            document.querySelector(".carousel-content").style.transform = `translateX(${offset}%)`;
            dots.forEach(dot => dot.classList.remove("active"));
            dots[index].classList.add("active");
        }
    }

    // Event listeners for navigation buttons
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            showSlide(currentIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // Initialize the carousel to the first slide
    showSlide(currentIndex);
});
</script>

