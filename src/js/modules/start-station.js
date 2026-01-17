// Start Station Logic
import { FingerprintAuth, utils } from '../app.js';

export class StartStation {
  constructor() {
    this.fingerprintAuth = null;
    this.isAuthenticating = false;
    this.lastDetectionTime = 0;
    this.detectionCooldown = 1000; // 1 second between detections
    this.sessionStartTime = null;
    this.timerInterval = null;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Start Station...');
      
      // Initialize Touch ID authentication
      this.fingerprintAuth = new FingerprintAuth();
      await this.fingerprintAuth.initialize();
      
      // Setup UI
      this.setupTouchIDInterface();
      
      // Start auto-detection
      this.startAutoTouchIDDetection();
      
      console.log('✅ Start Station initialized successfully');
    } catch (error) {
      console.error('❌ Start Station initialization failed:', error);
      this.showError('Failed to initialize Touch ID system');
    }
  }

  setupTouchIDInterface() {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;

    // Create Touch ID container
    const touchIdContainer = document.createElement('div');
    touchIdContainer.id = 'touchIdContainer';
    touchIdContainer.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      margin: 20px 0;
    `;

    // Touch ID icon
    const touchIdIcon = document.createElement('div');
    touchIdIcon.innerHTML = '👆';
    touchIdIcon.style.cssText = `
      font-size: 4rem;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = '👆 Touch to Start';
    title.style.cssText = `
      margin: 0 0 10px 0;
      font-size: 1.8rem;
      font-weight: bold;
    `;

    // Description
    const description = document.createElement('p');
    const hasFP = this.fingerprintAuth && this.fingerprintAuth.hasFingerprintOnDevice();
    description.textContent = hasFP ? 
      'Use your fingerprint to start your session' : 
      'Click to login and start your stair climbing session';
    description.style.cssText = `
      margin: 0 0 20px 0;
      opacity: 0.9;
      font-size: 1.1rem;
    `;

    // Progress container
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progressContainer';
    progressContainer.style.cssText = `
      display: none;
      margin: 20px 0;
    `;

    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.style.cssText = `
      width: 0%;
      height: 6px;
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
      overflow: hidden;
      transition: width 0.3s ease;
    `;

    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 2s infinite;
    `;

    progressBar.appendChild(shimmer);
    progressContainer.appendChild(progressBar);

    // Auto-detection indicator
    const autoIndicator = document.createElement('div');
    const fpInfo = this.fingerprintAuth && this.fingerprintAuth.getDeviceFingerprintInfo();
    autoIndicator.innerHTML = fpInfo ? 
      `👤 ${fpInfo.userName} - FINGERPRINT READY` :
      '🌐 MULTI-DEVICE ACCESS - FINGERPRINT + PIN';
    autoIndicator.style.cssText = `
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 25px;
      margin: 20px 0;
      font-size: 14px;
      font-weight: bold;
      backdrop-filter: blur(10px);
      animation: glow 2s infinite;
    `;

    // Status text
    const statusText = document.createElement('div');
    statusText.id = 'touchIdStatus';
    statusText.textContent = fpInfo ? 
      `Touch fingerprint sensor to login as ${fpInfo.userName}` :
      'Click to login with fingerprint or PIN';
    statusText.style.cssText = `
      margin-top: 15px;
      font-size: 16px;
      opacity: 0.9;
      font-weight: bold;
      animation: pulse 2s infinite;
    `;

    // Register new user button
    const registerButton = document.createElement('button');
    registerButton.id = 'registerButton';
    registerButton.innerHTML = '➕ Register New User';
    registerButton.style.cssText = `
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.4);
      padding: 12px 24px;
      border-radius: 25px;
      margin-top: 20px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    registerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showRegistrationModal();
    });
    registerButton.addEventListener('mouseenter', () => {
      registerButton.style.background = 'rgba(255,255,255,0.3)';
      registerButton.style.transform = 'scale(1.05)';
    });
    registerButton.addEventListener('mouseleave', () => {
      registerButton.style.background = 'rgba(255,255,255,0.2)';
      registerButton.style.transform = 'scale(1)';
    });

    // Assemble the container
    touchIdContainer.appendChild(touchIdIcon);
    touchIdContainer.appendChild(title);
    touchIdContainer.appendChild(description);
    touchIdContainer.appendChild(autoIndicator);
    touchIdContainer.appendChild(progressContainer);
    touchIdContainer.appendChild(statusText);
    touchIdContainer.appendChild(registerButton);

    // Add CSS animations
    this.addAnimations();

    // Replace camera container with Touch ID container
    const autoDetection = document.querySelector('.auto-detection');
    if (autoDetection) {
      autoDetection.appendChild(touchIdContainer);
    }

    statusEl.textContent = '✅ Login system ready! Click above to login or register.';
    statusEl.style.color = '#4CAF50';
  }

  addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
        50% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
        100% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
      }
      #touchIdContainer:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(style);
  }

  startAutoTouchIDDetection() {
    console.log('🌐 Login system ready for multi-device access...');
    
    // Listen for click/touch events to show login modal
    const touchIdContainer = document.getElementById('touchIdContainer');
    if (touchIdContainer) {
      touchIdContainer.addEventListener('click', async () => {
        if (!this.isAuthenticating) {
          console.log('👆 Container clicked - showing login modal');
          await this.authenticateWithTouchId();
        }
      });
    }
  }

  async authenticateWithTouchId() {
    if (!this.fingerprintAuth) {
      this.showError('Authentication system not initialized');
      return;
    }

    if (this.isAuthenticating) {
      console.log('Already authenticating, skipping...');
      return;
    }

    this.isAuthenticating = true;

    try {
      // Try fingerprint authentication first
      console.log('🔐 Attempting fingerprint authentication...');
      
      const user = await this.fingerprintAuth.authenticateUser(null, null, true);
      
      if (user) {
        console.log(`✅ Fingerprint authenticated: ${user.name}`);
        await this.handleUserAuthentication(user);
        this.isAuthenticating = false;
        return;
      }
    } catch (error) {
      // If fingerprint fails or credentials needed, show login modal
      if (error.message === 'CREDENTIALS_NEEDED') {
        console.log('📝 Fingerprint not available, showing login modal...');
        this.isAuthenticating = false;
        this.showLoginModal();
        return;
      } else {
        console.error('Authentication error:', error);
        this.showError(error.message);
      }
    }

    this.isAuthenticating = false;
  }

  showLoginModal() {
    // Check if modal already exists
    if (document.getElementById('loginModal')) {
      return;
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'loginModal';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      animation: slideUp 0.3s ease;
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = '🔐 Login';
    title.style.cssText = `
      color: white;
      margin: 0 0 10px 0;
      font-size: 1.8rem;
      text-align: center;
    `;

    // Description
    const description = document.createElement('p');
    description.textContent = 'Login with your username and PIN';
    description.style.cssText = `
      color: rgba(255,255,255,0.9);
      margin: 0 0 10px 0;
      text-align: center;
      font-size: 1rem;
    `;

    // Fingerprint hint
    const fpHint = document.createElement('p');
    fpHint.textContent = '💡 Fingerprint will be set up for quick access on this device';
    fpHint.style.cssText = `
      color: rgba(255,255,255,0.7);
      margin: 0 0 20px 0;
      text-align: center;
      font-size: 0.85rem;
    `;

    // Username input
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Your Name:';
    nameLabel.style.cssText = `
      color: white;
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 1rem;
    `;

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'loginNameInput';
    nameInput.placeholder = 'Enter your name...';
    nameInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 20px;
      background: rgba(255,255,255,0.9);
      color: #333;
      box-sizing: border-box;
    `;

    // PIN input
    const pinLabel = document.createElement('label');
    pinLabel.textContent = 'Your PIN:';
    pinLabel.style.cssText = `
      color: white;
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 1rem;
    `;

    const pinInput = document.createElement('input');
    pinInput.type = 'password';
    pinInput.id = 'loginPinInput';
    pinInput.placeholder = 'Enter your PIN...';
    pinInput.maxLength = 6;
    pinInput.inputMode = 'numeric';
    pinInput.pattern = '[0-9]*';
    pinInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 20px;
      background: rgba(255,255,255,0.9);
      color: #333;
      box-sizing: border-box;
      letter-spacing: 0.5em;
      text-align: center;
    `;

    // Status message
    const statusMessage = document.createElement('div');
    statusMessage.id = 'loginStatus';
    statusMessage.style.cssText = `
      color: white;
      margin: 15px 0;
      text-align: center;
      min-height: 24px;
      font-weight: bold;
    `;

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 15px;
      margin-top: 25px;
    `;

    // Login button
    const loginBtn = document.createElement('button');
    loginBtn.textContent = '✅ Login';
    loginBtn.style.cssText = `
      flex: 1;
      padding: 15px 25px;
      background: rgba(255,255,255,0.9);
      color: #764ba2;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    loginBtn.addEventListener('mouseenter', () => {
      loginBtn.style.background = 'white';
      loginBtn.style.transform = 'scale(1.05)';
    });
    loginBtn.addEventListener('mouseleave', () => {
      loginBtn.style.background = 'rgba(255,255,255,0.9)';
      loginBtn.style.transform = 'scale(1)';
    });
    loginBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const pin = pinInput.value.trim();
      if (!name) {
        statusMessage.textContent = '❌ Please enter your name';
        statusMessage.style.color = '#ffcccc';
      } else if (!pin) {
        statusMessage.textContent = '❌ Please enter your PIN';
        statusMessage.style.color = '#ffcccc';
      } else {
        this.processLogin(name, pin, statusMessage, modalOverlay);
      }
    });

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      flex: 1;
      padding: 15px 25px;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.4);
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = 'rgba(255,255,255,0.3)';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'rgba(255,255,255,0.2)';
    });
    cancelBtn.addEventListener('click', () => {
      modalOverlay.remove();
    });

    // Allow Enter key to submit
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        pinInput.focus();
      }
    });
    
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loginBtn.click();
      }
    });

    // Assemble modal
    buttonsContainer.appendChild(loginBtn);
    buttonsContainer.appendChild(cancelBtn);

    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(fpHint);
    modalContent.appendChild(nameLabel);
    modalContent.appendChild(nameInput);
    modalContent.appendChild(pinLabel);
    modalContent.appendChild(pinInput);
    modalContent.appendChild(statusMessage);
    modalContent.appendChild(buttonsContainer);

    modalOverlay.appendChild(modalContent);

    // Add to document
    document.body.appendChild(modalOverlay);

    // Focus the input
    setTimeout(() => nameInput.focus(), 100);

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
  }

  async processLogin(name, pin, statusMessage, modalOverlay) {
    try {
      statusMessage.textContent = '🔐 Logging in...';
      statusMessage.style.color = 'white';

      // Authenticate with username and PIN
      const user = await this.fingerprintAuth.authenticateUser(name, pin, false);

      if (user) {
        statusMessage.textContent = `✅ Welcome back, ${name}!`;
        statusMessage.style.color = '#4CAF50';
        
        // Setup fingerprint for this device if not already set up
        if (!this.fingerprintAuth.hasFingerprintOnDevice() && this.fingerprintAuth.isBiometricSupported) {
          try {
            statusMessage.textContent = '👆 Setting up fingerprint for quick access...';
            await this.fingerprintAuth.setupFingerprintForDevice(user.id, user.name);
            statusMessage.textContent = `✅ Fingerprint set up! You can now use fingerprint on this device.`;
          } catch (fpError) {
            console.log('Could not setup fingerprint:', fpError);
            // Continue without fingerprint
          }
        }
        
        // Close modal and process authentication
        setTimeout(async () => {
          modalOverlay.remove();
          await this.handleUserAuthentication(user);
        }, 1000);
      } else {
        throw new Error('Login failed - no user data returned');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.message.includes('Invalid username or PIN')) {
        errorMessage = '❌ Invalid username or PIN. Please try again.';
      } else if (error.message.includes('CREDENTIALS_NEEDED')) {
        errorMessage = '❌ Please enter your credentials';
      } else {
        errorMessage = '❌ ' + error.message;
      }
      
      statusMessage.textContent = errorMessage;
      statusMessage.style.color = '#ffcccc';
    }
  }

  async handleUserAuthentication(user) {
    console.log(`🔍 Processing user: ${user.name} (ID: ${user.id})`);
    
    try {
      // Start active session
      await this.fingerprintAuth.startActiveSession(user.id, 'start');
      
      // Save tap event
      await this.fingerprintAuth.saveTapEvent(user, 'start', 0);
      
      this.showSuccess(`🏃‍♂️ ${user.name} - Session started with Touch ID!`);
      
      // Start timer
      this.startSessionTimer();
      
    } catch (error) {
      console.error('Error processing user:', error);
      this.showError(`Failed to start session for ${user.name}: ${error.message}`);
    }
  }

  startSessionTimer() {
    this.sessionStartTime = new Date();
    
    this.timerInterval = setInterval(() => {
      if (this.sessionStartTime) {
        const now = new Date();
        const elapsed = Math.floor((now - this.sessionStartTime) / 1000);
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
          timerDisplay.textContent = utils.formatTime(elapsed);
        }
      }
    }, 1000);
  }

  showProgressBar() {
    const progressContainer = document.getElementById('progressContainer');
    const touchIdStatus = document.getElementById('touchIdStatus');
    if (progressContainer) progressContainer.style.display = 'block';
    if (touchIdStatus) touchIdStatus.style.fontWeight = 'bold';
  }

  hideProgressBar() {
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const touchIdStatus = document.getElementById('touchIdStatus');
    if (progressContainer) progressContainer.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
    if (touchIdStatus) touchIdStatus.style.fontWeight = 'normal';
  }

  updateProgress(percentage, message) {
    const progressBar = document.getElementById('progressBar');
    const touchIdStatus = document.getElementById('touchIdStatus');
    const statusEl = document.getElementById('status');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (touchIdStatus) touchIdStatus.textContent = message;
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.color = percentage === 100 ? '#4CAF50' : '#2196F3';
    }
  }

  showError(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = '❌ ' + message;
      statusEl.style.color = '#f44336';
    }
  }

  showSuccess(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.color = '#4CAF50';
    }
  }

  showRegistrationModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'registrationModal';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      animation: slideUp 0.3s ease;
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = '➕ Register New User';
    title.style.cssText = `
      color: white;
      margin: 0 0 10px 0;
      font-size: 1.8rem;
      text-align: center;
    `;

    // Description
    const description = document.createElement('p');
    description.textContent = 'Create your account with fingerprint + PIN backup';
    description.style.cssText = `
      color: rgba(255,255,255,0.9);
      margin: 0 0 10px 0;
      text-align: center;
      font-size: 1rem;
    `;

    // Multi-device hint
    const mdHint = document.createElement('p');
    mdHint.textContent = '🌐 Use fingerprint on THIS device, or PIN on ANY device';
    mdHint.style.cssText = `
      color: rgba(255,255,255,0.7);
      margin: 0 0 20px 0;
      text-align: center;
      font-size: 0.85rem;
    `;

    // Name input
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Your Name:';
    nameLabel.style.cssText = `
      color: white;
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 1rem;
    `;

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'registerNameInput';
    nameInput.placeholder = 'Enter your name...';
    nameInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 20px;
      background: rgba(255,255,255,0.9);
      color: #333;
      box-sizing: border-box;
    `;

    // PIN input
    const pinLabel = document.createElement('label');
    pinLabel.textContent = 'Create a 4-Digit PIN:';
    pinLabel.style.cssText = `
      color: white;
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 1rem;
    `;

    const pinInput = document.createElement('input');
    pinInput.type = 'password';
    pinInput.id = 'registerPinInput';
    pinInput.placeholder = 'Enter 4-digit PIN...';
    pinInput.maxLength = 6;
    pinInput.inputMode = 'numeric';
    pinInput.pattern = '[0-9]*';
    pinInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 10px;
      background: rgba(255,255,255,0.9);
      color: #333;
      box-sizing: border-box;
      letter-spacing: 0.5em;
      text-align: center;
    `;

    // PIN hint
    const pinHint = document.createElement('p');
    pinHint.textContent = '💡 Remember this PIN - you\'ll use it to log in from any device';
    pinHint.style.cssText = `
      color: rgba(255,255,255,0.8);
      margin: 0 0 20px 0;
      font-size: 0.9rem;
      text-align: center;
    `;

    // Status message
    const statusMessage = document.createElement('div');
    statusMessage.id = 'registrationStatus';
    statusMessage.style.cssText = `
      color: white;
      margin: 15px 0;
      text-align: center;
      min-height: 24px;
      font-weight: bold;
    `;

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 15px;
      margin-top: 25px;
    `;

    // Register button
    const registerBtn = document.createElement('button');
    registerBtn.textContent = '✅ Create Account';
    registerBtn.style.cssText = `
      flex: 1;
      padding: 15px 25px;
      background: rgba(255,255,255,0.9);
      color: #764ba2;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    registerBtn.addEventListener('mouseenter', () => {
      registerBtn.style.background = 'white';
      registerBtn.style.transform = 'scale(1.05)';
    });
    registerBtn.addEventListener('mouseleave', () => {
      registerBtn.style.background = 'rgba(255,255,255,0.9)';
      registerBtn.style.transform = 'scale(1)';
    });
    registerBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const pin = pinInput.value.trim();
      if (!name) {
        statusMessage.textContent = '❌ Please enter your name';
        statusMessage.style.color = '#ffcccc';
      } else if (!pin || pin.length < 4) {
        statusMessage.textContent = '❌ PIN must be at least 4 digits';
        statusMessage.style.color = '#ffcccc';
      } else {
        this.registerNewUser(name, pin, statusMessage, modalOverlay);
      }
    });

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      flex: 1;
      padding: 15px 25px;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.4);
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = 'rgba(255,255,255,0.3)';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'rgba(255,255,255,0.2)';
    });
    cancelBtn.addEventListener('click', () => {
      modalOverlay.remove();
    });

    // Allow Enter key to submit
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        pinInput.focus();
      }
    });
    
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        registerBtn.click();
      }
    });

    // Assemble modal
    buttonsContainer.appendChild(registerBtn);
    buttonsContainer.appendChild(cancelBtn);

    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(mdHint);
    modalContent.appendChild(nameLabel);
    modalContent.appendChild(nameInput);
    modalContent.appendChild(pinLabel);
    modalContent.appendChild(pinInput);
    modalContent.appendChild(pinHint);
    modalContent.appendChild(statusMessage);
    modalContent.appendChild(buttonsContainer);

    modalOverlay.appendChild(modalContent);

    // Add modal animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    // Add to document
    document.body.appendChild(modalOverlay);

    // Focus the input
    setTimeout(() => nameInput.focus(), 100);

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
  }

  async registerNewUser(name, pin, statusMessage, modalOverlay) {
    try {
      statusMessage.textContent = '📝 Creating your account...';
      statusMessage.style.color = 'white';

      // Call the registration with username and PIN (includes fingerprint setup)
      const user = await this.fingerprintAuth.registerUser(name, pin, true);

      if (user) {
        const hasFP = this.fingerprintAuth.hasFingerprintOnDevice();
        statusMessage.textContent = `✅ Successfully registered ${name}!`;
        statusMessage.style.color = '#4CAF50';
        
        // Show success and close modal
        setTimeout(() => {
          modalOverlay.remove();
          if (hasFP) {
            this.showSuccess(`🎉 Welcome ${name}! Use fingerprint on THIS device or PIN "${pin}" on any other device.`);
          } else {
            this.showSuccess(`🎉 Welcome ${name}! Use your name + PIN to login from any device.`);
          }
        }, 2000);
      } else {
        throw new Error('Registration failed - no user data returned');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      if (error.message.includes('already taken')) {
        errorMessage = '❌ This username is already taken. Please choose another.';
      } else if (error.message.includes('wait before registering')) {
        errorMessage = '❌ Please wait a moment before registering again';
      } else if (error.message.includes('PIN must be')) {
        errorMessage = '❌ ' + error.message;
      } else {
        errorMessage = '❌ ' + error.message;
      }
      
      statusMessage.textContent = errorMessage;
      statusMessage.style.color = '#ffcccc';
    }
  }
}
