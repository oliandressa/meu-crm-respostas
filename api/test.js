// api/test.js
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('🧪 Endpoint de teste chamado:', req.method, req.url);

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: '🧪 Endpoint de teste funcionando!',
      timestamp: new Date().toISOString(),
      data: {
        method: req.method,
        headers: req.headers,
        query: req.query,
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
      }
    });
  }

  if (req.method === 'POST') {
    // Simular processamento de webhook
    const simulatedWebhook = {
      object: 'instagram',
      entry: [{
        id: '123456789',
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            id: 'comment_123',
            text: 'Comentário de teste!',
            from: { id: 'user_456', username: 'testuser' },
            media: { id: 'media_789' }
          }
        }]
      }]
    };

    console.log('🤖 Simulando webhook:', simulatedWebhook);

    return res.status(200).json({
      success: true,
      message: '✅ Teste de webhook executado com sucesso!',
      timestamp: new Date().toISOString(),
      receivedData: req.body,
      simulatedWebhook: simulatedWebhook,
      response: {
        processed: true,
        action: 'Resposta automática enviada (simulação)',
        nextSteps: [
          'Webhook recebido e processado',
          'Comentário identificado',
          'Resposta automática selecionada',
          'Resposta enviada via API'
        ]
      }
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Método não permitido'
  });
}
