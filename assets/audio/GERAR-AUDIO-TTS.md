# 🎙️ COMO GERAR ÁUDIOS COM TTS (Text-to-Speech)

## 🌐 OPÇÃO 1: Google Cloud TTS (Melhor qualidade)

### Passo a Passo:

1. Acessar: https://cloud.google.com/text-to-speech
2. Clicar em "Try it" ou "Testar"
3. Configurar:
   - **Idioma:** Portuguese (Brazil)
   - **Voz:** pt-BR-Neural2-A (masculina) ou pt-BR-Neural2-C (feminina)
   - **Velocidade:** 1.0x (normal)
4. Colar o texto do script (SCRIPT-NARRACAO-MODULO-XX.txt)
5. Clicar em "Speak it" para testar
6. Baixar como MP3

## 🔊 OPÇÃO 2: Microsoft Azure TTS

1. Acessar: https://azure.microsoft.com/pt-br/services/cognitive-services/text-to-speech/
2. Usar demo gratuito
3. Configurar:
   - **Idioma:** pt-BR
   - **Voz:** pt-BR-FranciscaNeural (feminina) ou pt-BR-AntonioNeural (masculina)
4. Inserir texto
5. Gerar e baixar

## 🎵 OPÇÃO 3: ElevenLabs (Voz MUITO natural)

1. Acessar: https://elevenlabs.io/
2. Criar conta gratuita (10.000 caracteres/mês grátis)
3. Escolher voz em português brasileiro
4. Colar script
5. Gerar e baixar MP3

Qualidade: ★★★★★ (Melhor opção!)

## 📝 OPÇÃO 4: Ferramenta Online Gratuita - TTSMaker

1. Acessar: https://ttsmaker.com/
2. Configurar:
   - Idioma: Portuguese (Brazil)
   - Voz: Escolher masculina ou feminina
3. Colar texto (limite: 3000 caracteres por vez)
4. Gerar e baixar MP3
5. **Se o texto for longo:** Dividir em partes e juntar depois

## 🛠️ OPÇÃO 5: Usar Python (Automático)

```python
# Instalar: pip install gtts
from gtts import gTTS
import os

# Ler script
with open('SCRIPT-NARRACAO-MODULO-01.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Gerar áudio
tts = gTTS(text=text, lang='pt-br', slow=False)
tts.save('modulo-01.mp3')

print("Áudio gerado: modulo-01.mp3")
```

Executar:
```bash
cd "C:/Users/renat/TJPE/assets/audio"
python gerar_audio.py
```

## ✂️ EDITAR ÁUDIO (Opcional)

Usar **Audacity** (gratuito):
1. Baixar: https://www.audacityteam.org/
2. Abrir MP3 gerado
3. Editar:
   - Remover pausas longas
   - Ajustar volume
   - Adicionar fade in/out
   - Normalizar áudio
4. Exportar como MP3 (128-192 kbps)

## 📦 DEPOIS DE GERAR

1. Salvar arquivos em: `C:/Users/renat/TJPE/assets/audio/`
2. Nomear: `modulo-01.mp3`, `modulo-02.mp3`, etc.
3. Verificar que funcionam no sistema

## ⚙️ CONFIGURAÇÕES RECOMENDADAS

- **Formato:** MP3
- **Taxa de bits:** 128-192 kbps
- **Frequência:** 44.1 kHz
- **Canais:** Mono (economiza espaço)
- **Qualidade:** Normal a Alta

---

**📌 RECOMENDAÇÃO:**
Use **ElevenLabs** para melhor qualidade!
Ou **Google Cloud TTS** para boa qualidade gratuita.
