#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verifica duração dos arquivos MP3 e atualiza módulos
"""
import json
from pathlib import Path
import sys

# Tentar importar mutagen para ler duração de MP3
try:
    from mutagen.mp3 import MP3
    MUTAGEN_AVAILABLE = True
except ImportError:
    MUTAGEN_AVAILABLE = False
    print("[INFO] mutagen nao instalado. Instalando...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "mutagen"])
    from mutagen.mp3 import MP3
    MUTAGEN_AVAILABLE = True

AUDIO_PATH = Path(".")
MODULES_PATH = Path("../../modules")

def get_mp3_duration(mp3_file):
    """Retorna duração do MP3 em minutos"""
    audio = MP3(str(mp3_file))
    duration_seconds = audio.info.length
    duration_minutes = int(duration_seconds / 60)
    return duration_minutes

def format_duration(minutes):
    """Formata duração em minutos para string"""
    if minutes < 60:
        return f"{minutes}min"
    else:
        hours = minutes // 60
        mins = minutes % 60
        if mins == 0:
            return f"{hours}h"
        return f"{hours}h{mins}min"

print("=" * 60)
print("VERIFICANDO DURACOES DOS AUDIOS")
print("=" * 60)
print()

for i in range(1, 11):
    mp3_file = AUDIO_PATH / f"modulo-{str(i).zfill(2)}.mp3"
    module_file = MODULES_PATH / f"modulo-{str(i).zfill(2)}.json"

    if not mp3_file.exists():
        print(f"[ERRO] Audio nao encontrado: {mp3_file}")
        continue

    if not module_file.exists():
        print(f"[ERRO] Modulo nao encontrado: {module_file}")
        continue

    # Ler duração do MP3
    duration_minutes = get_mp3_duration(mp3_file)
    duration_str = format_duration(duration_minutes)

    # Ler módulo JSON
    with open(module_file, 'r', encoding='utf-8') as f:
        module_data = json.load(f)

    old_duration = module_data.get('duracao', 'N/A')

    # Atualizar duração
    module_data['duracao'] = duration_str

    # Salvar módulo
    with open(module_file, 'w', encoding='utf-8') as f:
        json.dump(module_data, f, ensure_ascii=False, indent=2)

    print(f"[OK] Modulo {i:02d}: {old_duration} -> {duration_str}")

print()
print("=" * 60)
print("[OK] TODAS AS DURACOES ATUALIZADAS!")
print("=" * 60)
