
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoin, RigStatusConfigCoinMiner, RigStatusConfigCoinMiners, RigStatusConfigCoinPool, RigStatusConfigCoinPools, RigStatusConfigCoinWallet, RigStatusConfigCoinWallets, RigStatusStatusInstalledMinerAlias, RigStatusStatusInstalledMinerAliases } from '../../types_client/freemining';




export const SoftwareTabRun: React.FC<{selectedMinerName: string, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigStatus } = context;

    const selectedMinerName = props.selectedMinerName;
    const setTabName = props.setTabName;

    const [coinsList, setCoinsList] = useState<[string, RigStatusConfigCoin][]>(rigStatus ? Object.entries(rigStatus.config.coins) : [])
    const [coin, setCoin] = useState<string | null>(null)

    const [walletsList, setWalletsList] = useState<[string, RigStatusConfigCoinWallet][]>([])
    const [wallet, setWallet] = useState<string | null>(null)

    const [poolsList, setPoolsList] = useState<[string, RigStatusConfigCoinPool][]>([])
    const [pool, setPool] = useState<string | null>(null)
    const [poolUrl, setPoolUrl] = useState<string | null>(null)
    const [poolAccount, setPoolAccount] = useState<string | null>(null)

    const [minersList, setMinersList] = useState<[string, RigStatusConfigCoinMiner][]>([])
    const [minerName, setMinerName] = useState<string | null>(null)
    const [minersAliasesList, setMinersAliasesList] = useState<[string, RigStatusStatusInstalledMinerAlias][]>([])
    const [minerAlias, setMinerAlias] = useState<string | null>(null)
    const [algo, setAlgo] = useState<string | null>(null)
    const [minerOptionalArgs, setMinerOptionalArgs] = useState<string | null>(null)
    const [worker, setWorker] = useState<string | null>(null)
    const [startEnabled, setStartEnabled] = useState<boolean>(false);

    const changeCoin = (_coin: string | null) => {
        setCoin(_coin)

        const _wallets: RigStatusConfigCoinWallets = (rigStatus && _coin) ? rigStatus.config.coinsWallets[_coin] : {};
        const _walletsList: [string, string][] = Object.entries(_wallets);
        setWalletsList(_walletsList);
        setWallet(null);

        const _pools: RigStatusConfigCoinPools = (rigStatus && _coin) ? rigStatus.config.coinsPools[_coin] : {};
        const _poolsList: [string, RigStatusConfigCoinPool][] = Object.entries(_pools);
        setPoolsList(_poolsList);
        setPool(null);
        setPoolUrl(null);
        setPoolAccount(null);

        const miners = (rigStatus && _coin) ? rigStatus.config.coinsMiners[_coin] : {};
        const _minersList: [string, RigStatusConfigCoinMiner][] = Object.entries(miners);
        setMinersList(_minersList);
        setMinerName(null);
        setMinersAliasesList([]);
        setMinerAlias(null);
        setAlgo(null);
        setMinerOptionalArgs(null);
        setWorker(null);

    }

    const changeWallet = (_walletName: string | null) => {
        setWallet(_walletName);
    }

    const changePoolRef = ($select: HTMLSelectElement) => {
        const _poolUrl = $select.value;

        if (! _poolUrl) {
            setPool(null);
            setPoolUrl(null);
            setPoolAccount(null);
            return;
        }

        const $option = $select.options[$select.selectedIndex];
        const $optgroup = $option.parentElement;[]

        const _poolName = $optgroup?.getAttribute('label') ?? '';

        if (! _poolName) {
            setPoolUrl(null);
            setPoolAccount(null);
            return;
        }

        const _pool = poolsList.find(pool => pool[0] === _poolName)?.at(1) as RigStatusConfigCoinPool | undefined;
        const _poolAccount = _pool?.user ?? '';

        setPool(_poolUrl);
        setPoolUrl(_poolUrl);
        setPoolAccount(_poolAccount);
    }

    const changePoolUrl = (_poolUrl: string | null) => {
        setPoolUrl(_poolUrl);
    }

    const changePoolAccount = (_poolAccount: string | null) => {
        setPoolAccount(_poolAccount);
    }

    const changeMinerName = (_minerName: string | null) => {
        setMinerName(_minerName);

        if (! coin || !rigStatus || ! _minerName) {
            setMinersAliasesList([]);
            setMinerAlias(null);
            setAlgo(null);
            setMinerOptionalArgs(null);
            return;
        }

        const _minerAliases = rigStatus.status.installedMinersAliases[_minerName].versions;
        const _minersAliasesList = Object.entries(_minerAliases);
        _minersAliasesList.sort((a, b) => b[1].version.localeCompare(a[1].version));
        setMinersAliasesList(_minersAliasesList);
        setMinerAlias(rigStatus.status.installedMinersAliases[_minerName].defaultAlias);

        const _algo = rigStatus.config.coinsMiners[coin][_minerName].algo ?? '';
        setAlgo(_algo);

        const _minerOptionalArgs = rigStatus.config.coinsMiners[coin][_minerName].extraArgs ?? '';
        setMinerOptionalArgs(_minerOptionalArgs);
    }

    const changeMinerAlias = (_minerAlias: string | null) => {
        setMinerAlias(_minerAlias);
    }

    const changeMinerOptionalArgs = (_minerOptionalArgs: string | null) => {
        setMinerOptionalArgs(_minerOptionalArgs);
    }

    const changeAlgo = (_algo: string | null) => {
        setAlgo(_algo);
    }

    const changeWorker = (_worker: string | null) => {
        setWorker(_worker);
    }


    useEffect(() => {
    }, [pool]);


    useEffect(() => {
        const variables: {[variableName: string]: string | null} = {
            coin,
            wallet,
            pool,
            poolAccount,
            poolUrl,
            minerName,
            minerAlias,
            algo,
            //minerOptionalParams,
            //worker,
        };

        //for (const variable in variables) {
        //    const ok = !! variables[variable];
        //    if (!ok) console.log(`DEBUG: variable "${variable}" is falsy`)
        //}

        const _startEnabled = ! Object.values(variables).some((variable => ! variable));

        //if (_startEnabled !== startEnabled) {
            setStartEnabled(_startEnabled);
        //}

    }, [coin, wallet, pool, poolAccount, poolUrl, minerName, minerAlias, algo, minerOptionalArgs, worker])

    return (
        <>
            <button onClick={() => setTabName('infos')}>back</button>
            <br />
            run miner {selectedMinerName}

            <form onSubmit={(event) => event.preventDefault()}>

                {/* COIN */}
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Coin</span>

                        <select name="" className='form-control' onChange={(event) => changeCoin(event.target.value || null)}>
                            <option value=""></option>

                            {coinsList.map(coinEntry => {
                                const [_coin, _coinDetails] = coinEntry;

                                return (
                                    <option key={_coin} value={_coin}>{_coin} - {_coinDetails.coinName}</option>
                                );
                            })}
                        </select>
                    </label>
                </div>

                {/* WALLET */}
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Wallet</span>

                        <select name="" className='form-control' onChange={(event) => changeWallet(event.target.value || null)}>
                            <option value=""></option>

                            {walletsList.map(walletEntry => {
                                const [_walletName, _walletAddress] = walletEntry;

                                return (
                                    <option key={_walletAddress} value={_walletAddress}>{_walletName} : {_walletAddress}</option>
                                );
                            })}
                        </select>
                    </label>
                </div>

                {/* POOL */}
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Pool</span>

                        <div className='input-group'>
                            <select name="" className='form-control' onChange={(event) => changePoolRef(event.target)}>
                                <option value=""></option>

                                {poolsList.map(poolEntry => {
                                    const [_poolName, _poolDetails] = poolEntry;

                                    return (
                                        <optgroup key={_poolName} label={_poolName}>

                                            {Object.entries(_poolDetails.urls).map(urlEntry => {
                                                const [_urlName, _url] = urlEntry;

                                                return (
                                                    <option key={_url} value={_url}>{_urlName} | {_url}</option>
                                                );
                                            })}
                                        </optgroup>
                                    )
                                })}
                            </select>

                            <button className="btn btn-outline-secondary" type="button" onClick={() => document.getElementById('run-miner-pool-details')?.classList.toggle('d-none')}>...</button>
                        </div>
                    </label>
                </div>

                {/* POOL - DETAILS */}
                <div id="run-miner-pool-details" className='d-none'>

                    {/* POOL - URL */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Pool url</span>

                            <input type="text" name="" value={poolUrl ?? ''} className='form-control' onChange={(event) => changePoolUrl(event.target.value || null) } />
                        </label>
                    </div>

                    {/* POOL - ACCOUNT */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Pool account</span>

                            <input type="text" name="" value={poolAccount ?? ''} className='form-control' onChange={(event) => changePoolAccount(event.target.value || null) } />
                        </label>
                    </div>
                </div>

                {/* MINER */}
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Miner</span>

                        <div className='input-group'>
                            <select name="" className='form-control' onChange={(event) => changeMinerName(event.target.value || null)}>
                                <option value=""></option>

                                {minersList.map(minerEntry => (
                                    <option key={minerEntry[0]} value={minerEntry[0]}>{minerEntry[0]}</option>
                                ))}
                            </select>

                            <button className="btn btn-outline-secondary" type="button" onClick={() => document.getElementById('run-miner-miner-details')?.classList.toggle('d-none')}>...</button>
                        </div>
                    </label>
                </div>

                {/* MINER - DETAILS */}
                <div id="run-miner-miner-details" className='d-none'>

                    {/* MINER - ALIAS */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Version</span>

                            <select name="" value={minerAlias ?? ''} className='form-control' onChange={(event) => changeMinerAlias(event.target.value || null)}>
                                <option value=""></option>

                                {minersAliasesList.map(minerAliasEntry => {
                                    const [aliasname, minerAliasDetails] = minerAliasEntry;
                                    //const selected = (rigStatus && minerName) ? (rigStatus.status.installedMinersAliases[minerName].defaultAlias === minerAliasDetails.alias) : false;

                                    return (
                                        <option key={minerAliasDetails.alias} value={minerAliasDetails.alias}>{minerAliasDetails.alias}</option>
                                    );
                                })}
                            </select>
                        </label>
                    </div>

                    {/* MINER - ALGO */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Algo</span>

                            <input type="text" name="" value={algo ?? ''} className='form-control' onChange={(event) => changeAlgo(event.target.value || null) } />
                        </label>
                    </div>

                    {/* MINER - OPTIONAL ARGS */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Miner optional parameters</span>

                            <input type="text" name="" value={minerOptionalArgs ?? ''} className='form-control' onChange={(event) => changeMinerOptionalArgs(event.target.value || null) } />
                        </label>
                    </div>

                    {/* MINER - WORKER */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Worker</span>

                            <input type="text" name="" value={worker ?? ''} className='form-control' onChange={(event) => changeWorker(event.target.value || null) } />
                        </label>
                    </div>
                </div>

                <div className='m-1'>
                    <button className={`btn btn-primary ${startEnabled ? "" : "disabled"}`}>Start</button>
                </div>

            </form>
        </>
    );
};


