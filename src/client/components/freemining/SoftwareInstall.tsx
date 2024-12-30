
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { GlobalContext } from '../../providers/global.provider';

import { installMinerSafe, InstallMinerOptions } from '../../lib/software_install';
import { fetchJson } from '../../lib/utils.client';

import type { RigStatusConfigCoinMiner, RigStatusStatusInstalledMinerAlias } from '../../types_client/freemining';
import { getMinerInstallableVersions } from '../../lib/rig_api';


export const SoftwareInstall: React.FC<{}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();
    const location = useLocation();

    const { appPath, rigHost, rigStatus } = context;

    const selectedCoin: string | null = location.state?.selectedCoin ?? null;

    const _runnableMinersNames: string[] = !rigStatus ? [] : rigStatus.status.installableMiners
        .filter(minerName => rigStatus.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus.status.managedMiners.includes(minerName))
        .filter(minerName => ! selectedCoin ? true : minerName in (rigStatus.config.coinsMiners[selectedCoin] || {}));

    const [runnableMinersNames, setRunnableMinersNames] = useState<string[]>(_runnableMinersNames);

    const _selectedMinerName: string | null = (location.state?.selectedMinerName && runnableMinersNames.includes(location.state?.selectedMinerName)) ? location.state?.selectedMinerName : null;
    const _minersList: [string, RigStatusConfigCoinMiner][] = rigStatus ? runnableMinersNames.map(minerName => [minerName, rigStatus.config.miners[minerName]]) : [];

    const [minersList, setMinersList] = useState<[string, RigStatusConfigCoinMiner][]>(_minersList);
    const [minerName, setMinerName] = useState<string | null>(_selectedMinerName);
    const [minersAliasesList, setMinersAliasesList] = useState<[string, RigStatusStatusInstalledMinerAlias][]>([]); // TODO: verifier qu'il existe pas deja un alias identique quand on lance une nouvelle install
    const [minerAlias, setMinerAlias] = useState<string | null>(null);
    const [minerInstallableVersionsList, setMinerInstallableVersionsList] = useState<string[]>([]);
    const [minerVersion, setMinerVersion] = useState<string | null>(null);
    const [installEnabled, setInstallEnabled] = useState<boolean>(false);

    const submitStartMiner = () => {
        if (! minerName || ! minerAlias) return;
        if (! minerVersion) return;
        if (! rigHost) return;

        const options: InstallMinerOptions = {
            confirmed: true,
            minerVersion,
        };

        installMinerSafe(rigHost, minerName, minerAlias, options);

        navigate(`${appPath}/software`);
    }

    // rigHost and/or rigStatus CHANGED
    useEffect(() => {
        const _minersList: [string, RigStatusConfigCoinMiner][] = rigStatus ? runnableMinersNames.map(minerName => [minerName, rigStatus.config.miners[minerName]]) : [];
        setMinersList(_minersList);

        const _runnableMinersNames: string[] = !rigStatus ? [] : rigStatus.status.installableMiners
            .filter(minerName => rigStatus.status.runnableMiners.includes(minerName))
            .filter(minerName => rigStatus.status.managedMiners.includes(minerName))
            .filter(minerName => ! selectedCoin ? true : minerName in (rigStatus.config.coinsMiners[selectedCoin] || {}));
        setRunnableMinersNames(_runnableMinersNames);

        const _selectedMinerName = (location.state?.selectedMinerName && _runnableMinersNames.includes(location.state?.selectedMinerName)) ? location.state?.selectedMinerName : null;

        if (minerName === location.state?.selectedMinerName && ! _selectedMinerName) {
            setMinerName(null);
        }
    }, [rigHost, rigStatus]);

    useEffect(() => {
        // rigHost and/or minerName CHANGED
        setMinerVersion(null);
        setMinerInstallableVersionsList([]);
        setMinersAliasesList([]);

        if (rigHost && minerName) {
            getMinerInstallableVersions(rigHost, minerName)
                .then((result) => {
                    setMinerInstallableVersionsList(result);
                })
                .catch((err: any) => {
                })

            const _minersAliasesList: [string, RigStatusStatusInstalledMinerAlias][] = Object.values(rigStatus?.status.installedMinersAliases[minerName]?.versions || {}).map(version => [version.alias, version]);
            setMinersAliasesList(_minersAliasesList);
        }


    }, [rigHost, minerName])

    useEffect(() => {
        if (minerInstallableVersionsList.length > 0) {
            setMinerVersion(minerInstallableVersionsList[0])
        }

    }, [rigHost, minerName, minerInstallableVersionsList])

    useEffect(() => {
        const _minerAlias = (minerName && minerVersion) ? `${minerName}-${minerVersion}` : null;
        setMinerAlias(_minerAlias);

    }, [rigHost, minerName, minerVersion])

    useEffect(() => {
        // check if <button ...> must be enabled

        const variables: {[variableName: string]: string | null} = {
            minerName,
            minerAlias,
            minerVersion,
        };

        //for (const variable in variables) {
        //    const ok = !! variables[variable];
        //    if (!ok) console.log(`DEBUG: variable "${variable}" is falsy`)
        //}

        const _installEnabled = ! Object.values(variables).some((variable => ! variable));
        setInstallEnabled(_installEnabled);

    }, [rigHost, minerName, minerAlias, minerVersion])

    return (
        <>
            <div className='d-flex m-2 mt-3'>
                <h2>Install miner</h2>
                {/*
                <button type="button" className="btn-close m-2" aria-label="Close" onClick={() => navigate(`${appPath}/software`)}></button>
                */}
            </div>

            <div className='alert alert-info'>
                <form onSubmit={(event) => event.preventDefault()}>

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
                            </div>
                        </label>
                    </div>

                    {/* MINER VERSION */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Version</span>

                            <div className='input-group'>
                                <select name="" value={minerVersion ?? ''} className='form-control' onChange={(event) => setMinerVersion(event.target.value || null)}>
                                    <option value=""></option>

                                    {minerInstallableVersionsList.map(version => (
                                        <option key={version} value={version}>{minerName} - {version}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                    </div>

                    {/* MINER - ALIAS */}
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Alias</span>

                            <input type="text" name="" value={minerAlias ?? ''} className='form-control' onChange={(event) => setMinerAlias(event.target.value || null) } />
                        </label>
                    </div>

                    {/* SUBMIT */}
                    <div className='m-1 mt-3 text-center'>
                        <button className={`btn btn-primary ${installEnabled ? "" : "disabled"}`} onClick={() => submitStartMiner()}>⚡ Install now</button>
                    </div>

                </form>
            </div>
        </>
    );
};
