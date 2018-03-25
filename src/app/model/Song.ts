import { Injectable } from '@angular/core';

@Injectable()
export class Song {
  id: string;
  name: string;
  trackNumber: string;
  year: string;
  fileId: string;
  artworkFileId: string;
}
