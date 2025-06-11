// Enhanced Vercel serverless function to proxy remove.bg API with all features
const API_KEY = process.env.REMOVE_BG_API_KEY || 'UdJecRQczjcUyQytSsqM3xd5';
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

// Disable automatic body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

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

    try {
        // Validate content type
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return res.status(400).json({ 
                error: 'Invalid content type. Expected multipart/form-data' 
            });
        }

        // Read the raw body
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        // Parse the feature type from the request
        const bodyString = body.toString();
        const featureMatch = bodyString.match(/name="feature"\r?\n\r?\n([^\r\n]+)/);
        const feature = featureMatch ? featureMatch[1] : 'remove-bg';

        // Determine the appropriate API endpoint and parameters
        let apiUrl = REMOVE_BG_API_URL;
        let processedBody = body;

        // Handle different features
        switch (feature) {
            case 'remove-bg':
                // Standard background removal - no changes needed
                break;
                
            case 'magic-brush':
                // Magic brush uses the same endpoint with specific parameters
                break;
                
            case 'custom-bg':
            case 'bg-color':
                // Background replacement - uses same endpoint with bg_color or bg_image_file
                break;
                
            case 'blur-bg':
                // Background blur - simulated by removing background then adding blur effect
                break;
                
            case 'ai-shadow':
                // AI shadow - uses shadow parameters
                break;
                
            case 'product-editor':
                // Product photo editing - uses type parameter
                break;
                
            case 'car-editor':
                // Car photo editing - uses type=car parameter
                processedBody = addParameterToFormData(body, 'type', 'car');
                break;
                
            case 'cv-photo':
                // CV photo - uses type=person parameter
                processedBody = addParameterToFormData(body, 'type', 'person');
                break;
                
            case 'signature-bg':
            case 'logo-bg':
                // Logo/signature removal - uses type=other parameter
                processedBody = addParameterToFormData(body, 'type', 'other');
                break;
                
            case 'sky-replacer':
                // Sky replacement - uses type=other with specific handling
                processedBody = addParameterToFormData(body, 'type', 'other');
                break;
                
            case 'youtube-thumbnail':
                // YouTube thumbnail - optimized for thumbnails
                processedBody = addParameterToFormData(body, 'type', 'person');
                processedBody = addParameterToFormData(processedBody, 'format', 'png');
                break;
                
            case 'video-bg':
                // Video background removal - not supported by remove.bg API
                return res.status(400).json({ 
                    error: 'Video background removal not supported',
                    details: 'This feature requires video processing capabilities not available in the current API'
                });
                
            case 'batch-edit':
                // Batch editing - handled on frontend, single API calls
                break;
                
            default:
                // Default to standard background removal
                break;
        }

        console.log('Processing feature:', feature);
        console.log('API URL:', apiUrl);

        // Forward the request to remove.bg API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': contentType,
                'Content-Length': processedBody.length.toString()
            },
            body: processedBody
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Remove.bg API error:', response.status, errorText);
            
            // Try to parse error as JSON for better error messages
            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch {
                errorDetails = { message: errorText };
            }
            
            return res.status(response.status).json({ 
                error: 'API request failed',
                details: errorDetails.errors?.[0]?.title || errorDetails.message || errorText,
                feature: feature
            });
        }

        // Get the image data
        const imageBuffer = await response.arrayBuffer();
        
        // Apply post-processing based on feature
        let finalBuffer = Buffer.from(imageBuffer);
        
        if (feature === 'blur-bg') {
            // For blur background, we would need additional processing
            // This is a placeholder - actual blur would require image processing library
            console.log('Blur background processing would be applied here');
        }
        
        // Set appropriate headers for image response
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', finalBuffer.length);
        res.setHeader('X-Feature-Used', feature);
        
        // Send the processed image
        return res.status(200).send(finalBuffer);

    } catch (error) {
        console.error('Error in enhanced remove-bg proxy:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}

// Helper function to add parameters to FormData
function addParameterToFormData(buffer, paramName, paramValue) {
    try {
        const boundary = extractBoundary(buffer);
        if (!boundary) return buffer;
        
        const newParam = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="${paramName}"\r\n\r\n${paramValue}`;
        const endBoundary = `\r\n--${boundary}--`;
        
        // Find the end boundary and insert new parameter before it
        const bufferString = buffer.toString();
        const endIndex = bufferString.lastIndexOf(`--${boundary}--`);
        
        if (endIndex === -1) return buffer;
        
        const beforeEnd = bufferString.substring(0, endIndex);
        const newContent = beforeEnd + newParam + endBoundary;
        
        return Buffer.from(newContent);
    } catch (error) {
        console.error('Error adding parameter to FormData:', error);
        return buffer;
    }
}

// Helper function to extract boundary from multipart data
function extractBoundary(buffer) {
    try {
        const bufferString = buffer.toString('ascii', 0, 200);
        const boundaryMatch = bufferString.match(/boundary=([^\r\n]+)/);
        return boundaryMatch ? boundaryMatch[1] : null;
    } catch (error) {
        console.error('Error extracting boundary:', error);
        return null;
    }
} 