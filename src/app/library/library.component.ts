import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestService } from '../service/rest/rest.service';
import { Artist } from '../model/Artist';
import { Album } from '../model/Album';
import { Song } from '../model/Song';
import { Selection } from '../model/Selection';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  @Input() selection: Selection;
  @Output() setPlaylist = new EventEmitter();
  @Output() getSelection = new EventEmitter();
  @Output() exitMenu = new EventEmitter();

  artistIdSelected: String;
  albumIdSelected: String;
  songIdSelected: String;
  artists: Array<Artist>;
  albums: Array<Album>;
  songs: Array<Song>;

  constructor(private restService: RestService) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.selection != null) {
        this.setLibrarySelections(this.selection.artist.id, this.selection.album.id, this.selection.song.id);
        this.getArtists();
        this.getAlbums(this.selection.artist.id);
        this.getSongs(this.selection.artist.id, this.selection.album.id);
      } else {
        this.getArtists();
      }
    }, 500);
  }

  getArtists() {
    this.restService.getArtists().subscribe(artists => {
      setTimeout( () => this.artists = artists, 100);
    });
  }

  getAlbums(artistId: string) {
    this.artistIdSelected = null; //Triggers albums animation by reseting to null first..
    this.albumIdSelected = null;  //Hides song listing in the view.
    setTimeout( () => this.artistIdSelected = artistId, 100); //Reset the artist ID.
    this.restService.getAlbums(artistId).subscribe(albums => this.albums = albums);
  }

  getSongs(artistId: string, albumId: string) {
    this.albumIdSelected = null;
    setTimeout( () => this.albumIdSelected = albumId, 100); //Reset the artist ID.
    this.restService.getSongs(artistId, albumId).subscribe(songs => this.songs = songs);
  }

  getSong(artistId: string, albumId: string, songId: string) {
    this.songIdSelected = songId;
    this.setPlaylist.emit(this.songs);  //For playback through album in player.
    this.getSelection.emit({artistId, albumId, songId});
    this.exitMenu.emit();
  }

  setLibrarySelections(artistId: string, albumId: string, songId: string) {
    this.artistIdSelected = artistId;
    this.albumIdSelected = albumId;
    this.songIdSelected = songId;
  }

}
