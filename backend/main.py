from fastapi import FastAPI, File, UploadFile, Query
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import librosa
import numpy as np
import io
import soundfile as sf
from pydub import AudioSegment
from pydub.utils import which
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AudioSegment.converter = which("ffmpeg")
AudioSegment.ffprobe = which("ffprobe")
from pydub.utils import which
AudioSegment.converter = which("ffmpeg")
AudioSegment.ffprobe   = which("ffprobe")
app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/process")
async def process_audio(
    file: UploadFile = File(...),
    n_steps: float = Query(-1, description="Pitch shift in semitones (e.g., -1 for down one semitone, 2 for up two semitones)"),
    rate: float = Query(0.85, description="Time stretch rate (e.g., 1.0 for no change, 0.5 for half speed, 2.0 for double speed)")
):
    audio_bytes = await file.read()
    filename = file.filename.lower()
    audio_file = io.BytesIO(audio_bytes)

    # Convert m4a to wav using pydub if needed
    is_m4a = filename.endswith('.m4a')
    if is_m4a:
        try:
            logger.info(f"Converting m4a to wav for file: {filename}")
            audio = AudioSegment.from_file(audio_file, format="m4a")
            wav_io = io.BytesIO()
            audio.export(wav_io, format="wav")
            wav_io.seek(0)
            audio_file = wav_io
        except Exception as e:
            logger.error(f"Failed to convert m4a: {str(e)}")
            return JSONResponse(status_code=400, content={"error": f"Failed to convert m4a: {str(e)}"})

    try:
        logger.info(f"Loading audio with librosa for file: {filename}")
        audio_np, sr = librosa.load(audio_file, sr=None, mono=True)
        if audio_np is None or sr is None or len(audio_np) == 0:
            logger.error("Invalid or empty audio data after conversion.")
            return JSONResponse(status_code=400, content={"error": "Invalid or empty audio data after conversion."})
        logger.info(f"Processing audio: pitch shift (n_steps={n_steps}) and time stretch (rate={rate})")
        audio_aug = librosa.effects.pitch_shift(y=audio_np, sr=sr, n_steps=n_steps)
        audio_aug = librosa.effects.time_stretch(audio_aug, rate=rate)
        buf = io.BytesIO()
        if is_m4a:
            logger.info("Exporting processed audio as m4a")
            temp_wav = io.BytesIO()
            sf.write(temp_wav, audio_aug, sr, format='WAV')
            temp_wav.seek(0)
            audio_segment = AudioSegment.from_wav(temp_wav)
            audio_segment.export(buf, format="mp4", codec="aac")
            buf.seek(0)
            return StreamingResponse(buf, media_type="audio/mp4")
        else:
            logger.info("Exporting processed audio as wav")
            sf.write(buf, audio_aug, sr, format='WAV')
            buf.seek(0)
            return StreamingResponse(buf, media_type="audio/wav")
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}")
        return JSONResponse(status_code=500, content={"error": f"Processing failed: {str(e)}"})
