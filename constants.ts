import { Person, SystemConfig } from './types';

export const ADMIN_CODE = 'admin4126';

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  bootSfxUrl: 'https://cdn.pixabay.com/audio/2022/10/21/audio_3497d51928.mp3', // HDD Spin up
  ambientSfxUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_b0445a606f.mp3', // HDD Hum/Clicks
  beepSfxUrl: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_82ccc5c65b.mp3?filename=retro-computer-typing-sound-113589.mp3', // Key press beep
  occasionalSfxUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c39b75225c.mp3?filename=glitch-bass-noise-104938.mp3' // Occasional glitch/processing
};

export const INITIAL_PEOPLE: Person[] = [
  {
    "id": "1",
    "accessKeys": [
      "guest",
      "todos",
      "1"
    ],
    "displayName": "Querido Visitante",
    "message": "Gracias por llegar hasta aquí.\n\nEste es un espacio diseñado para la honestidad y la introspección. A veces, el ruido del mundo nos impide decir lo que realmente sentimos. \n\nEspero que encuentres calma en estas palabras. (TEST)",
    "images": [
      "https://picsum.photos/600/800",
      "https://picsum.photos/600/400",
      "https://picsum.photos/500/700"
    ],
    "videoUrl": "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    "spotifyUrl": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC",
    "spotifyMessage": "Esta canción suena a como se siente una tarde tranquila de domingo. Me recuerda a nuestra paz.",
    "themeColor": "#ff0000",
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.05,
    "easterEggs": [
      {
        "code": "help",
        "type": "text",
        "response": "FIGURE IT OUT."
      },
      {
        "code": "love",
        "type": "text",
        "response": "Fingers Crossed"
      },
      {
        "code": "2026",
        "type": "countdown",
        "response": "NEW YEAR",
        "date": "2026-01-01T00:00:00"
      },
      {
        "code": "agus",
        "type": "countdown",
        "response": "Cumple de Agus 19",
        "date": "2026-02-28T19:00"
      },
      {
        "code": "Pasate Ald",
        "type": "text",
        "response": "JAJAJAJA"
      },
      {
        "code": "Me reí ",
        "type": "text",
        "response": "whoopsie"
      },
      {
        "code": "Chonchin",
        "type": "text",
        "response": "Peludo y bello"
      },
      {
        "code": "Tona",
        "type": "text",
        "response": "Did not participate "
      },
      {
        "code": "Chaval",
        "type": "text",
        "response": "Jolines hermano"
      },
      {
        "code": "Que rollo",
        "type": "text",
        "response": "con el pollo"
      },
      {
        "code": "Ola",
        "type": "text",
        "response": "whatsapp "
      },
      {
        "code": "Hello",
        "type": "text",
        "response": "Wassup"
      },
      {
        "code": "Yo",
        "type": "text",
        "response": "tú "
      },
      {
        "code": "Hola",
        "type": "text",
        "response": "piensa"
      },
      {
        "code": "Pene",
        "type": "text",
        "response": "chupas jaja"
      },
      {
        "code": "Fantastic",
        "type": "text",
        "response": "Cocacolastic"
      },
      {
        "code": "67",
        "type": "text",
        "response": "nah"
      },
      {
        "code": "oye",
        "type": "text",
        "response": "eu"
      },
      {
        "code": "bacachin",
        "type": "text",
        "response": "bye"
      },
      {
        "code": "buenas",
        "type": "text",
        "response": "malas"
      },
      {
        "code": "Pam",
        "type": "text",
        "response": "I wish"
      },
      {
        "code": "carambolas",
        "type": "text",
        "response": "Bart"
      },
      {
        "code": "",
        "type": "text",
        "response": ""
      }
    ],
    "videoUrls": [
      "https://www.youtube.com/watch?v=LXb3EKWsInQ"
    ]
  },
  {
    "id": "7b22ioqrt",
    "accessKeys": [
      "vale",
      "val",
      "valoll",
      "valentina"
    ],
    "displayName": "Val",
    "message": "Quiero empezar agradeciendo el gran peso de tu aparición durante el segundo acto de mi 2025, fue realmente impresionante, e indirectamente, hizo que acabaras aquí.\n\nGracias por los buenos momentos, por las risas, por los clashitos, por el intercambio, disfruté absolutamente cada momento.\n\nPor un 2026 lleno de locuras",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "https://open.spotify.com/track/6QFCMUUq1T2Vf5sFUXcuQ7?si=NUjf7IyZS--9HPCyO4202Q",
    "spotifyMessage": "Si una canción tuvies que representar el 2026, será esa",
    "themeColor": "#950714",
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "v44q4q78b",
    "accessKeys": [
      "carlos",
      "calros",
      "carlukis"
    ],
    "displayName": "Carlos",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#91faff",
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "mdm67cd00",
    "accessKeys": [
      "tadeo",
      "ateo",
      "amiko",
      "ermanaso"
    ],
    "displayName": "Tadeo",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#f2ab1d",
    "easterEggs": []
  },
  {
    "id": "57scgzriq",
    "accessKeys": [
      "xime",
      "ximenaaaa",
      "ximena"
    ],
    "displayName": "Ximena",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#a408d4",
    "easterEggs": [],
    "videoUrls": [
      "https://drive.google.com/file/d/1fpP6x4Do0JDAzi60-79xGwuas_BSqxUl/view?usp=drive_link"
    ]
  },
{
    "id": "emi_socio_01",
    "accessKeys": [
      "socio",
      "emi",
      "mamahuevo"
    ],
    "displayName": "Emi",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#0052cc", // Azul
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "mario_gulf_02",
    "accessKeys": [
      "mario",
      "papalote"
    ],
    "displayName": "Mario",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#bad9f0", // Azul Gulf (aprox)
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "vane_rosa_03",
    "accessKeys": [
      "vane",
      "vanessa",
      "cachirula"
    ],
    "displayName": "Vane",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#ffb6c1", // Rosa claro
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "bruno_grn_04",
    "accessKeys": [
      "bruno",
      "bruninho",
      "bruce"
    ],
    "displayName": "Bruno",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#2ecc71", // Verde
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "ale_sky_05",
    "accessKeys": [
      "ale",
      "alessandra"
    ],
    "displayName": "Ale",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#87ceeb", // Azul cielo
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "pau_pink_06",
    "accessKeys": [
      "pau",
      "pao",
      "paulina",
      "paolina"
    ],
    "displayName": "Pao",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#ff1493", // Rosa intenso
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "sil_cld_07",
    "accessKeys": [
      "silvana",
      "sil",
      "silv"
    ],
    "displayName": "Silvana",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#b0e0e6", // Azul nube
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "ilse_red_08",
    "accessKeys": [
      "ilse",
      "il",
      "se",
      "yilse"
    ],
    "displayName": "Ilse",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#d32f2f", // Rojo
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "lukas_drk_09",
    "accessKeys": [
      "lukas",
      "lucas",
      "pelucas"
    ],
    "displayName": "Lukas",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#006400", // Verde Oscuro
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "damian_trq_10",
    "accessKeys": [
      "damian",
      "deimian",
      "demiados"
    ],
    "displayName": "Damian",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#40e0d0", // Turquesa
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "zoe_gry_11",
    "accessKeys": [
      "zoe",
      "zoeeee",
      "zoeee"
    ],
    "displayName": "Zoe",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#808080", // Gris
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  },
  {
    "id": "fam_pine_12",
    "accessKeys": [
      "familia",
      "aeromamis"
    ],
    "displayName": "Familia",
    "message": "Escribe tu mensaje aquí...",
    "images": [],
    "videoUrl": "",
    "spotifyUrl": "",
    "spotifyMessage": "",
    "themeColor": "#01796f", // Verde Pino
    "easterEggs": [],
    "bgmUrl": "https://archive.org/download/Bandcamp-63012668/63012668.mp3",
    "bgmVolume": 0.1
  }
];
