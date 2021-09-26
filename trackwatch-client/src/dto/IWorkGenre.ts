import { IGenre } from "./IGenre";
import { IWork } from "./IWork";

export interface IWorkGenre {
    id: string;
    genre: IGenre;
    work: IWork
}