document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NAVEGAÇÃO
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if(icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTopBtn.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            backToTopBtn.classList.remove('visible');
        }
    });

    window.scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

    // 2. ANIMAÇÃO DOS NÚMEROS
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
                    let suffix = target === 100 ? '%' : (target === 35 ? '°C' : '%');
                    stat.innerText = target + suffix;
                }
            };
            updateCounter();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { animateStats(); statsObserver.disconnect(); }
    }, { threshold: 0.5 });
    if (statNumbers.length > 0) statsObserver.observe(statNumbers[0].parentElement.parentElement);

    // 3. SIMULADOR INTERATIVO
    const simTemp = document.getElementById('simTemp');
    const simTempValue = document.getElementById('simTempValue');
    const ledStatus = document.getElementById('ledStatus');
    const ledStatusText = document.getElementById('ledStatusText');
    const poolWater = document.getElementById('poolWater');
    const poolTempDisplay = document.getElementById('poolTempDisplay');
    const poolEdges = document.getElementById('poolEdges');

    if (simTemp) {
        simTemp.addEventListener('input', () => {
            const temp = parseFloat(simTemp.value);
            simTempValue.innerText = temp + '°C';
            poolTempDisplay.innerText = temp + '°C';
            
            if (temp < 28) {
                ledStatus.style.background = 'var(--azul-primario)';
                ledStatusText.innerText = 'AQUECENDO (Azul)';
                poolWater.style.background = 'linear-gradient(135deg, #0f172a, #0ea5e9)';
            } else {
                ledStatus.style.background = 'var(--verde-agua)';
                ledStatusText.innerText = 'TEMPERATURA IDEAL (Verde)';
                poolWater.style.background = 'linear-gradient(135deg, #0f766e, #14b8a6)';
            }
        });
    }

    window.toggleSafeMode = () => {
        const safeModeToggle = document.getElementById('safeMode');
        if (safeModeToggle.checked) {
            poolEdges.style.display = 'flex';
        } else {
            poolEdges.style.display = 'none';
        }
    };

    // 4. QUIZ INTERATIVO
    let quizScore = 0;
    let currentQuestion = 1;
    const totalQuestions = 3;

    window.checkAnswer = (btn, isCorrect) => {
        const buttons = btn.parentElement.querySelectorAll('.quiz-btn');
        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
            btn.classList.add('correct');
            quizScore++;
        } else {
            btn.classList.add('wrong');
            buttons.forEach(b => {
                if (b.getAttribute('onclick').includes('true')) b.classList.add('correct');
            });
        }

        setTimeout(() => {
            document.getElementById(`quizQuestion${currentQuestion}`).style.display = 'none';
            currentQuestion++;
            
            if (currentQuestion <= totalQuestions) {
                document.getElementById(`quizQuestion${currentQuestion}`).style.display = 'block';
            } else {
                document.getElementById('quizResult').style.display = 'block';
                document.getElementById('quizScore').innerText = quizScore;
                
                const message = document.getElementById('quizMessage');
                if (quizScore === totalQuestions) {
                    message.innerText = '🏆 Perfeito! Você domina o assunto!';
                } else if (quizScore >= 2) {
                    message.innerText = '👏 Muito bom! Você está quase lá!';
                } else {
                    message.innerText = '💡 Continue estudando, você consegue!';
                }
            }
        }, 1500);
    };

    window.resetQuiz = () => {
        quizScore = 0;
        currentQuestion = 1;
        document.getElementById('quizResult').style.display = 'none';
        document.getElementById('quizQuestion1').style.display = 'block';
        document.getElementById('quizQuestion2').style.display = 'none';
        document.getElementById('quizQuestion3').style.display = 'none';
        
        document.querySelectorAll('.quiz-btn').forEach(btn => {
            btn.classList.remove('correct', 'wrong');
            btn.disabled = false;
        });
    };
});
