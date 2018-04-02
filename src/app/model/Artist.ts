import { Injectable } from '@angular/core';

@Injectable()
export class Artist {
  id: string;
  name: string;
  constructor(name: string) { this.name = name; }
}
