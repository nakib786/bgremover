// API Configuration - Using secure proxy
const API_URL = '/api/remove-bg';

// DOM Elements
const uploadSection = document.getElementById('uploadSection');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const urlSubmit = document.getElementById('urlSubmit');

const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const retryBtn = document.getElementById('retryBtn');
const errorMessage = document.getElementById('errorMessage');
const comparisonOverlay = document.getElementById('comparisonOverlay');
const currentViewLabel = document.getElementById('currentViewLabel');

// State
let currentImageBlob = null;
let currentImageName = 'background-removed.png';
let isHolding = false;
let holdTimeout = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeLiquidEffects();
});

function setupEventListeners() {
    // File input events
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    // URL input events
    urlSubmit.addEventListener('click', handleUrlSubmit);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUrlSubmit();
        }
    });
    
    // Action button events
    downloadBtn.addEventListener('click', handleDownload);
    newImageBtn.addEventListener('click', resetApp);
    retryBtn.addEventListener('click', resetApp);
    
    // Setup comparison events
    setupComparisonEvents();
    
    // Prevent default drag behaviors on document
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (isValidImageFile(file)) {
            processImageFile(file);
        } else {
            showError('Please select a valid image file (JPG, PNG, GIF, BMP, WebP)');
        }
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && isValidImageFile(file)) {
        processImageFile(file);
    } else if (file) {
        showError('Please select a valid image file (JPG, PNG, GIF, BMP, WebP)');
    }
}

// URL Submit Handler
function handleUrlSubmit() {
    const url = urlInput.value.trim();
    if (!url) {
        showError('Please enter a valid image URL');
        return;
    }
    
    if (!isValidImageUrl(url)) {
        showError('Please enter a valid image URL (must end with .jpg, .jpeg, .png, .gif, .bmp, or .webp)');
        return;
    }
    
    processImageUrl(url);
}

// Image Processing Functions
async function processImageFile(file) {
    currentImageName = file.name.replace(/\.[^/.]+$/, '') + '-background-removed.png';
    
    try {
        showLoading();
        
        // Show original image
        const originalUrl = URL.createObjectURL(file);
        originalImage.src = originalUrl;
        
                // Validate file size (max 12MB for remove.bg)
        if (file.size > 12 * 1024 * 1024) {
            throw new Error('Image file is too large. Maximum size is 12MB.');
        }

        // Create FormData for API request
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        console.log('Sending request to:', API_URL);
        console.log('File size:', file.size, 'bytes');
        console.log('File type:', file.type);

        // Call remove.bg API via secure proxy
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }
        
        // Process the result
        const blob = await response.blob();
        currentImageBlob = blob;
        
        const resultUrl = URL.createObjectURL(blob);
        resultImage.src = resultUrl;
        
        showResult();
        
    } catch (error) {
        console.error('Error processing image:', error);
        showError(error.message);
    }
}

async function processImageUrl(url) {
    currentImageName = 'background-removed.png';
    
    try {
        showLoading();
        
        // Show original image
        originalImage.src = url;
        
                // Create FormData for API request
        const formData = new FormData();
        formData.append('image_url', url);
        formData.append('size', 'auto');

        console.log('Sending URL request to:', API_URL);
        console.log('Image URL:', url);

        // Call remove.bg API via secure proxy
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }
        
        // Process the result
        const blob = await response.blob();
        currentImageBlob = blob;
        
        const resultUrl = URL.createObjectURL(blob);
        resultImage.src = resultUrl;
        
        showResult();
        
    } catch (error) {
        console.error('Error processing image:', error);
        showError(error.message);
    }
}

// UI State Management
function showLoading() {
    hideAllSections();
    loadingSection.style.display = 'block';
}

function showResult() {
    hideAllSections();
    resultSection.style.display = 'block';
}

function showError(message) {
    hideAllSections();
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
}

function hideAllSections() {
    uploadSection.style.display = 'none';
    loadingSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}

function resetApp() {
    hideAllSections();
    uploadSection.style.display = 'block';
    
    // Reset form inputs
    fileInput.value = '';
    urlInput.value = '';
    
    // Clean up object URLs
    if (originalImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(originalImage.src);
    }
    if (resultImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(resultImage.src);
    }
    
    // Reset state
    currentImageBlob = null;
    currentImageName = 'background-removed.png';
}

// Download Handler
function handleDownload() {
    if (!currentImageBlob) {
        showError('No image available for download');
        return;
    }
    
    const url = URL.createObjectURL(currentImageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentImageName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility Functions
function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    return validTypes.includes(file.type);
}

function isValidImageUrl(url) {
    try {
        new URL(url);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const urlLower = url.toLowerCase();
        return validExtensions.some(ext => urlLower.includes(ext));
    } catch {
        return false;
    }
}

async function getErrorMessage(response) {
    try {
        const errorData = await response.json();
        
        // Handle specific remove.bg error codes
        switch (response.status) {
            case 400:
                // Check for specific error details from our API proxy
                if (errorData.details) {
                    if (typeof errorData.details === 'string') {
                        return errorData.details;
                    }
                    return errorData.details || 'Invalid image format or size. Please try a different image.';
                }
                return errorData.error || 'Invalid image format or size. Please try a different image.';
            case 402:
                return 'API credit limit exceeded. Please try again later.';
            case 403:
                return 'Invalid API key or access denied.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return errorData.message || errorData.details || 'Server error. Please try again.';
            default:
                return errorData.details || errorData.error || errorData.message || `Server error (${response.status}). Please try again.`;
        }
    } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return `Network error (${response.status}). Please check your connection and try again.`;
    }
}

// Add some visual feedback for better UX
function addVisualFeedback() {
    // Add pulse animation to upload icon when page loads
    const uploadIcon = document.querySelector('.upload-icon');
    if (uploadIcon) {
        uploadIcon.style.animation = 'bounce 2s infinite';
    }
    
    // Add smooth transitions for section changes
    const sections = [uploadSection, loadingSection, resultSection, errorSection];
    sections.forEach(section => {
        if (section) {
            section.style.transition = 'opacity 0.3s ease-in-out';
        }
    });
}

// Initialize visual feedback
document.addEventListener('DOMContentLoaded', addVisualFeedback);

// Setup comparison events for hold-to-compare functionality
function setupComparisonEvents() {
    const comparisonWrapper = document.querySelector('.comparison-wrapper');
    
    if (!comparisonWrapper) return;
    
    // Mouse events
    comparisonWrapper.addEventListener('mousedown', startHolding);
    comparisonWrapper.addEventListener('mouseup', stopHolding);
    comparisonWrapper.addEventListener('mouseleave', stopHolding);
    
    // Touch events for mobile
    comparisonWrapper.addEventListener('touchstart', startHolding, { passive: false });
    comparisonWrapper.addEventListener('touchend', stopHolding);
    comparisonWrapper.addEventListener('touchcancel', stopHolding);
    
    // Prevent context menu on right click
    comparisonWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
}

function startHolding(e) {
    e.preventDefault();
    
    if (isHolding) return;
    
    isHolding = true;
    const comparisonWrapper = document.querySelector('.comparison-wrapper');
    
    // Add active class for visual feedback
    comparisonWrapper.classList.add('active');
    
    // Show original image
    originalImage.classList.add('show');
    currentViewLabel.textContent = 'Original';
    currentViewLabel.classList.add('showing-original');
    
    // Add slight delay to prevent accidental triggers
    holdTimeout = setTimeout(() => {
        if (isHolding) {
            // Additional feedback can be added here
            console.log('Hold confirmed');
        }
    }, 100);
}

function stopHolding(e) {
    if (!isHolding) return;
    
    isHolding = false;
    const comparisonWrapper = document.querySelector('.comparison-wrapper');
    
    // Clear timeout
    if (holdTimeout) {
        clearTimeout(holdTimeout);
        holdTimeout = null;
    }
    
    // Remove active class
    comparisonWrapper.classList.remove('active');
    
    // Hide original image
    originalImage.classList.remove('show');
    currentViewLabel.textContent = 'Background Removed';
    currentViewLabel.classList.remove('showing-original');
}

// Initialize liquid splash effects
function initializeLiquidEffects() {
    const liquidContainer = document.getElementById('liquidContainer');
    let splashCount = 0;
    const maxSplashes = 10;
    
    // Mouse move event for liquid effects
    document.addEventListener('mousemove', (e) => {
        // Throttle the effect to prevent too many splashes
        if (Math.random() > 0.95) {
            createLiquidSplash(e.clientX, e.clientY, liquidContainer);
        }
    });
    
    // Click event for bigger splash
    document.addEventListener('click', (e) => {
        createLiquidSplash(e.clientX, e.clientY, liquidContainer, true);
    });
    
    function createLiquidSplash(x, y, container, isBig = false) {
        if (splashCount >= maxSplashes) return;
        
        const splash = document.createElement('div');
        splash.className = 'liquid-splash';
        
        if (isBig) {
            splash.style.background = `radial-gradient(circle, 
                rgba(64, 224, 208, 0.6) 0%, 
                rgba(138, 43, 226, 0.5) 30%,
                rgba(255, 20, 147, 0.4) 60%, 
                transparent 100%)`;
        }
        
        splash.style.left = x + 'px';
        splash.style.top = y + 'px';
        
        container.appendChild(splash);
        splashCount++;
        
        // Remove splash after animation
        setTimeout(() => {
            if (splash.parentNode) {
                splash.parentNode.removeChild(splash);
                splashCount--;
            }
        }, 1500);
    }
} 