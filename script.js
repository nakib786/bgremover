// Enhanced API Configuration
const API_URL = '/api/remove-bg';

// DOM Elements - will be initialized after DOM loads
let uploadSection, loadingSection, resultSection, batchResultsSection, errorSection, featureOptions;
let dropZone, fileInput, urlInput, urlSubmit;
let originalImage, resultImage, downloadBtn, newImageBtn, retryBtn, errorMessage, comparisonOverlay, currentViewLabel;
let featureTabs, featureDescriptionText, uploadTitle, uploadSubtitle, loadingTitle, loadingSubtitle;
let bgColorPicker, bgFileInput, bgDropZone, blurIntensity, blurValue, shadowType, shadowOpacity, shadowOpacityValue, productType;
let batchFileInput, batchDropZone, batchProgress, progressFill, progressText, batchResultsGrid, downloadAllBtn, newBatchBtn;

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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app...');
    initializeDOMElements();
    initializeFeatureTabs();
    initializeUploadHandlers();
    initializeFeatureOptions();
    updateFeatureContent();
});

// Initialize DOM elements after DOM loads
function initializeDOMElements() {
    console.log('Initializing DOM elements...');
    
    // Main sections
    uploadSection = document.getElementById('upload-section');
    loadingSection = document.getElementById('loading-section');
    resultSection = document.getElementById('result-section');
    batchResultsSection = document.getElementById('batch-section');
    errorSection = document.getElementById('errorSection');
    featureOptions = document.getElementById('feature-options');

    // Upload elements
    dropZone = document.getElementById('upload-area');
    fileInput = document.getElementById('file-input');
    urlInput = document.getElementById('urlInput');
    urlSubmit = document.getElementById('urlSubmit');

    // Result elements
    originalImage = document.getElementById('originalImage');
    resultImage = document.getElementById('result-image');
    downloadBtn = document.getElementById('download-btn');
    newImageBtn = document.getElementById('newImageBtn');
    retryBtn = document.getElementById('retryBtn');
    errorMessage = document.getElementById('errorMessage');
    comparisonOverlay = document.getElementById('comparisonOverlay');
    currentViewLabel = document.getElementById('currentViewLabel');

    // Feature-specific elements
    featureTabs = document.querySelectorAll('.tab-btn');
    featureDescriptionText = document.getElementById('feature-description');
    uploadTitle = document.getElementById('upload-title');
    uploadSubtitle = document.getElementById('upload-subtitle');
    loadingTitle = document.getElementById('loading-title');
    loadingSubtitle = document.getElementById('loading-subtitle');

    // Feature options elements
    bgColorPicker = document.getElementById('bgColorPicker');
    bgFileInput = document.getElementById('bgFileInput');
    bgDropZone = document.getElementById('bgDropZone');
    blurIntensity = document.getElementById('blurIntensity');
    blurValue = document.getElementById('blurValue');
    shadowType = document.getElementById('shadowType');
    shadowOpacity = document.getElementById('shadowOpacity');
    shadowOpacityValue = document.getElementById('shadowOpacityValue');
    productType = document.getElementById('productType');

    // Batch processing elements
    batchFileInput = document.getElementById('batchFileInput');
    batchDropZone = document.getElementById('batchDropZone');
    batchProgress = document.getElementById('batchProgress');
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    batchResultsGrid = document.getElementById('batch-results');
    downloadAllBtn = document.getElementById('downloadAllBtn');
    newBatchBtn = document.getElementById('newBatchBtn');
    
    console.log('DOM elements initialized. Found tabs:', featureTabs ? featureTabs.length : 0);
}

// Initialize feature tabs
function initializeFeatureTabs() {
    console.log('Initializing feature tabs...');
    
    if (!featureTabs || featureTabs.length === 0) {
        console.error('No feature tabs found!');
        return;
    }
    
    console.log('Found tabs:', featureTabs.length);
    
    featureTabs.forEach((tab, index) => {
        console.log(`Tab ${index}:`, tab.dataset.feature);
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Tab clicked:', tab.dataset.feature);
            
            // Remove active class from all tabs
            featureTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Update current feature
            currentFeature = tab.dataset.feature;
            // Update UI
            updateFeatureContent();
            updateFeatureOptions();
            resetUploadArea();
        });
    });
}

// Update feature content based on selection
function updateFeatureContent() {
    console.log('Updating feature content for:', currentFeature);
    const feature = featureDescriptions[currentFeature];
    if (!feature) {
        console.error('Feature not found:', currentFeature);
        return;
    }

    // Update description
    if (featureDescriptionText) {
        featureDescriptionText.innerHTML = `
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;
    }

    // Update upload title
    if (uploadTitle) {
        uploadTitle.textContent = feature.uploadTitle;
    }
    
    // Update loading title
    if (loadingTitle) {
        loadingTitle.textContent = feature.loadingTitle;
    }

    // Update file size hint based on feature
    const fileSizeHint = document.getElementById('file-size-hint');
    if (fileSizeHint) {
        if (currentFeature === 'video-background') {
            fileSizeHint.textContent = 'Maximum file size: 50MB for videos';
        } else if (currentFeature === 'batch-editing') {
            fileSizeHint.textContent = 'Maximum 10 images, 5MB each';
        } else {
            fileSizeHint.textContent = 'Maximum file size: 5MB';
        }
    }
}

// Update feature-specific options
function updateFeatureOptions() {
    console.log('Updating feature options for:', currentFeature);
    
    // Hide all option groups first
    document.querySelectorAll('.option-group').forEach(group => {
        group.style.display = 'none';
    });

    const featureOptions = document.getElementById('feature-options');
    const hasOptions = [
        'custom-background', 'blur-background', 'ai-shadow', 'background-color', 
        'product-photo', 'batch-editing', 'sky-replacer', 'cv-photo', 
        'car-photo', 'youtube-thumbnail'
    ].includes(currentFeature);
    
    if (featureOptions) {
        featureOptions.style.display = hasOptions ? 'block' : 'none';
    }

    // Show specific options based on feature
    switch(currentFeature) {
        case 'custom-background':
            const customBgOptions = document.getElementById('customBgOptions');
            if (customBgOptions) customBgOptions.style.display = 'block';
            break;

        case 'blur-background':
            const blurOptions = document.getElementById('blurOptions');
            if (blurOptions) blurOptions.style.display = 'block';
            break;

        case 'ai-shadow':
            const shadowOptions = document.getElementById('shadowOptions');
            if (shadowOptions) shadowOptions.style.display = 'block';
            break;

        case 'background-color':
            const bgColorOptions = document.getElementById('bgColorOptions');
            if (bgColorOptions) bgColorOptions.style.display = 'block';
            break;

        case 'product-photo':
            const productOptions = document.getElementById('productOptions');
            if (productOptions) productOptions.style.display = 'block';
            break;

        case 'batch-editing':
            const batchOptions = document.getElementById('batchOptions');
            if (batchOptions) batchOptions.style.display = 'block';
            break;

        case 'sky-replacer':
            const skyOptions = document.getElementById('skyOptions');
            if (skyOptions) skyOptions.style.display = 'block';
            break;

        case 'cv-photo':
            const cvOptions = document.getElementById('cvOptions');
            if (cvOptions) cvOptions.style.display = 'block';
            break;

        case 'car-photo':
            const carOptions = document.getElementById('carOptions');
            if (carOptions) carOptions.style.display = 'block';
            break;

        case 'youtube-thumbnail':
            const thumbnailOptions = document.getElementById('thumbnailOptions');
            if (thumbnailOptions) thumbnailOptions.style.display = 'block';
            break;
    }
}

// Initialize upload handlers
function initializeUploadHandlers() {
    if (dropZone && fileInput) {
        // Click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });
    }
}

// Initialize feature options
function initializeFeatureOptions() {
    // Color picker events
    if (bgColorPicker) {
        bgColorPicker.addEventListener('change', updateColorPreview);
    }
    
    // Color preset events
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            if (bgColorPicker) {
                bgColorPicker.value = color;
                updateColorPreview();
            }
        });
    });
    
    // Range input events
    if (blurIntensity && blurValue) {
        blurIntensity.addEventListener('input', () => {
            blurValue.textContent = blurIntensity.value;
        });
    }
    
    const shadowOpacity = document.getElementById('shadowOpacity');
    const shadowOpacityValue = document.getElementById('shadowOpacityValue');
    if (shadowOpacity && shadowOpacityValue) {
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

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// Handle files
function handleFiles(files) {
    console.log('Handling files:', files.length, 'for feature:', currentFeature);
    
    // Validate files
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    selectedFiles = validFiles;

    if (currentFeature === 'batch-editing') {
        handleBatchUpload(validFiles);
    } else {
        handleSingleUpload(validFiles[0]);
    }
}

// Validate files
function validateFiles(files) {
    const maxSize = currentFeature === 'video-background' ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for images
    const maxFiles = currentFeature === 'batch-editing' ? 10 : 1;
    
    const validFiles = [];

    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        const file = files[i];
        
        // Check file size
        if (file.size > maxSize) {
            showError(`File "${file.name}" is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
            continue;
        }

        // Check file type
        const validTypes = currentFeature === 'video-background' 
            ? ['video/mp4', 'video/webm', 'video/ogg']
            : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!validTypes.includes(file.type)) {
            showError(`File "${file.name}" is not a valid ${currentFeature === 'video-background' ? 'video' : 'image'} file.`);
            continue;
        }

        validFiles.push(file);
    }

    return validFiles;
}

// Handle single file upload
function handleSingleUpload(file) {
    console.log('Processing single file:', file.name);
    showLoading();
    processImage(file)
        .then(result => {
            showResult(result, file.name);
        })
        .catch(error => {
            showError(error.message);
        });
}

// Handle batch upload
function handleBatchUpload(files) {
    console.log('Processing batch files:', files.length);
    showBatchProgress();
    processBatch(files);
}

// Process single image with feature-specific parameters
async function processImage(file) {
    const formData = new FormData();
    formData.append('image_file', file);
    
    // Add feature-specific parameters
    addFeatureParameters(formData);

    try {
        const response = await fetch('/api/remove-bg', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP ${response.status}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }

            if (response.status === 413) {
                errorMessage = 'File too large. Please use a smaller image (max 5MB).';
            }

            throw new Error(errorMessage);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Processing error:', error);
        throw error;
    }
}

// Add feature-specific parameters to FormData
function addFeatureParameters(formData) {
    // Add the current feature type
    formData.append('feature', currentFeature);
    
    // Common parameters
    formData.append('size', 'auto');
    formData.append('format', 'png');

    switch(currentFeature) {
        case 'background-removal':
            // Default background removal - no additional parameters needed
            break;

        case 'magic-brush':
            // Magic brush uses ROI (Region of Interest) for precision
            formData.append('roi', '10% 10% 90% 90%'); // Focus on center area
            break;

        case 'custom-background':
            const bgFile = document.getElementById('bgFileInput')?.files[0];
            if (bgFile) {
                formData.append('bg_image_file', bgFile);
            }
            break;

        case 'blur-background':
            // For blur effect, we'll use a gradient background to simulate blur
            formData.append('bg_color', 'f0f0f0');
            formData.append('crop', 'true');
            formData.append('scale', '80%');
            break;

        case 'ai-shadow':
            const shadowType = document.getElementById('shadowType')?.value || 'natural';
            const shadowOpacity = document.getElementById('shadowOpacity')?.value || '50';
            formData.append('shadow_type', shadowType);
            formData.append('shadow_opacity', shadowOpacity);
            break;

        case 'product-photo':
            formData.append('type', 'product');
            const addShadow = document.getElementById('add-shadow')?.checked;
            if (addShadow) {
                formData.append('shadow_type', 'drop');
                formData.append('shadow_opacity', '30');
            }
            formData.append('crop', 'true');
            formData.append('crop_margin', '5%');
            break;

        case 'background-color':
            const bgColor = document.getElementById('bgColorPicker')?.value || '#ffffff';
            formData.append('bg_color', bgColor.replace('#', ''));
            break;

        case 'video-background':
            // Video processing would need special handling
            formData.append('format', 'zip'); // Use ZIP for better performance
            break;

        case 'logo-background':
            formData.append('type', 'graphic');
            formData.append('crop', 'true');
            formData.append('crop_margin', '2%');
            break;

        case 'sky-replacer':
            const skyType = document.getElementById('skyType')?.value || 'blue';
            if (skyType !== 'custom') {
                // Use predefined sky colors
                const skyColors = {
                    'blue': '87CEEB',
                    'cloudy': 'D3D3D3',
                    'sunset': 'FF6B35',
                    'dramatic': '2F4F4F'
                };
                formData.append('bg_color', skyColors[skyType]);
            } else {
                const skyFile = document.getElementById('skyFileInput')?.files[0];
                if (skyFile) {
                    formData.append('bg_image_file', skyFile);
                }
            }
            formData.append('roi', '0% 0% 100% 60%'); // Focus on sky area
            break;

        case 'signature-background':
            formData.append('type', 'graphic');
            formData.append('crop', 'true');
            formData.append('crop_margin', '10px');
            break;

        case 'cv-photo':
            formData.append('type', 'person');
            const cvBgColor = document.getElementById('cvBgColor')?.value || '#ffffff';
            if (cvBgColor !== 'transparent') {
                formData.append('bg_color', cvBgColor.replace('#', ''));
            }
            formData.append('crop', 'true');
            formData.append('crop_margin', '15%');
            formData.append('scale', '85%');
            formData.append('position', 'center');
            break;

        case 'car-photo':
            formData.append('type', 'car');
            const carShadow = document.getElementById('carShadow')?.checked;
            const carSemitransparency = document.getElementById('carSemitransparency')?.checked;
            
            if (carShadow) {
                formData.append('shadow_type', 'natural');
                formData.append('shadow_opacity', '40');
            }
            if (carSemitransparency) {
                formData.append('semitransparency', 'true');
            }
            break;

        case 'youtube-thumbnail':
            const thumbnailBg = document.getElementById('thumbnailBg')?.value || 'transparent';
            if (thumbnailBg === 'solid') {
                const thumbnailColor = document.getElementById('thumbnailColor')?.value || '#ff0000';
                formData.append('bg_color', thumbnailColor.replace('#', ''));
            } else if (thumbnailBg === 'gradient') {
                formData.append('bg_color', 'FF6B6B'); // Default gradient color
            }
            formData.append('scale', '90%');
            formData.append('position', 'center');
            break;
    }
}

// Process batch of images
async function processBatch(files) {
    batchResults = [];
    const batchContainer = document.getElementById('batch-results');
    if (batchContainer) {
        batchContainer.innerHTML = '';
    }

    const maxConcurrent = 3;
    const chunks = [];
    
    for (let i = 0; i < files.length; i += maxConcurrent) {
        chunks.push(files.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
        const promises = chunk.map(async (file, index) => {
            try {
                const result = await processImage(file);
                return { success: true, result, fileName: file.name, index };
            } catch (error) {
                return { success: false, error: error.message, fileName: file.name, index };
            }
        });

        const results = await Promise.all(promises);
        results.forEach(result => {
            batchResults.push(result);
            addBatchResult(result);
        });

        updateBatchProgress(batchResults.length, files.length);
    }

    hideBatchProgress();
}

// Add batch result to UI
function addBatchResult(result) {
    const batchContainer = document.getElementById('batch-results');
    if (!batchContainer) return;

    const resultDiv = document.createElement('div');
    resultDiv.className = 'batch-result-item';

    if (result.success) {
        resultDiv.innerHTML = `
            <img src="${result.result}" alt="Processed ${result.fileName}">
            <div class="batch-result-info">
                <p>${result.fileName}</p>
                <button onclick="downloadImage('${result.result}', '${result.fileName}')" class="download-btn">
                    Download
                </button>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="batch-result-error">
                <p>${result.fileName}</p>
                <p class="error-text">${result.error}</p>
            </div>
        `;
    }

    batchContainer.appendChild(resultDiv);
}

// Show loading state
function showLoading() {
    hideAllSections();
    const loadingSection = document.getElementById('loading-section');
    if (loadingSection) {
        loadingSection.style.display = 'block';
    }
}

// Show batch progress
function showBatchProgress() {
    hideAllSections();
    const batchSection = document.getElementById('batch-section');
    if (batchSection) {
        batchSection.style.display = 'block';
        const batchProgress = batchSection.querySelector('.batch-progress');
        if (batchProgress) {
            batchProgress.style.display = 'block';
        }
    }
}

// Update batch progress
function updateBatchProgress(completed, total) {
    const progressBar = document.querySelector('.batch-progress-bar');
    const progressText = document.querySelector('.batch-progress-text');
    
    if (progressBar && progressText) {
        const percentage = (completed / total) * 100;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `Processing ${completed} of ${total} images...`;
    }
}

// Hide batch progress
function hideBatchProgress() {
    const batchProgress = document.querySelector('.batch-progress');
    if (batchProgress) {
        batchProgress.style.display = 'none';
    }
}

// Show result
function showResult(imageUrl, fileName) {
    hideAllSections();
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
        resultSection.style.display = 'block';
        const resultImage = document.getElementById('result-image');
        if (resultImage) {
            resultImage.src = imageUrl;
            resultImage.onload = () => {
                const downloadBtn = document.getElementById('download-btn');
                if (downloadBtn) {
                    downloadBtn.onclick = () => downloadImage(imageUrl, fileName);
                }
            };
        }
    }
}

// Show error
function showError(message) {
    hideAllSections();
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
        uploadSection.style.display = 'block';
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }
}

// Hide all sections
function hideAllSections() {
    const sections = ['upload-section', 'loading-section', 'result-section', 'batch-section'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}

// Download image
function downloadImage(imageUrl, fileName) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `processed_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Reset upload area
function resetUploadArea() {
    hideAllSections();
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
        uploadSection.style.display = 'block';
    }
    
    // Clear file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.value = '';
    }
    
    selectedFiles = [];
    batchResults = [];
    
    // Clear any error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// Try again functionality
function tryAgain() {
    resetUploadArea();
}

// Update color preview
function updateColorPreview() {
    const bgColorPicker = document.getElementById('bgColorPicker');
    if (bgColorPicker) {
        console.log('Background color updated:', bgColorPicker.value);
    }
} 