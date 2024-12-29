
import React, { createContext, useState, ReactNode, ProviderProps, useContext } from 'react';

import { RigStatus } from '../types_client/freemining';
import { showUninstallMiner, installMiner, uninstallMiner } from '../lib/software_install';
import { showStopMiner, startMiner, stopMiner } from '../lib/software_start';


const appPath = '/mining';


// Définir les types pour le contexte
export interface GlobalContextType {
    appPath: string;

    rigHost: string | null;
    setRigHost: React.Dispatch<React.SetStateAction<string | null>>;

    rigStatus: RigStatus | null;
    setRigStatus: React.Dispatch<React.SetStateAction<RigStatus | null>>;

    rigStatusLoading: boolean;
    setRigStatusLoading: React.Dispatch<React.SetStateAction<boolean>>;

    installMiner: (context: GlobalContextType, minerName: string, minerAlias?: string, options?: {[key: string]: any} ) => void,
    uninstallMiner: (context: GlobalContextType, minerName: string, minerAlias?: string) => void,

    startMiner: (context: GlobalContextType, minerName: string, minerAlias: string, options: {[key: string]: any}) => void,
    stopMiner: (context: GlobalContextType, minerName: string, minerAlias: string) => void,

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

    const [rigHost, setRigHost] = useState<string | null>(lastHost);
    const [rigStatus, setRigStatus] = useState<RigStatus | null>(null);
    const [rigStatusLoading, setRigStatusLoading] = useState<boolean>(false);

    const _favoritesHostsJson = window.localStorage.getItem('favoritesHosts') || null;
    const _favoritesHosts = _favoritesHostsJson ? JSON.parse(_favoritesHostsJson) : ([]);
    const [favoritesHosts, setFavoritesHosts] = useState<string[]>(_favoritesHosts);

    const variables: any = {
        appPath,
        rigHost, setRigHost,
        rigStatus, setRigStatus,
        rigStatusLoading, setRigStatusLoading,
        installMiner, uninstallMiner, startMiner, stopMiner,
        favoritesHosts, setFavoritesHosts,
    };

    return (
        <GlobalContext.Provider value={variables}>
            {children}
        </GlobalContext.Provider>
    );
};


