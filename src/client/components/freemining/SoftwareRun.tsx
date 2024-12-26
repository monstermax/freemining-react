
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { RigStatusConfigCoin, RigStatusConfigCoinMiner, RigStatusConfigCoinMiners, RigStatusConfigCoinPool, RigStatusConfigCoinPools, RigStatusConfigCoinWallet, RigStatusConfigCoinWallets, RigStatusStatusInstalledMinerAlias, RigStatusStatusInstalledMinerAliases } from '../../types_client/freemining';
import { startMiner, startMinerOptions } from '../../lib/software_start';


// TODO: a deplacer dans une route autonome : /mining/software/run


export const SoftwareTabRun: React.FC<{selectedMinerName: string, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigStatus } = context;

    const selectedMinerName = props.selectedMinerName;
    const setTabName = props.setTabName;

    const _selectedMinerCoinsList = (rigStatus && selectedMinerName) ? Object.entries(rigStatus.config.coinsMiners).filter(entry => selectedMinerName in entry[1]).map(entry => entry[0]) : null
    const _coinsList = rigStatus ? Object.entries(rigStatus.config.coins).filter(entry => (_selectedMinerCoinsList === null) || _selectedMinerCoinsList.includes(entry[0])) : [];

    const [coinsList, setCoinsList] = useState<[string, RigStatusConfigCoin][]>(_coinsList)
    const [coin, setCoin] = useState<string | null>(null)

    const [walletsList, setWalletsList] = useState<[string, RigStatusConfigCoinWallet][]>([])
    const [wallet, setWallet] = useState<string | null>(null)

    const [poolsList, setPoolsList] = useState<[string, RigStatusConfigCoinPool][]>([])
    const [pool, setPool] = useState<string | null>(null)
    const [poolUrl, setPoolUrl] = useState<string | null>(null)
    const [poolUser, setPoolUser] = useState<string | null>(null)

    const [minersList, setMinersList] = useState<[string, RigStatusConfigCoinMiner][]>([])
    const [minerName, setMinerName] = useState<string | null>(null)
    const [minersAliasesList, setMinersAliasesList] = useState<[string, RigStatusStatusInstalledMinerAlias][]>([])
    const [minerAlias, setMinerAlias] = useState<string | null>(null)
    const [algo, setAlgo] = useState<string | null>(null)
    const [extraArgs, setExtraArgs] = useState<string | null>(null)
    const [worker, setWorker] = useState<string | null>('test'); // TODO
    const [startEnabled, setStartEnabled] = useState<boolean>(false);

    const changeCoin = (_coin: string | null) => {
        setCoin(_coin)

        const _wallets: RigStatusConfigCoinWallets = (rigStatus && _coin) ? rigStatus.config.coinsWallets[_coin] : {};
        const _walletsList: [string, string][] = Object.entries(_wallets);
        const _wallet = (_walletsList.length === 1) ? _walletsList[0][0] : null;
        setWalletsList(_walletsList);
        setWallet(null);

        const _pools: RigStatusConfigCoinPools = (rigStatus && _coin) ? rigStatus.config.coinsPools[_coin] : {};
        const _poolsList: [string, RigStatusConfigCoinPool][] = Object.entries(_pools);
        const _pool = null; // TODO
        setPoolsList(_poolsList);
        setPool(null);
        setPoolUrl(null);
        setPoolUser(null);

        const miners = (rigStatus && _coin) ? rigStatus.config.coinsMiners[_coin] : {};
        const _minersList: [string, RigStatusConfigCoinMiner][] = Object.entries(miners);
        const _miner = selectedMinerName || ((_minersList.length === 1) ? _minersList[0][0] : null) || null;
        setMinersList(_minersList);
        setMinerName(null);
        setMinersAliasesList([]);
        setMinerAlias(null);
        setAlgo(null);
        setExtraArgs(null);
        //setWorker(null);

        if (_coin && _wallet) {
            changeWallet(_wallet);
        }

        if (_coin && _pool) {
            //const $select = null; // TODO
            //$select.value = _pool;
        }

        if (_coin && _miner) {
            changeMinerName(_miner);
        }
    }

    const changeWallet = (_walletName: string | null) => {
        setWallet(_walletName);
    }

    const changePoolRef = ($select: HTMLSelectElement) => {
        const _poolUrl = $select.value;

        if (! _poolUrl) {
            setPool(null);
            setPoolUrl(null);
            setPoolUser(null);
            return;
        }

        const $option = $select.options[$select.selectedIndex];
        const $optgroup = $option.parentElement;[]

        const _poolName = $optgroup?.getAttribute('label') ?? '';

        if (! _poolName) {
            setPoolUrl(null);
            setPoolUser(null);
            return;
        }

        const _pool = poolsList.find(pool => pool[0] === _poolName)?.at(1) as RigStatusConfigCoinPool | undefined;
        const _poolUserRaw = _pool?.user ?? '';

        let _poolUser = _poolUserRaw;
        _poolUser = _poolUser.replaceAll('{wallet}', wallet ?? '');
        _poolUser = _poolUser.replaceAll('{worker}', worker ?? '');

        setPool(_poolUrl);
        setPoolUrl(_poolUrl);
        setPoolUser(_poolUser);
    }

    const changePoolUrl = (_poolUrl: string | null) => {
        setPoolUrl(_poolUrl);
    }

    const changepoolUser = (_poolUser: string | null) => {
        setPoolUser(_poolUser);
    }

    const changeMinerName = (_minerName: string | null) => {
        setMinerName(_minerName);

        if (! coin || !rigStatus || ! _minerName) {
            setMinersAliasesList([]);
            setMinerAlias(null);
            setAlgo(null);
            setExtraArgs(null);
            return;
        }

        const _minerAliases = rigStatus.status.installedMinersAliases[_minerName].versions;
        const _minersAliasesList = Object.entries(_minerAliases);
        _minersAliasesList.sort((a, b) => b[1].version.localeCompare(a[1].version));
        setMinersAliasesList(_minersAliasesList);
        setMinerAlias(rigStatus.status.installedMinersAliases[_minerName].defaultAlias);

        const _algo = rigStatus.config.coinsMiners[coin][_minerName].algo ?? '';
        setAlgo(_algo);

        const _extraArgs = rigStatus.config.coinsMiners[coin][_minerName].extraArgs ?? '';
        setExtraArgs(_extraArgs);
    }

    const changeMinerAlias = (_minerAlias: string | null) => {
        setMinerAlias(_minerAlias);
    }

    const changeextraArgs = (_extraArgs: string | null) => {
        setExtraArgs(_extraArgs);
    }

    const changeAlgo = (_algo: string | null) => {
        setAlgo(_algo);
    }

    const changeWorker = (_worker: string | null) => {
        setWorker(_worker);
    }

    const submitStartMiner = () => {
        if (! minerName || ! minerAlias) return;
        if (! coin || ! algo) return;
        if (! poolUrl || ! poolUser) return;

        const options: startMinerOptions = {
            coin,
            algo,
            poolUrl,
            poolUser,
            extraArgs: extraArgs ?? '',
        };

        startMiner(context, minerName, minerAlias, options);
    }


    useEffect(() => {
        const variables: {[variableName: string]: string | null} = {
            coin,
            wallet,
            //pool,
            poolUser,
            poolUrl,
            minerName,
            minerAlias,
            algo,
            //extraArgs,
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

    }, [coin, wallet, pool, poolUser, poolUrl, minerName, minerAlias, algo, extraArgs, worker])

    return (
        <>
            <button onClick={() => setTabName('infos')}>back</button>
            <br />
            run miner

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
                            <select name="" className='form-control' value={pool ?? ''} onChange={(event) => changePoolRef(event.target)}>
                                <option value=""></option>

                                {poolsList.map(poolEntry => {
                                    const [_poolName, _poolDetails] = poolEntry;

                                    if (Object.keys(_poolDetails.urls).length === 0) {
                                        return null;
                                    }

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

                            <input type="text" name="" value={poolUser ?? ''} className='form-control' onChange={(event) => changepoolUser(event.target.value || null) } />
                        </label>
                    </div>
                </div>

                {/* MINER */}
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Miner</span>

                        <div className='input-group'>
                            <select name="" className='form-control' value={minerName ?? ''} onChange={(event) => changeMinerName(event.target.value || null)}>
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

                            <input type="text" name="" value={extraArgs ?? ''} className='form-control' onChange={(event) => changeextraArgs(event.target.value || null) } />
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
                    <button className={`btn btn-primary ${startEnabled ? "" : "disabled"}`} onClick={() => submitStartMiner()}>Start</button>
                </div>

            </form>
        </>
    );
};


