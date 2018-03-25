import { Component, ViewChild } from '@angular/core';
import { LibraryComponent } from './library/library.component';
import { PlayerComponent } from './player/player.component';
import { RestService } from './service/rest/rest.service';
import { Artist } from './model/Artist';
import { Album } from './model/Album';
import { Song } from './model/Song';
import { Selection } from './model/Selection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /*
   *  Makes child components accessible directly in this parent component.
   */

  @ViewChild(LibraryComponent)
  private library: LibraryComponent;
  @ViewChild(PlayerComponent)
  private player: PlayerComponent;

  artists: Array<Artist>;
  albums: Array<Album>;
  songs: Array<Song>;
  playlist: Array<Song>;
  selection: Selection;

  constructor(private restService: RestService) { }

  //Active menu sections: ["Music Library"]
  isActiveMenuSection: Array<boolean> = [false];

  //Represents whether or not the player component is initialized.
  isPlayerLoaded: boolean = false;

  getArtists() {
    this.restService.getArtists().subscribe(artists => this.artists = artists);
  }

  /*
   *  Retrieves an object containing an artist, album, and song object for given
   *  artist, album, and song IDs. This is used primarily for song playback info.
   */
  getSelection(event) {
    this.exitMenu();
    this.stopPlayer();
    if (this.selection != null && this.selection.album.id != event.albumId) {
      this.reloadPlayer();
    }
    this.restService.getArtist(event.artistId).subscribe(artist => {
      this.restService.getAlbum(event.artistId, event.albumId).subscribe(album => {
        this.restService.getSong(event.artistId, event.albumId, event.songId).subscribe(song => {
          this.selection = new Selection(artist, album, song);
          this.isPlayerLoaded = true;
          this.loadPlayer();
        });
      });
    });
  }

  /*
   *  Setter for the songsSelected object. This is used by the library component to
   *  store the last accessed list of songs to effectively allow album playback
   *  in the player object.
   */
  setPlaylist(songs: Array<Song>) {
    this.playlist = songs;
  }

  /*
   *  Sets the active section in the menu.
   *  Triggers upon clicking one of the menu buttons.
   */
  setActiveTab(boolIndex) {
    for (let i = 0; i < this.isActiveMenuSection.length; i++) {
      if (i == boolIndex) {
        this.isActiveMenuSection[boolIndex] = !this.isActiveMenuSection[boolIndex];
      }
      else {
        this.isActiveMenuSection[i] = false;
      }
    }
  }

  /*
   *  Sets every menu item's boolean variable to false, which fails their
   *  conditionals in the view.
   */
  exitMenu() {
    for (let i = 0; i < this.isActiveMenuSection.length; i++) {
      this.isActiveMenuSection[i] = false;
    }
  }

  /*
   *  Tells the child component "Player" to load a new song.
   *  A timeout is set to allow the component to load, otherwise it will appear
   *  undefined if processed quickly enough.
   */
  loadPlayer() {
    this.exitMenu();
    setTimeout( () => this.player.load(), 200);
  }

  /*
   *  Reloads player based on conditional in the view. This triggers its CSS animation.
   *  A timeout is set to allow the component to load, otherwise it will appear
   *  undefined if processed quickly enough.
   */
  reloadPlayer() {
    this.isPlayerLoaded = false;
    setTimeout( () => this.isPlayerLoaded = true, 200);
  }

  /*
   *  Stops any existing song playback.
   *  Checks if the player component has been loaded,
   *  and if there is already a loaded song. Sets the loaded song to null.
   */
  stopPlayer() {
    if (this.player != undefined) {
      if (this.player.audio != null ) {
        this.player.audio.pause();
        this.player.audio = null;
      }
      this.player.isPlaying = false;
    }
  }

}
