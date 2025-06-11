// Enhanced API Configuration
const API_URL = '/api/remove-bg';

// DOM Elements
const uploadSection = document.getElementById('upload-section');
const loadingSection = document.getElementById('loading-section');
const resultSection = document.getElementById('result-section');
const batchResultsSection = document.getElementById('batch-section');
const errorSection = document.getElementById('errorSection');
const featureOptions = document.getElementById('feature-options');

const dropZone = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const urlInput = document.getElementById('urlInput');
const urlSubmit = document.getElementById('urlSubmit');

const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('result-image');
const downloadBtn = document.getElementById('download-btn');
const newImageBtn = document.getElementById('newImageBtn');
const retryBtn = document.getElementById('retryBtn');
const errorMessage = document.getElementById('errorMessage');
const comparisonOverlay = document.getElementById('comparisonOverlay');
const currentViewLabel = document.getElementById('currentViewLabel');

// Feature-specific elements
const featureTabs = document.querySelectorAll('.tab-btn');
const featureDescriptionText = document.getElementById('feature-description');
const uploadTitle = document.getElementById('upload-title');
const uploadSubtitle = document.getElementById('upload-subtitle');
const loadingTitle = document.getElementById('loading-title');
const loadingSubtitle = document.getElementById('loading-subtitle');

// Feature options elements
const bgColorPicker = document.getElementById('bgColorPicker');
const bgFileInput = document.getElementById('bgFileInput');
const bgDropZone = document.getElementById('bgDropZone');
const blurIntensity = document.getElementById('blurIntensity');
const blurValue = document.getElementById('blurValue');
const shadowType = document.getElementById('shadowType');
const shadowOpacity = document.getElementById('shadowOpacity');
const shadowOpacityValue = document.getElementById('shadowOpacityValue');
const productType = document.getElementById('productType');

// Batch processing elements
const batchFileInput = document.getElementById('batchFileInput');
const batchDropZone = document.getElementById('batchDropZone');
const batchProgress = document.getElementById('batchProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const batchResultsGrid = document.getElementById('batch-results');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const newBatchBtn = document.getElementById('newBatchBtn');

// State
let currentFeature = 'background-removal';
let selectedFiles = [];
let batchResults = [];
let isHolding = false;
let holdTimeout = null;

// Feature descriptions with proper functionality
const featureDescriptions = {
    'background-removal': {
        title: 'Background Removal',
        description: 'Remove backgrounds from images with AI precision. Perfect for product photos, portraits, and creating transparent images.',
        uploadTitle: 'Upload Image for Background Removal',
        loadingTitle: 'Removing Background...'
    },
    'magic-brush': {
        title: 'Magic Brush',
        description: 'Manually refine background removal with precision brush tools. Paint to keep or remove specific areas.',
        uploadTitle: 'Upload Image for Magic Brush Editing',
        loadingTitle: 'Processing with Magic Brush...'
    },
    'custom-background': {
        title: 'Custom Background',
        description: 'Replace backgrounds with your own images. Upload a background image to create stunning compositions.',
        uploadTitle: 'Upload Image and Background',
        loadingTitle: 'Adding Custom Background...'
    },
    'blur-background': {
        title: 'Blur Background',
        description: 'Create professional depth-of-field effects by blurring the background while keeping the subject sharp.',
        uploadTitle: 'Upload Image for Background Blur',
        loadingTitle: 'Blurring Background...'
    },
    'ai-shadow': {
        title: 'AI Shadow',
        description: 'Add realistic shadows to your subjects. Perfect for product photography and creating natural-looking compositions.',
        uploadTitle: 'Upload Image for AI Shadow',
        loadingTitle: 'Adding AI Shadow...'
    },
    'product-photo': {
        title: 'Product Photo Editor',
        description: 'Optimize product images for e-commerce. Remove backgrounds, add shadows, and enhance for online stores.',
        uploadTitle: 'Upload Product Image',
        loadingTitle: 'Optimizing Product Photo...'
    },
    'batch-editing': {
        title: 'Batch Editing',
        description: 'Process multiple images at once. Upload up to 10 images and apply the same edits to all.',
        uploadTitle: 'Upload Multiple Images (Max 10)',
        loadingTitle: 'Processing Batch...'
    },
    'background-color': {
        title: 'Add Background Color',
        description: 'Replace backgrounds with solid colors. Choose from presets or pick custom colors for your images.',
        uploadTitle: 'Upload Image for Color Background',
        loadingTitle: 'Adding Background Color...'
    },
    'video-background': {
        title: 'Remove Video Background',
        description: 'Remove backgrounds from video frames. Extract frames, process them, and create transparent videos.',
        uploadTitle: 'Upload Video for Background Removal',
        loadingTitle: 'Processing Video Frames...'
    },
    'logo-background': {
        title: 'Remove Logo Background',
        description: 'Perfect for logos and graphics. Remove backgrounds while preserving crisp edges and transparency.',
        uploadTitle: 'Upload Logo Image',
        loadingTitle: 'Removing Logo Background...'
    },
    'sky-replacer': {
        title: 'Sky Replacer',
        description: 'Replace skies in landscape photos. Transform cloudy days into perfect blue skies or dramatic sunsets.',
        uploadTitle: 'Upload Landscape Image',
        loadingTitle: 'Replacing Sky...'
    },
    'signature-background': {
        title: 'Remove Signature Background',
        description: 'Clean up scanned signatures and handwritten text. Remove paper backgrounds for digital use.',
        uploadTitle: 'Upload Signature Image',
        loadingTitle: 'Cleaning Signature...'
    },
    'cv-photo': {
        title: 'Create CV Photo',
        description: 'Create professional headshots for resumes and profiles. Remove backgrounds and optimize for professional use.',
        uploadTitle: 'Upload Portrait for CV',
        loadingTitle: 'Creating CV Photo...'
    },
    'car-photo': {
        title: 'Car Photo Editor',
        description: 'Specialized for automotive photography. Remove backgrounds, add shadows, and enhance car images.',
        uploadTitle: 'Upload Car Image',
        loadingTitle: 'Editing Car Photo...'
    },
    'youtube-thumbnail': {
        title: 'Create YouTube Thumbnail',
        description: 'Design eye-catching YouTube thumbnails. Remove backgrounds and create engaging preview images.',
        uploadTitle: 'Upload Image for Thumbnail',
        loadingTitle: 'Creating Thumbnail...'
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeLiquidEffects();
    initializeFeatureTabs();
    initializeFeatureOptions();
    updateFeatureContent();
});

function setupEventListeners() {
    // File input events
    dropZone.addEventListener('click', () => {
        if (currentFeature === 'batch-editing') {
            batchFileInput.click();
        } else {
            fileInput.click();
        }
    });
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
    
    // Batch processing events
    if (batchFileInput) {
        batchFileInput.addEventListener('change', handleBatchFileSelect);
    }
    if (batchDropZone) {
        batchDropZone.addEventListener('click', () => batchFileInput.click());
    }
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', handleDownloadAll);
    }
    if (newBatchBtn) {
        newBatchBtn.addEventListener('click', resetApp);
    }
    
    // Background upload events
    if (bgDropZone) {
        bgDropZone.addEventListener('click', () => bgFileInput.click());
        bgFileInput.addEventListener('change', handleBackgroundFileSelect);
    }
    
    // Setup comparison events
    setupComparisonEvents();
    
    // Prevent default drag behaviors on document
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
}

function initializeFeatureTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const feature = tab.dataset.feature;
            console.log('Tab clicked:', feature); // Debug log
            switchFeature(feature);
        });
    });
}

function initializeFeatureOptions() {
    // Color picker events
    if (bgColorPicker) {
        bgColorPicker.addEventListener('change', updateColorPreview);
    }
    
    // Color preset events
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            bgColorPicker.value = color;
            updateColorPreview();
        });
    });
    
    // Range input events
    if (blurIntensity) {
        blurIntensity.addEventListener('input', () => {
            blurValue.textContent = blurIntensity.value;
        });
    }
    
    if (shadowOpacity) {
        shadowOpacity.addEventListener('input', () => {
            shadowOpacityValue.textContent = shadowOpacity.value + '%';
        });
    }
    
    // Sky replacer events
    const skyType = document.getElementById('skyType');
    if (skyType) {
        skyType.addEventListener('change', (e) => {
            const customUpload = document.getElementById('customSkyUpload');
            if (customUpload) {
                customUpload.style.display = e.target.value === 'custom' ? 'block' : 'none';
            }
        });
    }
    
    // YouTube thumbnail events
    const thumbnailBg = document.getElementById('thumbnailBg');
    if (thumbnailBg) {
        thumbnailBg.addEventListener('change', (e) => {
            const colorGroup = document.getElementById('thumbnailColorGroup');
            if (colorGroup) {
                colorGroup.style.display = e.target.value === 'solid' ? 'block' : 'none';
            }
        });
    }
}

function switchFeature(feature) {
    console.log('Switching to feature:', feature); // Debug log
    currentFeature = feature;
    
    // Update active tab
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if (tab.dataset.feature === feature) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update description
    if (featureDescriptionText) {
        const featureData = featureDescriptions[feature] || featureDescriptions['background-removal'];
        featureDescriptionText.innerHTML = `<h3>${featureData.title}</h3><p>${featureData.description}</p>`;
    }
    
    // Update UI text based on feature
    updateUIText(feature);
    
    // Show/hide feature options
    updateFeatureOptions(feature);
    
    // Reset app state
    resetApp();
}

function updateUIText(feature) {
    const textMappings = {
        'background-removal': {
            uploadTitle: 'Drop your image here',
            uploadSubtitle: 'or click to browse files',
            loadingTitle: 'Removing background...',
            loadingSubtitle: 'This may take a few seconds',
            resultLabel: 'Background Removed'
        },
        'magic-brush': {
            uploadTitle: 'Drop your image here',
            uploadSubtitle: 'for magic brush editing',
            loadingTitle: 'Applying magic brush...',
            loadingSubtitle: 'AI is working its magic',
            resultLabel: 'Magic Brush Applied'
        },
        'custom-background': {
            uploadTitle: 'Drop your main image here',
            uploadSubtitle: 'then upload a background below',
            loadingTitle: 'Adding custom background...',
            loadingSubtitle: 'Compositing images together',
            resultLabel: 'Custom Background Added'
        },
        'blur-background': {
            uploadTitle: 'Drop your image here',
            uploadSubtitle: 'to blur the background',
            loadingTitle: 'Blurring background...',
            loadingSubtitle: 'Creating depth effect',
            resultLabel: 'Background Blurred'
        },
        'ai-shadow': {
            uploadTitle: 'Drop your image here',
            uploadSubtitle: 'to add AI shadows',
            loadingTitle: 'Adding AI shadows...',
            loadingSubtitle: 'Generating realistic shadows',
            resultLabel: 'AI Shadow Added'
        },
        'product-photo': {
            uploadTitle: 'Drop your product image here',
            uploadSubtitle: 'for product photo optimization',
            loadingTitle: 'Optimizing product photo...',
            loadingSubtitle: 'Enhancing product image',
            resultLabel: 'Product Photo Optimized'
        },
        'batch-editing': {
            uploadTitle: 'Drop multiple images here',
            uploadSubtitle: 'for batch processing',
            loadingTitle: 'Processing batch...',
            loadingSubtitle: 'Working on multiple images',
            resultLabel: 'Batch Processed'
        },
        'background-color': {
            uploadTitle: 'Drop your image here',
            uploadSubtitle: 'to add colored background',
            loadingTitle: 'Adding background color...',
            loadingSubtitle: 'Applying color background',
            resultLabel: 'Background Color Added'
        },
        'video-background': {
            uploadTitle: 'Drop your video here',
            uploadSubtitle: 'for video background removal',
            loadingTitle: 'Processing video frames...',
            loadingSubtitle: 'Extracting frames',
            resultLabel: 'Video Background Removed'
        },
        'logo-background': {
            uploadTitle: 'Drop your logo image here',
            uploadSubtitle: 'for logo background removal',
            loadingTitle: 'Removing logo background...',
            loadingSubtitle: 'Preserving crisp edges',
            resultLabel: 'Logo Background Removed'
        },
        'sky-replacer': {
            uploadTitle: 'Drop your landscape image here',
            uploadSubtitle: 'for sky replacement',
            loadingTitle: 'Replacing sky...',
            loadingSubtitle: 'Transforming skies',
            resultLabel: 'Sky Replaced'
        },
        'signature-background': {
            uploadTitle: 'Drop your signature image here',
            uploadSubtitle: 'for signature background removal',
            loadingTitle: 'Cleaning signature...',
            loadingSubtitle: 'Removing paper background',
            resultLabel: 'Signature Background Removed'
        },
        'cv-photo': {
            uploadTitle: 'Drop your portrait here',
            uploadSubtitle: 'for CV photo creation',
            loadingTitle: 'Creating CV photo...',
            loadingSubtitle: 'Preparing professional portrait',
            resultLabel: 'CV Photo Ready'
        },
        'car-photo': {
            uploadTitle: 'Drop your car image here',
            uploadSubtitle: 'for automotive editing',
            loadingTitle: 'Enhancing car photo...',
            loadingSubtitle: 'Optimizing automotive image',
            resultLabel: 'Car Photo Enhanced'
        },
        'youtube-thumbnail': {
            uploadTitle: 'Drop your image here',
            uploadSubtitle: 'for thumbnail creation',
            loadingTitle: 'Creating thumbnail...',
            loadingSubtitle: 'Designing eye-catching thumbnail',
            resultLabel: 'YouTube Thumbnail Created'
        }
    };
    
    const texts = textMappings[feature] || textMappings['background-removal'];
    
    if (uploadTitle) uploadTitle.textContent = texts.uploadTitle;
    if (uploadSubtitle) uploadSubtitle.textContent = texts.uploadSubtitle;
    if (loadingTitle) loadingTitle.textContent = texts.loadingTitle;
    if (loadingSubtitle) loadingSubtitle.textContent = texts.loadingSubtitle;
    if (currentViewLabel) currentViewLabel.textContent = texts.resultLabel;
}

function updateFeatureOptions(feature) {
    // Hide all option groups first
    document.querySelectorAll('.option-group').forEach(group => {
        group.style.display = 'none';
    });
    
    // Show feature options container if needed
    const hasOptions = ['custom-background', 'blur-background', 'ai-shadow', 'background-color', 'product-photo', 'batch-editing', 'sky-replacer', 'cv-photo', 'car-photo', 'youtube-thumbnail'].includes(feature);
    if (featureOptions) {
        featureOptions.style.display = hasOptions ? 'block' : 'none';
    }
    
    // Show specific options based on feature
    switch (feature) {
        case 'custom-background':
            document.getElementById('customBgOptions').style.display = 'block';
            break;
        case 'blur-background':
            document.getElementById('blurOptions').style.display = 'block';
            break;
        case 'ai-shadow':
            document.getElementById('shadowOptions').style.display = 'block';
            break;
        case 'background-color':
            document.getElementById('bgColorOptions').style.display = 'block';
            break;
        case 'product-photo':
            document.getElementById('productOptions').style.display = 'block';
            break;
        case 'batch-editing':
            document.getElementById('batchOptions').style.display = 'block';
            break;
        case 'sky-replacer':
            document.getElementById('skyOptions').style.display = 'block';
            break;
        case 'cv-photo':
            document.getElementById('cvOptions').style.display = 'block';
            break;
        case 'car-photo':
            document.getElementById('carOptions').style.display = 'block';
            break;
        case 'youtube-thumbnail':
            document.getElementById('thumbnailOptions').style.display = 'block';
            break;
    }
}

function updateColorPreview() {
    // Update color preview if needed
    console.log('Background color updated:', bgColorPicker.value);
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
        if (currentFeature === 'batch-editing') {
            handleBatchFiles(files);
        } else {
            const file = files[0];
            if (!isValidImageFile(file)) {
                showError('Please select a valid image file (JPG, PNG, GIF, BMP, WebP)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showError('Image file is too large. Maximum size is 5MB. Please compress your image or use a smaller file.');
                return;
            }
            processImageFile(file);
        }
    }
}

// File Selection Handlers
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

function handleBatchFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleBatchFiles(files);
    }
}

function handleBackgroundFileSelect(e) {
    const file = e.target.files[0];
    if (file && isValidImageFile(file)) {
        currentBackgroundFile = file;
        bgDropZone.innerHTML = `<span>Background selected: ${file.name}</span>`;
    } else if (file) {
        showError('Please select a valid background image file');
    }
}

function handleBatchFiles(files) {
    const validFiles = Array.from(files).filter(isValidImageFile);
    if (validFiles.length === 0) {
        showError('Please select valid image files');
        return;
    }
    
    if (validFiles.length > 20) {
        showError('Maximum 20 images allowed per batch');
        return;
    }
    
    processBatchImages(validFiles);
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
    currentImageName = generateFileName(file.name);
    
    try {
        showLoading();
        
        // Show original image
        const originalUrl = URL.createObjectURL(file);
        originalImage.src = originalUrl;
        
        // Validate file size (max 5MB to avoid server limits)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image file is too large. Maximum size is 5MB. Please compress your image or use a smaller file.');
        }

        // Create FormData for API request
        const formData = createFormData(file);

        console.log('Sending request to:', API_URL);
        console.log('Feature:', currentFeature);
        console.log('File size:', file.size, 'bytes');

        // Call enhanced remove.bg API
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
    currentImageName = generateFileName('image-from-url');
    
    try {
        showLoading();
        
        // Show original image
        originalImage.src = url;
        
        // Create FormData for API request
        const formData = createFormDataFromUrl(url);

        console.log('Sending URL request to:', API_URL);
        console.log('Feature:', currentFeature);
        console.log('Image URL:', url);

        // Call enhanced remove.bg API
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

async function processBatchImages(files) {
    try {
        showLoading();
        batchProgress.style.display = 'block';
        batchResults = [];
        
        const total = files.length;
        let completed = 0;
        
        progressText.textContent = `0 / ${total} images processed`;
        progressFill.style.width = '0%';
        
        // Process images in parallel (max 3 at a time to avoid rate limits)
        const batchSize = 3;
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const promises = batch.map(file => processSingleBatchImage(file));
            
            const results = await Promise.allSettled(promises);
            
            results.forEach((result, index) => {
                completed++;
                const file = batch[index];
                
                if (result.status === 'fulfilled') {
                    batchResults.push({
                        name: file.name,
                        originalFile: file,
                        processedBlob: result.value,
                        success: true
                    });
                } else {
                    batchResults.push({
                        name: file.name,
                        originalFile: file,
                        error: result.reason.message,
                        success: false
                    });
                }
                
                // Update progress
                const progress = (completed / total) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${completed} / ${total} images processed`;
            });
        }
        
        showBatchResults();
        
    } catch (error) {
        console.error('Error processing batch:', error);
        showError(error.message);
    }
}

async function processSingleBatchImage(file) {
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${file.name}: File too large (max 5MB)`);
    }

    // Create FormData for API request
    const formData = createFormData(file);

    // Call API
    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response);
        throw new Error(`${file.name}: ${errorMsg}`);
    }
    
    return await response.blob();
}

function createFormData(file) {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');
    formData.append('feature', currentFeature);
    
    // Add feature-specific parameters
    switch (currentFeature) {
        case 'custom-background':
            if (currentBackgroundFile) {
                formData.append('bg_image_file', currentBackgroundFile);
            }
            break;
        case 'background-color':
            if (bgColorPicker) {
                formData.append('bg_color', bgColorPicker.value.replace('#', ''));
            }
            break;
        case 'blur-background':
            if (blurIntensity) {
                formData.append('blur_intensity', blurIntensity.value);
            }
            break;
        case 'ai-shadow':
            if (shadowType) {
                formData.append('shadow_type', shadowType.value);
            }
            if (shadowOpacity) {
                formData.append('shadow_opacity', shadowOpacity.value);
            }
            break;
        case 'product-photo':
            if (productType) {
                formData.append('type', productType.value);
            }
            break;
    }
    
    return formData;
}

function createFormDataFromUrl(url) {
    const formData = new FormData();
    formData.append('image_url', url);
    formData.append('size', 'auto');
    formData.append('feature', currentFeature);
    
    // Add feature-specific parameters (same as createFormData)
    switch (currentFeature) {
        case 'background-color':
            if (bgColorPicker) {
                formData.append('bg_color', bgColorPicker.value.replace('#', ''));
            }
            break;
        case 'blur-background':
            if (blurIntensity) {
                formData.append('blur_intensity', blurIntensity.value);
            }
            break;
        case 'ai-shadow':
            if (shadowType) {
                formData.append('shadow_type', shadowType.value);
            }
            if (shadowOpacity) {
                formData.append('shadow_opacity', shadowOpacity.value);
            }
            break;
        case 'product-photo':
            if (productType) {
                formData.append('type', productType.value);
            }
            break;
    }
    
    return formData;
}

function generateFileName(originalName) {
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    const featureSuffix = currentFeature.replace('-', '_');
    return `${baseName}_${featureSuffix}.png`;
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

function showBatchResults() {
    hideAllSections();
    batchResultsSection.style.display = 'block';
    renderBatchResults();
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
    batchResultsSection.style.display = 'none';
    errorSection.style.display = 'none';
}

function renderBatchResults() {
    batchResultsGrid.innerHTML = '';
    
    batchResults.forEach((result, index) => {
        const item = document.createElement('div');
        item.className = 'batch-result-item';
        
        if (result.success) {
            const imageUrl = URL.createObjectURL(result.processedBlob);
            item.innerHTML = `
                <img src="${imageUrl}" alt="${result.name}" class="batch-result-image">
                <div class="batch-result-name">${result.name}</div>
                <div class="batch-result-actions">
                    <button class="batch-download-btn" onclick="downloadBatchItem(${index})">Download</button>
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="batch-result-error">
                    <div class="batch-result-name">${result.name}</div>
                    <div class="batch-error-message">${result.error}</div>
                </div>
            `;
            item.style.background = 'rgba(255, 0, 0, 0.1)';
            item.style.borderColor = 'rgba(255, 0, 0, 0.3)';
        }
        
        batchResultsGrid.appendChild(item);
    });
}

function resetApp() {
    hideAllSections();
    uploadSection.style.display = 'block';
    
    // Reset form inputs
    fileInput.value = '';
    urlInput.value = '';
    if (batchFileInput) batchFileInput.value = '';
    if (bgFileInput) bgFileInput.value = '';
    
    // Reset background file
    currentBackgroundFile = null;
    if (bgDropZone) {
        bgDropZone.innerHTML = '<span>Click to upload background image</span>';
    }
    
    // Hide batch progress
    if (batchProgress) {
        batchProgress.style.display = 'none';
    }
    
    // Clean up object URLs
    if (originalImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(originalImage.src);
    }
    if (resultImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(resultImage.src);
    }
    
    // Clean up batch results
    batchResults.forEach(result => {
        if (result.processedBlob) {
            URL.revokeObjectURL(URL.createObjectURL(result.processedBlob));
        }
    });
    batchResults = [];
    
    // Reset state
    currentImageBlob = null;
    currentImageName = 'processed-image.png';
}

// Download Handlers
function handleDownload() {
    if (!currentImageBlob) {
        showError('No image available for download');
        return;
    }
    
    downloadBlob(currentImageBlob, currentImageName);
}

function downloadBatchItem(index) {
    const result = batchResults[index];
    if (result && result.success) {
        const fileName = generateFileName(result.name);
        downloadBlob(result.processedBlob, fileName);
    }
}

function handleDownloadAll() {
    const successfulResults = batchResults.filter(r => r.success);
    if (successfulResults.length === 0) {
        showError('No successful results to download');
        return;
    }
    
    successfulResults.forEach((result, index) => {
        setTimeout(() => {
            const fileName = generateFileName(result.name);
            downloadBlob(result.processedBlob, fileName);
        }, index * 500); // Stagger downloads
    });
}

function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Global function for batch download buttons (called from HTML)
window.downloadBatchItem = function(index) {
    const result = batchResults[index];
    if (result && result.success) {
        const fileName = generateFileName(result.name);
        downloadBlob(result.processedBlob, fileName);
    }
};

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
        // Handle specific HTTP status codes first
        switch (response.status) {
            case 413:
                return 'Image file is too large for the server. Please use an image smaller than 5MB.';
            case 402:
                return 'API credit limit exceeded. Please try again later.';
            case 403:
                return 'Invalid API key or access denied.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return 'Server error. Please try again in a few moments.';
            case 502:
            case 503:
            case 504:
                return 'Service temporarily unavailable. Please try again later.';
        }

        // Try to parse JSON response for detailed error messages
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            
            switch (response.status) {
                case 400:
                    if (errorData.details) {
                        return errorData.details;
                    }
                    return errorData.error || 'Invalid image format or size. Please try a different image.';
                default:
                    return errorData.details || errorData.error || errorData.message || `Server error (${response.status}). Please try again.`;
            }
        } else {
            // Non-JSON response, return generic message based on status
            return `Server error (${response.status}). Please try again.`;
        }
    } catch (parseError) {
        console.error('Error parsing response:', parseError);
        
        // Handle specific status codes even when JSON parsing fails
        switch (response.status) {
            case 413:
                return 'Image file is too large for the server. Please use an image smaller than 5MB.';
            case 400:
                return 'Invalid image format or size. Please try a different image.';
            case 402:
                return 'API credit limit exceeded. Please try again later.';
            case 403:
                return 'Invalid API key or access denied.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return 'Server error. Please try again in a few moments.';
            case 502:
            case 503:
            case 504:
                return 'Service temporarily unavailable. Please try again later.';
            default:
                return `Network error (${response.status}). Please check your connection and try again.`;
        }
    }
}

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
    
    // Reset label based on current feature
    const featureLabels = {
        'background-removal': 'Background Removed',
        'magic-brush': 'Magic Brush Applied',
        'custom-background': 'Custom Background Added',
        'blur-background': 'Background Blurred',
        'ai-shadow': 'AI Shadow Added',
        'background-color': 'Background Color Added'
    };
    
    currentViewLabel.textContent = featureLabels[currentFeature] || 'Processed';
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