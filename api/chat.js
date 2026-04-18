export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-405b-instruct",
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI assistant for Norwood Gulf. You help customers with questions about auto services, appointments, pricing, and general automotive inquiries. Be friendly, professional, and provide accurate information about their services: engine diagnostics, transmission repair, brake services, electrical systems, HVAC, steering & suspension, emissions testing, and general maintenance. 
Service Hours: Mon-Fri 7AM-6PM, Sat 7AM-3PM, Sun Service and state inspection closed.
Gas Station Hours: Mon-Sat 6AM-9:30PM, Sun 8AM-8PM.
Phone: (781) 255-7368. Address: 707 Neponset Street, Norwood, MA 02062.`
            },
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      }
    );

    if (!response.ok) {
        const errorData = await response.text();
        console.error('NVIDIA API Error:', errorData);
        return res.status(response.status).json({ error: 'Failed to fetch from NVIDIA' });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Serverless Function Error:', error);
    res.status(500).json({ error: error.message });
  }
}
