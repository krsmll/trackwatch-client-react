import { IWork } from "./IWork";

export interface IWorkType {
    id: string;
    name: string;
    description: string;
    works: IWork[]
}