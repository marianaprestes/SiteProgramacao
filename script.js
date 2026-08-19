// ===== NAVIGATION =====
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.innerHTML = nav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Active link on scroll
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        nav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ===== STATS COUNTER =====
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
                stat.innerText = target + (target === 16 ? 'M' : target === 35 ? '°C' : '%');
            }
        };
        
        updateCounter();
    });
};

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

if (statNumbers.length > 0) {
    statsObserver.observe(statNumbers[0].parentElement);
}

// ===== CHARTS =====
// Heating Comparison Chart
const heatingCtx = document.getElementById('heatingChart');
if (heatingCtx) {
    new Chart(heatingCtx, {
        type: 'bar',
        data: {
            labels: ['Solar', 'Bomba de Calor', 'Elétrico'],
            datasets: [
                {
                    label: 'Eficiência (%)',
                    data: [75, 400, 95],
                    backgroundColor: '#00A8E8',
                    borderColor: '#003B5C',
                    borderWidth: 2
                },
                {
                    label: 'Economia (%)',
                    data: [95, 80, 40],
                    backgroundColor: '#FF6B35',
                    borderColor: '#003B5C',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Annual Savings Chart
const savingsCtx = document.getElementById('savingsChart');
if (savingsCtx) {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    new Chart(savingsCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Sem Aquecimento',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#999999',
                    backgroundColor: 'rgba(153, 153, 153, 0.1)',
                    fill: true
                },
                {
                    label: 'Solar',
                    data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
                    borderColor: '#FFD93D',
                    backgroundColor: 'rgba(255, 217, 61, 0.1)',
                    fill: true
                },
                {
                    label: 'Bomba de Calor',
                    data: [180, 180, 200, 220, 240, 260, 280, 260, 240, 220, 200, 180],
                    borderColor: '#00A8E8',
                    backgroundColor: 'rgba(0, 168, 232, 0.1)',
                    fill: true
                },
                {
                    label: 'Elétrico',
                    data: [450, 450, 500, 550, 600, 650, 700, 650, 600, 550, 500, 450],
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Custo Mensal (R$)'
                    }
                }
            }
        }
    });
}

// Sustainability Chart
const sustainabilityCtx = document.getElementById('sustainabilityChart');
if (sustainabilityCtx) {
    new Chart(sustainabilityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Redução CO₂', 'Economia Energia', 'Água Economizada'],
            datasets: [{
                data: [75, 90, 60],
                backgroundColor: [
                    '#7ED321',
                    '#00A8E8',
                    '#FFD93D'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// ===== COLOR SIMULATOR =====
const colorPicker = document.getElementById('colorPicker');
const previewOverlay = document.getElementById('previewOverlay');

function setColor(color) {
    colorPicker.value = color;
    updatePreview(color);
}

if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
        updatePreview(e.target.value);
    });
}

function updatePreview(color) {
    if (previewOverlay) {
        previewOverlay.style.background = hexToRgba(color, 0.4);
    }
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ===== DASHBOARD SIMULATION =====
const tempSlider = document.getElementById('tempSlider');
const tempValue = document.getElementById('tempValue');
const lightToggle = document.getElementById('lightToggle');
const pumpToggle = document.getElementById('pumpToggle');
const pumpStatus = document.getElementById('pumpStatus');
const consumptionValue = document.getElementById('consumptionValue');

if (tempSlider) {
    tempSlider.addEventListener('input', (e) => {
        tempValue.textContent = `${e.target.value}°C`;
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
        pumpStatus.textContent = isActive ? 'Ligada' : 'Desligada';
        pumpStatus.style.color = isActive ? '#7ED321' : '#999999';
    });
}

// Simulate consumption
setInterval(() => {
    if (consumptionValue && Math.random() > 0.7) {
        const current = parseFloat(consumptionValue.textContent);
        const increment = (Math.random() * 0.5).toFixed(2);
        consumptionValue.textContent = `${(current + parseFloat(increment)).toFixed(2)} kWh`;
    }
}, 3000);

// ===== CALCULATORS =====
// Solar Calculator
const solarForm = document.getElementById('solarForm');
if (solarForm) {
    solarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const poolSize = parseFloat(document.getElementById('poolSize').value);
        const city = document.getElementById('city').value;
        
        // Simple calculation
        const collectors = Math.ceil(poolSize / 2);
        const cost = collectors * 500;
        const saving = poolSize * 10;
        
        const resultDiv = document.getElementById('solarResult');
        resultDiv.innerHTML = `
            <h4>Resultado do Dimensionamento</h4>
            <p><strong>Coletores necessários:</strong> ${collectors} unidades</p>
            <p><strong>Área total:</strong> ${collectors * 2}m²</p>
            <p><strong>Custo estimado:</strong> R$ ${cost.toLocaleString()}</p>
            <p><strong>Economia mensal:</strong> R$ ${saving.toLocaleString()}</p>
            <p><strong>Retorno do investimento:</strong> ${Math.ceil(cost / saving / 12)} anos</p>
        `;
        resultDiv.classList.add('show');
    });
}

// ROI Calculator
const roiForm = document.getElementById('roiForm');
if (roiForm) {
    roiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const investment = parseFloat(document.getElementById('investment').value);
        const monthlySaving = parseFloat(document.getElementById('monthlySaving').value);
        
        const paybackMonths = Math.ceil(investment / monthlySaving);
        const paybackYears = (paybackMonths / 12).toFixed(1);
        const saving5Years = (monthlySaving * 60 - investment).toLocaleString();
        const saving10Years = (monthlySaving * 120 - investment).toLocaleString();
        
        const resultDiv = document.getElementById('roiResult');
        resultDiv.innerHTML = `
            <h4>Retorno de Investimento</h4>
            <p><strong>Payback:</strong> ${paybackMonths} meses (${paybackYears} anos)</p>
            <p><strong>Economia em 5 anos:</strong> R$ ${saving5Years}</p>
            <p><strong>Economia em 10 anos:</strong> R$ ${saving10Years}</p>
        `;
        resultDiv.classList.add('show');
    });
}

// Energy Cost Calculator
const energyForm = document.getElementById('energyForm');
if (energyForm) {
    energyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const kwhPrice = parseFloat(document.getElementById('kwhPrice').value);
        const hoursDay = parseFloat(document.getElementById('hoursDay').value);
        const systemType = document.getElementById('systemType').value;
        
        let power = 0;
        switch(systemType) {
            case 'solar': power = 0.15; break; // Only pump
            case 'bomba': power = 1.5; break;
            case 'eletrico': power = 5; break;
        }
        
        const dailyConsumption = power * hoursDay;
        const monthlyConsumption = dailyConsumption * 30;
        const monthlyCost = monthlyConsumption * kwhPrice;
        const yearlyCost = monthlyCost * 12;
        
        const resultDiv = document.getElementById('energyResult');
        resultDiv.innerHTML = `
            <h4>Custo Energético Estimado</h4>
            <p><strong>Consumo diário:</strong> ${dailyConsumption.toFixed(2)} kWh</p>
            <p><strong>Consumo mensal:</strong> ${monthlyConsumption.toFixed(2)} kWh</p>
            <p><strong>Custo mensal:</strong> R$ ${monthlyCost.toFixed(2)}</p>
            <p><strong>Custo anual:</strong> R$ ${yearlyCost.toFixed(2)}</p>
        `;
        resultDiv.classList.add('show');
    });
}

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== MODAL =====
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.getElementById('modalBody');

function showDetails(type) {
    let content = '';
    
    switch(type) {
        case 'solar':
            content = `
                <h2>Aquecimento Solar</h2>
                <p>O aquecimento solar é a forma mais econômica e sustentável de aquecer sua piscina.</p>
                <h3>Vantagens:</h3>
                <ul>
                    <li>Eficiência de 75% na conversão de energia</li>
                    <li>Zero custo operacional (apenas bomba de circulação)</li>
                    <li>Vida útil de 20 anos</li>
                    <li>Retorno do investimento em 3-5 anos</li>
                    <li>Energia 100% renovável</li>
                </ul>
                <h3>Como funciona:</h3>
                <p>A água da piscina circula através dos coletores solares instalados no telhado, onde é aquecida pela radiação solar e retorna à piscina.</p>
            `;
            break;
        case 'bomba':
            content = `
                <h2>Bomba de Calor</h2>
                <p>Tecnologia moderna que extrai calor do ar ambiente para aquecer a água.</p>
                <h3>Vantagens:</h3>
                <ul>
                    <li>COP de 400-600% (4-6x mais eficiente que elétrico)</li>
                    <li>Funciona mesmo em dias nublados</li>
                    <li>Controle preciso de temperatura</li>
                    <li>Integração com energia solar fotovoltaica</li>
                    <li>Aquecimento rápido (24-48 horas)</li>
                </ul>
                <h3>Como funciona:</h3>
                <p>A bomba de calor utiliza um ciclo termodinâmico para transferir calor do ar para a água, consumindo muito menos energia que um aquecedor elétrico.</p>
            `;
            break;
        case 'eletrico':
            content = `
                <h2>Aquecedor Elétrico</h2>
                <p>Sistema tradicional de aquecimento por resistência elétrica.</p>
                <h3>Vantagens:</h3>
                <ul>
                    <li>Menor custo inicial de instalação</li>
                    <li>Instalação simples e rápida</li>
                    <li>Controle preciso de temperatura</li>
                    <li>Funciona em qualquer condição climática</li>
                    <li>Manutenção mínima</li>
                </ul>
                <h3>Considerações:</h3>
                <p>Apesar do baixo custo inicial, o aquecedor elétrico tem maior custo operacional e menor eficiência energética comparado às outras opções.</p>
            `;
            break;
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('show');
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// ===== LAZY LOADING =====
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== PERFORMANCE =====
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Add any scroll-dependent functionality here
}, 10));

console.log('Site carregado com sucesso! 🎓✨');
