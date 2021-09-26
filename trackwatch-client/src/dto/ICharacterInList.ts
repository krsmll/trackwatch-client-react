import { ICharacter } from "./ICharacter";
import { IFavCharacterList } from "./IFavCharacterList";

export interface ICharacterInList {
    id: string;
    characterId: string;
    character: ICharacter;
    favCharacterListId: string;
    favCharacterList: IFavCharacterList
  }
  