import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RestService } from '../service/rest/rest.service';
import { Artist } from '../model/Artist';
import { Album } from '../model/Album';
import { Song } from '../model/Song';
import { Selection } from '../model/Selection';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

//TODO:
// - Add edit button for each Artist, Album, Song selection that will dropdown (preferably with animation) the fields that are editable.
//     Ultimately this will have a sort of accordian style to it.
// - Add save and delete buttons to suitable areas where user can't accidentally click one versus the other (after first bullet done).
export class EditComponent {

  @Input() selection: Selection;
  @Output() exitMenu = new EventEmitter();

  artists: Array<Artist>;
  albums: Array<Album>;
  songs: Array<Song>;
  artistSelected: Artist;
  albumSelected: Album;
  songSelected: Song;
  artistEdited: Artist;
  albumEdited: Album;
  songEdited: Song;
  isActiveEditSection: Array<boolean> = [true, false, false];

  constructor(private restService: RestService) { }

  ngOnInit() {
    setTimeout(() => this.restService.getArtists().subscribe(artists => {
      this.artists = artists;
      if (this.selection != undefined) {
        this.artistSelected = Object.assign({}, this.selection.artist);
        this.albumSelected = Object.assign({}, this.selection.album);
        this.songSelected = Object.assign({}, this.selection.song);
        this.artistEdited = Object.assign({}, this.selection.artist);
        this.albumEdited = Object.assign({}, this.selection.album);
        this.songEdited = Object.assign({}, this.selection.song);
      }
    }), 500);
  }

  setArtist(artist: Artist) {
    this.songSelected = null;
    this.songEdited = null;
    this.songs = null;
    this.albumEdited = null;
    this.albumSelected == null;
    this.albums = null;
    this.artistSelected = artist;
    this.artistEdited = Object.assign({}, artist);
    this.restService.getAlbums(artist.id).subscribe(albums => this.albums = albums);
  }

  setAlbum(album: Album) {
    this.songSelected = null;
    this.songEdited = null;
    this.songs = null;
    this.albumSelected = album;
    this.albumEdited = Object.assign({}, album);
    this.restService.getSongs(this.artistSelected.id, album.id).subscribe(songs => this.songs = songs);
  }

  setSong(song: Song) {
    this.songSelected = song;
    this.songEdited = Object.assign({}, song);
  }

  setActiveTab(boolIndex) {
    for (let i = 0; i < this.isActiveEditSection.length; i++) {
      if (i == boolIndex) {
        this.isActiveEditSection[boolIndex] = !this.isActiveEditSection[boolIndex];
      }
      else {
        this.isActiveEditSection[i] = false;
      }
    }
  }

  updateArtist() {
    this.restService.updateArtist(this.artistSelected.id, this.artistEdited).subscribe(artistResponse => {
      this.artistSelected = Object.assign({}, artistResponse.result);
      this.artistEdited = Object.assign({}, artistResponse.result);
      this.selection.artist = Object.assign({}, artistResponse.result);
    });
  }

  updateAlbum() {
    this.restService.updateAlbum(this.artistSelected.id, this.albumSelected.id, this.albumEdited).subscribe(albumResponse => {
      this.albumSelected = Object.assign({}, albumResponse.result);
      this.albumEdited = Object.assign({}, albumResponse.result);
      this.selection.album = Object.assign({}, albumResponse.result);
    });
  }

  updateSong() {
    this.restService.updateSong(this.artistSelected.id, this.albumSelected.id, this.songSelected.id, this.songEdited).subscribe(songResponse => {
      this.songSelected = Object.assign({}, songResponse.result);
      this.songEdited = Object.assign({}, songResponse.result);
      this.selection.song = Object.assign({}, songResponse.result);
    });
  }

  deleteArtist() {
    this.restService.deleteArtist(this.artistSelected.id).subscribe(() => this.exitMenu.emit());
  }

  deleteAlbum() {
    this.restService.deleteAlbum(this.artistSelected.id, this.albumSelected.id).subscribe(() => {
      if (this.albums.length == 1) {
        this.restService.deleteArtist(this.artistSelected.id).subscribe(() => this.exitMenu.emit());
      } else {
        this.exitMenu.emit();
      }
    });
  }

  deleteSong() {
    this.restService.deleteSong(this.artistSelected.id, this.albumSelected.id, this.songSelected.id).subscribe(() => {
      if (this.songs.length == 1) {
        this.restService.deleteAlbum(this.artistSelected.id, this.albumSelected.id).subscribe(() => {
          if (this.albums.length == 1) {
            this.restService.deleteArtist(this.artistSelected.id).subscribe(() => this.exitMenu.emit());
          } else {
            this.exitMenu.emit();
          }
        });
      } else {
        this.exitMenu.emit();
      }
    });
  }

}
