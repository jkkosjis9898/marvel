const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});
const fs = require('fs');

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Conexión exitosa nenes');
});

// Función para eliminar tildes de las palabras
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Palabras clave con respuestas aleatorias y secuencias de mensajes
const keywordResponses = [
  {
    keywords: ["hola", "hl", "noches", "buenas", "saludos", "dias", "tarde", "mañana", "hla", "ola"],
    responses: ['Hola amor', 'Hola papi', 'Hola como ests','Hola','Hola Rey','Como estás mi vida','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey','Hola Rey'],
  },
  {
    keywords: ["como", "estas", "como estas", "esta", "tal", "estás", "está"],
    responses: ['Estoy, bien gracias', 'Bastante bien.', 'Muy bien Gracias', 'Bien, gracias.', 'Estoy de maravilla, amor❤️.'],
  },
  {
    keywords: ["donde", "parte", "vives", "ciudad", "lugar", "pais", "dnde", "dónde", "país", "sitio"],
    responses: ['Soy Venezolana y estoy aquí en Bogota en la 127 con avenida villas en frente de bulevar niza amor'],
  },
  {
    keywords: ["soltera", "comprometida", "casada", "marido", "novio", "esposo", "pareja"],
    responses: ['Soy mamá de 2 niñas, tengo varios años separada del papá de mis hijas y solo me he dedicado a ellas el 100 %'],
  },
  {
    keywords: ["reina", "atractiva", "guapa", "belleza", "amor", "bb", "hermosa", "preciosa", "te amo", "amo", "adoro", "te quiero", "belleza", "bellezima", "belleza","encantadora", "fascinante", "atractiva", "hermosa", "maravillosa", "carismática", "espléndida", "elegante", "agradable", "deslumbrante", "deslumbradora", "encantadoramente", "atractivamente", "fascinantemente", "guapa", "encanto", "adorable", "adoracion", "cariñosa", "amorosa"],
    responses: ['Gracias amor', 'Enserio', 'Eso siii todo natural amor', 'De verdad q eres super lindo',  'Tu eres tan lindo de verdad', 'tu me gustas mucho', 'Gracias amor 💞', 'Gracias mí corazón', 'Y eso q no me conoces','Es usted muy amable.', 'Gracias rey', 'Gracias por ser tan bello', 'Gracias mí amor', 'Gracias bb', 'Usted también es hermoso mi amor', 'Ya bello 🤩', 'Gracias 🥴', 'Bello mi amor', 'Hay BB eres la mejor persona 💗', 'Tú eres perfecto', 'Todo hermoso mi BB ❣️', 'Bello 🤩 meeeee encantaaaaaas', '❤️ tan bello', 'Gracias rey', 'Gracias cielo ❤️', 'Hay amor que lindo 😻', 'Gracias mi vida', 'Tan lindo me agradas mucho', 'Hay cielo que lindo', 'Besos mi amor', 'Hay amor tan lindo 😍', 'Te mando un beso y un abrazo fuerte', 'Tan bello mi amor', 'Gracias me encabtas amor', 'Es usted un amor', 'Te amo más mi bb', 'Yo a usted lo quiero mucho mucho', 'Siii Loo seee mi rey', 'Bueno mi vida pueden existir muchas más hermosas', 'Y gracias mi  amor 😍😍❤️💘', 'Y gracias', 'Te amooooo como loca', 'Aww te amo 😍😍', 'Te amo', 'Si de algo puedes estar seguro es q yo te amo más', 'Tii amo💘', '❤️💘 yo lo amo más', 'Yo también te quiero 😘', 'Te quiero 💖'],
  },
  {
    keywords: ["edad", "años"],
    responses: ['Tengo 47 años'],
  },
  {
    keywords: ["edad", "años"],
    responses: ['Tengo 47 años'],
  },

    {
      keywords: ["mamar", "cuca", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito","meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas ", "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja","cenos"],
      responses: ['Así me encanta el huevo rico 🤤 Ami me gusta mucho', 'Ay No Se Que Decir🤭', 'Q Rico Eso Me Encanta', 'Ay No Se Que Decir🤭', 'Super rico❤️❤️', 'divino papasito', 'Uf, qué rico. Me encantaría. 😋😋😋😋', 'Ayyy Q RiKo sii', 'Qué delicia 😘😘❤😍😍😍', 'Dime que me harías', 'Q rico seriaa amor 😍😍❤️🤤😈', 'Huuuuy q ricoo Mii bb', 'mee encantaa q ricooo mi amor', '😋😋😋q riicooo me encantaaaaaa', 'yaaa quiroo sentirlooo', 'Aaaaahh uufhssss q ricoooo', 'Riiicooo 😋😋👅', 'Ricooo riicoo ricoooo', 'Uufhsss dioossssss q ricoooooo 😍😍😍😍😍😈😈😈', 'q me deje las piernas temblando sexo rudo contigo amor seria perfectoo', 'Huy q riiicooo uffhsss', 'Quierooo esooo paraaa mi, sentirloo dentro de miii😍😍😍😍', 'Q ricooo sería super😈😋😋😋', 'Mee encantaria sentirlo dentro d mii 😈😋😋', '😋😋😋 seriaaaa ricooo', 'yoo quierooo 😈😈', 'sii Bebé y me mandas videos yoo quiero ver 😋😋😋😈😍😍', 'Waooo q ricoooo bb', 'Q ricooo bb meee encantaaas', 'huy q ricoo bb', 'Uf q ricooooooo mee encantaria tu penee😋😋😋😋', '😋😋😋 ufsss ricoooo', 'huy q ricoo', '😮😮😋😋😋😈q riiicoooo mee encantaaa'],
    },

{
  keywords: ['rico', 'rica', 'provocativa', 'ricota', 'lechita', 'haces', 'desnuda', 'dedicas', 'que haces', 'deliciosa'],
  sequences: [
    [
      ['Soy modelo webc@m de S€X0 en vivo por chat', 6000],
      ['Si quieres verme, aquí te envió el Link', 6000],
      ['no tienes que pagar nada amor', 6000],
      ['Te envire fotos y vídeos y cuando este en vivo amor', 6000],
      ['enviar imagen rica1.jpg', 6000],
      ['enviar imagen rica2.jpg', 6000],
      ['enviar imagen rica3.jpg', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
    ],
    [
      ['Soy modelo webc@m de S€X0 en vivo por chat, Te enviaré el enlace y no tienes que pagar nada, te enviare fotos y videos, podras verme cuando este en vivo Amor❤️🔥.', 6000],
      ['enviar imagen rica1.jpg', 6000],
      ['enviar imagen rica2.jpg', 6000],
      ['enviar imagen rica3.jpg', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
    ],
  ],
},
{
  keywords: ['entra', 'sale', 'entro', 'paguina', 'abre', 'hago', 'link', 'bloquada', 'funciona', 'abrir'],
  sequences: [
    [
      ['Quiero q lo intentes de nuevo para que me veas todas las noches Amor', 6000],
      ['enviar imagen entra1.jpg', 6000],
      ['enviar imagen entra2.jpg', 6000],
      ['enviar imagen entra3.jpg', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
    ],
    [
      ['Intentalo de nuevo y disfrutamos todas las noches Amor🔥.', 6000],
      ['enviar imagen entra1.jpg', 6000],
      ['enviar imagen entra4.jpg', 6000],
      ['enviar imagen entra5.jpg', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
    ],
  ],
},
// Agregar más palabras clave y sus respuestas/secuencias asociadas aquí
{
  keywords: ['foto', 'video', 'videos', 'mandame', 'enviame', 'hago', 'llamada', 'audio'],
  sequences: [
    [
      ['Sii Amor', 6000],
      ['enviar imagen amor1.jpg', 6000],
      ['enviar imagen amor2.jpg', 6000],
      ['enviar imagen amor3.jpg', 6000],
    ],
    [
      ['Bien Amor🔥.', 6000],
      ['enviar imagen amor2.jpg', 6000],
      ['enviar imagen amor4.jpg', 6000],
      ['enviar imagen amor5.jpg', 6000],
    ],
  ],
},
];

// Diccionario de secuencias y sus imágenes asociadas
const sequences = {
// Agregar más secuencias aquí si es necesario
// secuencia3: [ ... ]
};

// Respuestas aleatorias para mensajes desconocidos
const randomResponses = [
  '❤️',
  '🤗🤗',
  '😍',
  '🤗🤗',
  'Si amor',
  'Shiiii 🥰❤️',
  'Ok amor',
  '❤️super rico 🤤',
  'Hay dios 😁',
  'Que bueno saber eso 😊',
  'Vale está bien',
  'Woow',
  'Vale',
  'Que finooo',
  'Ahhh yaa que chevere',
  'Sip',
  'Si claro',
  '❤️super rico 🤤',
  'Ya entiendo',
  'Ok me parece bien',
  'Unnm eso es bueno',
  'Muy bien',
  'Si Rey',
  'Está muy bien',
  'Eso es bueno',
  'Si ya',
  'Bueno Amor❤️',
  'Lindo',
  'Eres mío Amor',
  'Un ya',
  'Me alegro',
  'Si aja',
  'Un ya cielo',
  'Vale cielo está bien',
  'Vale mí amor ❤️😍',
  'Está bien ☺️',
  'Vale amor está Bien que haces horita',
  'Si que bueno',
  'Ok mi amor',
  'Que bueno mi amor',
  ];

// Función para obtener una respuesta aleatoria de una lista
function getRandomResponse(responsesList) {
  const randomIndex = Math.floor(Math.random() * responsesList.length);
  return responsesList[randomIndex];
}

// Función para verificar si el mensaje incluye alguna de las palabras clave asociadas con una secuencia
function findSequence(message) {
  const lowercaseMessage = removeAccents(message.toLowerCase()); // Eliminamos los acentos del mensaje
  for (const response of keywordResponses) {
    const keywords = response.keywords;
    const found = keywords.some(keyword => {
      const lowercaseKeyword = removeAccents(keyword.toLowerCase()); // Eliminamos los acentos de la palabra clave
      return lowercaseMessage.includes(lowercaseKeyword);
    });
    if (found) {
      return response;
    }
  }
  return null;
}

// Función para enviar mensajes con intervalos de tiempo y seleccionar una secuencia aleatoria
async function sendSequenceMessages(chatId, sequences) {
  const randomSequenceIndex = Math.floor(Math.random() * sequences.length);
  const randomSequence = sequences[randomSequenceIndex];

  for (const [message, interval] of randomSequence) {
    if (message.startsWith('enviar imagen')) {
      // Es una solicitud para enviar una imagen o video
      const imagePath = message.substring(14).trim();
      if (fs.existsSync(imagePath)) {
        const media = MessageMedia.fromFilePath(imagePath);
        await client.sendMessage(chatId, media);
      } else {
        await client.sendMessage(chatId, 'No se encontró la imagen.');
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, interval));
      await client.sendMessage(chatId, message);
    }
  }
}

async function handleIncomingMessage(message) {
  console.log(message.body);
  const matchedResponse = findSequence(message.body);
  if (matchedResponse) {
    if (matchedResponse.responses) {
      const randomResponse = getRandomResponse(matchedResponse.responses);
      await sendDelayedMessage(message.from, randomResponse);
    } else if (matchedResponse.sequences) {
      const sequences = matchedResponse.sequences;
      await sendSequenceMessages(message.from, sequences);
    }
  } else {
    const randomResponse = getRandomResponse(randomResponses);
    await sendDelayedMessage(message.from, randomResponse);
  }
}

// Función para enviar un mensaje con una demora aleatoria antes de enviarlo
async function sendDelayedMessage(chatId, message) {
  const delay = Math.floor(Math.random() * 8000) + 4000; // Delay entre 1 y 5 segundos
  await new Promise(resolve => setTimeout(resolve, delay));
  await client.sendMessage(chatId, message);
}



// Manejar eventos de mensajes
client.on('message', handleIncomingMessage);

// Función para inicializar el cliente y navegar a WhatsApp Web con opciones de espera
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    client.initialize(browser);
})();
