import { IRatingScale } from "./IRatingScale";
import { IWorkInList } from "./IWorkInList";

export interface IWatchList {
    id: string;
    ratingScaleId: string;
    ratingScale: IRatingScale;
    appUserId: string;
    workInLists: IWorkInList[];
}