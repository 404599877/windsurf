// Initialize after page load
document.addEventListener('DOMContentLoaded', function() {
  initializeGameCards();
  initializeButtons();
});

// Initialize game cards
function initializeGameCards() {
  const cards = document.querySelectorAll('.game-card');
  
  cards.forEach((card, index) => {
    // Add keyboard navigation support
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(card);
      }
    });
    
    // Add click event
    card.addEventListener('click', function() {
      handleCardClick(card);
    });
    
    // Add focus styles
    card.addEventListener('focus', function() {
      card.style.outline = '2px solid #ff6f8d';
      card.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', function() {
      card.style.outline = 'none';
    });
  });
}

// Handle card click
function handleCardClick(card) {
  const img = card.querySelector('img');
  const title = card.querySelector('.game-title');
  
  if (img) {
    // Create modal to show large image
    showImageModal(img.src, title ? title.textContent : 'Game Screenshot');
  }
}

// Show image modal
function showImageModal(imageSrc, title) {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
  `;
  
  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    position: relative;
  `;
  
  // Create image
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = title;
  img.style.cssText = `
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  `;
  
  // Create title
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.style.cssText = `
    color: white;
    text-align: center;
    margin-top: 16px;
    font-family: 'Fredoka One', Arial, sans-serif;
    font-size: 24px;
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 32px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  `;
  
  closeBtn.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(255, 255, 255, 0.2)';
  });
  
  closeBtn.addEventListener('mouseleave', function() {
    this.style.background = 'none';
  });
  
  // Assemble modal
  imageContainer.appendChild(closeBtn);
  imageContainer.appendChild(img);
  imageContainer.appendChild(titleElement);
  modal.appendChild(imageContainer);
  
  // Add to page
  document.body.appendChild(modal);
  
  // Close events
  function closeModal() {
    document.body.removeChild(modal);
    document.removeEventListener('keydown', handleKeyDown);
  }
  
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  modal.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', handleKeyDown);
  
  // Prevent image click from closing modal
  img.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// Initialize buttons
function initializeButtons() {
  const playBtn = document.querySelector('.btn-main');
  const downloadBtn = document.querySelector('.btn-outline');
  
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      showNotification('Start Game! (Demo)', 'success');
    });
  }
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      showNotification('Download Game! (Demo)', 'info');
    });
  }
  
  // Initialize header buttons
  const headerBtns = document.querySelectorAll('.header-btn');
  headerBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const action = index === 0 ? 'Login' : 'Register';
      showNotification(`${action} feature coming soon...`, 'warning');
    });
  });
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const colors = {
    success: '#1a8f6a',
    info: '#388bff',
    warning: '#ff9a5c',
    error: '#ff6f8d'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: 'Fredoka One', Arial, sans-serif;
    font-size: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto hide
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add page load animations
window.addEventListener('load', function() {
  const cards = document.querySelectorAll('.game-card');
  const features = document.querySelectorAll('.feature-item');
  
  // Game cards animation
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 200);
  });
  
  // Features animation
  features.forEach((feature, index) => {
    feature.style.opacity = '0';
    feature.style.transform = 'scale(0.8)';
    feature.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      feature.style.opacity = '1';
      feature.style.transform = 'scale(1)';
    }, 800 + index * 200);
  });
}); 