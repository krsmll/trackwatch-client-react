import { ICharacterPerson } from "./ICharacterPerson";
import { IPerson } from "./IPerson";
import { IWork } from "./IWork";
import { IWorkAuthorRole } from "./IWorkAuthorRole";

export interface IWorkAuthor {
    id: string;
    personId: string;
    person: IPerson;
    workId: string;
    work: IWork;
    workAuthorRoles: IWorkAuthorRole[];
    characterPersons: ICharacterPerson[];
}
