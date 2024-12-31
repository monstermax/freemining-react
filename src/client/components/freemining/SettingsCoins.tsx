
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoin } from '../../types_client/freemining';



export const SettingsCoins: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const [coins, setCoins] = useState<{[coin: string]: RigStatusConfigCoin}>(rigStatus?.config.coins ?? {});


    return (
        <div>
            <h2 className='h4'>Coins configuration</h2>

            <div>
                {Object.entries(coins).map(coinEntry => {
                    const [coin, coinConfig] = coinEntry;

                    const [showCoinDetails, setShowCoinDetails] = useState(false);

                    return (
                        <div key={coin} className='alert alert-info m-2 pb-0'>
                            <div className='d-flex pointer' onClick={() => setShowCoinDetails(!showCoinDetails)}>
                                <h3 className='h5 m-1'>
                                    <img src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '32px' }} />

                                    <span className='m-2'>{coin} - {coinConfig?.coinName}</span>
                                </h3>

                                <div className='ms-auto'>
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
                                            <input type="text" className='form-control' defaultValue={coinConfig.coinName} placeholder='Example' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='cursor-default'>
                                            Algo
                                        </td>
                                        <td>
                                            <input type="text" className='form-control' defaultValue={coinConfig.algo} placeholder='ethash' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='cursor-default'>
                                            Website
                                        </td>
                                        <td>
                                            <input type="text" className='form-control' defaultValue={coinConfig.website} placeholder='https://example.com' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='cursor-default'>
                                            Explorer
                                        </td>
                                        <td>
                                            <input type="text" className='form-control' defaultValue={coinConfig.explorer} placeholder='https://explorer.example.com' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}

