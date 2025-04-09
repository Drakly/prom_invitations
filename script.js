document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const responseMsg = document.getElementById('response-message');
    const invitationCard = document.querySelector('.invitation-card');
    const rsvpSection = document.getElementById('rsvp-section');
    const rsvpFormContainer = document.getElementById('rsvp-form-container');
    const rsvpForm = document.getElementById('rsvp-form');
    
    // Add floating effect to the invitation card
    floatElement(invitationCard);
    
    // Add hover sound to buttons
    addHoverSound(yesBtn);
    addHoverSound(noBtn);
    
    // Make the "No" button run away
    let runAwayCount = 0;
    noBtn.addEventListener('mouseover', (e) => {
        if (runAwayCount < 5) {
            moveButtonAway(noBtn, e);
            runAwayCount++;
        } else {
            // After 5 attempts, let them click it
            noBtn.style.transform = 'none';
        }
    });
    
    // Handle button clicks
    yesBtn.addEventListener('click', () => {
        handleYes();
    });
    
    noBtn.addEventListener('click', () => {
        handleNo();
    });
    
    // Handle form submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            // Let Netlify handle the form submission
            // After successful submission, Netlify will redirect to the success page
            
            // You can add form validation here if needed
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (!name || !email) {
                e.preventDefault();
                alert('Please fill in all required fields');
                return;
            }
            
            // If not using Netlify's automatic redirects, you can set a custom redirect
            // However, Netlify's default behavior works well
        });
    }
    
    // Add parallax effect to elements
    document.addEventListener('mousemove', createParallaxEffect);
});

// Function to make the button run away from the cursor
function moveButtonAway(button, event) {
    const x = event.clientX;
    const y = event.clientY;
    
    // Get the button's position
    const btnRect = button.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    // Calculate direction to move (away from cursor)
    const dirX = btnCenterX - x;
    const dirY = btnCenterY - y;
    
    // Normalize direction
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const normDirX = dirX / length;
    const normDirY = dirY / length;
    
    // Calculate the new position
    const moveDistance = 150;
    const newX = normDirX * moveDistance;
    const newY = normDirY * moveDistance;
    
    // Keep the button on screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let finalX = newX;
    let finalY = newY;
    
    // Ensure button stays in viewport
    if (btnRect.left + newX < 0) finalX = -btnRect.left + 10;
    if (btnRect.right + newX > windowWidth) finalX = windowWidth - btnRect.right - 10;
    if (btnRect.top + newY < 0) finalY = -btnRect.top + 10;
    if (btnRect.bottom + newY > windowHeight) finalY = windowHeight - btnRect.bottom - 10;
    
    // Apply the movement
    button.style.transform = `translate(${finalX}px, ${finalY}px)`;
    
    // Add a little animation
    button.style.transition = 'transform 0.2s ease-out';
}

// Function to handle "Yes" click
function handleYes() {
    const responseMsg = document.getElementById('response-message');
    const rsvpSection = document.getElementById('rsvp-section');
    const rsvpFormContainer = document.getElementById('rsvp-form-container');
    
    // Show initial response
    responseMsg.textContent = "Amazing! Let's get your details...";
    responseMsg.style.color = '#6FFF9F';
    
    // Show the form
    setTimeout(() => {
        // Hide the RSVP buttons and show the form
        const buttonContainer = document.querySelector('.button-container');
        buttonContainer.style.display = 'none';
        rsvpFormContainer.style.display = 'block';
        
        // Scroll to the form
        rsvpFormContainer.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
    
    // Trigger confetti celebration
    triggerConfetti();
    
    // Play success sound
    playSound('https://cdn.staticcrate.com/stock-hd/audio/soundscrate-cool-success-fanfare-1.mp3');
    
    // Add a special animation class
    document.querySelector('.invitation-card').classList.add('celebration');
}

// Function to handle "No" click
function handleNo() {
    const noBtn = document.getElementById('no-btn');
    const responseMsg = document.getElementById('response-message');
    
    // Array of funny responses
    const funnyResponses = [
        "Nice try! Your attendance is non-negotiable 😉",
        "Error 404: Decline option not available",
        "I'll pretend I didn't see that click",
        "Is that your final answer? Because it's wrong",
        "The universe has decided you're coming!"
    ];
    
    // Pick a random response
    const randomResponse = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
    responseMsg.textContent = randomResponse;
    responseMsg.style.color = '#FF9F80';
    
    // Shake the button
    noBtn.classList.add('shake');
    setTimeout(() => {
        noBtn.classList.remove('shake');
    }, 500);
    
    // Play "wrong answer" sound
    playSound('https://cdn.staticcrate.com/stock-hd/audio/soundscrate-error-alert-3.mp3');
}

// Function to trigger confetti
function triggerConfetti() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 1000
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#ff9966', '#ff5e62']
    });
    fire(0.2, {
        spread: 60,
        colors: ['#6a11cb', '#9f80ff']
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#43c6ac', '#80e5ff']
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ['#ffffff']
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
        colors: ['#6d5df1', '#80e5ff']
    });
}

// Function to create a floating animation effect
function floatElement(element) {
    let floatY = 0;
    let floatX = 0;
    let direction = 1;
    let directionX = 1;
    
    setInterval(() => {
        floatY += 0.1 * direction;
        floatX += 0.05 * directionX;
        
        if (floatY > 5) direction = -1;
        if (floatY < -5) direction = 1;
        if (floatX > 3) directionX = -1;
        if (floatX < -3) directionX = 1;
        
        element.style.transform = `translate(${floatX}px, ${floatY}px)`;
    }, 50);
}

// Function to add hover sound to buttons
function addHoverSound(button) {
    button.addEventListener('mouseenter', () => {
        playSound('https://cdn.staticcrate.com/stock-hd/audio/soundscrate-ui-button-click-1.mp3', 0.2);
    });
}

// Function to play sound
function playSound(url, volume = 0.5) {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Function to create parallax effect
function createParallaxEffect(e) {
    const header = document.querySelector('.header');
    const details = document.querySelector('.details');
    
    // Get mouse position
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate mouse position percentage
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;
    
    // Apply parallax effect
    header.style.transform = `translate(${percentX * 10}px, ${percentY * 10}px)`;
    details.style.transform = `translate(${percentX * -5}px, ${percentY * -5}px)`;
}

// Add CSS animation classes
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
        100% { transform: translateX(0); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .celebration {
        animation: celebrate 1s ease-in-out;
    }
    
    @keyframes celebrate {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(128, 229, 255, 0.5); }
        100% { transform: scale(1); }
    }
</style>
`); 