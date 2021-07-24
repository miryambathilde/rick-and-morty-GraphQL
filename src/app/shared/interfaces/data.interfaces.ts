// ponemos la T para indicar que la respuesta con el resultado es de clase tipo genérico //
export interface APIResponse<T> {
  results: T;
}

// Creamos la interfance de DataResponse con las respuestas de characters y episodes y el tipo con [] porque es un array vacío //
export interface DataResponse {
  characters: APIResponse<Character[]>;
  episodes: APIResponse<Episode[]>;
}

// creamos interface con las propiedades de los datos que pedimos a la API en data.serice.ts //

export interface Episode {
  name: string;
  episode: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  isFavorite?: boolean;
}
