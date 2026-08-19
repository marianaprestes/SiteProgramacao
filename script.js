document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MENU MOBILE (Hambúrguer)
    // ==========================================
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Alterna ícone entre barras e X
        const icon = menuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.querySelector('i').classList.remove('fa-xmark');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // ==========================================
    // 2. ANIMAÇÃO AO ROLAR (Scroll Animation)
    // ==========================================
    const observerOptions = {
        threshold: 0.15, // Dispara quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // ==========================================
    // 3. SIMULADOR DE CUSTOS E ECONOMIA
    // ==========================================
    const simulatorForm = document.getElementById('simulatorForm');
    const resultBox = document.getElementById('simulatorResult');

    simulatorForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Captura dos valores
        const poolSize = parseFloat(document.getElementById('poolSize').value);
        const systemType = document.getElementById('systemType').value;
        const ledCount = parseInt(document.getElementById('ledCount').value);

        // Lógica de cálculo (Valores estimados para o projeto escolar)
        let custoAquecimento = 0;
        let economiaMensal = 0; // Economia comparada ao sistema elétrico puro
        let payback = 0;

        // Custos base por m² (valores didáticos)
        if (systemType === 'solar') {
            custoAquecimento = poolSize * 250; // Ex: R$ 250 por m²
            economiaMensal = poolSize * 15;    // Economia alta
            payback = (custoAquecimento / (economiaMensal * 12)).toFixed(1);
        } else if (systemType === 'bomba') {
            custoAquecimento = poolSize * 400; 
            economiaMensal = poolSize * 10;    // Economia média
            payback = (custoAquecimento / (economiaMensal * 12)).toFixed(1);
        } else {
            custoAquecimento = poolSize * 100;
            economiaMensal = 0; // Sistema elétrico é a base de comparação
            payback = "N/A";
        }

        // Custo LED (aprox. R$ 150 por luminária instalada)
        const custoLED = ledCount * 150;
        const economiaMensalLED = ledCount * 12; // Economia vs incandescente

        // Totais
        const investimentoTotal = custoAquecimento + custoLED;
        const economiaTotalMensal = economiaMensal + economiaMensalLED;
        const economia5Anos = economiaTotalMensal * 12 * 5;

        // Formatação para Real Brasileiro
        const formatarMoeda = (valor) => {
            return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        // Atualização do DOM
        document.getElementById('resInvestimento').textContent = formatarMoeda(investimentoTotal);
        document.getElementById('resEconomia').textContent = formatarMoeda(economiaTotalMensal) + "/mês";
        document.getElementById('resPayback').textContent = payback === "N/A" ? "N/A" : `${payback} anos`;
        document.getElementById('resEconomia5anos').textContent = formatarMoeda(economia5Anos);

        // Mostrar resultado com animação suave
        resultBox.classList.remove('hidden');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // ==========================================
    // 4. HEADER TRANSPARENTE AO ROLAR
    // ==========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }
    });
});
