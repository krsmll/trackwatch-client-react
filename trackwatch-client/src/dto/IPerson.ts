import { ICharacterPerson } from "./ICharacterPerson";
import { IPersonPicture } from "./IPersonPicture";
import { IWorkAuthor } from "./IWorkAuthor";

export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    nationality: string;
    birthdate: string;
    workAuthors: IWorkAuthor[];
    personPictures: IPersonPicture[];
  }
  