# Configuração para Deploy na Vercel

## Variáveis de Ambiente

Para fazer o deploy na Vercel, você precisa configurar a variável de ambiente `REACT_APP_API_URL` com a URL base da sua API.

### Como configurar na Vercel:

1. Acesse o dashboard da Vercel
2. Vá até o projeto
3. Clique em **Settings** > **Environment Variables**
4. Adicione a variável:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: URL completa da sua API (ex: `https://api.seudominio.com`)
   - **Environment**: Selecione Production, Preview e Development conforme necessário

### Exemplo:

```
REACT_APP_API_URL=https://api.seudominio.com
```

### Importante:

- A URL deve incluir o protocolo (`https://` ou `http://`)
- Não inclua a barra final (`/`) na URL
- Todos os endpoints da API usarão automaticamente esta URL base

### Para desenvolvimento local:

Crie um arquivo `.env.local` na raiz do projeto com:

```
REACT_APP_API_URL=http://localhost:8080
```

**Nota**: O arquivo `.env.local` já está no `.gitignore` e não será commitado.

