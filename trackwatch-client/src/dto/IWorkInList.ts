import { IStatus } from "./IStatus";
import { IWatchList } from "./IWatchList";
import { IWork } from "./IWork";

export interface IWorkInList {
    id: string;
    watchListId: string;
    watchList: IWatchList;
    workId: string;
    work: IWork;
    statusId: string;
    status: IStatus;
    started: string;
    finished: string;
    notes: string;
    rating: number;
    episodesWatched: number;
}

export interface IWorkInListToAdd {
    watchListId: string;
    workId: string;
    statusId: string;
    started: string | undefined;
    finished: string |  undefined;
    notes: string | undefined;
    rating: number | undefined;
    episodesWatched: number;
}