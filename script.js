document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Menu Mobile
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (nav) nav.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // 2. Animação dos Números (Stats)
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
                    let suffix = target === 16 ? 'M' : (target === 35 ? '°C' : '%');
                    stat.innerText = target + suffix;
                }
            };
            updateCounter();
        });
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { animateStats(); statsObserver.disconnect(); }
    }, { threshold: 0.5 });
    
    if (statNumbers.length > 0) {
        statsObserver.observe(statNumbers[0].parentElement.parentElement);
    }

    // 3. Gráficos (Chart.js) - PALETA AZUL
    window.addEventListener('load', () => {
        const heatingCtx = document.getElementById('heatingChart');
        if (heatingCtx) {
            new Chart(heatingCtx, {
                type: 'bar',
                data: {
                    labels: ['Solar', 'Bomba de Calor', 'Elétrico'],
                    datasets: [{ label: 'Eficiência (%)', data: [75, 400, 95], backgroundColor: ['#00A8E8', '#0077CC', '#00C2FF'], borderWidth: 0 }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            });
        }

        const savingsCtx = document.getElementById('savingsChart');
        if (savingsCtx) {
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            new Chart(savingsCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        { label: 'Solar', data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50], borderColor: '#00C2FF', backgroundColor: 'rgba(0, 194, 255, 0.1)', fill: true },
                        { label: 'Bomba de Calor', data: [180, 180, 200, 220, 240, 260, 280, 260, 240, 220, 200, 180], borderColor: '#00A8E8', backgroundColor: 'rgba(0, 168, 232, 0.1)', fill: true },
                        { label: 'Elétrico', data: [450, 450, 500, 550, 600, 650, 700, 650, 600, 550, 500, 450], borderColor: '#0056B3', backgroundColor: 'rgba(0, 86, 179, 0.1)', fill: true }
                    ]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true, title: {display: true, text: 'Custo Mensal (R$)'} } } }
            });
        }

        const sustainabilityCtx = document.getElementById('sustainabilityChart');
        if (sustainabilityCtx) {
            new Chart(sustainabilityCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Redução CO₂', 'Economia Energia', 'Água Economizada'],
                    datasets: [{ data: [75, 90, 60], backgroundColor: ['#00C2FF', '#00A8E8', '#0077CC'], borderWidth: 2 }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }
    });

    // 4. Simulador de Cores
    const colorPicker = document.getElementById('colorPicker');
    const previewOverlay = document.getElementById('previewOverlay');
    
    window.setColor = function(color) { 
        if (colorPicker) colorPicker.value = color; 
        updatePreview(color); 
    };
    
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => updatePreview(e.target.value));
    }
    
    function updatePreview(color) {
        if (previewOverlay) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            previewOverlay.style.background = `rgba(${r}, ${g}, ${b}, 0.5)`;
        }
    }

    // 5. Dashboard Simulation
    const tempSlider = document.getElementById('tempSlider');
    const tempValue = document.getElementById('tempValue');
    const lightToggle = document.getElementById('lightToggle');
    const pumpToggle = document.getElementById('pumpToggle');
    const pumpStatus = document.getElementById('pumpStatus');
    const consumptionValue = document.getElementById('consumptionValue');

    if (tempSlider) {
        tempSlider.addEventListener('input', (e) => {
            if (tempValue) tempValue.textContent = `${e.target.value}°C`;
        });
    }
    if (lightToggle) {
        lightToggle.addEventListener('click', () => {
            lightToggle.classList.toggle('active');
            lightToggle.textContent = lightToggle.classList.contains('active') ? 'Desligar' : 'Ligar';
        });
    }
    if (pumpToggle) {
        pumpToggle.addEventListener('click', () => {
            pumpToggle.classList.toggle('active');
            const isActive = pumpToggle.classList.contains('active');
            pumpToggle.textContent = isActive ? 'Desligar' : 'Ligar';
            if (pumpStatus) {
                pumpStatus.textContent = isActive ? 'Ligada' : 'Desligada';
                pumpStatus.style.color = isActive ? 'var(--azul-sucesso)' : 'var(--cinza-azulado-texto)';
            }
        });
    }
    
    setInterval(() => {
        if (consumptionValue && Math.random() > 0.7) {
            const current = parseFloat(consumptionValue.textContent) || 0;
            const increment = (Math.random() * 0.5).toFixed(2);
            consumptionValue.textContent = `${(current + parseFloat(increment)).toFixed(2)}`;
        }
    }, 3000);

    // 6. Calculadoras (CORRIGIDAS)
    function preventDefault(e) { if(e) e.preventDefault(); }

    window.calcSolar = function(e) {
        preventDefault(e);
        const size = parseFloat(document.getElementById('poolSize').value) || 20;
        const collectors = Math.ceil(size / 2);
        const cost = collectors * 500;
        const res = document.getElementById('solarResult');
        res.innerHTML = `<strong>Coletores:</strong> ${collectors} un.<br><strong>Área total:</strong> ${collectors * 2}m²<br><strong>Custo estimado:</strong> R$ ${cost.toLocaleString('pt-BR')}<br><strong>Economia mensal:</strong> R$ ${(size * 10).toFixed(2)}`;
        res.classList.add('show');
    };

    window.calcROI = function(e) {
        preventDefault(e);
        const inv = parseFloat(document.getElementById('investment').value) || 5000;
        const save = parseFloat(document.getElementById('monthlySaving').value) || 200;
        const months = Math.ceil(inv / save);
        const res = document.getElementById('roiResult');
        res.innerHTML = `<strong>Payback:</strong> ${months} meses (${(months/12).toFixed(1)} anos)<br><strong>Economia em 5 anos:</strong> R$ ${(save * 60 - inv).toLocaleString('pt-BR')}`;
        res.classList.add('show');
    };

    window.calcEnergy = function(e) {
        preventDefault(e);
        const price = parseFloat(document.getElementById('kwhPrice').value) || 0.80;
        const hours = parseFloat(document.getElementById('hoursDay').value) || 8;
        const power = 1.5; 
        const monthlyCost = (power * hours * 30 * price).toFixed(2);
        const res = document.getElementById('energyResult');
        res.innerHTML = `<strong>Consumo mensal:</strong> ${(power * hours * 30).toFixed(1)} kWh<br><strong>Custo mensal:</strong> R$ ${monthlyCost}`;
        res.classList.add('show');
    };

    // 7. Gallery Filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
                } else {
                    item.style.opacity = '0'; item.style.transform = 'scale(0.8)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // 8. Modal
    window.showDetails = function(type) {
        let content = '';
        if(type === 'solar') content = '<h2>Aquecimento Solar</h2><p>O aquecimento solar é a forma mais econômica e sustentável. Eficiência de 75%, zero custo operacional e vida útil de 20 anos.</p>';
        else if(type === 'bomba') content = '<h2>Bomba de Calor</h2><p>Extrai calor do ar ambiente. COP de 400-600%, funciona em dias nublados e integração com energia solar.</p>';
        else if(type === 'eletrico') content = '<h2>Aquecedor Elétrico</h2><p>Sistema tradicional por resistência. Menor custo inicial, instalação simples, mas maior custo operacional.</p>';
        
        const modalBody = document.getElementById('modalBody');
        const modal = document.getElementById('modal');
        if (modalBody) modalBody.innerHTML = content;
        if (modal) modal.classList.add('show');
    };
    
    window.closeModal = function() { 
        const modal = document.getElementById('modal');
        if (modal) modal.classList.remove('show'); 
    };
    
    const modalElement = document.getElementById('modal');
    if (modalElement) {
        modalElement.addEventListener('click', (e) => { if(e.target.id === 'modal') window.closeModal(); });
    }

    // 9. Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
});
