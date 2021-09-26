import React from "react";

export interface IAppState {
    token: string | null;
    roles: string[];
    username: string;
    setAuthInfo: (token: string | null, roles: string[], username: string) => void;
}

export const initialAppState : IAppState = {
    token: null,
    roles: [],
    username: '',
    setAuthInfo: (token: string | null, roles: string[], username: string): void => {}
}

export const AppContext = React.createContext<IAppState>(initialAppState);
export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;
