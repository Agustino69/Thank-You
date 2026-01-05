import { Person, SystemConfig } from './types';

export const ADMIN_CODE = 'admin4126';

export const PROJECT_LOGS = [
  "[v1.0.0] INIT :: Core Archive System Online.",
  "[v1.1.0] FEAT :: Integrated Spotify Audio Engine.",
  "[v1.2.0] UX   :: Admin Panel & Local Persistence Layer.",
  "[v1.3.0] NET  :: Added Google Drive & Photos Native Embedding.",
  "[v1.4.0] CORE :: Multi-video Support & Audio Playback.",
  "[v1.5.0] SYS  :: Easter Eggs: Audio, Countdowns & Secrets.",
  "[v1.5.1] CMD  :: System Log Terminal View Access.",
  "[v1.6.0] SFX  :: Dynamic System Audio Configuration.",
  "[v1.7.0] DRV  :: Google Drive Audio Streaming & Random SFX."
];

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  bootSfxUrl: 'https://cdn.pixabay.com/audio/2022/10/21/audio_3497d51928.mp3', // HDD Spin up
  ambientSfxUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_b0445a606f.mp3', // HDD Hum/Clicks
  beepSfxUrl: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_82ccc5c65b.mp3?filename=retro-computer-typing-sound-113589.mp3', // Key press beep
  occasionalSfxUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c39b75225c.mp3?filename=glitch-bass-noise-104938.mp3' // Occasional glitch/processing
};

export const INITIAL_PEOPLE: Person[] = [
  {
    id: '1',
    accessKeys: ['guest', 'invitado', 'visitante'],
    displayName: 'Querido Visitante',
    message: "Gracias por llegar hasta aquí.\n\nEste es un espacio diseñado para la honestidad y la introspección. A veces, el ruido del mundo nos impide decir lo que realmente sentimos. \n\nEspero que encuentres calma en estas palabras.",
    images: [
      'https://picsum.photos/600/800',
      'https://picsum.photos/600/400',
      'https://picsum.photos/500/700'
    ],
    videoUrls: ['https://www.youtube.com/watch?v=LXb3EKWsInQ'],
    spotifyUrl: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
    spotifyMessage: 'Esta canción suena a como se siente una tarde tranquila de domingo. Me recuerda a nuestra paz.',
    themeColor: '#4A463E',
    bgmUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', // Example LoFi
    bgmVolume: 0.3,
    easterEggs: [
      { code: 'help', type: 'text', response: 'NO HELP AVAILABLE. FIGURE IT OUT.' },
      { code: 'love', type: 'text', response: 'ERROR 404: EMOTION NOT FOUND IN KERNEL.' },
      { code: '2026', type: 'countdown', response: 'NEW YEAR', date: '2026-01-01T00:00:00' }
    ]
  }
];