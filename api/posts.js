// api/posts.js
let posts = [];

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`📋 API Posts chamada: ${req.method} ${req.url}`);

  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        success: true,
        posts: posts,
        total: posts.length,
        active: posts.filter(p => p.ativo).length
      });

    case 'POST':
      try {
        const { url_post, descricao, resposta1, resposta2, resposta3 } = req.body;

        if (!url_post || !resposta1 || !resposta2 || !resposta3) {
          return res.status(400).json({
            success: false,
            error: 'Dados obrigatórios faltando'
          });
        }

        const novoPost = {
          id: Date.now(),
          url_post,
          descricao: descricao || 'Post sem descrição',
          resposta1,
          resposta2,
          resposta3,
          ativo: true,
          criadoEm: new Date().toISOString(),
          respostasEnviadas: 0
        };

        posts.push(novoPost);

        console.log('✅ Novo post adicionado:', novoPost);

        return res.status(201).json({
          success: true,
          message: 'Post configurado com sucesso',
          post: novoPost
        });

      } catch (error) {
        console.error('❌ Erro ao criar post:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

    case 'PUT':
      try {
        const { id, ...updateData } = req.body;
        const postIndex = posts.findIndex(p => p.id === id);

        if (postIndex === -1) {
          return res.status(404).json({
            success: false,
            error: 'Post não encontrado'
          });
        }

        posts[postIndex] = { ...posts[postIndex], ...updateData };

        return res.status(200).json({
          success: true,
          message: 'Post atualizado com sucesso',
          post: posts[postIndex]
        });

      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        const postIndex = posts.findIndex(p => p.id === parseInt(id));

        if (postIndex === -1) {
          return res.status(404).json({
            success: false,
            error: 'Post não encontrado'
          });
        }

        const deletedPost = posts.splice(postIndex, 1)[0];

        return res.status(200).json({
          success: true,
          message: 'Post deletado com sucesso',
          post: deletedPost
        });

      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

    default:
      return res.status(405).json({
        success: false,
        error: 'Método não permitido'
      });
  }
}
