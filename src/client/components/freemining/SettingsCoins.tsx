
import React, { useContext, useRef, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoin } from '../../types_client/freemining_types.client';
import { updateRigConfig } from '../../lib/rig_api';
import { downloadFile, refreshRigStatus, uploadFile } from '../../lib/utils.client';



export const SettingsCoins: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;
    if (! rigHost || ! rigHost) return <div>No host</div>

    const [coins, setCoins] = useState<{[coin: string]: RigStatusConfigCoin}>(rigStatus?.config.coins ?? {});

    const downloadConfigFile = () => {
        const fileName = `freemining_config_coins.${rigStatus?.rig.name}.json`;
        return downloadFile(coins, fileName, "application/json");
    }

    const uploadConfigFile = () => {
        return uploadFile(context)
            .then((content) => {
                return JSON.parse(content ?? '{}')
            })
            .then((config: {[coin: string]: RigStatusConfigCoin}) => updateRigConfig(rigHost, 'coins', config))
            .then(() => refreshRigStatus(context))
    }

    return (
        <div>
            <h2 className='h4'>Coins configuration</h2>

            <div>
                {Object.entries(coins).map(coinEntry => {
                    const [coin, coinConfig] = coinEntry;

                    const [showCoinDetails, setShowCoinDetails] = useState(false);

                    const changeCoinName = (newCoinName: string) => {
                        if (coinConfig.coinName === newCoinName) {
                            return;
                        }

                        coinConfig.coinName = newCoinName;

                        updateRigConfig(rigHost, 'coins', coins)
                            .then((result) => {
                                refreshRigStatus(context);
                            })
                    }

                    const changeCoinAlgo = (newAlgo: string) => {
                        if (coinConfig.algo === newAlgo) {
                            return;
                        }

                        coinConfig.algo = newAlgo;

                        updateRigConfig(rigHost, 'coins', coins)
                            .then((result) => {
                                refreshRigStatus(context);
                            })
                    }

                    const changeCoinWebsite = (newWebsite: string) => {
                        if (coinConfig.website === newWebsite) {
                            return;
                        }

                        coinConfig.website = newWebsite;

                        updateRigConfig(rigHost, 'coins', coins)
                            .then((result) => {
                                refreshRigStatus(context);
                            })
                    }

                    const changeCoinExplorer = (newExplorer: string) => {
                        if (coinConfig.explorer === newExplorer) {
                            return;
                        }

                        coinConfig.explorer = newExplorer;

                        updateRigConfig(rigHost, 'coins', coins)
                            .then((result) => {
                                refreshRigStatus(context);
                            })
                    }


                    return (
                        <div key={coin} className='alert alert-info m-2 pb-0'>
                            <div className='d-flex pointer' onClick={() => setShowCoinDetails(!showCoinDetails)}>
                                <h3 className='h5 m-1'>
                                    <img src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '32px' }} />

                                    <span className='m-2'>{coin} - {coinConfig?.coinName}</span>
                                </h3>

                                <div className='d-flex align-items-center ms-auto'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <table className={`table mt-3 ${showCoinDetails ? "" : "d-none"}`}>
                                <tbody>
                                    <tr>
                                        <td className='cursor-default'>
                                            Name
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className='form-control'
                                                defaultValue={coinConfig.coinName}
                                                onBlur={(event) => changeCoinName(event.currentTarget.value)}
                                                onKeyDown={(event) => { if (event.key === 'Enter') { changeCoinName(event.currentTarget.value); } }}
                                                placeholder='Example'
                                                />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='cursor-default'>
                                            Algo
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className='form-control'
                                                defaultValue={coinConfig.algo}
                                                onBlur={(event) => changeCoinAlgo(event.currentTarget.value)}
                                                onKeyDown={(event) => { if (event.key === 'Enter') { changeCoinAlgo(event.currentTarget.value); } }}
                                                placeholder='ex: ethash'
                                                />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='cursor-default'>
                                            Website
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className='form-control'
                                                defaultValue={coinConfig.website}
                                                onBlur={(event) => changeCoinWebsite(event.currentTarget.value)}
                                                onKeyDown={(event) => { if (event.key === 'Enter') { changeCoinWebsite(event.currentTarget.value); } }}
                                                placeholder='ex: https://example.com'
                                                />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='cursor-default'>
                                            Explorer
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className='form-control'
                                                defaultValue={coinConfig.explorer}
                                                onBlur={(event) => changeCoinExplorer(event.currentTarget.value)}
                                                onKeyDown={(event) => { if (event.key === 'Enter') { changeCoinExplorer(event.currentTarget.value); } }}
                                                placeholder='ex: https://explorer.example.com'
                                                />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    );
                })}
            </div>

            <div className='mt-2'>
                <button className='btn btn-primary m-1' onClick={() => uploadConfigFile()}>Import coins config</button>

                <button className='btn btn-primary m-1' onClick={() => downloadConfigFile()}>Export coins config</button>
            </div>

        </div>
    );
}

