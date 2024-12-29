
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';

import type { RigStatusConfigCoinPools, RigStatusConfigCoinsWallets } from '../../types_client/freemining';



export const Settings: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const [coinsWallets, setCoinsWallets] = useState<RigStatusConfigCoinsWallets>(rigStatus?.config.coinsWallets || {});
    const [coinsPools, setCoinsPools] = useState<{[coin: string]: RigStatusConfigCoinPools}>(rigStatus?.config.coinsPools || {});

    const coinsWalletsCoins = Object.keys(coinsWallets);
    const coinsPoolsCoins = Object.keys(coinsPools);

    const configuredCoins = [... new Set([...coinsPoolsCoins, ...coinsWalletsCoins])];
    configuredCoins.sort();


    useEffect(() => {
        setCoinsWallets(rigStatus?.config.coinsWallets || {})
        setCoinsPools(rigStatus?.config.coinsPools || {})

    }, [rigHost, rigStatus]);


    return (
        <>
            <div>
                <br />

                <h2 className='h4'>Coins configuration (not available / read only)</h2>

                <div className='m-1'>
                    {configuredCoins.map(coin => {
                        const coinWallets = coinsWallets[coin] || {};
                        const coinPools = coinsPools[coin] || {};

                        return (
                            <div key={coin} className='alert alert-info m-2'>
                                <h3 className='h5'>
                                    <div className='d-flex'>
                                        <span>{coin}</span>
                                        <div className='badge bg-info m-1 ms-auto'>{Object.keys(coinWallets).length} wallets</div>
                                        <div className='badge bg-info m-1'>{Object.keys(coinPools).length} pools</div>
                                    </div>
                                </h3>

                                <div className='m-1'>
                                    <ul>
                                        {Object.entries(coinWallets).map(walletEntry => {
                                            const [walletName, walletAdress] = walletEntry;

                                            return (
                                                <li key={walletAdress} className='truncate'>{walletName} : {walletAdress}</li>
                                            );
                                        })}
                                    </ul>

                                    {Object.keys(coinWallets).length === 0 && (
                                        <div>no wallet</div>
                                    )}

                                    <div className='m-1'>
                                        <button className='btn btn-primary btn-sm'>Add new wallet</button>
                                    </div>
                                </div>

                                <div className='m-1'>
                                    <ul>
                                        {Object.entries(coinPools).map(poolEntry => {
                                            const [poolName, pool] = poolEntry;
                                            const poolUrlsCount = Object.keys(pool.urls || {}).length;

                                            return (
                                                <li key={poolName}>
                                                    {poolName}
                                                    &nbsp;
                                                    <small>({poolUrlsCount} url{poolUrlsCount > 1 ? 's' : ''})</small>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {Object.keys(coinPools).length === 0 && (
                                        <div>no pool</div>
                                    )}

                                    <div className='m-1'>
                                        <button className='btn btn-primary btn-sm'>Add new pool</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='m-1'>
                    <button className='btn btn-primary'>Configure new coin</button>
                </div>

                <br />
            </div>

        </>
    );
}

