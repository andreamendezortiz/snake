export type Point = { x: number; y: number };

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
};

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#ff00ff',
  },
  {
    id: '2',
    title: 'Cyber Circuit',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#00ffff',
  },
  {
    id: '3',
    title: 'Void Runner',
    artist: 'Night Crawler',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#39ff14',
  },
];
