import { ICharacterInList } from "./ICharacterInList";
import { ICharacterPerson } from "./ICharacterPerson";
import { ICharacterPicture } from "./ICharacterPicture";
import { IWorkCharacter } from "./IWorkCharacter";

export interface ICharacter {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    age: number;
    birthdate: string;
    pictures: ICharacterPicture[];
    characterPersons: ICharacterPerson[]
    characterInLists: ICharacterInList[]
    workCharacters: IWorkCharacter[]
  }
  