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

function getSidebarTemplate() {
    return `
<aside id="sidebar" class="fixed md:relative inset-y-0 left-0 w-64 bg-[#075985] text-white flex flex-col shadow-xl z-30 h-screen md:h-auto transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out md:transition-none">
    <div class="p-6 flex justify-between items-center">
        <div>
            <h1 class="text-xl font-bold tracking-wider">PONTES 2026</h1>
            <p class="text-xs text-[#E0F2FE] mt-1 opacity-80">Gestão de Intercâmbio</p>
        </div>
        <button onclick="toggleMenu()" class="md:hidden text-[#E0F2FE] hover:text-white" aria-label="Fechar menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>

    <nav class="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar" id="nav-menu">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-2 px-2">Navegação Geral</p>

        <a href="dashboard.html" data-page="dashboard" class="nav-item flex items-center px-2 py-2.5 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">🏠</span> <span class="font-medium text-sm">Dashboard</span>
        </a>
        <a href="selecao.html" data-page="selecao" class="nav-item flex items-center px-2 py-2.5 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">🎯</span> <span class="font-medium text-sm">Seleção e Edital</span>
        </a>
        <a href="contratos.html" data-page="contratos" class="nav-item flex items-center px-2 py-2.5 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">📋</span> <span class="font-medium text-sm">Contratos e Termos de Referência</span>
        </a>
        <a href="destinos.html" data-page="destinos" class="nav-item flex items-center px-2 py-2.5 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">🌍</span> <span class="font-medium text-sm">Países e Instituições de Ensino</span>
        </a>
        <a href="governanca.html" data-page="governanca" class="nav-item flex items-center px-2 py-2.5 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">🛡️</span> <span class="font-medium text-sm">Informações úteis</span>
        </a>

        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-2 px-2">Acesso Rápido</p>
        <a href="planilha.html" data-page="planilha" class="nav-item flex items-center px-2 py-2 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">📊</span> <span class="font-medium text-sm">Planilha Mestre</span>
        </a>
        <a href="#" target="_blank" class="nav-item flex items-center px-2 py-2 rounded-lg text-gray-200">
            <span class="mr-3 text-lg">📁</span> <span class="font-medium text-sm">Drive (Modelos)</span>
        </a>
    </nav>

    <div class="p-4 bg-[#064e73] text-xs text-center border-t border-[#0c6b9e]">
        Acesso: <strong>@edu.se.df.gov.br</strong>
    </div>
</aside>
`;
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

function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = getSidebarTemplate();
    markActiveNavigation();
    wireMobileNavigation();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDate();
    loadSidebar();
});
