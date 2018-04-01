import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Artist } from '../model/Artist';
import { Album } from '../model/Album';
import { Song } from '../model/Song';
import { Selection } from '../model/Selection';
import { config } from '../config/config';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {

  @Input() selection: Selection;
  @Input() playlist: Array<Song>;
  @Output() getSelection = new EventEmitter();

  playback;
  artworkPath: string;
  isPlaying: boolean = false;
  doShowSettings: boolean = false;
  doRepeat: boolean = false;
  doShuffle: boolean = false;
  currPlaytime: number = 0;
  maxPlaytime: number = 1;
  currPlaytimeFormatted: string = "00:00";
  maxPlaytimeFormatted: string = "00:00";

  constructor() {}

  load() {
    if (this.playback == null) { this.playback = new Audio(); }
    this.artworkPath = this.getArtworkPath();
    this.getPlayback(this);
  }

  play() {
    console.log("PLAY");
    let self = this;
    self.playback.addEventListener('ended', function() {
      self.playback = null;
      self.next();
    }, false);
    self.playback.addEventListener('timeupdate', function() {
      if (self.isPlaying) {
        self.currPlaytime = self.playback.currentTime;
        self.currPlaytimeFormatted = self.convertPlayTimeFormat(self.currPlaytime);
      }
    });
    this.playback.play();
    this.isPlaying = true;
  }

  pause() {
    this.isPlaying = false;
    this.playback.pause();
  }

  stop() {
    if (this.playback != null) {
      this.playback.pause();
      this.playback.currentTime = 0;
    }
    this.isPlaying = false;
    this.currPlaytime = 0;
    this.currPlaytimeFormatted = "00:00";
  }

  /*
   *  Looks through current song list (i.e. album), and plays the previous song.
   *  If there is no existing previous song, then do nothing.
   */
  previous() {
    let artistId = this.selection.artist.id;
    let albumId = this.selection.album.id;
    let songId = "0";
    if      (this.doRepeat) { songId = this.selection.song.id; }
    else if (this.doShuffle) { songId = this.getShuffledSongId(this.playlist, songId); }
    else if (this.playlist.length > 1) {
      for (let i = 0; i < this.playlist.length; i++) {
        if (this.playlist[i].id == this.selection.song.id && i > 0) {
          artistId = this.selection.artist.id;
          albumId = this.selection.album.id;
          songId = this.playlist[i-1].id
          break;
        }
      }
    }
    this.getSelection.emit({artistId, albumId, songId});
  }

  /*
   *  Looks through current song list (i.e. album), and plays the next song.
   *  If the user selected the repeat button in the view, reload the song.
   *  If the user selected the shuffle button in the view, shuffle the song
   *  by selecting a random index in the list of songs and using the ID of the
   *  song with the given index (cannot be same as existing song). Load new song.
   *  Otherwise load the next song in the current list of songs (i.e. album).
   *  Else stop playback.
   */
  next() {
    let artistId = this.selection.artist.id;
    let albumId = this.selection.album.id;
    let songId = "0";
    if      (this.doRepeat) { songId = this.selection.song.id; }
    else if (this.doShuffle) { songId = this.getShuffledSongId(this.playlist, songId); }
    else if (this.playlist.length > 1) {
      for (let i = 0; i < this.playlist.length; i++) {
        if (this.playlist[i].id == this.selection.song.id && i < this.playlist.length - 1) {
          songId = this.playlist[i+1].id;
          this.stop();
          break;
        }
      }
    }
    else { this.stop(); }
    this.getSelection.emit({artistId, albumId, songId});
  }

  changePlaytime(value: number) { this.playback.currentTime = value; }

  changeVolume(value: number) { this.playback.volume = value; }

  getShuffledSongId(playlist: Array<Song>, songId: string): string {
      let currSongIndex = 0;
      for (let i = 0; i < playlist.length; i++) {
        if (playlist[i].id == songId) { currSongIndex = i; }
      }
      let randomInt = currSongIndex;  //Initialize this way to enter while loop.
      while (randomInt == currSongIndex) {
        randomInt = this.getRandomInt(0, playlist.length - 1);
      }
      return playlist[randomInt].id;
    }

  convertPlayTimeFormat(seconds: number) {
    let minutes: any = Math.floor(seconds / 60);
    let secs: any = Math.floor(seconds % 60);
    if (minutes < 10) { minutes = '0' + minutes; }
    if (secs < 10) { secs = '0' + secs; }
    return minutes +  ':' + secs;
  }

  getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  getArtworkPath() {
    return config.apiHost
      + "/artists/" + this.selection.artist.id
      + "/albums/" + this.selection.album.id
      + "/songs/" + this.selection.song.id
      + "/artwork";
  }

  getPlayback(self: this) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(blob) {
      if (xhr.status == 200) { self.playback.src = window.URL.createObjectURL(xhr.response); }
      setTimeout( () => {
        self.maxPlaytime = self.playback.duration;
        self.maxPlaytimeFormatted = self.convertPlayTimeFormat(self.maxPlaytime);
        self.play();
      }, 200);
    });
    xhr.open('GET', config.apiHost
      + "/artists/" + this.selection.artist.id
      + "/albums/" + this.selection.album.id
      + "/songs/" + this.selection.song.id
      + "/file");
    xhr.responseType = 'blob';
    xhr.send(null);
  }

}
