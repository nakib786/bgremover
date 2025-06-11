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

// State
let currentImageBlob = null;
let currentImageName = 'background-removed.png';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
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