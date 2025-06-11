// Enhanced Vercel serverless function to proxy remove.bg API with all features
import formidable from 'formidable';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

// Disable automatic body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to get form data value
function getFormValue(fields, key) {
    const value = fields[key];
    return Array.isArray(value) ? value[0] : value;
}

// Helper function to get file from files object
function getFormFile(files, key) {
    const file = files[key];
    return Array.isArray(file) ? file[0] : file;
}

// Feature-specific parameter mapping
function buildRemoveBgParams(fields, files) {
    const params = new FormData();
    
    // Get the main image file
    const imageFile = getFormFile(files, 'image_file');
    if (imageFile) {
        const fs = require('fs');
        const imageBuffer = fs.readFileSync(imageFile.filepath);
        const blob = new Blob([imageBuffer], { type: imageFile.mimetype });
        params.append('image_file', blob, imageFile.originalFilename);
    }

    // Basic parameters
    params.append('size', getFormValue(fields, 'size') || 'auto');
    const format = getFormValue(fields, 'format') || 'png';
    params.append('format', format);

    // Feature-specific parameters
    const featureType = getFormValue(fields, 'feature') || 'background-removal';
    
    switch (featureType) {
        case 'background-removal':
            // Standard background removal - no additional params needed
            break;

        case 'magic-brush':
            // Use ROI for precision editing
            const roi = getFormValue(fields, 'roi');
            if (roi) {
                params.append('roi', roi);
            }
            break;

        case 'custom-background':
            // Add custom background image
            const bgImageFile = getFormFile(files, 'bg_image_file');
            if (bgImageFile) {
                const fs = require('fs');
                const bgBuffer = fs.readFileSync(bgImageFile.filepath);
                const bgBlob = new Blob([bgBuffer], { type: bgImageFile.mimetype });
                params.append('bg_image_file', bgBlob, bgImageFile.originalFilename);
            }
            break;

        case 'blur-background':
            // Simulate blur with background color and scaling
            params.append('bg_color', 'f0f0f0');
            params.append('crop', 'true');
            params.append('scale', '80%');
            params.append('position', 'center');
            break;

        case 'ai-shadow':
            // Add shadow parameters
            const shadowType = getFormValue(fields, 'shadow_type') || 'natural';
            const shadowOpacity = getFormValue(fields, 'shadow_opacity') || '50';
            params.append('shadow_type', shadowType);
            params.append('shadow_opacity', shadowOpacity);
            break;

        case 'product-photo':
            // Product-specific optimization
            params.append('type', 'product');
            params.append('crop', 'true');
            params.append('crop_margin', '5%');
            
            // Add shadow if requested
            const addShadow = getFormValue(fields, 'add_shadow');
            if (addShadow === 'true') {
                params.append('shadow_type', 'drop');
                params.append('shadow_opacity', '30');
            }
            break;

        case 'background-color':
            // Add solid background color
            const bgColor = getFormValue(fields, 'bg_color');
            if (bgColor) {
                params.append('bg_color', bgColor.replace('#', ''));
            }
            break;

        case 'video-background':
            // For video, use ZIP format for better performance
            params.set('format', 'zip');
            break;

        case 'logo-background':
            // Optimize for graphics/logos
            params.append('type', 'graphic');
            params.append('crop', 'true');
            params.append('crop_margin', '2%');
            break;

        case 'sky-replacer':
            // Sky replacement with ROI focusing on upper portion
            params.append('roi', '0% 0% 100% 60%');
            
            const skyType = getFormValue(fields, 'sky_type');
            if (skyType && skyType !== 'custom') {
                const skyColors = {
                    'blue': '87CEEB',
                    'cloudy': 'D3D3D3', 
                    'sunset': 'FF6B35',
                    'dramatic': '2F4F4F'
                };
                params.append('bg_color', skyColors[skyType] || '87CEEB');
            } else if (skyType === 'custom') {
                const skyFile = getFormFile(files, 'sky_upload');
                if (skyFile) {
                    const fs = require('fs');
                    const skyBuffer = fs.readFileSync(skyFile.filepath);
                    const skyBlob = new Blob([skyBuffer], { type: skyFile.mimetype });
                    params.append('bg_image_file', skyBlob, skyFile.originalFilename);
                }
            }
            break;

        case 'signature-background':
            // Optimize for text/signatures
            params.append('type', 'graphic');
            params.append('crop', 'true');
            params.append('crop_margin', '10px');
            break;

        case 'cv-photo':
            // Professional headshot optimization
            params.append('type', 'person');
            params.append('crop', 'true');
            params.append('crop_margin', '15%');
            params.append('scale', '85%');
            params.append('position', 'center');
            
            const cvBgColor = getFormValue(fields, 'cv_bg_color');
            if (cvBgColor && cvBgColor !== 'transparent') {
                params.append('bg_color', cvBgColor.replace('#', ''));
            }
            break;

        case 'car-photo':
            // Automotive-specific processing
            params.append('type', 'car');
            
            const carShadow = getFormValue(fields, 'car_shadow');
            if (carShadow === 'true') {
                params.append('shadow_type', 'natural');
                params.append('shadow_opacity', '40');
            }
            
            const carSemitransparency = getFormValue(fields, 'car_semitransparency');
            if (carSemitransparency === 'true') {
                params.append('semitransparency', 'true');
            }
            break;

        case 'youtube-thumbnail':
            // Thumbnail optimization
            params.append('scale', '90%');
            params.append('position', 'center');
            
            const thumbnailBg = getFormValue(fields, 'thumbnail_bg');
            if (thumbnailBg === 'solid') {
                const thumbnailColor = getFormValue(fields, 'thumbnail_color');
                if (thumbnailColor) {
                    params.append('bg_color', thumbnailColor.replace('#', ''));
                }
            } else if (thumbnailBg === 'gradient') {
                params.append('bg_color', 'FF6B6B');
            }
            break;

        default:
            // Default to standard background removal
            break;
    }

    // Add any additional custom parameters
    const additionalParams = [
        'crop', 'crop_margin', 'scale', 'position', 'channels', 
        'semitransparency', 'type', 'type_level'
    ];
    
    additionalParams.forEach(param => {
        const value = getFormValue(fields, param);
        if (value && !params.has(param)) {
            params.append(param, value);
        }
    });

    return params;
}

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!REMOVE_BG_API_KEY) {
        return res.status(500).json({ error: 'Remove.bg API key not configured' });
    }

    try {
        // Parse the incoming form data
        const form = formidable({
            maxFileSize: 50 * 1024 * 1024, // 50MB for videos
            maxTotalFileSize: 100 * 1024 * 1024, // 100MB total
            keepExtensions: true,
            multiples: true
        });

        const [fields, files] = await form.parse(req);

        // Check if we have an image file
        const imageFile = getFormFile(files, 'image_file');
        if (!imageFile) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Validate file size (5MB for images, 50MB for videos)
        const featureType = getFormValue(fields, 'feature') || 'background-removal';
        const maxSize = featureType === 'video-background' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        
        if (imageFile.size > maxSize) {
            return res.status(413).json({ 
                error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB` 
            });
        }

        // Build parameters for remove.bg API
        const formData = buildRemoveBgParams(fields, files);

        // Make request to remove.bg API
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': REMOVE_BG_API_KEY,
            },
            body: formData
        });

        if (!response.ok) {
            let errorMessage = `Remove.bg API error: ${response.status}`;
            
            try {
                const errorText = await response.text();
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.errors?.[0]?.title || errorData.error || errorMessage;
            } catch (e) {
                // If we can't parse the error, use the status text
                errorMessage = response.statusText || errorMessage;
            }

            // Handle specific error codes
            if (response.status === 402) {
                errorMessage = 'Insufficient credits. Please check your remove.bg account.';
            } else if (response.status === 403) {
                errorMessage = 'Invalid API key or access denied.';
            } else if (response.status === 429) {
                errorMessage = 'Rate limit exceeded. Please try again later.';
            }

            return res.status(response.status).json({ error: errorMessage });
        }

        // Get the processed image
        const imageBuffer = await response.arrayBuffer();
        
        // Set appropriate headers
        const contentType = response.headers.get('content-type') || 'image/png';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', imageBuffer.byteLength);
        
        // Add feature context to response headers
        res.setHeader('X-Feature-Type', featureType);
        res.setHeader('X-Processing-Status', 'success');

        // Send the processed image
        res.send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error('API Error:', error);
        
        // Handle specific error types
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ 
                error: 'File too large. Please use a smaller image.' 
            });
        }
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return res.status(503).json({ 
                error: 'Service temporarily unavailable. Please try again later.' 
            });
        }

        return res.status(500).json({ 
            error: 'Internal server error. Please try again.' 
        });
    }
} 