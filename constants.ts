import { Person } from './types';

export const ADMIN_CODE = 'admin4126';

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
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
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