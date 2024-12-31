
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoinPools } from '../../types_client/freemining';



export const SettingsCoinsPools: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const [coinsPools, setCoinsPools] = useState<{[coin: string]: RigStatusConfigCoinPools}>(rigStatus?.config.coinsPools ?? {});


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

                                <div className='badge bg-info ms-auto me-2'>
                                    {Object.keys(coinPoolsConfig).length} pools
                                </div>

                                <div className='ms-2'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                {Object.entries(coinPoolsConfig).map(coinPoolEntry => {
                                    const [poolName, coinPoolConfig] = coinPoolEntry;

                                    const [showPoolDetails, setShowPoolDetails] = useState(false);

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
                                                    <tr>
                                                        <td className='bold cursor-default'>Nickname template</td>
                                                        <td><input type="text" className='form-control' defaultValue={coinPoolConfig.user} placeholder='{wallet}.{worker}' /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='bold cursor-default'>Urls</td>
                                                        <td>
                                                            <table className='table'>
                                                                {Object.entries(coinPoolConfig?.urls || {}).map(coinPoolEntry => {
                                                                    const [urlName, url] = coinPoolEntry;

                                                                    return (
                                                                        <div>
                                                                            <label className='d-flex'>
                                                                                <input type="text" className='form-control' style={{width:'8em'}} defaultValue={urlName} placeholder='world' />
                                                                                <input type="text" className='form-control' defaultValue={url} placeholder="https://..." />
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </table>
                                                        </td>
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

