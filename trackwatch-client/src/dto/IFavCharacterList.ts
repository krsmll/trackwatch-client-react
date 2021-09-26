import { ICharacterInList } from "./ICharacterInList";

export interface IFavCharacterList {
    id: string;
    appUserId: string;
    charactersInList: ICharacterInList[]
}