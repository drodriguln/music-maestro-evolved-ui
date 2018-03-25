import { Injectable } from '@angular/core';
import { Artist } from './Artist';
import { Album } from './Album';
import { Song } from './Song';

@Injectable()
export class Selection {
  artist: Artist;
  album: Album;
  song: Song;
  constructor(artist: Artist, album: Album, song: Song) {
    this.artist = artist;
    this.album = album;
    this.song = song;
  }
}
