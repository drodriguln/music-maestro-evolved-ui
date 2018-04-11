import { Component, ViewChild } from '@angular/core';
import { LibraryComponent } from './library/library.component';
import { EditComponent } from './edit/edit.component';
import { UploadComponent } from './upload/upload.component';
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

  @ViewChild(LibraryComponent)
  private library: LibraryComponent;
  @ViewChild(EditComponent)
  private edit: EditComponent;
  @ViewChild(UploadComponent)
  private upload: UploadComponent;
  @ViewChild(PlayerComponent)
  private player: PlayerComponent;

  artists: Array<Artist>;
  albums: Array<Album>;
  songs: Array<Song>;
  playlist: Array<Song>;
  selection: Selection;
  isActiveMenuSection: Array<boolean> = [false, false, false];
  isPlayerLoaded: boolean = false;

  constructor(private restService: RestService) { }

  getArtists() {
    this.restService.getArtists().subscribe(artists => this.artists = artists);
  }

  getSelection(event) {
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

  setPlaylist(songs: Array<Song>) {
    this.playlist = songs;
  }

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

  exitMenu() {
    for (let i = 0; i < this.isActiveMenuSection.length; i++) {
      this.isActiveMenuSection[i] = false;
    }
  }

  loadPlayer() {
    setTimeout( () => this.player.load(), 200);
  }

  reloadPlayer() {
    this.isPlayerLoaded = false;
    setTimeout( () => this.isPlayerLoaded = true, 200);
  }

  stopPlayer() {
    if (this.player != undefined) {
      if (this.player.playback != null ) {
        this.player.playback.pause();
        this.player.playback = null;
      }
      this.player.isPlaying = false;
    }
  }

}
