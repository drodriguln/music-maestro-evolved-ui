import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Artist } from '../model/Artist';
import { Album } from '../model/Album';
import { Song } from '../model/Song';
import { RestService } from '../service/rest/rest.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  @Output() exitMenu = new EventEmitter();

  isUploading: boolean = false;
  isNewArtist: boolean = false;
  isNewAlbum: boolean = false;
  newArtistName: string;
  newAlbumName: string;
  newSongName: string;
  newSongTrackNumber: string;
  newSongYear: string;
  artistSelected: Artist;
  albumSelected: Album;
  artworkFile: File;
  songFile: File;
  artists: Array<Artist>;
  albums: Array<Album>;
  currProgress: number = 0;
  maxProgress: number = 1;

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.restService.getArtists().subscribe(artists => this.artists = artists);
  }

  setArtist(artist: Artist) {
    this.albumSelected == null;
    this.artistSelected = artist;
    this.restService.getAlbums(artist.id).subscribe(albums => this.albums = albums);
  }

  setAlbum(album: Album) { this.albumSelected = album; }

  setArtworkFile(artworkFiles: FileList) { this.artworkFile = artworkFiles[0]; }

  setSongFile(songFiles: FileList) { this.songFile = songFiles[0]; }

  /*
   *  Takes a list of files selected in the view, and sends them one-by-one to
   *  the server to store and to create new artist, album, and song objects.
   *  Once completed, a timeout is set so the user is given time to see the upload has finished.
   */
  upload() {
    if (this.isNewArtist) {
      this.restService.addArtist(new Artist(this.newArtistName)).subscribe(artistResponse => {
        let repoArtist = artistResponse.result;
        if (this.isNewAlbum) {
          this.restService.addAlbum(repoArtist.id, new Album(this.newAlbumName)).subscribe(albumResponse => {
            let repoAlbum = albumResponse.result;
            this.sendFormData(repoArtist.id, repoAlbum.id);
          });
        } else {
          this.sendFormData(repoArtist.id, this.albumSelected.id);
        }
      });
    } else if (this.isNewAlbum) {
      this.restService.addAlbum(this.artistSelected.id, new Album(this.newAlbumName)).subscribe(albumResponse => {
        let repoAlbum = albumResponse.result;
        this.sendFormData(this.artistSelected.id, repoAlbum.id);
      });
    } else {
      this.sendFormData(this.artistSelected.id, this.albumSelected.id);
    }
  }

  sendFormData(artistId: string, albumId: string) {
    let formData: FormData = new FormData();
    formData.append('songName', this.newSongName);
    formData.append('trackNumber', this.newSongTrackNumber);
    formData.append('year', this.newSongYear);
    formData.append('artwork', this.artworkFile);
    formData.append('song', this.songFile);
    this.isUploading = true;   //Used in view to show progress bar.
    this.maxProgress = 1; //Sets the new max value for progress bar.
    this.restService.addSong(artistId, albumId, formData).subscribe(() => {  //Send song to server.
      this.currProgress++; //Increment the current value for progress bar.
      setTimeout( () => { //Delay 0.8 seconds.
        this.exitMenu.emit();  //Clears out of current menu.
        this.resetProgressBar(); //Resets the current and max values for the progress bar.
        this.isUploading = false; //Used in view to hide progress bar.
      }, 800);
    });
    }

  resetProgressBar() {
    this.currProgress = 0;
    this.maxProgress = 1;
  }

}
