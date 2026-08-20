// 1. Menu Mobile
document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.nav-list').classList.toggle('active');
    document.getElementById('nav').classList.toggle('active');
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
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) { animateStats(); observer.disconnect(); }
});
if(statNumbers.length > 0) observer.observe(statNumbers[0].parentElement);

// 3. Gráficos (Chart.js)
window.addEventListener('load', () => {
    new Chart(document.getElementById('heatingChart'), {
        type: 'bar',
        data: {
            labels: ['Solar', 'Bomba de Calor', 'Elétrico'],
            datasets: [{ label: 'Eficiência (%)', data: [75, 400, 95], backgroundColor: ['#00A8E8', '#FF6B35', '#7ED321'], borderWidth: 0 }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    new Chart(document.getElementById('savingsChart'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label: 'Solar', data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50], borderColor: '#FFD93D', backgroundColor: 'rgba(255, 217, 61, 0.1)', fill: true },
                { label: 'Bomba de Calor', data: [180, 180, 200, 220, 240, 260, 280, 260, 240, 220, 200, 180], borderColor: '#00A8E8', backgroundColor: 'rgba(0, 168, 232, 0.1)', fill: true },
                { label: 'Elétrico', data: [450, 450, 500, 550, 600, 650, 700, 650, 600, 550, 500, 450], borderColor: '#FF6B35', backgroundColor: 'rgba(255, 107, 53, 0.1)', fill: true }
            ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, title: {display: true, text: 'Custo Mensal (R$)'} } } }
    });

    new Chart(document.getElementById('sustainabilityChart'), {
        type: 'doughnut',
        data: {
            labels: ['Redução CO₂', 'Economia Energia', 'Água Economizada'],
            datasets: [{ data: [75, 90, 60], backgroundColor: ['#7ED321', '#00A8E8', '#FFD93D'], borderWidth: 2 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
});

// 4. Simulador de Cores
const colorPicker = document.getElementById('colorPicker');
const previewOverlay = document.getElementById('previewOverlay');

function setColor(color) { 
    colorPicker.value = color; 
    updatePreview(color); 
}

function updatePreview(color) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    previewOverlay.style.background = `rgba(${r}, ${g}, ${b}, 0.5)`;
}

colorPicker.addEventListener('input', (e) => updatePreview(e.target.value));

// 5. Dashboard Simulado (Com lógica de indicador de temperatura adicionada)
document.getElementById('tempSlider').addEventListener('input', (e) => {
    const temp = e.target.value;
    document.getElementById('tempValue').textContent = temp + '°C';
    
    // Lógica de Indicador Visual (Aplicação no CEP)
    const lightColorInput = document.getElementById('lightColor');
    if(temp < 28) {
        lightColorInput.value = '#00A8E8'; // Azul: Aquecendo
        updatePreview('#00A8E8');
    } else {
        lightColorInput.value = '#7ED321'; // Verde: Temperatura Ideal
        updatePreview('#7ED321');
    }
});

document.getElementById('lightToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    this.textContent = this.classList.contains('active') ? 'Desligar' : 'Ligar';
});

document.getElementById('pumpToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    const isActive = this.classList.contains('active');
    this.textContent = isActive ? 'Desligar' : 'Ligar';
    const statusEl = document.getElementById('pumpStatus');
    statusEl.textContent = isActive ? 'Ligada' : 'Desligada';
    statusEl.style.color = isActive ? 'var(--verde-energia)' : 'var(--cinza-medio)';
});

setInterval(() => {
    const el = document.getElementById('consumptionValue');
    if(Math.random() > 0.7) {
        let val = parseFloat(el.textContent);
        el.textContent = (val + (Math.random() * 0.1)).toFixed(2);
    }
}, 2000);

// 6. Calculadoras
function preventDefault(e) { if(e) e.preventDefault(); }

function calcSolar(e) {
    preventDefault(e);
    const size = parseFloat(document.getElementById('poolSize').value) || 20;
    const collectors = Math.ceil(size / 2);
    const cost = collectors * 500;
    const res = document.getElementById('solarResult');
    res.innerHTML = `<h4>Resultado da Simulação</h4><p><strong>Coletores necessários:</strong> ${collectors} un.</p><p><strong>Área total:</strong> ${collectors * 2}m²</p><p><strong>Custo estimado:</strong> R$ ${cost}</p><p><strong>Economia mensal estimada:</strong> R$ ${(size * 10).toFixed(2)}</p>`;
    res.classList.add('show');
}

function calcROI(e) {
    preventDefault(e);
    const inv = parseFloat(document.getElementById('investment').value) || 5000;
    const save = parseFloat(document.getElementById('monthlySaving').value) || 200;
    const months = Math.ceil(inv / save);
    const res = document.getElementById('roiResult');
    res.innerHTML = `<h4>Resultado da Simulação</h4><p><strong>Payback:</strong> ${months} meses (${(months/12).toFixed(1)} anos)</p><p><strong>Economia líquida em 5 anos:</strong> R$ ${(save * 60 - inv).toLocaleString()}</p>`;
    res.classList.add('show');
}

function calcEnergy(e) {
    preventDefault(e);
    const price = parseFloat(document.getElementById('kwhPrice').value) || 0.80;
    const hours = parseFloat(document.getElementById('hoursDay').value) || 8;
    const power = 1.5; 
    const monthlyCost = (power * hours * 30 * price).toFixed(2);
    const res = document.getElementById('energyResult');
    res.innerHTML = `<h4>Resultado da Simulação</h4><p><strong>Consumo mensal:</strong> ${(power * hours * 30).toFixed(1)} kWh</p><p><strong>Custo mensal estimado:</strong> R$ ${monthlyCost}</p>`;
    res.classList.add('show');
}

// 7. Filtro da Galeria
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
function showDetails(type) {
    let content = '';
    if(type === 'solar') {
        content = '<h2>Aquecimento Solar</h2><p>O aquecimento solar é a forma mais econômica e sustentável. Utiliza princípios de óptica como a alta absorção de radiação por superfícies escuras e o efeito estufa controlado pelo vidro. Possui eficiência de 75%, zero custo operacional de combustível e vida útil de 20 anos.</p>';
    } else if(type === 'bomba') {
        content = '<h2>Bomba de Calor</h2><p>Extrai calor do ar ambiente, mesmo em dias frios. Possui COP de 400-600% (para cada 1kW de eletricidade, gera 4 a 6kW de calor). Pode ser integrada a painéis solares fotovoltaicos para máxima sustentabilidade.</p>';
    } else if(type === 'eletrico') {
        content = '<h2>Aquecedor Elétrico</h2><p>Sistema tradicional por resistência. Apresenta menor custo inicial e instalação simples, mas possui o maior custo operacional e menor eficiência energética a longo prazo.</p>';
    } else if(type === 'led') {
        content = '<h2>Tecnologia LED RGB e Acessibilidade</h2><p>Baseado na Síntese Aditiva (como no Disco de Newton), o LED combina microchips R, G e B controlados por PWM. No CEP, ele atua como indicador visual de temperatura (Azul = aquecendo, Verde = pronto) e possui um "Modo Acessibilidade" que ilumina as bordas em branco de alto contraste para segurança de alunos com baixa visão.</p>';
    }
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('show');
}

function closeModal() { 
    document.getElementById('modal').classList.remove('show'); 
}

document.getElementById('modal').addEventListener('click', (e) => { 
    if(e.target.id === 'modal') closeModal(); 
});

// 9. Formulário de Contato
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! A equipe do projeto entrará em contato em breve.');
    e.target.reset();
});
