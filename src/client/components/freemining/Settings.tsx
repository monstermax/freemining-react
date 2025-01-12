
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';

import type { RigStatusConfigCoinMiners, RigStatusConfigCoinPools, RigStatusConfigCoinWallets } from '../../types_client/freemining_types.client';
import { Link } from 'react-router-dom';



export const Settings: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const [coinsWallets, setCoinsWallets] = useState<{[coin: string]: RigStatusConfigCoinWallets}>(rigStatus?.config.coinsWallets || {});
    const [coinsPools, setCoinsPools] = useState<{[coin: string]: RigStatusConfigCoinPools}>(rigStatus?.config.coinsPools || {});
    const [coinsMiners, setCoinsMiners] = useState<{[coin: string]: RigStatusConfigCoinMiners}>(rigStatus?.config.coinsMiners || {});

    const coinsWalletsCoins = Object.keys(coinsWallets);
    const coinsPoolsCoins = Object.keys(coinsPools);

    const configuredCoins = [... new Set([...coinsPoolsCoins, ...coinsWalletsCoins])];
    configuredCoins.sort();


    useEffect(() => {
        setCoinsWallets(rigStatus?.config.coinsWallets || {})
        setCoinsPools(rigStatus?.config.coinsPools || {})

    }, [rigHost, rigStatus]);

    const coinsCount  = Object.keys(rigStatus?.config.coins  || {}).length;
    const minersCount = Object.keys(rigStatus?.config.miners || {}).length;
    const coinsWalletsCount = Object.values(coinsWallets).map(coinWalletConfig => Object.keys(coinWalletConfig || {}).length).reduce((p, c) => p + c, 0);
    const coinsPoolsCount   = Object.values(coinsPools  ).map(coinPoolConfig   => Object.keys(coinPoolConfig   || {}).length).reduce((p, c) => p + c, 0);
    const coinsMinersCount  = Object.values(coinsMiners ).map(coinMinerConfig  => Object.keys(coinMinerConfig  || {}).length).reduce((p, c) => p + c, 0);

    return (
        <div className='m-2'>
            <h2 className='h4'>Settings</h2>

            <div className='my-1'>
                <Link to={`/mining/settings/coins`} className='btn btn-secondary m-1'>coins <sup>({coinsCount})</sup></Link>
                <br />
                <Link to={`/mining/settings/coins-wallets`} className='btn btn-secondary m-1'>coins wallets <sup>({coinsWalletsCount})</sup></Link>
                <Link to={`/mining/settings/coins-pools`} className='btn btn-secondary m-1'>coins pools <sup>({coinsPoolsCount})</sup></Link>
                <Link to={`/mining/settings/coins-miners`} className='btn btn-secondary m-1'>coins miners <sup>({coinsMinersCount})</sup></Link>
                <br />
                <Link to={`/mining/settings/miners`} className='btn btn-secondary m-1'>miners <sup>({minersCount})</sup></Link>
            </div>

        </div>
    );
}

