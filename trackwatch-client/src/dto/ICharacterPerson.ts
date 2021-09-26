import { ICharacter } from "./ICharacter";
import { IPerson } from "./IPerson";
import { IWorkAuthor } from "./IWorkAuthor";

export interface ICharacterPerson {
    id: string;
    characterId: string;
    character: ICharacter;
    workAuthorId: string;
    workAuthor: IWorkAuthor
  }
  