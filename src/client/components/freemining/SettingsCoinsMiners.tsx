
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoinMiners } from '../../types_client/freemining_types.client';
import { updateRigConfig } from '../../lib/rig_api';
import { downloadFile, refreshRigStatus, uploadFile } from '../../lib/utils.client';



export const SettingsCoinsMiners: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;
    if (! rigHost || ! rigHost) return <div>No host</div>

    const [coinsMiners, setCoinsMiners] = useState<{[coin: string]: RigStatusConfigCoinMiners}>(rigStatus?.config.coinsMiners ?? {});

    const downloadConfigFile = () => {
        const fileName = `freemining_config_coins_miners.${rigStatus?.rig.name}.json`;
        return downloadFile(coinsMiners, fileName, "application/json");
    }

    const uploadConfigFile = () => {
        return uploadFile(context)
            .then((content) => {
                return JSON.parse(content ?? '{}')
            })
            .then((config: {[coin: string]: RigStatusConfigCoinMiners}) => updateRigConfig(rigHost, 'coins_miners', config))
            .then(() => refreshRigStatus(context))
    }


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

                                <div className="d-flex align-items-center ms-auto me-2">
                                    <div className='badge bg-info'>
                                        {Object.keys(coinMinersConfig).length} miners
                                    </div>
                                </div>

                                <div className='d-flex align-items-center ms-2'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                {Object.entries(coinMinersConfig).map(coinMinerEntry => {
                                    const [minerName, coinMinerConfig] = coinMinerEntry;

                                    const [showMinerDetails, setShowMinerDetails] = useState(false);

                                    const changeMinerAlgo = (newAlgo: string) => {
                                        if (coinMinerConfig.algo === newAlgo) {
                                            return;
                                        }

                                        coinMinerConfig.algo = newAlgo;

                                        updateRigConfig(rigHost, 'coins_miners', coinsMiners)
                                            .then((result) => {
                                                refreshRigStatus(context);
                                            })
                                    }

                                    const changeMinerExtraArgs = (newExtraArgs: string) => {
                                        if (coinMinerConfig.extraArgs === newExtraArgs) {
                                            return;
                                        }

                                        coinMinerConfig.extraArgs = newExtraArgs;

                                        updateRigConfig(rigHost, 'coins_miners', coinsMiners)
                                            .then((result) => {
                                                refreshRigStatus(context);
                                            })
                                    }

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
                                                    <tbody>
                                                        <tr>
                                                            <td className='bold cursor-default'>Algo</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className='form-control'
                                                                    defaultValue={coinMinerConfig.algo}
                                                                    onBlur={(event) => changeMinerAlgo(event.currentTarget.value)}
                                                                    onKeyDown={(event) => { if (event.key === 'Enter') { changeMinerAlgo(event.currentTarget.value); } }}
                                                                    />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bold cursor-default'>Optional arguments</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className='form-control'
                                                                    defaultValue={coinMinerConfig.extraArgs}
                                                                    onBlur={(event) => changeMinerExtraArgs(event.currentTarget.value)}
                                                                    onKeyDown={(event) => { if (event.key === 'Enter') { changeMinerExtraArgs(event.currentTarget.value); } }}
                                                                    />
                                                            </td>
                                                        </tr>
                                                    </tbody>
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

            <div className='mt-2'>
                <button className='btn btn-primary m-1' onClick={() => uploadConfigFile()}>Load coins-miners config</button>

                <button className='btn btn-primary m-1' onClick={() => downloadConfigFile()}>Save coins-miners config</button>
            </div>
        </div>
    );
}

