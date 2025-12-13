import type { User, Comic, Author, Genre, Comment, Post } from './types';
/* -------------------------------------------------
   MOCK USERS – deterministic data (no random UUIDs)
   ------------------------------------------------- */
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'User A',
    email: 'user.a@example.com',
    passwordHash: 'cGFzc3dvcmQxMjM=',
    pts: 250,
    awards: [
      {
        id: 'award-u1-1',
        type: 'top-rated',
        earnedAt: '2024-01-01T12:00:00.000Z',
      },
    ],
    libraryUnlocked: { 'comic-1': true, 'comic-2': true },
  }, // password123
  {
    id: 'u2',
    name: 'User B',
    email: 'user.b@example.com',
    passwordHash: 'cGFzc3dvcmQ0NTY=',
    pts: 120,
    awards: [],
    libraryUnlocked: {},
  }, // password456
];
/* -------------------------------------------------
   AUTHORS & GENRES
   ------------------------------------------------- */
export const AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Stan Lee',
    avatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    bio: 'An American comic book writer, editor, and publisher, widely regarded as one of the pioneers of the modern comic book industry.',
  },
  {
    id: 'author-2',
    name: 'Jack Kirby',
    avatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    bio: "An American comic book artist, writer, and editor, widely regarded as one of the medium's major innovators and one of its most prolific and influential creators.",
  },
  {
    id: 'author-3',
    name: 'Alan Moore',
    avatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    bio: 'An English writer known primarily for his work in comic books including Watchmen, V for Vendetta, and From Hell.',
  },
  {
    id: 'author-4',
    name: 'Frank Miller',
    avatarUrl: 'https://i.pravatar.cc/150?u=author-4',
    bio: 'An American comic book writer, penciller and inker, novelist, screenwriter, film director, and producer known for his comic book stories and graphic novels such as Ronin, Daredevil: Born Again, The Dark Knight Returns, Sin City, and 300.',
  },
  {
    id: 'author-5',
    name: 'Hajime Isayama',
    avatarUrl: 'https://i.pravatar.cc/150?u=author-5',
    bio: 'A Japanese manga artist. His first and currently ongoing series, Attack on Titan, has sold over 100 million copies in print worldwide, making it one of the best-selling manga series of all time.',
  },
  {
    id: 'author-6',
    name: 'Neil Gaiman',
    avatarUrl: 'https://i.pravatar.cc/150?u=author-6',
    bio: 'An English author of short fiction, novels, comic books, graphic novels, nonfiction, audio theatre, and films. His work includes The Sandman comic book series.',
  },
];
export const GENRES: Genre[] = [
  { id: 'genre-1', name: 'Superhero' },
  { id: 'genre-2', name: 'Sci-Fi' },
  { id: 'genre-3', name: 'Fantasy' },
  { id: 'genre-4', name: 'Horror' },
  { id: 'genre-5', name: 'Manga' },
  { id: 'genre-6', name: 'Graphic Novel' },
  { id: 'genre-7', name: 'Noir' },
];
/* -------------------------------------------------
   HELPERS – deterministic mock data
   ------------------------------------------------- */
const chapterTitles = [
  'The Awakening',
  'First Contact',
  'The Conspiracy',
  'Betrayal',
  'The Siege',
  'Turning Point',
  'Revelation',
  'Final Battle',
  'Epilogue',
  'New Beginning',
];
const generateChapters = (comicId: string) => {
  const numChapters = 10 + Math.floor(Math.random() * 11); // 10‑20 chapters (acceptable randomness)
  return Array.from({ length: numChapters }).map((_, i) => ({
    id: `ch-${comicId}-${i + 1}`,
    title: `Chapter ${i + 1}: ${chapterTitles[i % chapterTitles.length]}`,
    progress: Math.floor(Math.random() * 101),
  }));
};
const mockCommenters = [
  { name: 'ComicFan82', avatar: 'https://i.pravatar.cc/150?u=fan1' },
  { name: 'ArtLover', avatar: 'https://i.pravatar.cc/150?u=fan2' },
  { name: 'StorySeeker', avatar: 'https://i.pravatar.cc/150?u=fan3' },
  { name: 'MangaManiac', avatar: 'https://i.pravatar.cc/150?u=fan4' },
  { name: 'GeekVerse', avatar: 'https://i.pravatar.cc/150?u=fan5' },
];
const mockMessages = [
  'Absolutely stunning artwork! The story is captivating.',
  "A must-read for any fan of the genre. I couldn't put it down.",
  'The character development is top-notch. Highly recommended.',
  'A bit slow to start, but the ending is mind-blowing!',
  "I've read this three times already. It's a masterpiece.",
];
const generateComments = (prefix: string): Comment[] => {
  const numComments = 3 + Math.floor(Math.random() * 6);
  return Array.from({ length: numComments }).map((_, i) => ({
    id: `comment-${prefix}-${String(i + 1).padStart(3, '0')}`,
    user: mockCommenters[i % mockCommenters.length],
    message: mockMessages[i % mockMessages.length],
    time: `2024-12-${String(10 + i).padStart(2, '0')}T12:00:00Z`,
  }));
};
const generatePosts = (prefix: string, authorIds: string[]): Post[] => {
  const numPosts = 8 + Math.floor(Math.random() * 5);
  const postTypes: Post['type'][] = ['text', 'image', 'video', 'text', 'text'];
  const postContents = {
    text: [
      'Just finished this chapter, wow! What did everyone else think about that twist?',
      'The art in this panel is absolutely breathtaking. The use of color is masterful.',
      "I have a theory about what's going to happen next...",
      'Can we talk about the character arc of the protagonist? So well written!',
    ],
    image: 'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7295486-tdkr3.jpg',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    voice: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    file: 'Chapter_Analysis.pdf',
  };
  const author = AUTHORS.find((a) => authorIds.includes(a.id));
  const users = [
    ...(author ? [{ name: author.name, avatar: author.avatarUrl, isCreator: true }] : []),
    ...mockCommenters,
  ];
  return Array.from({ length: numPosts }).map((_, i) => {
    const type = postTypes[i % postTypes.length];
    const votes = 20 + (i * 5) % 40; // deterministic 20‑59
    const up = Math.floor(votes * 0.7);
    const user = users[i % users.length];
    return {
      id: `post-${prefix}-${String(i + 1).padStart(3, '0')}`,
      user,
      type,
      content: type === 'text' ? postContents.text[i % postContents.text.length] : postContents[type],
      time: `2024-12-${String(5 + i).padStart(2, '0')}T14:00:00Z`,
      reactions: {
        votes,
        up,
        down: votes - up,
        stars: parseFloat((3 + (i % 2) * 0.5).toFixed(1)), // 3.0 or 3.5
        emojis: { '👍': i * 2, '❤️': i, '🔥': i % 3 },
        stickers: { '⭐': i % 5, '💯': i % 3, '😂': i % 4 },
        heart: 10 + i * 3,
      },
      replies:
        i % 2 === 0
          ? generateComments(`${prefix}-post-${String(i + 1).padStart(3, '0')}`).slice(0, 2)
          : [],
    };
  });
};
const generateRatings = (prefix: string) => {
  const avg = 4.5 + (prefix.charCodeAt(0) % 10) / 10; // 4.5‑5.4
  const votes = 80 + (prefix.charCodeAt(1) % 20) * 10; // 80‑380
  const up = Math.floor(votes * 0.75);
  const down = votes - up;
  return { avg: parseFloat(avg.toFixed(1)), votes, up, down };
};
/* -------------------------------------------------
   COMICS – deterministic mock catalog
   ------------------------------------------------- */
export const COMICS: Comic[] = [
  {
    id: 'comic-1',
    title: 'Amazing Spider-Man #36',
    description:
      'A thrilling space opera that spans galaxies. Follow the crew of the Star-Wanderer as they uncover an ancient secret that could change the universe forever. This epic tale combines stunning visuals with a deep, character-driven narrative that explores themes of destiny, sacrifice, and the nature of consciousness itself. Prepare for a journey to the edge of imagination.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11135/111356221/9232085-asm2022036_cov.jpg',
    authorIds: ['author-1', 'author-2'],
    genreIds: ['genre-1', 'genre-2'],
    price: 19.99,
    rating: 4.8,
    ratings: generateRatings('comic-1'),
    pages: 256,
    releaseDate: '2024-05-20',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/9232088-asm2022036_int_1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/9232089-asm2022036_int_2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/9232090-asm2022036_int_3.jpg',
    ],
    chapters: generateChapters('comic-1'),
    comments: generateComments('comic-1'),
    posts: generatePosts('comic-1', ['author-1', 'author-2']),
    awards: ['top-fan'],
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    duration: '3h 45m',
  },
  {
    id: 'comic-2',
    title: 'The Watchmen',
    description:
      'In an alternate history where superheroes are treated as outlaws, a murder mystery uncovers a conspiracy that could doom the world. This seminal work deconstructs the superhero genre, offering a gritty, realistic take on what it would mean for costumed vigilantes to exist in the real world. Its complex narrative and mature themes have made it a cornerstone of the graphic novel medium.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189851-watchmen.jpg',
    authorIds: ['author-3'],
    genreIds: ['genre-1', 'genre-6'],
    price: 24.99,
    rating: 4.9,
    ratings: generateRatings('comic-2'),
    pages: 416,
    releaseDate: '1987-09-01',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/6/67663/3003923-01.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/6/67663/3003924-02.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/6/67663/3003925-03.jpg',
    ],
    chapters: generateChapters('comic-2'),
    comments: generateComments('comic-2'),
    posts: generatePosts('comic-2', ['author-3']),
    awards: ['super-reader'],
    audioUrl: 'https://www.soundjay.com/misc/sounds/dream-harp-01.mp3',
    duration: '5h 12m',
  },
  {
    id: 'comic-3',
    title: 'Attack on Titan Vol. 1',
    description:
      'In a world where humanity lives in cities surrounded by enormous walls, a young boy vows to exterminate the giant humanoids that threaten his home. This manga series is known for its intense action, shocking plot twists, and exploration of themes like freedom, despair, and the horrors of war. It has captivated audiences worldwide and become a global phenomenon.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/3054944-01.jpg',
    authorIds: ['author-5'],
    genreIds: ['genre-5', 'genre-4', 'genre-3'],
    price: 12.99,
    rating: 4.7,
    ratings: generateRatings('comic-3'),
    pages: 192,
    releaseDate: '2010-03-17',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350888-aot2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350889-aot3.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350890-aot4.jpg',
    ],
    chapters: generateChapters('comic-3'),
    comments: generateComments('comic-3'),
    posts: generatePosts('comic-3', ['author-5']),
    awards: [],
  },
  {
    id: 'comic-4',
    title: 'The Dark Knight Returns',
    description:
      'A grizzled, middle-aged Bruce Wayne returns from retirement to fight crime in a dark and violent future, facing opposition from the Gotham City police force and the U.S. government. This landmark story redefined Batman for a new generation, presenting a darker, more complex version of the character and influencing countless comics and films that followed.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189849-dmdkr.jpg',
    authorIds: ['author-4'],
    genreIds: ['genre-1', 'genre-6', 'genre-7'],
    price: 21.5,
    rating: 4.9,
    ratings: generateRatings('comic-4'),
    pages: 224,
    releaseDate: '1986-02-01',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7295484-tdkr1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7295485-tdkr2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7295486-tdkr3.jpg',
    ],
    chapters: generateChapters('comic-4'),
    comments: generateComments('comic-4'),
    posts: generatePosts('comic-4', ['author-4']),
    awards: ['top-fan'],
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-1.mp3',
    duration: '2h 55m',
  },
  {
    id: 'comic-5',
    title: 'Saga #1',
    description:
      'In a neon-drenched metropolis, a rogue android detective hunts for the truth behind her own creation, uncovering a corporate conspiracy. This cyberpunk thriller blends high-octane action with philosophical questions about identity and humanity in a technologically advanced world. The stunning artwork brings the futuristic city to life in vivid detail.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189852-saga.jpg',
    authorIds: ['author-1'],
    genreIds: ['genre-2', 'genre-7'],
    price: 15.99,
    rating: 4.5,
    ratings: generateRatings('comic-5'),
    pages: 180,
    releaseDate: '2024-04-15',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350891-saga1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350892-saga2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350893-saga3.jpg',
    ],
    chapters: generateChapters('comic-5'),
    comments: generateComments('comic-5'),
    posts: generatePosts('comic-5', ['author-1']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
    duration: '2h 10m',
  },
  {
    id: 'comic-6',
    title: 'Monstress #1',
    description:
      'A high-fantasy epic where a young elf must unite warring kingdoms against a shadow that threatens to consume the land. Featuring a sprawling world, a rich history, and a diverse cast of characters, this series is a must-read for fans of classic fantasy. The journey is filled with magic, monsters, and political intrigue.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189853-monstress.jpg',
    authorIds: ['author-3', 'author-6'],
    genreIds: ['genre-3'],
    price: 29.99,
    rating: 4.6,
    ratings: generateRatings('comic-6'),
    pages: 350,
    releaseDate: '2022-08-20',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350894-monstress1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350895-monstress2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350896-monstress3.jpg',
    ],
    chapters: generateChapters('comic-6'),
    comments: generateComments('comic-6'),
    posts: generatePosts('comic-6', ['author-3', 'author-6']),
    awards: [],
  },
  {
    id: 'comic-7',
    title: 'Daredevil: Born Again',
    description:
      'A psychological horror story set on a derelict space station. The lone survivor must confront her inner demons and a terrifying presence. This comic masterfully blends science fiction with cosmic horror, creating a tense and atmospheric experience that will linger with you long after you finish reading. The art perfectly captures the sense of isolation and dread.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189850-ddba.jpg',
    authorIds: ['author-4'],
    genreIds: ['genre-4', 'genre-2'],
    price: 18.0,
    rating: 4.7,
    ratings: generateRatings('comic-7'),
    pages: 210,
    releaseDate: '2023-05-11',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350897-ddba1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350898-ddba2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350899-ddba3.jpg',
    ],
    chapters: generateChapters('comic-7'),
    comments: generateComments('comic-7'),
    posts: generatePosts('comic-7', ['author-4']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-2.mp3',
    duration: '1h 58m',
  },
  {
    id: 'comic-8',
    title: 'Lone Wolf and Cub',
    description:
      'A lone samurai wanders a feudal Japan-inspired land, seeking redemption for his past while protecting the innocent from a corrupt shogun. This manga is a beautifully drawn tale of honor, revenge, and redemption. The sword fights are dynamic and visceral, and the story is a poignant exploration of the samurai code in a changing world.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189854-lwac.jpg',
    authorIds: ['author-5'],
    genreIds: ['genre-5'],
    price: 14.99,
    rating: 4.8,
    ratings: generateRatings('comic-8'),
    pages: 200,
    releaseDate: '2021-11-30',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350900-lwac1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350901-lwac2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350902-lwac3.jpg',
    ],
    chapters: generateChapters('comic-8'),
    comments: generateComments('comic-8'),
    posts: generatePosts('comic-8', ['author-5']),
    awards: [],
  },
  {
    id: 'comic-9',
    title: 'The Sandman: Preludes',
    description:
      'Journey into a world of dreams, myths, and nightmares as the lord of dreams, Morpheus, is captured and must reclaim his lost artifacts. This series is a masterpiece of modern fantasy, weaving together mythology, folklore, and history into a rich and intricate tapestry. It is a story about stories, and its influence on the comic book medium is immeasurable.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189855-sandman.jpg',
    authorIds: ['author-6'],
    genreIds: ['genre-3', 'genre-6', 'genre-4'],
    price: 22.99,
    rating: 4.9,
    ratings: generateRatings('comic-9'),
    pages: 240,
    releaseDate: '2024-05-01',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350903-sandman1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350904-sandman2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350905-sandman3.jpg',
    ],
    chapters: generateChapters('comic-9'),
    comments: generateComments('comic-9'),
    posts: generatePosts('comic-9', ['author-6']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-3.mp3',
    duration: '4h 30m',
  },
  {
    id: 'comic-10',
    title: 'X-Men: God Loves, Man Kills',
    description:
      'An ancient artifact sends a signal across the galaxy, leading a team of explorers to a long-lost civilization. A story of discovery and danger.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189856-xmen.jpg',
    authorIds: ['author-1', 'author-2'],
    genreIds: ['genre-2'],
    price: 17.99,
    rating: 4.6,
    ratings: generateRatings('comic-10'),
    pages: 220,
    releaseDate: '2024-03-10',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350906-xmen1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350907-xmen2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350908-xmen3.jpg',
    ],
    chapters: generateChapters('comic-10'),
    comments: generateComments('comic-10'),
    posts: generatePosts('comic-10', ['author-1', 'author-2']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/buttons/sounds/button-1.mp3',
    duration: '3h 15m',
  },
  {
    id: 'comic-11',
    title: 'Sin City',
    description:
      'A hardboiled detective navigates the rain-slicked streets of a corrupt city, solving a case that hits too close to home.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189857-sincity.jpg',
    authorIds: ['author-4'],
    genreIds: ['genre-7'],
    price: 14.5,
    rating: 4.8,
    ratings: generateRatings('comic-11'),
    pages: 190,
    releaseDate: '2023-09-05',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350909-sincity1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350910-sincity2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350911-sincity3.jpg',
    ],
    chapters: generateChapters('comic-11'),
    comments: generateComments('comic-11'),
    posts: generatePosts('comic-11', ['author-4']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/buttons/sounds/button-2.mp3',
    duration: '2h 40m',
  },
  {
    id: 'comic-12',
    title: 'Fables: Legends in Exile',
    description:
      'In a world where magic is fading, the last dragon and its rider must embark on a perilous journey to restore balance to the realm.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189858-fables.jpg',
    authorIds: ['author-6'],
    genreIds: ['genre-3'],
    price: 20.99,
    rating: 4.7,
    ratings: generateRatings('comic-12'),
    pages: 310,
    releaseDate: '2024-04-22',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350912-fables1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350913-fables2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350914-fables3.jpg',
    ],
    chapters: generateChapters('comic-12'),
    comments: generateComments('comic-12'),
    posts: generatePosts('comic-12', ['author-6']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/buttons/sounds/button-3.mp3',
    duration: '4h 05m',
  },
  {
    id: 'comic-13',
    title: 'Superman: Red Son',
    description:
      'A brilliant physicist gets trapped in a time loop, reliving the same day over and over. He must use his knowledge of quantum mechanics to break free.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189859-redson.jpg',
    authorIds: ['author-1'],
    genreIds: ['genre-2'],
    price: 16.99,
    rating: 4.5,
    ratings: generateRatings('comic-13'),
    pages: 200,
    releaseDate: '2024-05-15',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350915-redson1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350916-redson2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350917-redson3.jpg',
    ],
    chapters: generateChapters('comic-13'),
    comments: generateComments('comic-13'),
    posts: generatePosts('comic-13', ['author-1']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/buttons/sounds/button-4.mp3',
    duration: '2h 20m',
  },
  {
    id: 'comic-14',
    title: 'Hellboy: Seed of Destruction',
    description:
      'A haunting tale of a family cursed by a malevolent spirit. They must uncover the dark secrets of their ancestors to survive.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189860-hellboy.jpg',
    authorIds: ['author-3'],
    genreIds: ['genre-4'],
    price: 13.99,
    rating: 4.4,
    ratings: generateRatings('comic-14'),
    pages: 180,
    releaseDate: '2023-11-18',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350918-hellboy1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350919-hellboy2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350920-hellboy3.jpg',
    ],
    chapters: generateChapters('comic-14'),
    comments: generateComments('comic-14'),
    posts: generatePosts('comic-14', ['author-3']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/buttons/sounds/button-5.mp3',
    duration: '1h 55m',
  },
  {
    id: 'comic-15',
    title: 'Akira Vol. 1',
    description:
      'A young ninja seeks to avenge her fallen clan, mastering the art of the silent blade to take down a powerful warlord.',
    coverUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/11147/111471097/9189861-akira.jpg',
    authorIds: ['author-5'],
    genreIds: ['genre-5'],
    price: 11.99,
    rating: 4.6,
    ratings: generateRatings('comic-15'),
    pages: 170,
    releaseDate: '2024-02-28',
    previewImageUrls: [
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350921-akira1.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350922-akira2.jpg',
      'https://comicvine.gamespot.com/a/uploads/original/11135/111356221/7350923-akira3.jpg',
    ],
    chapters: generateChapters('comic-15'),
    comments: generateComments('comic-15'),
    posts: generatePosts('comic-15', ['author-5']),
    awards: [],
    audioUrl: 'https://www.soundjay.com/buttons/sounds/button-6.mp3',
    duration: '2h 00m',
  },
];
/* -------------------------------------------------
   EXPORTS – convenience aliases
   ------------------------------------------------- */
export const genres = GENRES;
export const authors = AUTHORS;
export const comics = COMICS;
export const audiobooks = COMICS.filter((c) => c.audioUrl);
export const newReleasesAudiobooks = [...audiobooks]
  .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
  .slice(0, 5);
//