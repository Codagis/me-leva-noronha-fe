# Configuração para Deploy na Vercel

## Variáveis de Ambiente

Para fazer o deploy na Vercel, você precisa configurar a variável de ambiente `REACT_APP_API_URL` com a URL base da sua API.

## 📋 Passo a Passo - Configuração via Interface Web

### 1. Acesse o Dashboard da Vercel
- Acesse [https://vercel.com](https://vercel.com)
- Faça login na sua conta

### 2. Selecione o Projeto
- No dashboard, clique no projeto **me-leva-noronha-fe** (ou o nome do seu projeto)

### 3. Acesse as Configurações
- Clique na aba **Settings** (Configurações)
- No menu lateral, clique em **Environment Variables** (Variáveis de Ambiente)

### 4. Adicione a Variável de Ambiente
- Clique no botão **Add New** (Adicionar Nova)
- Preencha os campos:
  - **Key (Chave)**: `REACT_APP_API_URL`
  - **Value (Valor)**: A URL completa da sua API (ex: `https://api.seudominio.com`)
  - **Environment (Ambiente)**: 
    - ✅ Marque **Production** (Produção)
    - ✅ Marque **Preview** (Preview/Staging)
    - ✅ Marque **Development** (Desenvolvimento) - opcional
- Clique em **Save** (Salvar)

### 5. Faça um Novo Deploy
⚠️ **IMPORTANTE**: Após adicionar a variável, você precisa fazer um novo deploy para que ela seja aplicada!

- Vá para a aba **Deployments**
- Clique nos três pontos (...) do último deployment
- Selecione **Redeploy** (Refazer Deploy)
- Ou faça um novo commit/push para acionar um deploy automático

## 🔧 Configuração via CLI (Opcional)

Se preferir usar a linha de comando:

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Adicionar variável de ambiente
vercel env add REACT_APP_API_URL production
# Digite o valor quando solicitado (ex: https://api.seudominio.com)

# Adicionar para outros ambientes também
vercel env add REACT_APP_API_URL preview
vercel env add REACT_APP_API_URL development
```

## ✅ Verificar se Está Funcionando

Após o deploy, você pode verificar se a variável está sendo usada:

1. Acesse o deployment na Vercel
2. Abra o console do navegador (F12)
3. Verifique se não há erros relacionados à URL da API
4. Teste uma requisição para a API

## 📝 Exemplos de Valores

### Produção:
```
REACT_APP_API_URL=https://api.seudominio.com
```

### Staging/Preview:
```
REACT_APP_API_URL=https://staging-api.seudominio.com
```

### Desenvolvimento Local:
Crie um arquivo `.env.local` na raiz do projeto:

```
REACT_APP_API_URL=http://localhost:8080
```

**Nota**: O arquivo `.env.local` já está no `.gitignore` e não será commitado.

## ⚠️ Regras Importantes

- ✅ **SEMPRE use HTTPS em produção!** O frontend na Vercel roda em HTTPS, então a API também deve usar HTTPS
- ✅ A URL deve incluir o protocolo (`https://` para produção, `http://` apenas para localhost)
- ✅ Não inclua a barra final (`/`) na URL
- ✅ Todos os endpoints da API usarão automaticamente esta URL base
- ✅ Variáveis que começam com `REACT_APP_` são expostas no build do React
- ⚠️ Após adicionar/alterar variáveis, sempre faça um novo deploy!

## 🔒 Mixed Content - Problema de HTTP/HTTPS

### O que é Mixed Content?
Quando uma página HTTPS tenta carregar recursos HTTP, o navegador bloqueia essas requisições por segurança. Isso é chamado de **Mixed Content**.

### Erro comum:
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, 
but requested an insecure resource 'http://...'
```

### Solução:
**SEMPRE configure a URL da API com HTTPS em produção!**

❌ **ERRADO** (causa Mixed Content):
```
REACT_APP_API_URL=http://me-leva-noronha-ms-homolog.up.railway.app
```

✅ **CORRETO**:
```
REACT_APP_API_URL=https://me-leva-noronha-ms-homolog.up.railway.app
```

### Nota Importante:
O código agora converte automaticamente HTTP para HTTPS em produção, mas **é melhor configurar corretamente desde o início** para evitar problemas.

## 🐛 Troubleshooting

### A variável não está funcionando?
1. Verifique se o nome está correto: `REACT_APP_API_URL` (case-sensitive)
2. Certifique-se de que fez um novo deploy após adicionar a variável
3. Verifique se selecionou os ambientes corretos (Production, Preview)
4. No console do navegador, verifique se há erros de CORS ou conexão

### Erro "Mixed Content" ou imagens não carregam?
1. **Verifique se a URL da API está usando HTTPS** (não HTTP)
2. A URL correta deve ser: `https://me-leva-noronha-ms-homolog.up.railway.app` (com HTTPS)
3. Se sua API no Railway não tem HTTPS configurado, você precisa:
   - Configurar HTTPS no Railway (geralmente automático)
   - Ou usar um domínio customizado com certificado SSL
4. Após corrigir, faça um novo deploy na Vercel

### Como verificar o valor no build?
Adicione temporariamente no código (apenas para debug):
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

**Lembre-se**: Remova logs de debug antes do deploy final!

