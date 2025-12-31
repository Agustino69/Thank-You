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
    themeColor: '#4A463E'
  }
];