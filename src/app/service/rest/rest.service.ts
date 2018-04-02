import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Artist } from '../../model/Artist';
import { Album } from '../../model/Album';
import { config } from '../../config/config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {

  constructor(private http: Http) {}

  getArtists() {
    return this.http.get(config.apiHost + "/artists")
    .map((response: Response) => response.json());
  }

  getArtist(artistId: string) {
    return this.http.get(config.apiHost + "/artists/" + artistId)
    .map((response: Response) => response.json());
  }

  getAlbums(artistId: string) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums")
    .map((response: Response) => response.json());
  }

  getAlbum(artistId: string, albumId: string) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums/" + albumId)
    .map((response: Response) => response.json());
  }

  getSongs(artistId: string, albumId: string) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums/" + albumId + "/songs")
    .map((response: Response) => response.json());
  }

  getSong(artistId: string, albumId: string, songId: string) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums/" + albumId + "/songs/" + songId)
    .map((response: Response) => response.json());
  }

  addArtist(artist: Artist) {
    return this.http.post(config.apiHost + "/artists", artist)
    .map((response: Response) => response.json());
  }

  addAlbum(artistId: string, album: Album) {
    return this.http.post(config.apiHost + "/artists/" + artistId + "/albums", album)
    .map((response: Response) => response.json());
  }

  addSong(artistId: string, albumId: string, formData: FormData) {
    return this.http.post(config.apiHost + "/artists/" + artistId + "/albums/" + albumId + "/songs", formData);
  }

}
