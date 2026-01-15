/**
 * SafarSorted Destination Details Script
 * Handles tab navigation, smooth scrolling, and scroll spy for destination pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation
    const tabs = document.querySelectorAll('.dest-tab');

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.dataset.tab;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offset = 150; // Account for sticky headers
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Update active tab on scroll
    window.addEventListener('scroll', () => {
        const sections = ['overview', 'itinerary', 'inclusions', 'gallery'];
        const scrollPos = window.scrollY + 200;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    tabs.forEach(t => t.classList.remove('active'));
                    const activeTab = document.querySelector(`.dest-tab[data-tab="${sectionId}"]`);
                    if (activeTab) activeTab.classList.add('active');
                }
            }
        });
    });
});
