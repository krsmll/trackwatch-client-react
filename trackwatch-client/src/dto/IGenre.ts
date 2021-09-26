import { IWorkGenre } from "./IWorkGenre";

export interface IGenre {
    id: string;
    name: string;
    description: string;
    workGenres: IWorkGenre[]
}