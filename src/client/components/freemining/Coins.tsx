
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';
import { formatNumber } from '../../lib/utils.client';
import { stopMiner } from '../../lib/software_start';
import { useNavigate } from 'react-router-dom';
import { RigStatusConfigCoinPools, RigStatusConfigCoinsWallets } from '../../types_client/freemining';



const Coins: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();

    const { rigHost, rigStatus } = context;

    const [coinsWallets, setCoinsWallets] = useState<RigStatusConfigCoinsWallets>(rigStatus?.config.coinsWallets || {});
    const [coinsPools, setCoinsPools] = useState<{[coin: string]: RigStatusConfigCoinPools}>(rigStatus?.config.coinsPools || {});

    const coins: string[] = Object.keys(rigStatus?.config.coins || {});
    const coinsWalletsCoins: string[] = Object.keys(coinsWallets);
    const coinsPoolsCoins: string[] = Object.keys(coinsPools);

    const allCoins: string[] = [... new Set([...coins, ...coinsPoolsCoins, ...coinsWalletsCoins])];
    allCoins.sort();

    const runnableInstalledMinersNames: string[] = !rigStatus ? [] : rigStatus?.status.installedMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));

    const changeTab = (tabName: string, selectedCoin?: string | null) => {
        navigate(`/mining/software/${tabName}`, { state: { selectedCoin } });
    }

    return (
        <>
            <div className='m-2 mt-3'>
                {allCoins.map(coin => {
                    const coinConfig = rigStatus?.config.coins[coin] ?? null;
                    const coinName = coinConfig?.coinName;

                    const walletsCount = Object.keys(rigStatus?.config.coinsWallets[coin] || {}).length;
                    const poolsCount = Object.keys(rigStatus?.config.coinsPools[coin] || {}).length;
                    const minersCount = Object.keys(rigStatus?.config.coinsMiners[coin] || {}).filter(minerName => runnableInstalledMinersNames.includes(minerName)).length;

                    const runEnabled = !! (walletsCount && poolsCount && minersCount);

                    return (
                        <div key={coin} className='alert alert-info p-2 my-2'>
                            <div className='d-flex'>
                                <img className='m-1' src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '24px' }} />

                                <div className='m-1 cursor-default'>
                                    <h2 className='h6 truncate'>{coin} {coinName ? ` - ${coinName}` : ""}</h2>
                                </div>

                                <div className='m-1 ms-auto'>

                                    <div className='btn-group'>
                                        <button className={`btn ${walletsCount ? "btn-success" : "btn-warning"} btn-sm cursor-default`}>{walletsCount} wallets</button>

                                        <button className={`btn ${poolsCount ? "btn-success" : "btn-warning"} btn-sm cursor-default`}>{poolsCount} pools</button>

                                        <button className={`btn ${minersCount ? "btn-success" : "btn-warning"} btn-sm cursor-default`}>{minersCount} miners</button>

                                        <button className={`btn ${minersCount ? "btn-success" : "btn-warning"} btn-sm dropdown-toggle dropdown-toggle-split`} data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </button>

                                        <ul className="dropdown-menu">
                                            {runEnabled && (
                                                <li>
                                                    <span className='dropdown-item pointer' onClick={() => changeTab('run', coin)}>run a miner...</span>
                                                </li>
                                            )}

                                            <li>
                                                <span className='dropdown-item pointer' onClick={() => changeTab('install', coin)}>install a miner...</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}


                {Object.entries(rigStatus?.config.coins || {}).length === 0 && (
                    <div className='alert alert-warning'>
                        No coin found
                    </div>
                )}

                <div className='my-1 alert alert-info p-2'>
                    <a className='btn btn-primary btn-sm m-1' onClick={() => navigate('/mining/software/run') }>Run miner...</a>
                </div>
            </div>
        </>
    );

}


export default Coins;

