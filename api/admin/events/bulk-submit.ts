import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      res.status(400).json({ error: 'Invalid events data' });
      return;
    }

    console.log(`🔄 Processing bulk submission of ${events.length} events via Railway proxy`);

    // Proxy to Railway backend for bulk event submission
    const railwayResponse = await fetch('https://blkout-api-railway-production.up.railway.app/api/events/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events })
    });

    if (railwayResponse.ok) {
      const railwayData = await railwayResponse.json();
      console.log(`✅ Railway bulk submission successful:`, railwayData);

      res.status(200).json({
        success: true,
        message: `Successfully submitted ${events.length} events via Railway`,
        events: railwayData.data || railwayData.events || events,
        source: 'railway-proxy'
      });
    } else {
      throw new Error(`Railway API error: ${railwayResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Bulk events submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}