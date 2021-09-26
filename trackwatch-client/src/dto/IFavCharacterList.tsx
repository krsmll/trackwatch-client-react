import { ICharacter } from "./ICharacter";

export interface IFavCharacterList {
    id: string;
    appUserId: string;
    characters: ICharacter[]
  }
  