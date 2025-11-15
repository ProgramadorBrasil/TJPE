# 🚀 INSTRUÇÕES PARA ATIVAR GITHUB PAGES

## ⚠️ AÇÃO NECESSÁRIA

O deploy automático está configurado, mas o **GitHub Pages precisa ser ativado manualmente** no repositório.

---

## 📋 PASSO A PASSO

### 1. Acessar Configurações do Repositório

1. Acesse: https://github.com/ProgramadorBrasil/TJPE
2. Clique em **Settings** (⚙️ no menu superior)

### 2. Ativar GitHub Pages

1. No menu lateral esquerdo, clique em **Pages**
2. Na seção **Build and deployment**:
   - **Source**: Selecione `GitHub Actions`
3. Clique em **Save** (se aparecer)

### 3. Aguardar Deploy Automático

1. Vá para **Actions** no menu superior
2. Aguarde o workflow "Deploy to GitHub Pages" completar
3. Tempo estimado: 2-3 minutos
4. Status ficará ✅ verde quando concluído

### 4. Acessar Site Publicado

Após deploy concluído, o site estará disponível em:

```
https://programadorbrasil.github.io/TJPE/
```

---

## 🔄 DEPLOY MANUAL (Alternativa)

Se preferir fazer deploy manual:

### Opção 1: GitHub Pages Manual

1. Settings > Pages
2. Source: `Deploy from a branch`
3. Branch: `main`
4. Folder: `/ (root)`
5. Save

### Opção 2: Netlify

1. Acesse: https://netlify.com
2. Faça login
3. New site from Git
4. Conecte repositório: `ProgramadorBrasil/TJPE`
5. Build settings:
   - Build command: (deixar vazio)
   - Publish directory: `/`
6. Deploy site

URL gerada: `https://tjpe-curso.netlify.app` (exemplo)

### Opção 3: Vercel

1. Acesse: https://vercel.com
2. Faça login
3. Import Project
4. Conecte repositório: `ProgramadorBrasil/TJPE`
5. Framework: `Other`
6. Deploy

URL gerada: `https://tjpe.vercel.app` (exemplo)

### Opção 4: Deploy Local (Desenvolvimento)

```bash
# Navegue até a pasta
cd TJPE

# Inicie servidor HTTP
python -m http.server 8000

# Ou com Node.js
npx http-server -p 8000
```

Acesse: `http://localhost:8000`

---

## ✅ VERIFICAÇÃO DE DEPLOY

Após ativar, verifique se o site está acessível:

1. Acesse a URL do GitHub Pages
2. Verifique se:
   - ✅ Página carrega sem erros
   - ✅ Menu lateral aparece
   - ✅ Módulos carregam ao clicar
   - ✅ Controles de acessibilidade funcionam
   - ✅ Painel admin acessível (`/painel-admin.html`)

---

## 🐛 TROUBLESHOOTING

### Problema: "404 - Página não encontrada"

**Solução:**
1. Aguardar 2-3 minutos após ativar Pages
2. Limpar cache do navegador (Ctrl+Shift+R)
3. Verificar URL (deve ter `/TJPE/` no final)

### Problema: "Deploy falhou"

**Solução:**
1. Ir em Actions > Rerun workflow
2. Verificar logs de erro
3. Se persistir, usar deploy manual (opções acima)

### Problema: "Arquivos não carregam"

**Solução:**
1. Verificar console do navegador (F12)
2. Procurar erros de CORS ou 404
3. Verificar se todos arquivos foram commitados:
   ```bash
   cd TJPE
   git status
   ```

---

## 📊 STATUS ATUAL

- ✅ **Código**: 100% completo e commitado
- ✅ **GitHub Actions**: Configurado (workflow pronto)
- ⏳ **GitHub Pages**: Aguardando ativação manual
- ⏳ **Deploy**: Aguardando ativação do Pages

---

## 🎯 PRÓXIMO PASSO

**➡️ Ative o GitHub Pages seguindo os passos acima!**

Após ativação, o deploy será automático a cada push para `main`.

---

## 📞 SUPORTE

Se tiver problemas:

1. Verificar: https://github.com/ProgramadorBrasil/TJPE/actions
2. Abrir issue: https://github.com/ProgramadorBrasil/TJPE/issues
3. Consultar documentação: `DOCUMENTACAO.md`

---

**Data**: 15/11/2025
**Versão**: 1.0.0
**Status**: Aguardando ativação do GitHub Pages
