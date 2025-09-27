// Simple Railway connectivity test endpoint
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Testing Railway connectivity...');

    // Test basic connectivity
    const response = await fetch('https://blkout-api-railway-production.up.railway.app/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Railway response status:', response.status);
    console.log('📡 Railway response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.text();
      console.log('✅ Railway response data:', data);

      return res.status(200).json({
        success: true,
        message: 'Railway connectivity test successful',
        railwayStatus: response.status,
        railwayResponse: data,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Railway health check failed: ${response.status}`);
    }

  } catch (error) {
    console.error('❌ Railway connectivity test failed:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message,
      cause: error?.cause
    });

    return res.status(500).json({
      success: false,
      error: 'Railway connectivity failed',
      details: error?.message,
      timestamp: new Date().toISOString()
    });
  }
}