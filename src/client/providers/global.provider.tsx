
import React, { createContext, useState, ReactNode } from 'react';

import type { RigStatus } from '../types_client/freemining';


const appPath = '/mining';


// Définir les types pour le contexte
export interface GlobalContextType {
    appPath: string;

    rigHost: string | null;
    setRigHost: React.Dispatch<React.SetStateAction<string | null>>;

    rigStatus: RigStatus | undefined | null;
    setRigStatus: React.Dispatch<React.SetStateAction<RigStatus | undefined | null>>;

    favoritesHosts: string[],
    setFavoritesHosts: React.Dispatch<React.SetStateAction<string[]>>,
}


// Initialiser le contexte avec des valeurs par défaut (sera écrasé par le Provider)
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);


// Fournisseur de contexte
interface GlobalProviderProps {
    children: ReactNode;
}


export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const lastHost = localStorage.getItem('lastHost') || null;

    console.log('url:', window.location.pathname)

    const [rigHost, setRigHost] = useState<string | null>(lastHost);
    const [rigStatus, setRigStatus] = useState<RigStatus | undefined | null>(undefined);

    const _favoritesHostsJson = window.localStorage.getItem('favoritesHosts') || null;
    const _favoritesHosts = _favoritesHostsJson ? JSON.parse(_favoritesHostsJson) : ([]);
    const [favoritesHosts, setFavoritesHosts] = useState<string[]>(_favoritesHosts);

    const variables: any = {
        appPath,
        rigHost, setRigHost,
        rigStatus, setRigStatus,
        favoritesHosts, setFavoritesHosts,
    };

    return (
        <GlobalContext.Provider value={variables}>
            {children}
        </GlobalContext.Provider>
    );
};


