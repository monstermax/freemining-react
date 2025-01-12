
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoinWallets } from '../../types_client/freemining_types.client';
import { updateRigConfig } from '../../lib/rig_api';
import { downloadFile, refreshRigStatus, uploadFile } from '../../lib/utils.client';



export const SettingsCoinsWallets: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;
    if (! rigHost || ! rigHost) return <div>No host</div>

    const [coinsWallets, setCoinsWallets] = useState<{[coin: string]: RigStatusConfigCoinWallets}>(rigStatus?.config.coinsWallets ?? {});

    const downloadConfigFile = () => {
        const fileName = `freemining_config_coins_wallets.${rigStatus?.rig.name}.json`;
        return downloadFile(coinsWallets, fileName, "application/json");
    }

    const uploadConfigFile = () => {
        return uploadFile(context)
            .then((content) => {
                return JSON.parse(content ?? '{}')
            })
            .then((config: {[coin: string]: RigStatusConfigCoinWallets}) => updateRigConfig(rigHost, 'coins_wallets', config))
            .then(() => refreshRigStatus(context))
    }


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

                                <div className="d-flex align-items-center ms-auto me-2">
                                    <div className='badge bg-info'>
                                        {Object.keys(coinWalletsConfig).length} wallets
                                    </div>
                                </div>

                                <div className='d-flex align-items-center ms-2'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                {Object.entries(coinWalletsConfig).map(coinWalletEntry => {
                                    const [walletName, walletAddress] = coinWalletEntry;

                                    const changeWalletName = (newWalletName: string) => {
                                        if (newWalletName === walletName) {
                                            return;
                                        }

                                        coinWalletsConfig[newWalletName] = coinWalletsConfig[walletName];
                                        delete coinWalletsConfig[walletName];

                                        updateRigConfig(rigHost, 'coins_wallets', coinsWallets)
                                            .then((result) => {
                                                refreshRigStatus(context);
                                            })
                                    }

                                    const changeWalletAddress = (newAddress: string) => {
                                        if (newAddress === walletAddress) {
                                            return;
                                        }

                                        coinWalletsConfig[walletName] = newAddress;

                                        updateRigConfig(rigHost, 'coins_wallets', coinsWallets)
                                            .then((result) => {
                                                refreshRigStatus(context);
                                            })
                                    }

                                    return (
                                        <div key={walletName}>
                                            <div className={`m-1 ${showCoinDetails ? "" : "d-none"}`}>
                                                <div>
                                                    <label className='d-flex'>
                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            style={{width:'8em'}}
                                                            defaultValue={walletName}
                                                            onBlur={(event) => changeWalletName(event.currentTarget.value)}
                                                            onKeyDown={(event) => { if (event.key === 'Enter') { changeWalletName(event.currentTarget.value); } }}
                                                            placeholder='Name' />

                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            defaultValue={walletAddress}
                                                            onBlur={(event) => changeWalletAddress(event.currentTarget.value)}
                                                            onKeyDown={(event) => { if (event.key === 'Enter') { changeWalletAddress(event.currentTarget.value); } }}
                                                            placeholder="Address" />
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

            <div className='mt-2'>
                <button className='btn btn-primary m-1' onClick={() => uploadConfigFile()}>Load wallets config</button>

                <button className='btn btn-primary m-1' onClick={() => downloadConfigFile()}>Save wallets config</button>
            </div>
        </div>
    );
}

