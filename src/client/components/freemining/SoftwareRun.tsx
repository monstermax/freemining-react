
import React, { useContext, useEffect, useRef, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { startMiner, StartMinerOptions } from '../../lib/software_start';

import type { RigStatusConfigCoin, RigStatusConfigCoinMiner, RigStatusConfigCoinMiners, RigStatusConfigCoinPool, RigStatusConfigCoinPools, RigStatusConfigCoinWallet, RigStatusConfigCoinWallets, RigStatusStatusInstalledMinerAlias, RigStatusStatusInstalledMinerAliases } from '../../types_client/freemining';
import { Link } from 'react-router-dom';


// TODO: a deplacer dans une route autonome : /mining/software/run


export const SoftwareTabRun: React.FC<{selectedCoin?: string | null, selectedMinerName?: string | null, closeSoftwarePopup: () => void, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const selectedCoin = props.selectedCoin ?? null;
    const selectedMinerName = props.selectedMinerName ?? null;
    const setTabName = props.setTabName;
    const closeSoftwarePopup = props.closeSoftwarePopup;

    const [coin, setCoin] = useState<string | null>(null)

    const _minersNames = (rigStatus && coin) ? rigStatus.config.coinsMiners[coin] : {};

    const _runnableMiners: string[] = !rigStatus ? [] : rigStatus?.status.installedMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));

    const _selectedMinerCoinsList = ! (rigStatus && selectedMinerName) ? null : Object.entries(rigStatus.config.coinsMiners).filter(entry => selectedMinerName in entry[1]).map(entry => entry[0])

    const _coinsList = !rigStatus ? [] : Object.entries(rigStatus.config.coins)
            .filter(coinEntry => (_selectedMinerCoinsList === null) || _selectedMinerCoinsList.includes(coinEntry[0]))
            .filter(coinEntry => Object.keys(rigStatus.config.coinsWallets[coinEntry[0]] ?? {}).length > 0)
            .filter(coinEntry => Object.keys(rigStatus.config.coinsPools[coinEntry[0]] ?? {}).length > 0)
            .filter(coinEntry => Object.keys(rigStatus.config.coinsMiners[coinEntry[0]] ?? {}).length > 0)
            .filter(coinEntry => Object.keys(rigStatus.config.coinsMiners[coinEntry[0]] ?? {}).filter(minerName => _runnableMiners.includes(minerName)).length > 0)
            ;

    const [coinsList, setCoinsList] = useState<[string, RigStatusConfigCoin][]>(_coinsList)

    const [walletsList, setWalletsList] = useState<[string, RigStatusConfigCoinWallet][]>([])
    const [wallet, setWalletAddress] = useState<string | null>(null)

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
    const [worker, setWorker] = useState<string | null>(rigStatus?.rig.name ?? null);
    const [startEnabled, setStartEnabled] = useState<boolean>(false);

    const $poolRef = useRef<HTMLSelectElement>(null);


    const onCoinChanged = () => {
        // Update WALLET
        const _wallets: RigStatusConfigCoinWallets = (rigStatus && coin) ? rigStatus.config.coinsWallets[coin] : {};
        const _walletsList: [string, string][] = Object.entries(_wallets);
        setWalletsList(_walletsList);

        // Update POOL
        const _pools: RigStatusConfigCoinPools = (rigStatus && coin) ? rigStatus.config.coinsPools[coin] : {};
        const _poolsList: [string, RigStatusConfigCoinPool][] = Object.entries(_pools);
        setPoolsList(_poolsList);


        // Update MINER
        const _minersList: [string, RigStatusConfigCoinMiner][] = Object.entries(_minersNames)
            .filter(minerEntry => _runnableMiners.includes(minerEntry[0]));

        setMinersList(_minersList);
    }

    const onWalletChanged = () => {

    }

    const onPoolChanged = () => {
        const $select = $poolRef.current;   // <SELECT ...>
        //const _poolUrl = $select?.value;
        const _poolUrl = pool;

        if (! _poolUrl || ! $select) {
            setPoolUrl(null);
            setPoolUser(null);
            return;
        }

        const $option = $select.options[$select.selectedIndex]; // <OPTION value="...">
        const $optgroup = $option.parentElement;[]              // <OPTGROUP label="...">
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

        setPoolUrl(_poolUrl);
        setPoolUser(_poolUser);
    }

    const onPoolUrlChanged = () => {

    }

    const onPoolUserChanged = () => {

    }

    const onMinerNameChanged = () => {
        if (! coin || ! rigStatus || ! minerName) {
            setMinersAliasesList([]);
            setMinerAlias(null);
            setAlgo(null);
            setExtraArgs(null);
            return;
        }

        // UPDATE ALIAS
        const _minerAliases = rigStatus.status.installedMinersAliases[minerName]?.versions || {};
        const _minersAliasesList = Object.entries(_minerAliases);
        _minersAliasesList.sort((a, b) => b[1].version.localeCompare(a[1].version));
        setMinersAliasesList(_minersAliasesList);
        setMinerAlias(rigStatus.status.installedMinersAliases[minerName]?.defaultAlias ?? null);

        // UPDATE ALGO
        const _algo = rigStatus.config.coinsMiners[coin][minerName]?.algo ?? '';
        setAlgo(_algo);

        // UPDATE EXTRA_ARGS
        const minerExtraArgs = rigStatus.config.miners[minerName]?.extraArgs ?? '';
        const coinerMinerExtraArgs = rigStatus.config.coinsMiners[coin][minerName]?.extraArgs ?? '';

        const _extraArgs = [minerExtraArgs, coinerMinerExtraArgs].join(' ').trim();
        setExtraArgs(_extraArgs);
    }

    const onMinerAliasChanged = () => {

    }

    const onExtraArgsChanged = () => {

    }

    const onAlgoChanged = () => {

    }

    const onWorkerChanged = () => {

    }

    const submitStartMiner = () => {
        if (! minerName || ! minerAlias) return;
        if (! coin || ! algo) return;
        if (! poolUrl || ! poolUser) return;

        const options: StartMinerOptions = {
            coin,
            algo,
            poolUrl,
            poolUser,
            extraArgs: extraArgs ?? '',
        };

        startMiner(context, minerName, minerAlias, options);

        setTabName('infos');
    }


    useEffect(() => {
        // HOST CHANGED
        setWorker(rigStatus?.rig.name ?? null);
    }, [rigHost, rigStatus, coin]);

    useEffect(() => {
        // COIN CHANGED
        onCoinChanged();
    }, [rigHost, rigStatus, coin]);

    useEffect(() => {
        // WALLETS LIST CHANGED
        const _wallet = (walletsList.length === 1) ? walletsList[0][1] : null; // si 1 seul element on le selectionne
        setWalletAddress(_wallet ?? null);
    }, [rigHost, rigStatus, coin, walletsList]);

    useEffect(() => {
        // WALLET CHANGED
        onWalletChanged();
    }, [rigHost, rigStatus, coin, walletsList]);

    useEffect(() => {
        // MINERS LIST CHANGED
        const _minerName = selectedMinerName || ((minersList.length === 1) ? minersList[0][0] : null); // si 1 seul element on le selectionne
        setMinerName(_minerName ?? null);
    }, [rigHost, rigStatus, coin, minersList]);

    useEffect(() => {
        // MINER NAME CHANGED
        onMinerNameChanged();
    }, [rigHost, rigStatus, coin, minerName]);

    useEffect(() => {
        // POOLS LIST CHANGED
        const _pool = null; // TODO : selectedPool || (allPoolsUrls.length === 1) ....
        setPool(_pool ?? null);
    }, [rigHost, rigStatus, coin, poolsList]);

    useEffect(() => {
        // POOL CHANGED
        onPoolChanged();
    }, [rigHost, rigStatus, coin, pool]);


    useEffect(() => {
        const variables: {[variableName: string]: string | null} = {
            coin,
            //wallet,
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
        setStartEnabled(_startEnabled);

    }, [rigHost, rigStatus, coin, wallet, pool, poolUser, poolUrl, minerName, minerAlias, algo, extraArgs, worker])

    return (
        <>
            <div className='d-flex m-2 mt-3'>
                <h2>Run miner</h2>
                <button type="button" className="btn-close m-2" aria-label="Close" onClick={() => setTabName('infos')}></button>
            </div>

            <div className='alert alert-info'>
                <form onSubmit={(event) => event.preventDefault()}>

                    {/* COIN */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Coin</span>

                            <select name="" value={coin ?? ''} className='form-control' onChange={(event) => setCoin(event.target.value || null)}>
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

                            <select name="" value={wallet ?? ''} className='form-control' onChange={(event) => setWalletAddress(event.target.value || null)}>
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
                                <select ref={$poolRef} name="" value={pool ?? ''} className='form-control' onChange={(event) => setPool(event.target.value || null)}>
                                    <option value=""></option>

                                    {poolsList.map(poolEntry => {
                                        const [_poolName, _poolDetails] = poolEntry;

                                        if (Object.keys(_poolDetails.urls || {}).length === 0) {
                                            return null;
                                        }

                                        return (
                                            <optgroup key={_poolName} label={_poolName}>

                                                {Object.entries(_poolDetails.urls || {}).map(urlEntry => {
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

                                <input type="text" name="" value={poolUrl ?? ''} className='form-control' onChange={(event) => setPoolUrl(event.target.value || null) } />
                            </label>
                        </div>

                        {/* POOL - ACCOUNT */}
                        <div className='m-1'>
                            <label className='w-100'>
                                <span>Pool account</span>

                                <input type="text" name="" value={poolUser ?? ''} className='form-control' onChange={(event) => setPoolUser(event.target.value || null) } />
                            </label>
                        </div>
                    </div>

                    {/* MINER */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Miner</span>

                            <div className='input-group'>
                                <select name="" value={minerName ?? ''} className='form-control' onChange={(event) => setMinerName(event.target.value || null)}>
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

                                <select name="" value={minerAlias ?? ''} className='form-control' onChange={(event) => setMinerAlias(event.target.value || null)}>
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

                                <input type="text" name="" value={algo ?? ''} className='form-control' onChange={(event) => setAlgo(event.target.value || null) } />
                            </label>
                        </div>

                        {/* MINER - OPTIONAL ARGS */}
                        <div className='m-1'>
                            <label className='w-100'>
                                <span>Miner optional parameters</span>

                                <input type="text" name="" value={extraArgs ?? ''} className='form-control' onChange={(event) => setExtraArgs(event.target.value || null) } />
                            </label>
                        </div>

                        {/* MINER - WORKER */}
                        <div className='m-1'>
                            <label className='w-100'>
                                <span>Worker</span>

                                <input type="text" name="" value={worker ?? ''} className='form-control' onChange={(event) => setWorker(event.target.value || null) } />
                            </label>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className='m-1 mt-3 text-center'>
                        <button className={`btn btn-primary ${startEnabled ? "" : "disabled"}`} onClick={() => submitStartMiner()}>⚡ Start now</button>
                    </div>

                </form>
            </div>
        </>
    );
};


