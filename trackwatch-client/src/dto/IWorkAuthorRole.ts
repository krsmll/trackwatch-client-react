import { IRole } from "./IRole";
import { IWorkAuthor } from "./IWorkAuthor";

export interface IWorkAuthorRole {
    id: string;
    workAuthorId: string;
    workAuthor: IWorkAuthor;
    roldId: string;
    role: IRole
}
  