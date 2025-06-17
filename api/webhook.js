// api/webhook.js
import axios from 'axios';

// Simulação de banco de dados em memória
let posts = [];
let responseLog = [];

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'meu_token_secreto_1012';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || '';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`🔥 Webhook chamado: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  if (req.method === 'GET') {
    // Verificação do webhook pelo Meta
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('🔍 Verificação do webhook:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado com sucesso!');
      return res.status(200).send(challenge);
    } else {
      console.log('❌ Falha na verificação do webhook');
      return res.status(403).json({ error: 'Token de verificação inválido' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      
      // Log completo para debug
      console.log('📨 Dados recebidos:', JSON.stringify(body, null, 2));

      // Verificar se é um evento do Instagram
      if (body.object === 'instagram') {
        for (const entry of body.entry) {
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.field === 'comments') {
                await processarComentario(change.value);
              }
            }
          }
        }
      }

      // Verificar se é um evento do TikTok
      if (body.object === 'tiktok' || body.type === 'comment') {
        await processarComentarioTikTok(body);
      }

      return res.status(200).json({ status: 'success', message: 'Webhook processado' });

    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

async function processarComentario(commentData) {
  try {
    console.log('💬 Processando comentário Instagram:', commentData);

    const postId = commentData.media?.id;
    const commentId = commentData.id;
    const commentText = commentData.text;
    const userId = commentData.from?.id;

    if (!postId || !commentId) {
      console.log('⚠️ Dados do comentário incompletos');
      return;
    }

    // Buscar configuração do post
    const postConfig = posts.find(p => 
      p.url_post.includes(postId) || 
      p.url_post.includes(commentData.media?.permalink) ||
      p.ativo === true
    );

    if (!postConfig) {
      console.log('📝 Nenhuma configuração encontrada para este post');
      return;
    }

    // Determinar qual resposta usar (rotação entre 3 respostas)
    const respostaIndex = (postConfig.respostasEnviadas || 0) % 3;
    const respostas = [postConfig.resposta1, postConfig.resposta2, postConfig.resposta3];
    const respostaEscolhida = respostas[respostaIndex];

    console.log(`🤖 Enviando resposta ${respostaIndex + 1}: ${respostaEscolhida}`);

    // Simular envio da resposta (aqui você integraria com a API do Instagram)
    const respostaEnviada = await enviarRespostaInstagram(commentId, respostaEscolhida);

    if (respostaEnviada) {
      // Atualizar estatísticas
      postConfig.respostasEnviadas = (postConfig.respostasEnviadas || 0) + 1;
      
      // Log da resposta
      responseLog.push({
        timestamp: new Date().toISOString(),
        postId: postId,
        commentId: commentId,
        commentText: commentText,
        resposta: respostaEscolhida,
        status: 'enviado'
      });

      console.log('✅ Resposta enviada com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro ao processar comentário:', error);
  }
}

async function processarComentarioTikTok(data) {
  try {
    console.log('💬 Processando comentário TikTok:', data);
    
    // Implementar lógica similar para TikTok
    // A estrutura pode variar dependendo da API do TikTok
    
  } catch (error) {
    console.error('❌ Erro ao processar comentário TikTok:', error);
  }
}

async function enviarRespostaInstagram(commentId, resposta) {
  try {
    if (!PAGE_ACCESS_TOKEN) {
      console.log('⚠️ Token de acesso não configurado - simulando envio');
      return true; // Simular sucesso para testes
    }

    const url = `https://graph.facebook.com/v18.0/${commentId}/replies`;
    
    const response = await axios.post(url, {
      message: resposta,
      access_token: PAGE_ACCESS_TOKEN
    });

    console.log('📤 Resposta enviada via API:', response.data);
    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar resposta:', error.response?.data || error.message);
    return false;
  }
}

// Funções para gerenciar configurações via API
export function adicionarPost(postConfig) {
  posts.push({
    ...postConfig,
    id: Date.now(),
    criadoEm: new Date().toISOString(),
    respostasEnviadas: 0
  });
}

export function obterPosts() {
  return posts;
}

export function obterLogs() {
  return responseLog;
}
