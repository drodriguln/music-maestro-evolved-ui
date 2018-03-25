import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestService } from '../service/rest/rest.service';
import { Artist } from '../model/Artist';
import { Album } from '../model/Album';
import { Song } from '../model/Song';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  /*
   *  Input and output between the parent component.
   *  The output objects are event emitters that trigger parent function.
   */

  @Output() setPlaylist = new EventEmitter();
  @Output() getSelection = new EventEmitter();

  /*
   *  Instance variables and objects.
   */

  //The IDs for the selections in the library's artist, album, and song lists.
  artistIdSelected: String;
  albumIdSelected: String;
  songIdSelected: String;

  //The lists of artists, albums, and songs pulled from the server.
  artists: Array<Artist>;
  albums: Array<Album>;
  songs: Array<Song>;

  constructor(private restService: RestService) { }

  ngOnInit() {
    setTimeout(() => {
      this.getArtists();
    }, 500);
  }

  /*
   *  Gets a list of artists form the server. A timeout is done to sync timing
   *  with the animations for the album and song lists (since they require a delay).
   */
  getArtists() {
    this.restService.getArtists().subscribe(artists => {
      setTimeout( () => this.artists = artists, 100);
    });
  }

  /*
   *  Gets a list of albums from the server for the selected artist ID.
   *  Sets the selected album ID to null then reset after delay to trigger the
   *  list loading animation.
   *  The album ID is set to null to close any already-opened song list.
   */
  getAlbums(artistId: String) {
    this.artistIdSelected = null; //Triggers albums animation by reseting to null first..
    this.albumIdSelected = null;  //Hides song listing in the view.
    setTimeout( () => this.artistIdSelected = artistId, 100); //Reset the artist ID.
    this.restService.getAlbums(artistId).subscribe(albums => this.albums = albums);
  }

  /*
   *  Gets a list of songs from the server for the selected artist and album IDs.
   *  Sets the selected album ID to null then reset after delay to trigger the
   *  list loading animation.
   */
  getSongs(artistId: String, albumId: String) {
    this.albumIdSelected = null;
    setTimeout( () => this.albumIdSelected = albumId, 100); //Reset the artist ID.
    this.restService.getSongs(artistId, albumId).subscribe(songs => this.songs = songs);
  }

  getSong(artistId: String, albumId: String, songId: String) {
    this.songIdSelected = songId;
    this.setPlaylist.emit(this.songs);  //For playback through album in player.
    this.getSelection.emit({artistId, albumId, songId});
  }

}
