/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import {
  find,
  mergeMap,
  pluck,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {
  Character,
  DataResponse,
  Episode
} from '../interfaces/data.interfaces';
import { LocalStorageService } from './localStorage.service';

// ponemos la query para recuperar los datos desde la api
const QUERY = gql`
  {
    episodes {
      results {
        name
        episode
      }
    }
    characters {
      results {
        id
        name
        status
        species
        gender
        image
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //metodos privados y observables
  private episodesSubject = new BehaviorSubject<Episode[]>([]);
  episodes$ = this.episodesSubject.asObservable();

  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$ = this.charactersSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private localStorageSvc: LocalStorageService
  ) {
    this.getDataAPI();
  }

  // esto recorrerá todos los personajes y nos devolverá cada uno de ellos y nos devolverá el que recuperemos por id
  getDetails(id: number): any {
    return this.characters$.pipe(
      mergeMap((characters: Character[]) => characters),
      find((character: Character) => character?.id === id)
    );
  }

  getCharactersByPage(pageNum: number): void {
    const QUERY_BY_PAGE = gql`{
        characters(page: ${pageNum}) {
          results {
            id
            name
            status
            species
            gender
            image
          }
        }
      }
    `;

    this.apollo
      .watchQuery<any>({
        query: QUERY_BY_PAGE
      })
      .valueChanges.pipe(
        take(1),
        pluck('data', 'characters'),
        withLatestFrom(this.characters$),
        tap(([apiResponse, characters]) => {
          this.parseCharactersData([...characters, ...apiResponse.results]);
        })
      )
      .subscribe();
  }

  private getDataAPI(): void {
    this.apollo
      .watchQuery<DataResponse>({
        query: QUERY
      })
      .valueChanges.pipe(
        take(1),
        tap(({ data }) => {
          const { characters, episodes } = data;
          this.episodesSubject.next(episodes.results);
          this.parseCharactersData(characters.results);
        })
      )
      .subscribe();
  }

  private parseCharactersData(characters: Character[]): void {
    const currentFavs = this.localStorageSvc.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFavs.find(
        (fav: Character) => fav.id === character.id
      );
      return { ...character, isFavorite: found };
    });

    this.charactersSubject.next(newData);
  }
}
