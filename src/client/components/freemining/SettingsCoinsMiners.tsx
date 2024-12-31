
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoinMiners } from '../../types_client/freemining';



export const SettingsCoinsMiners: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const [coinsMiners, setCoinsMiners] = useState<{[coin: string]: RigStatusConfigCoinMiners}>(rigStatus?.config.coinsMiners ?? {});


    return (
        <div>
            <h2 className='h4'>Coins Miners configuration</h2>

            <div>
                {Object.entries(coinsMiners).map(coinEntry => {
                    const [coin, coinMinersConfig] = coinEntry;

                    const [showCoinDetails, setShowCoinDetails] = useState(false);

                    return (
                        <div key={coin} className='alert alert-info m-2 pb-0'>
                            <div className='d-flex pointer' onClick={() => setShowCoinDetails(!showCoinDetails)}>
                                <h3 className='h5 m-1'>
                                    <img src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '32px' }} />

                                    <span className='m-2'>{coin}</span>
                                </h3>

                                <div className='badge bg-info ms-auto me-2'>
                                    {Object.keys(coinMinersConfig).length} miners
                                </div>

                                <div className='ms-2'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                {Object.entries(coinMinersConfig).map(coinMinerEntry => {
                                    const [minerName, coinMinerConfig] = coinMinerEntry;

                                    const [showMinerDetails, setShowMinerDetails] = useState(false);

                                    const minerConfig = rigStatus?.config.miners[minerName] || null;

                                    return (
                                        <div key={minerName}>
                                            <div className={`alert alert-secondary m-1 pb-0`}>
                                                <div className='d-flex pointer' onClick={() => setShowMinerDetails(!showMinerDetails)}>
                                                    <h4 className='h5'>{minerName}</h4>

                                                    <div className='ms-auto'>
                                                        <i className={`bi text-secondary ${showMinerDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                                    </div>
                                                </div>

                                                <table className={`table mt-1 ${showMinerDetails ? "" : "d-none"}`}>
                                                    <tr>
                                                        <td className='bold cursor-default'>Algo</td>
                                                        <td><input type="text" className='form-control' defaultValue={coinMinerConfig.algo} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='bold cursor-default'>Optional arguments</td>
                                                        <td><input type="text" className='form-control' defaultValue={coinMinerConfig.extraArgs} placeholder={minerConfig?.sampleArgs || ''} /></td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

