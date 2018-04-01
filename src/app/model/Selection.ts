import { Injectable } from '@angular/core';
import { Artist } from './Artist';
import { Album } from './Album';
import { Song } from './Song';

@Injectable()
export class Selection {
  constructor(public artist: Artist, public album: Album, public song: Song) {
    this.artist = artist;
    this.album = album;
    this.song = song;
  }
}
