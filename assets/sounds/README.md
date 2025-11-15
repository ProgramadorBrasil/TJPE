# Pasta de Áudio - Assets de Som

Diretório centralizado para todos os arquivos de áudio da plataforma TJPE Academy.

## Estrutura de Arquivos

```
/assets/sounds/
├── README.md (este arquivo)
├── course-intro.mp3 (narração introdutória - 2-3 min)
├── module-1.mp3 (narração do módulo 1)
├── module-2.mp3 (narração do módulo 2)
├── ... (até module-10.mp3)
└── backgrounds/
    ├── ambient-1.mp3 (música de fundo subtil)
    ├── ambient-2.mp3 (música de fundo alternativa)
    └── silence.mp3 (arquivo de pausa)
```

## Especificações de Áudio

### Formato Recomendado
- **Codec**: MP3 (compatibilidade máxima)
- **Bitrate**: 128 kbps (qualidade/tamanho)
- **Taxa de Amostragem**: 44.1 kHz
- **Canais**: Mono ou Estéreo

### Alternativas
- **AAC**: Melhor qualidade, menor tamanho
- **OGG Vorbis**: Open source, excelente qualidade
- **FLAC**: Sem perda (para backup)

## Como Gerar Áudio com Narração

### Opção 1: Google Cloud Text-to-Speech

```python
from google.cloud import texttospeech

def synthesize_speech(text, output_file):
    client = texttospeech.TextToSpeechClient()

    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="pt-BR",
        name="pt-BR-Standard-A",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )

    with open(output_file, 'wb') as out:
        out.write(response.audio_content)

# Usar
text = """
Bem-vindo ao Curso TJPE.
Este curso foi desenvolvido para ensinar os procedimentos...
"""
synthesize_speech(text, "course-intro.mp3")
```

### Opção 2: Azure Speech Services

```python
import azure.cognitiveservices.speech as speechsdk

def generate_speech(text, output_file):
    speech_config = speechsdk.SpeechConfig(
        subscription=SUBSCRIPTION_KEY,
        region=SERVICE_REGION
    )
    speech_config.speech_synthesis_voice_name = "pt-BR-AntonioNeural"

    audio_config = speechsdk.audio.AudioOutputConfig(
        filename=output_file
    )

    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config
    )

    synthesizer.speak_text_async(text).get()

# Usar
generate_speech("Seu conteúdo aqui", "module-1.mp3")
```

### Opção 3: Festival (Open Source - Linux)

```bash
# Instalar
sudo apt-get install festival festival-pt

# Usar
echo "Bem-vindo ao curso TJPE" | \
  festival --language pt --tts --output mp3:course-intro.mp3
```

### Opção 4: eSpeak (Open Source - Multiplataforma)

```bash
# Instalar
sudo apt-get install espeak

# Usar português brasileiro
espeak -v pt+f3 "Bem-vindo" -w welcome.wav
ffmpeg -i welcome.wav -codec:a libmp3lame -b:a 128k output.mp3
```

## Conteúdo de Áudio Sugerido

### course-intro.mp3
Narração com duração de 2-3 minutos:
```
"Bem-vindo ao Curso TJPE Academy.

Este é um curso completo sobre os procedimentos, estrutura e
funcionamento do Tribunal de Justiça de Pernambuco.

Você encontrará 10 módulos interativos, cada um cobrindo aspectos
importantes da instituição, da legislação aplicável e das melhores
práticas profissionais.

O curso inclui mais de 9 horas de conteúdo, com aulas em vídeo,
materiais de leitura e testes para consolidar seu aprendizado.

Você pode estudar no seu próprio ritmo e acessar o material sempre
que precisar. Ao final, receberá um certificado de conclusão.

Comece agora mesmo clicando no primeiro módulo e aproveite esta
oportunidade de aprendizado profissional de qualidade."
```

### module-1.mp3 até module-10.mp3
Cada módulo tem uma narração de 3-5 minutos com:
- Introdução ao tema
- Pontos principais
- Exemplos práticos
- Resumo e próximos passos

## Como Integrar no Player

```html
<!-- Exemplo 1: Player do Curso Intro -->
<div id="intro-player"></div>
<script>
    const introPlayer = new AudioPlayer(
        document.getElementById('intro-player'),
        {
            title: 'Visão Geral do Curso TJPE',
            url: '/assets/sounds/course-intro.mp3',
            autoplay: false
        }
    );
</script>

<!-- Exemplo 2: Player do Módulo -->
<div id="module-player"></div>
<script>
    const modulePlayer = new AudioPlayer(
        document.getElementById('module-player'),
        {
            title: 'Módulo 1: Introdução ao TJPE',
            url: '/assets/sounds/module-1.mp3',
            autoplay: false
        }
    );
</script>
```

## Otimização de Áudio

### Reduzir Tamanho
```bash
# Com ffmpeg
ffmpeg -i input.mp3 -b:a 96k output.mp3

# Com Sox
sox input.mp3 -b 16 -r 22050 output.mp3
```

### Converter Formato
```bash
# WAV para MP3
ffmpeg -i audio.wav -codec:a libmp3lame -b:a 128k audio.mp3

# WAV para OGG
ffmpeg -i audio.wav -c:a libvorbis -q:a 6 audio.ogg

# MP3 para AAC
ffmpeg -i audio.mp3 -c:a aac -b:a 128k audio.m4a
```

### Normalizar Áudio
```bash
# Aumentar volume se muito baixo
ffmpeg -i input.mp3 -filter:a "volume=1.5" output.mp3

# Normalizar para volume padrão
ffmpeg -i input.mp3 -filter:a loudnorm output.mp3
```

## Streaming de Áudio

Para arquivos grandes (>5MB), considere:

1. **HLS (HTTP Live Streaming)**
   - Segmentação automática
   - Suporte adaptive bitrate
   - Melhor performance

2. **DASH (Dynamic Adaptive Streaming)**
   - Padrão aberto
   - Suporte universal

3. **Progressive Download**
   - Simples
   - Funciona em todos os navegadores

## Referências

- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- AudioContext: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
- FFmpeg: https://ffmpeg.org/
- TTS Cloud Services: https://cloud.google.com/text-to-speech

## Licença

Todos os arquivos de áudio devem respeitar direitos autorais e
licenças de uso apropriadas. Indique a fonte e créditos quando necessário.
