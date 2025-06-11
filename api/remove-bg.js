// Vercel serverless function to proxy remove.bg API
const API_KEY = process.env.REMOVE_BG_API_KEY || 'UdJecRQczjcUyQytSsqM3xd5';
const API_URL = 'https://api.remove.bg/v1.0/removebg';

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

        // Forward the request to remove.bg API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': contentType,
                'Content-Length': body.length.toString()
            },
            body: body
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
                details: errorDetails.errors?.[0]?.title || errorDetails.message || errorText
            });
        }

        // Get the image data
        const imageBuffer = await response.arrayBuffer();
        
        // Set appropriate headers for image response
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', imageBuffer.byteLength);
        
        // Send the processed image
        return res.status(200).send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error('Error in remove-bg proxy:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
} 