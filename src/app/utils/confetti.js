// Simple confetti animation without external dependencies
export function triggerConfetti() {
    const colors = [
        'rgb(59, 130, 246)',   // blue
        'rgb(34, 211, 238)',   // cyan
        'rgb(16, 185, 129)',   // emerald
        'rgb(168, 85, 247)',   // purple
        'rgb(236, 72, 153)',   // pink
        'rgb(251, 146, 60)',   // orange
    ];

    const confettiCount = 50;
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 360;
        const duration = Math.random() * 2 + 2;

        confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            top: -20px;
            left: ${startX}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            transform: rotate(${rotation}deg);
            animation: confetti-fall ${duration}s ease-out forwards;
            opacity: 1;
        `;

        container.appendChild(confetti);

        // Create keyframes animation
        const keyframes = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(${window.innerHeight + 20}px) translateX(${endX - startX}px) rotate(${rotation + 720}deg);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
    }

    // Cleanup after animation
    setTimeout(() => {
        document.body.removeChild(container);
    }, 4000);
}

// Sparkle effect for success
export function triggerSparkles(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const sparkleCount = 12;
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        const angle = (i / sparkleCount) * Math.PI * 2;
        const distance = 60;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;

        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: absolute;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: 20px;
            animation: sparkle-burst 0.6s ease-out forwards;
        `;

        sparkle.style.setProperty('--end-x', `${endX - centerX}px`);
        sparkle.style.setProperty('--end-y', `${endY - centerY}px`);

        container.appendChild(sparkle);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle-burst {
            to {
                transform: translate(var(--end-x), var(--end-y));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.removeChild(container);
    }, 1000);
}
