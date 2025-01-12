
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoinPools } from '../../types_client/freemining_types.client';
import { updateRigConfig } from '../../lib/rig_api';
import { downloadFile, refreshRigStatus, uploadFile } from '../../lib/utils.client';



export const SettingsCoinsPools: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;
    if (! rigHost || ! rigHost) return <div>No host</div>

    const [coinsPools, setCoinsPools] = useState<{[coin: string]: RigStatusConfigCoinPools}>(rigStatus?.config.coinsPools ?? {});

    const downloadConfigFile = () => {
        const fileName = `freemining_config_coins_pools.${rigStatus?.rig.name}.json`;
        return downloadFile(coinsPools, fileName, "application/json");
    }

    const uploadConfigFile = () => {
        return uploadFile(context)
            .then((content) => {
                return JSON.parse(content ?? '{}')
            })
            .then((config: {[coin: string]: RigStatusConfigCoinPools},) => updateRigConfig(rigHost, 'coins_pools', config))
            .then(() => refreshRigStatus(context))
    }


    return (
        <div>
            <h2 className='h4'>Coins Pools configuration</h2>

            <div>
                {Object.entries(coinsPools).map(coinEntry => {
                    const [coin, coinPoolsConfig] = coinEntry;

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
                                        {Object.keys(coinPoolsConfig).length} pools
                                    </div>
                                </div>

                                <div className='d-flex align-items-center ms-2'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                {Object.entries(coinPoolsConfig).map(coinPoolEntry => {
                                    const [poolName, coinPoolConfig] = coinPoolEntry;

                                    const [showPoolDetails, setShowPoolDetails] = useState(false);

                                    const changePoolName = (newPoolName: string) => {
                                        if (newPoolName === poolName) {
                                            return;
                                        }

                                        coinPoolsConfig[newPoolName] = coinPoolsConfig[poolName];
                                        delete coinPoolsConfig[poolName];

                                        updateRigConfig(rigHost, 'coins_pools', coinsPools)
                                            .then((result) => {
                                                refreshRigStatus(context);
                                            })
                                    }

                                    const changePoolUser = (newPoolUser: string) => {
                                        if (newPoolUser === coinPoolConfig.user) {
                                            return;
                                        }

                                        coinPoolsConfig[poolName].user = newPoolUser;

                                        updateRigConfig(rigHost, 'coins_pools', coinsPools)
                                            .then((result) => {
                                                refreshRigStatus(context);
                                            })
                                    }

                                    return (
                                        <div key={poolName}>
                                            <div className={`alert alert-secondary m-1 pb-0`}>
                                                <div className='d-flex pointer' onClick={() => setShowPoolDetails(!showPoolDetails)}>
                                                    <h4 className='h5'>{poolName}</h4>

                                                    <div className='ms-auto'>
                                                        <i className={`bi text-secondary ${showPoolDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                                    </div>
                                                </div>


                                                <table className={`table ${showPoolDetails ? "" : "d-none"}`}>
                                                    <tbody>
                                                        <tr>
                                                            <td className='bold cursor-default'>Nickname template</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className='form-control'
                                                                    defaultValue={coinPoolConfig.user}
                                                                    onBlur={(event) => changePoolUser(event.currentTarget.value)}
                                                                    onKeyDown={(event) => { if (event.key === 'Enter') { changePoolUser(event.currentTarget.value); } }}
                                                                    placeholder='{wallet}.{worker}'
                                                                    />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bold cursor-default'>Urls</td>
                                                            <td>
                                                                <table className='table'>
                                                                    <tbody>
                                                                        {Object.entries(coinPoolConfig?.urls || {}).map(coinPoolEntry => {
                                                                            const [urlName, url] = coinPoolEntry;

                                                                            const changeUrlName = (newUrlName: string) => {
                                                                                if (newUrlName === urlName) {
                                                                                    return;
                                                                                }

                                                                                coinPoolConfig.urls[newUrlName] = url;
                                                                                delete coinPoolConfig.urls[urlName];

                                                                                updateRigConfig(rigHost, 'coins_pools', coinsPools)
                                                                                    .then((result) => {
                                                                                        refreshRigStatus(context);
                                                                                    })
                                                                            }

                                                                            const changePoolUrl = (newUrl: string) => {
                                                                                if (newUrl === url) {
                                                                                    return;
                                                                                }

                                                                                coinPoolConfig.urls[urlName] = newUrl;

                                                                                updateRigConfig(rigHost, 'coins_pools', coinsPools)
                                                                                    .then((result) => {
                                                                                        refreshRigStatus(context);
                                                                                    })
                                                                            }

                                                                            return (
                                                                                <tr key={urlName}>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            className='form-control'
                                                                                            style={{width:'8em'}}
                                                                                            defaultValue={urlName}
                                                                                            onBlur={(event) => changeUrlName(event.currentTarget.value)}
                                                                                            onKeyDown={(event) => { if (event.key === 'Enter') { changeUrlName(event.currentTarget.value); } }}
                                                                                            placeholder='world' />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            className='form-control'
                                                                                            defaultValue={url}
                                                                                            onBlur={(event) => changePoolUrl(event.currentTarget.value)}
                                                                                            onKeyDown={(event) => { if (event.key === 'Enter') { changePoolUrl(event.currentTarget.value); } }}
                                                                                            placeholder="https://..." />
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
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
                <button className='btn btn-primary m-1' onClick={() => uploadConfigFile()}>Load pools config</button>

                <button className='btn btn-primary m-1' onClick={() => downloadConfigFile()}>Save pools config</button>
            </div>
        </div>
    );
}

