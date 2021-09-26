import { IWork } from "./IWork";

export interface IWorkRelation {
    id: string;
    workId: string;
    work: IWork;
    relatedWorkId: string;
    relatedWork: IWork;
}