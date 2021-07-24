/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '@shared/interfaces/data.interfaces';

const MY_FAVORITES = 'myFavorites';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private charactersFavSubject = new BehaviorSubject<Character[]>(null);
  charactersFav$ = this.charactersFavSubject.asObservable();

  constructor() {
    this.initialStorage();
  }

  addOrRemoveFavorite(character: Character): void {
    const { id } = character;
    const currentsFav = this.getFavoritesCharacters();
    const found = !!currentsFav.find((fav: Character) => fav.id === id);

    found ? this.removeFromFavorite(id) : this.addToFavorite(character);
  }

  // método para añadir favoritos //
  private addToFavorite(character: Character): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      localStorage.setItem(
        MY_FAVORITES,
        JSON.stringify([...currentsFav, character])
      );
      this.charactersFavSubject.next([...currentsFav, character]);
    } catch (error) {
      console.log('Error saving LocalStorage', error);
      alert('Error');
    }
  }

  // metodo para borrar favoritos //
  private removeFromFavorite(id: number): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      const characters = currentsFav.filter(item => item.id !== id);
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
      this.charactersFavSubject.next([...characters]);
    } catch (error) {
      console.log('Error removing from LocalStorage', error);
      alert('Error');
    }
  }

  // método para recuperar los favoritos //
  getFavoritesCharacters(): any {
    try {
      const charactersFav = JSON.parse(localStorage.getItem(MY_FAVORITES));
      // almacenamos los datos que recuperamos del localStorage
      this.charactersFavSubject.next(charactersFav);
      // tenemos que devolver los charactersFav
      return charactersFav;
    } catch (error) {
      console.log('Error getting favorites from LocalStorage', error);
    }
  }
  // metodo para limpiar el localstorage
  clearStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.log('Error cleaning LocalStorage', error);
    }
  }

  //si no hay nada en mi localstorage lo que haremos es crear un array vacío //
  private initialStorage(): void {
    const currents = JSON.parse(localStorage.getItem(MY_FAVORITES));
    if (!currents) {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
    }
    this.getFavoritesCharacters();
  }
}
