
import type { RigStatus, RigStatusConfigCoin, RigStatusConfigCoinMiners, RigStatusConfigCoinPools, RigStatusConfigCoinWallets } from '../types_client/freemining';
import { InstallMinerOptions, UninstallMinerOptions } from './software_install';
import { StartMinerOptions, StopMinerOptions } from './software_run';
import { fetchHtml, fetchJson } from './utils.client';

type ConfigType = 'coins' | 'miners' | 'coins_wallets' | 'coins_pools' | 'coins_miners';


export const getRigStatus = async (rigHost: string): Promise<RigStatus | null> => {
    return fetchJson<RigStatus>(`http://${rigHost}/rig/status.json`, { useProxy: true })
        .then((newRigStatus) => {
            return newRigStatus ? newRigStatus.data : null;
        })
        .catch((err: any) => {
            return null;
        })
}


export const getMinerInstallableVersions = async (rigHost: string, minerName: string): Promise<string[]> => {
    return fetchJson<string[]>(`http://${rigHost}/rig/config/miners/${minerName}/installable-versions`, { useProxy: true })
        .then((result) => {
            return result ? result.data : [];
        })
        .catch((err: any) => {
            return [];
        })
}



export const startMiner = (rigHost: string, minerName: string, minerAlias: string, options: StartMinerOptions) => {
    const {coin, algo, poolUrl, poolUser, extraArgs} = options;

    const data: {[key: string]: any} = {
        action: 'start',
        miner: minerName,
        minerAlias,
        coin,
        algo,
        poolUrl,
        poolUser,
        extraArgs,
    };

    const url = `http://${rigHost}/rig/miners/${minerName}/run`;

    return fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) });
}


export const stopMiner = (rigHost: string, minerName: string, minerAlias: string, options?: StopMinerOptions) => {
    const instanceName = options?.instanceName || `${minerName}-${minerAlias}`;

    const data: {[key: string]: any} = {
        action: 'stop',
        miner: minerName,
        alias: minerAlias,
        instanceName,
    };

    const url = `http://${rigHost}/rig/miners/${minerName}/run`;

    return fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) });
}


export const installMiner = (rigHost: string, minerName: string, minerAlias?: string, options?: InstallMinerOptions) => {
    const minerVersion = options?.minerVersion || '';

    const data: {[key: string]: any} = {
        action: 'start',
        miner: minerName,
        alias: minerAlias,
        version: minerVersion,
        default: 1,
    };

    const url = `http://${rigHost}/rig/miners/${minerName}/install`;

    return fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) })
}


export const uninstallMiner = (rigHost: string, minerName: string, minerAlias?: string, options?: UninstallMinerOptions) => {
    const data: {[key: string]: any} = {
        action: 'start',
        miner: minerName,
        alias: minerAlias,
    };

    const url = `http://${rigHost}/rig/miners/${minerName}/uninstall`;

    return fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) });
}


export const updateRigConfig = <T extends ConfigType>(rigHost: string, configType: T, config: RigConfigs<T>) => {
    const data: {[key: string]: any} = {
        action: 'update',
        config,
    };

    const url = `http://${rigHost}/rig/config/${configType}/update`;

    return fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) });
}


type RigConfigs<T extends ConfigType> = 
    T extends 'coins'        ? {[coin: string]: RigStatusConfigCoin} :
    T extends 'coins_wallets' ? {[coin: string]: RigStatusConfigCoinWallets} :
    T extends 'coins_miners'  ? {[coin: string]: RigStatusConfigCoinMiners} :
    T extends 'coins_pools'   ? {[coin: string]: RigStatusConfigCoinPools} :
    T extends 'miners'       ? {[minerName: string]: { extraArgs?: string }} :
    never;

