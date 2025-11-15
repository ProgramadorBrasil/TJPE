#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GERADOR AUTOMÁTICO DE ÁUDIOS - CURSO TJPE
Gera narração com TTS para todos os 10 módulos
Autor: Claude Code + Renato Gracie
"""

import json
import os
from pathlib import Path

# Verificar se gtts está instalado
try:
    from gtts import gTTS
except ImportError:
    print("[ERRO] Biblioteca gtts nao encontrada!")
    print("\n[INFO] Instale com: pip install gtts")
    print("       Ou: pip install gTTS")
    exit(1)

# Configurações
MODULES_PATH = Path("../../modules")
AUDIO_PATH = Path(".")
LANGUAGE = "pt-br"
SLOW = False  # False = velocidade normal, True = mais devagar

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

    # Carregar dados do módulo
    module_file = MODULES_PATH / f"modulo-{str(module_id).zfill(2)}.json"

    if not module_file.exists():
        print(f"[ERRO] Modulo {module_id} nao encontrado: {module_file}")
        return False

    print(f"\n[INFO] Carregando modulo {module_id}...")
    with open(module_file, 'r', encoding='utf-8') as f:
        module_data = json.load(f)

    # Criar script de narração
    print("[INFO] Criando script de narracao...")
    script = create_narration_script(module_data)

    # Salvar script (para referência)
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

        # Mostrar tamanho do arquivo
        size_mb = audio_file.stat().st_size / (1024 * 1024)
        print(f"[INFO] Tamanho: {size_mb:.2f} MB")

        return True
    except Exception as e:
        print(f"[ERRO] Erro ao gerar audio: {e}")
        return False

def main():
    """Função principal"""
    # Configurar encoding UTF-8 para Windows
    import sys
    if sys.platform == 'win32':
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

    print("=" * 60)
    print("GERADOR AUTOMATICO DE AUDIOS - CURSO TJPE")
    print("=" * 60)

    # Verificar se diretório de módulos existe
    if not MODULES_PATH.exists():
        print(f"[ERRO] Pasta de modulos nao encontrada: {MODULES_PATH}")
        print("[INFO] Execute este script da pasta assets/audio/")
        return

    print(f"\n[INFO] Pasta de modulos: {MODULES_PATH.absolute()}")
    print(f"[INFO] Pasta de audio: {AUDIO_PATH.absolute()}")
    print(f"[INFO] Idioma: {LANGUAGE}")
    print(f"[INFO] Velocidade: {'Devagar' if SLOW else 'Normal'}")

    # Perguntar quais módulos gerar
    print("\n" + "=" * 60)
    print("Opções:")
    print("1 - Gerar TODOS os 10 módulos")
    print("2 - Gerar apenas um módulo")
    print("=" * 60)

    choice = input("\nEscolha (1 ou 2): ").strip()

    if choice == '1':
        # Gerar todos
        print("\n[INFO] Gerando audios para TODOS os 10 modulos...")
        success_count = 0
        for i in range(1, 11):
            if generate_audio(i):
                success_count += 1

        print("\n" + "=" * 60)
        print(f"[OK] Concluido! {success_count}/10 audios gerados com sucesso!")
        print("=" * 60)

    elif choice == '2':
        # Gerar um específico
        module_id = input("\nQual módulo? (1-10): ").strip()
        try:
            module_id = int(module_id)
            if 1 <= module_id <= 10:
                generate_audio(module_id)
            else:
                print("[ERRO] Modulo invalido! Escolha entre 1 e 10.")
        except ValueError:
            print("[ERRO] Entrada invalida! Digite um numero.")
    else:
        print("[ERRO] Opcao invalida!")

    print("\n" + "=" * 60)
    print("[OK] Processo finalizado!")
    print("=" * 60)
    print("\n[DICAS]")
    print("- Teste os audios antes de usar")
    print("- Voce pode editar em: https://www.audacityteam.org/")
    print("- Para melhor qualidade, use ElevenLabs ou Google Cloud TTS")

if __name__ == "__main__":
    main()
