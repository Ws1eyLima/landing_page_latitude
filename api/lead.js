// ============================================
// BREVO API INTEGRATION - Serverless Function
// ============================================
// This endpoint handles lead submissions securely
// Deploy on Vercel or Netlify as a serverless function
//
// For Vercel: This file should be in /api/lead.js
// For Netlify: Move to /netlify/functions/lead.js and use exports.handler

export default async function handler(req, res) {
    // Vercel serverless function format
    // Set CORS headers for serverless environments
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }

    try {
        // Get API key from environment variables
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        
        if (!BREVO_API_KEY) {
            console.error('BREVO_API_KEY is not set in environment variables');
            return res.status(500).json({ 
                success: false, 
                error: 'Server configuration error' 
            });
        }

        // Get LIST_ID from environment (optional, can be hardcoded if you prefer)
        const LIST_ID = process.env.BREVO_LIST_ID || null;

        // Extract and validate request body
        const { email, nome } = req.body;

        // Validate email is provided
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ 
                success: false, 
                error: 'Email is required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }

        // Prepare Brevo API payload
        const brevoPayload = {
            email: email.trim(),
            attributes: {}
        };

        // Add nome to attributes if provided
        if (nome && typeof nome === 'string' && nome.trim()) {
            brevoPayload.attributes.NOME = nome.trim();
        }

        // Add list ID if configured
        if (LIST_ID) {
            brevoPayload.listIds = [parseInt(LIST_ID)];
        }

        // Send request to Brevo API
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(brevoPayload)
        });

        const brevoData = await brevoResponse.json();

        // Handle Brevo API responses
        if (!brevoResponse.ok) {
            // Check if contact already exists (common case)
            if (brevoResponse.status === 400 && brevoData.code === 'duplicate_parameter') {
                // Contact already exists - treat as success
                return res.status(200).json({ 
                    success: true, 
                    message: 'Contact already exists in our system' 
                });
            }

            // Log error for debugging (don't expose to client)
            console.error('Brevo API error:', brevoResponse.status, brevoData);

            return res.status(brevoResponse.status).json({ 
                success: false, 
                error: 'Failed to add contact. Please try again later.' 
            });
        }

        // Success response
        return res.status(200).json({ 
            success: true, 
            message: 'Contact added successfully' 
        });

    } catch (error) {
        // Log error for debugging
        console.error('Server error:', error);

        // Return generic error to client
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error. Please try again later.' 
        });
    }
}

