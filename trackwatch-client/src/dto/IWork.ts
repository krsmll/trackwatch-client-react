import { ICoverPicture } from "./ICoverPicture";
import { IFormat } from "./IFormat";
import { IWorkAuthor } from "./IWorkAuthor";
import { IWorkCharacter } from "./IWorkCharacter";
import { IWorkGenre } from "./IWorkGenre";
import { IWorkRelation } from "./IWorkRelation";
import { IWorkType } from "./IWorkType";

export interface IWork {
    id: string;
    formatId: string;
    format: IFormat;
    workTypeId: string;
    workType: IWorkType;
    title: string;
    description: string;
    releaseDate: string;
    finishDate: string;
    episodeNumber: number;
    workGenres: IWorkGenre[];
    relatedWorks: IWorkRelation[];
    relationOfWorks: IWorkRelation[];
    workCharacters: IWorkCharacter[];
    coverPictures: ICoverPicture[];
    workAuthors: IWorkAuthor[];
}