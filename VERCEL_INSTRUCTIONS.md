# Instruções de Deploy na Vercel

Seu projeto está pronto para ser implantado na Vercel. Siga os passos abaixo:

## 1. Repositório Git
Certifique-se de que seu código esteja em um repositório Git (GitHub, GitLab ou Bitbucket).
Pelo que vi, você já tem um repositório git iniciado na pasta `controle-de-retiradas`.

## 2. Importar na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Clique em **"Add New..."** -> **"Project"**.
3. Importe o repositório git do seu projeto.

## 3. Configurações do Projeto
A Vercel deve detectar automaticamente que é um projeto **Vite**.

### Diretório Raiz (Root Directory)
**Muito Importante:** 
Se o seu repositório contém a pasta `controle-de-retiradas` na raiz (ou seja, você vê a pasta `controle-de-retiradas` quando abre o repo no GitHub), você precisa configurar o **Root Directory** nas configurações da Vercel para `controle-de-retiradas`.

Se o conteúdo do repositório já é direto o conteúdo da pasta (onde está o `package.json`), então não precisa alterar nada.

### Variáveis de Ambiente (Environment Variables)
Você DEVE configurar as seguintes variáveis de ambiente na tela de deploy da Vercel (copie do seu arquivo `.env.local`):

1. **VITE_SUPABASE_URL**: Copie o valor do arquivo `.env.local`.
2. **VITE_SUPABASE_ANON_KEY**: Copie o valor do arquivo `.env.local`.

## 4. Deploy
Clique em **Deploy**. A Vercel irá instalar as dependências, construir o projeto e publicá-lo.
