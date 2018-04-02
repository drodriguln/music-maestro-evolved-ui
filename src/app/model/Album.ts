import { Injectable } from '@angular/core';

@Injectable()
export class Album {
  id: string;
  name: string;
  constructor(name: string) { this.name = name; }
}
