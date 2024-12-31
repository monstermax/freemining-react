
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoinWallets } from '../../types_client/freemining';



export const SettingsCoinsWallets: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

        const [coinsWallets, setCoinsWallets] = useState<{[coin: string]: RigStatusConfigCoinWallets}>(rigStatus?.config.coinsWallets ?? {});


    return (
        <div>
            <h2 className='h4'>Coins Wallets configuration</h2>

            <div>
                {Object.entries(coinsWallets).map(coinEntry => {
                    const [coin, coinWalletsConfig] = coinEntry;

                    const [showCoinDetails, setShowCoinDetails] = useState(false);

                    return (
                        <div key={coin} className='alert alert-info m-2 pb-0'>
                            <div className='d-flex pointer' onClick={() => setShowCoinDetails(!showCoinDetails)}>
                                <h3 className='h5 m-1'>
                                    <img src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '32px' }} />

                                    <span className='m-2'>{coin}</span>
                                </h3>

                                <div className='badge bg-info ms-auto me-2'>
                                    {Object.keys(coinWalletsConfig).length} wallets
                                </div>

                                <div className='ms-2'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                {Object.entries(coinWalletsConfig).map(coinWalletEntry => {
                                    const [walletName, walletAddress] = coinWalletEntry;

                                    return (
                                        <div key={walletName}>
                                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                                <div>
                                                    <label className='d-flex'>
                                                        <input type="text" className='form-control' style={{width:'8em'}} defaultValue={walletName} placeholder='Name' />
                                                        <input type="text" className='form-control' defaultValue={walletAddress} placeholder="Address" />
                                                    </label>
                                                </div>
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

