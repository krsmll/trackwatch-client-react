import { IWorkAuthorRole } from "./IWorkAuthorRole";


export interface IRole {
    id: string;
    name: string;
    description: string;
    workAuthors: IWorkAuthorRole[];
}
  