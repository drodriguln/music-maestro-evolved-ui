import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

  getArtist(artistId) {
    return this.http.get(config.apiHost + "/artists/" + artistId)
    .map((response: Response) => response.json());
  }

  getAlbums(artistId) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums")
    .map((response: Response) => response.json());
  }

  getAlbum(artistId, albumId) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums/" + albumId)
    .map((response: Response) => response.json());
  }

  getSongs(artistId, albumId) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums/" + albumId + "/songs")
    .map((response: Response) => response.json());
  }

  getSong(artistId, albumId, songId) {
    return this.http.get(config.apiHost + "/artists/" + artistId + "/albums/" + albumId + "/songs/" + songId)
    .map((response: Response) => response.json());
  }

}
