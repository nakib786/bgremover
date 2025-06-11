// Vercel serverless function to proxy remove.bg API
const API_KEY = process.env.REMOVE_BG_API_KEY || 'UdJecRQczjcUyQytSsqM3xd5';
const API_URL = 'https://api.remove.bg/v1.0/removebg';

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
        // Forward the request to remove.bg API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: req.body
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: 'API request failed',
                details: errorText 
            });
        }

        // Get the image blob
        const imageBuffer = await response.arrayBuffer();
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', imageBuffer.byteLength);
        
        // Send the image
        res.status(200).send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error('Error in remove-bg proxy:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
} 