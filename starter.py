import matplotlib.pyplot as plt 
import IPython.display as ipd
import librosa
import librosa.display
import numpy as np 
import pandas as pd

def import_music_file(file_name):
    #filename = "theyearningcolab.wav"
    filename = file_name
    sound_data, sample_rate = librosa.load(filename, sr=None) 
    # Load file to find data and sr(how many times per sec sound sample)
    ipd.Audio(filename) # play the audio

def alter_speed(sound_data, sample_rate):
    n_steps=-1 #key transpose down one step (one note on the piano for ex)
    #audio_aug = librosa.effects.pitch_shift(sound_data, sample_rate, n_steps)

    audio_aug=librosa.effects.time_stretch(sound_data, rate=.85)



    librosa.display.waveplot(audio_aug, sr=sample_rate) # Plotting audio file
    plt.title("audio augmented")
    ipd.Audio(audio_aug, rate=sample_rate) # play the audio

def alter_pitch(sound_data, sample_rate):

    n_steps=-1 #key transpose down one step (one note on the piano for ex)
    audio_aug_pitch = librosa.effects.pitch_shift(sound_data, sample_rate, n_steps)

    #audio_aug=librosa.effects.time_stretch(sound_data, rate=.85)



    librosa.display.waveplot(audio_aug_pitch, sr=sample_rate) # Plotting audio file
    plt.title("audio augmented")
    ipd.Audio(audio_aug_pitch, rate=sample_rate) # play the audio

def alter_timbre(sound_data, sample_rate):

    # Apply a bandpass filter to isolate a specific frequency range
    audio_aug_timbre = librosa.effects.preemphasis(sound_data)

    librosa.display.waveplot(audio_aug_timbre, sr=sample_rate) # Plotting audio file
    plt.title("audio augmented")
    ipd.Audio(audio_aug_timbre, rate=sample_rate) # play the audio
def alter_multiple(audio_aug_pitch, sample_rate):
    n_steps=-1 #key transpose down one step (one note on the piano for ex)

    audio_aug=librosa.effects.time_stretch(audio_aug_pitch, rate=.85)
    #audio_aug += librosa.effects.pitch_shift(sound_data, sample_rate, n_steps)
    #audio_aug=librosa.effects.time_stretch(sound_data, rate=.85)



    librosa.display.waveplot(audio_aug, sr=sample_rate) # Plotting audio file
    plt.title("audio augmented")
    ipd.Audio(audio_aug, rate=sample_rate) # play the audio
     


def save_audio_file(audio_data, sample_rate, output_filename):
    librosa.output.write_wav(output_filename, audio_data, sample_rate)
    ipd.Audio(audio_data, rate=sample_rate) # play the audio
