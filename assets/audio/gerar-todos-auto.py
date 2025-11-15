#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Wrapper para gerar todos os 10 módulos automaticamente
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import from the main script
from pathlib import Path

# Set working directory
os.chdir(Path(__file__).parent)

# Import after setting path
import json
from gtts import gTTS

MODULES_PATH = Path("../../modules")
AUDIO_PATH = Path(".")
LANGUAGE = "pt-br"
SLOW = False

def create_narration_script(module_data):
    """Cria script de narração a partir dos dados do módulo"""
    script = []

    # Introdução
    script.append(f"Bem-vindo ao Módulo {module_data['id']}: {module_data['titulo']}.")
    script.append(f"Eu sou {module_data['autor']}.")
    script.append(f"Duração estimada deste módulo: {module_data['duracao']}.")

    # Objetivos
    if 'objetivos' in module_data and module_data['objetivos']:
        script.append("\nNeste módulo, você irá:")
        for obj in module_data['objetivos']:
            script.append(f"- {obj}")

    # Alertas Críticos
    if 'alertasCriticos' in module_data and module_data['alertasCriticos']:
        script.append("\nAntes de começarmos, atenção aos seguintes alertas:")
        for i, alerta in enumerate(module_data['alertasCriticos'], 1):
            script.append(f"\nALERTA {i} - {alerta['titulo']}:")
            script.append(alerta['conteudo'])

    script.append("\nVamos começar!")

    # Seções
    if 'secoes' in module_data:
        for secao in module_data['secoes']:
            script.append(f"\n\nSEÇÃO {secao['id']}: {secao['titulo']}")
            script.append(secao['descricao'])

            # Tópicos
            if 'topicos' in secao:
                for topico in secao['topicos']:
                    script.append(f"\n{topico['titulo']}")
                    if 'conteudo' in topico:
                        # Remover HTML tags simples
                        conteudo = topico['conteudo'].replace('<br>', '. ')
                        conteudo = conteudo.replace('<strong>', '').replace('</strong>', '')
                        conteudo = conteudo.replace('<em>', '').replace('</em>', '')
                        script.append(conteudo)

    # Conclusão
    script.append(f"\n\nConcluímos o Módulo {module_data['id']}: {module_data['titulo']}.")
    script.append("Parabéns por completar este módulo!")
    script.append("Até o próximo módulo!")

    return "\n".join(script)

def generate_audio(module_id):
    """Gera áudio para um módulo específico"""
    module_file = MODULES_PATH / f"modulo-{str(module_id).zfill(2)}.json"

    if not module_file.exists():
        print(f"[ERRO] Modulo {module_id} nao encontrado: {module_file}")
        return False

    print(f"\n[INFO] Carregando modulo {module_id}...")
    with open(module_file, 'r', encoding='utf-8') as f:
        module_data = json.load(f)

    print("[INFO] Criando script de narracao...")
    script = create_narration_script(module_data)

    # Salvar script
    script_file = AUDIO_PATH / f"script-modulo-{str(module_id).zfill(2)}.txt"
    with open(script_file, 'w', encoding='utf-8') as f:
        f.write(script)
    print(f"[OK] Script salvo: {script_file}")

    # Gerar áudio
    audio_file = AUDIO_PATH / f"modulo-{str(module_id).zfill(2)}.mp3"
    print("[INFO] Gerando audio com TTS...")
    print(f"[INFO] Tamanho do texto: {len(script)} caracteres")

    try:
        tts = gTTS(text=script, lang=LANGUAGE, slow=SLOW)
        tts.save(str(audio_file))
        print(f"[OK] Audio gerado: {audio_file}")

        size_mb = audio_file.stat().st_size / (1024 * 1024)
        print(f"[INFO] Tamanho: {size_mb:.2f} MB")

        return True
    except Exception as e:
        print(f"[ERRO] Erro ao gerar audio: {e}")
        return False

# Main execution
print("=" * 60)
print("GERADOR AUTOMATICO - TODOS OS 10 MODULOS")
print("=" * 60)

success_count = 0
for i in range(1, 11):
    if generate_audio(i):
        success_count += 1

print("\n" + "=" * 60)
print(f"[OK] Concluido! {success_count}/10 audios gerados com sucesso!")
print("=" * 60)
