// Inicialização do AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. NAVEGAÇÃO E SCROLL SUAVE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');

    // Menu Mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Header scroll effect & Back to Top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (backToTopBtn) backToTopBtn.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if (backToTopBtn) backToTopBtn.classList.remove('visible');
        }
    });

    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ==========================================
    // 2. ANIMAÇÃO DOS NÚMEROS (STATS)
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    let suffix = target === 16 ? 'M' : (target === 35 ? '°C' : (target === 100 ? '%' : '%'));
                    stat.innerText = target + suffix;
                }
            };
            updateCounter();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        statsObserver.observe(statNumbers[0].parentElement.parentElement);
    }

    // ==========================================
    // 3. GRÁFICOS (CHART.JS)
    // ==========================================
    if (typeof Chart !== 'undefined') {
        // Gráfico de Eficiência
        const heatingCtx = document.getElementById('heatingChart');
        if (heatingCtx) {
            new Chart(heatingCtx, {
                type: 'bar',
                data: {
                    labels: ['Aquecimento Solar', 'Bomba de Calor', 'Aquecedor Elétrico'],
                    datasets: [{ 
                        label: 'Eficiência Energética (%)', 
                        data: [75, 400, 95], 
                        backgroundColor: ['#0ea5e9', '#27ae60', '#ff6b35'],
                        borderRadius: 8
                    }]
                },
                options: { 
                    responsive: true, 
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 450 } }
                }
            });
        }

        // Gráfico de Economia Anual
        const savingsCtx = document.getElementById('savingsChart');
        if (savingsCtx) {
            new Chart(savingsCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [
                        { label: 'Sistema LED + Solar', data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50], borderColor: '#27ae60', backgroundColor: 'rgba(39, 174, 96, 0.1)', fill: true, tension: 0.4 },
                        { label: 'Sistema Tradicional', data: [450, 450, 500, 550, 600, 650, 700, 650, 600, 550, 500, 450], borderColor: '#ff6b35', backgroundColor: 'rgba(255, 107, 53, 0.1)', fill: true, tension: 0.4 }
                    ]
                },
                options: { 
                    responsive: true, 
                    scales: { y: { beginAtZero: true, title: { display: true, text: 'Custo Mensal (R$)' } } } 
                }
            });
        }

        // Gráfico de Sustentabilidade
        const sustainabilityCtx = document.getElementById('sustainabilityChart');
        if (sustainabilityCtx) {
            new Chart(sustainabilityCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Economia de Energia', 'Preservação Hídrica', 'Redução de Impacto'],
                    datasets: [{ data: [90, 30, 85], backgroundColor: ['#0ea5e9', '#27ae60', '#f1c40f'], borderWidth: 0 }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }
    }

    // ==========================================
    // 4. SIMULADOR DE CORES RGB (CORRIGIDO E APRIMORADO)
    // ==========================================
    const redSlider = document.getElementById('redChannel');
    const greenSlider = document.getElementById('greenChannel');
    const blueSlider = document.getElementById('blueChannel');
    const previewOverlay = document.getElementById('previewOverlay');
    const rgbText = document.getElementById('rgbText');
    const hexText = document.getElementById('hexText');
    const colorName = document.getElementById('colorName');

    function updateColorSimulator() {
        if (!redSlider || !greenSlider || !blueSlider) return;
        
        const r = parseInt(redSlider.value);
        const g = parseInt(greenSlider.value);
        const b = parseInt(blueSlider.value);
        
        // Atualiza displays de valor
        document.getElementById('redValue').innerText = r;
        document.getElementById('greenValue').innerText = g;
        document.getElementById('blueValue').innerText = b;
        
        // Atualiza cor e textos (Correção do bug de formatação Hex)
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
        
        if (previewOverlay) {
            previewOverlay.style.background = `rgba(${r}, ${g}, ${b}, 0.6)`;
        }
        if (rgbText) rgbText.innerText = `rgb(${r}, ${g}, ${b})`;
        if (hexText) hexText.innerText = hex;
        
        // Lógica de nome da cor
        if (r < 50 && g < 50 && b > 200) {
            colorName.innerText = "🔵 Azul - Modo Aquecimento";
            colorName.style.color = "#3498db";
        } else if (r < 50 && g > 200 && b < 50) {
            colorName.innerText = "🟢 Verde - Temperatura Ideal (28°C)";
            colorName.style.color = "#27ae60";
        } else if (r > 200 && g > 200 && b > 200) {
            colorName.innerText = "⚪ Branco Quente - Modo Seguro";
            colorName.style.color = "#f39c12";
        } else {
            colorName.innerText = "🎨 Cor Personalizada";
            colorName.style.color = "#9b59b6";
        }
    }

    if (redSlider) redSlider.addEventListener('input', updateColorSimulator);
    if (greenSlider) greenSlider.addEventListener('input', updateColorSimulator);
    if (blueSlider) blueSlider.addEventListener('input', updateColorSimulator);

    // Função global para os botões de preset
    window.setPreset = (r, g, b) => {
        if (redSlider) redSlider.value = r;
        if (greenSlider) greenSlider.value = g;
        if (blueSlider) blueSlider.value = b;
        updateColorSimulator();
    };

    // Função do botão "Iniciar Simulação"
    window.startSimulation = () => {
        updateColorSimulator();
        if (previewOverlay) {
            previewOverlay.style.transition = 'background 1.5s ease-in-out';
            // Pequeno efeito visual de confirmação
            previewOverlay.style.opacity = '0.8';
            setTimeout(() => {
                previewOverlay.style.opacity = '1';
            }, 100);
        }
        alert('✅ Simulação iniciada com sucesso! Observe a cor aplicada na imagem da piscina.');
    };

    // ==========================================
    // 5. PAINEL DE CONTROLE SIMULADO (CORRIGIDO)
    // ==========================================
    const simTemp = document.getElementById('simTemp');
    if (simTemp) {
        simTemp.addEventListener('input', () => {
            const temp = parseFloat(simTemp.value);
            const tempValueEl = document.getElementById('simTempValue');
            const poolTempDisplay = document.getElementById('poolTempDisplay');
            const ledStatus = document.getElementById('ledStatus');
            const ledStatusText = document.getElementById('ledStatusText');
            const poolWater = document.getElementById('poolWater');
            const tempoAquecimento = document.getElementById('tempoAquecimento');

            if (tempValueEl) tempValueEl.innerText = temp + '°C';
            if (poolTempDisplay) poolTempDisplay.innerText = temp + '°C';
            
            // Lógica de aquecimento (Azul -> Verde)
            if (temp < 28) {
                if (ledStatus) ledStatus.style.background = '#3498db';
                if (ledStatusText) ledStatusText.innerText = 'AZUL - Aquecendo';
                if (poolWater) poolWater.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
            } else {
                if (ledStatus) ledStatus.style.background = '#27ae60';
                if (ledStatusText) ledStatusText.innerText = 'VERDE - Temperatura Ideal';
                if (poolWater) poolWater.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';
            }
            
            // Cálculo estimado de tempo
            const diff = 28 - temp;
            const time = diff > 0 ? `~${Math.ceil(diff * 15)} min` : 'Pronta!';
            if (tempoAquecimento) tempoAquecimento.innerText = time;
        });
    }

    window.toggleSafeMode = () => {
        const safeModeToggle = document.getElementById('safeMode');
        const poolEdges = document.getElementById('poolEdges');
        if (safeModeToggle && poolEdges) {
            poolEdges.style.display = safeModeToggle.checked ? 'flex' : 'none';
        }
    };

    // Simulação de consumo oscilando
    setInterval(() => {
        const el = document.getElementById('consumoAtual');
        if (el && Math.random() > 0.6) {
            let val = parseFloat(el.innerText) || 23;
            el.innerText = (val + (Math.random() * 0.5 - 0.25)).toFixed(1) + 'W';
        }
    }, 3000);

    // ==========================================
    // 6. CALCULADORAS (CORRIGIDAS E FUNCIONAIS)
    // ==========================================
    window.calcSolarDimension = () => {
        const size = parseFloat(document.getElementById('calcPoolSize').value) || 50;
        const collectors = Math.ceil(size / 2);
        const area = collectors * 2;
        const cost = collectors * 600;
        
        const resultBox = document.getElementById('solarDimensionResult');
        if (resultBox) {
            resultBox.innerHTML = `
                <h4><i class="fas fa-check-circle"></i> Dimensionamento</h4>
                <p><strong>Coletores necessários:</strong> ${collectors} unidades</p>
                <p><strong>Área total de placas:</strong> ${area} m²</p>
                <p><strong>Investimento estimado:</strong> R$ ${cost.toLocaleString('pt-BR')}</p>
            `;
            resultBox.style.display = 'block';
            resultBox.classList.add('show');
        }
    };

    window.calcROI = () => {
        const inv = parseFloat(document.getElementById('calcInvestment').value) || 8000;
        const save = parseFloat(document.getElementById('calcSaving').value) || 250;
        const months = Math.ceil(inv / save);
        const years = (months / 12).toFixed(1);
        const savings5y = (save * 60) - inv;
        
        const resultBox = document.getElementById('roiResult');
        if (resultBox) {
            resultBox.innerHTML = `
                <h4><i class="fas fa-chart-line"></i> Retorno do Investimento</h4>
                <p><strong>Payback:</strong> ${months} meses (${years} anos)</p>
                <p><strong>Economia líquida em 5 anos:</strong> R$ ${savings5y.toLocaleString('pt-BR')}</p>
            `;
            resultBox.style.display = 'block';
            resultBox.classList.add('show');
        }
    };

    window.calcEnergyCost = () => {
        const price = parseFloat(document.getElementById('calcKwhPrice').value) || 0.85;
        const hours = parseFloat(document.getElementById('calcHours').value) || 8;
        const power = 0.023; // 23W em kW
        const monthlyKwh = power * hours * 30;
        const monthlyCost = monthlyKwh * price;
        
        const resultBox = document.getElementById('energyResult');
        if (resultBox) {
            resultBox.innerHTML = `
                <h4><i class="fas fa-bolt"></i> Custo Mensal LED</h4>
                <p><strong>Consumo:</strong> ${monthlyKwh.toFixed(2)} kWh/mês</p>
                <p><strong>Custo estimado:</strong> R$ ${monthlyCost.toFixed(2)}/mês</p>
                <p style="font-size:13px; color: #27ae60; margin-top:10px;"><i class="fas fa-info-circle"></i> Comparado a 300W, você economiza ~R$ ${(monthlyCost * 12).toFixed(2)}/ano!</p>
            `;
            resultBox.style.display = 'block';
            resultBox.classList.add('show');
        }
    };

    // ==========================================
    // 7. FILTRO DA GALERIA
    // ==========================================
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                } else {
                    item.style.opacity = '0'; item.style.transform = 'scale(0.8)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // ==========================================
    // 8. MODAL
    // ==========================================
    window.showDetails = (type) => {
        const modal = document.getElementById('modal');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');
        
        const content = {
            solar: { t: 'Aquecimento Solar', d: '<p>Utiliza princípios de óptica como a alta absorção de radiação por superfícies escuras (corpo negro) e o efeito estufa controlado pelo vidro. Possui eficiência de 75%, zero custo operacional de combustível e vida útil de 20 anos.</p>' },
            bomba: { t: 'Bomba de Calor', d: '<p>Extrai calor do ar ambiente, mesmo em dias frios. Possui COP de 400-600% (para cada 1kW de eletricidade, gera 4 a 6kW de calor). Pode ser integrada a painéis solares fotovoltaicos para máxima sustentabilidade.</p>' },
            eletrico: { t: 'Aquecedor Elétrico', d: '<p>Sistema tradicional por resistência. Apresenta menor custo inicial e instalação simples, mas possui o maior custo operacional e menor eficiência energética a longo prazo.</p>' }
        };
        
        if (content[type] && title && text) {
            title.innerText = content[type].t;
            text.innerHTML = content[type].d;
            if (modal) modal.classList.add('show');
        }
    };

    window.closeModal = () => {
        const modal = document.getElementById('modal');
        if (modal) modal.classList.remove('show');
    };

    const modalElement = document.getElementById('modal');
    if (modalElement) {
        modalElement.addEventListener('click', (e) => {
            if (e.target.id === 'modal') window.closeModal();
        });
    }

    // ==========================================
    // 9. FORMULÁRIO DE CONTATO
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('✅ Mensagem enviada com sucesso!\n\nA equipe do Projeto Integrador do CEP agradece o contato e responderá em breve.');
            contactForm.reset();
        });
    }
});
