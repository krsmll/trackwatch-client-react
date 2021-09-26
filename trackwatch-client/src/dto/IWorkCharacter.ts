import { ICharacter } from "./ICharacter";
import { IWork } from "./IWork";

export interface IWorkCharacter {
    id: string;
    workId: string;
    work: IWork;
    characterId: string;
    character: ICharacter;
}