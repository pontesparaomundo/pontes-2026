function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (!sidebar || !overlay) return;

    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

function initializeDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    dateElement.textContent = new Date().toLocaleDateString('pt-BR', options).replace(/^\w/, c => c.toUpperCase());
}

function markActiveNavigation() {
    const activePage = document.body.dataset.activePage;
    if (!activePage) return;

    document.querySelectorAll('#nav-menu a[data-page]').forEach(link => {
        const isActive = link.dataset.page === activePage;

        link.classList.toggle('nav-active', isActive);
        if (isActive) {
            link.classList.remove('text-gray-200');
            link.classList.add('text-[#075985]');
        } else {
            link.classList.add('text-gray-200');
            link.classList.remove('text-[#075985]');
        }
    });
}

function wireMobileNavigation() {
    if (window.innerWidth >= 768) return;

    document.querySelectorAll('#nav-menu a[data-page]').forEach(link => {
        link.addEventListener('click', () => {
            const overlay = document.getElementById('mobile-overlay');
            if (!overlay || overlay.classList.contains('hidden')) return;
            toggleMenu();
        });
    });
}

async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    try {
        const response = await fetch('sidebar.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        sidebarContainer.innerHTML = await response.text();
        markActiveNavigation();
        wireMobileNavigation();
    } catch (error) {
        console.error('Erro ao carregar sidebar:', error);
        sidebarContainer.innerHTML = '<div class="p-4 text-sm text-gray-500">Menu indisponível.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDate();
    loadSidebar();
});
