
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';

import type { RigStatusConfigCoinMiner, RigStatusStatusInstalledMinerAlias } from '../../types_client/freemining';
import { installMiner, InstallMinerOptions } from '../../lib/software_install';
import { Link } from 'react-router-dom';
import { fetchJson } from '../../lib/utils.client';


// TODO: a deplacer dans une route autonome : /mining/software/install


export const SoftwareTabInstall: React.FC<{selectedMinerName?: string | null, closeSoftwarePopup: () => void, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const runnableMinersNames: string[] = !rigStatus ? [] : rigStatus?.status.installableMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));

    const selectedMinerName = (props.selectedMinerName && runnableMinersNames.includes(props.selectedMinerName)) ? props.selectedMinerName : null;
    const setTabName = props.setTabName;
    const closeSoftwarePopup = props.closeSoftwarePopup;

    const [minersList, setMinersList] = useState<[string, RigStatusConfigCoinMiner][]>(rigStatus ? runnableMinersNames.map(minerName => [minerName, rigStatus.config.miners[minerName]]) : []);
    const [minerName, setMinerName] = useState<string | null>(selectedMinerName);
    const [minersAliasesList, setMinersAliasesList] = useState<[string, RigStatusStatusInstalledMinerAlias][]>([]);
    const [minerAlias, setMinerAlias] = useState<string | null>(null);
    const [minerInstallableVersionsList, setMinerInstallableVersionsList] = useState<string[]>([]);
    const [minerVersion, setMinerVersion] = useState<string | null>(null);
    const [installEnabled, setInstallEnabled] = useState<boolean>(false);

    const submitStartMiner = () => {
        if (! minerName || ! minerAlias) return;
        if (! minerVersion) return;

        const options: InstallMinerOptions = {
            confirmed: true,
            minerVersion,
        };

        installMiner(context, minerName, minerAlias, options);

        setTabName('infos');
    }

    useEffect(() => {
        setMinerVersion(null);
        setMinerInstallableVersionsList([]);

        if (minerName) {
            const url = `http://${rigHost}/rig/config/miners/${minerName}/installable-versions`;

            fetchJson<string[]>(url, { useProxy: true })
                .then((result) => {
                    setMinerInstallableVersionsList(result?.data || []);
                })
                .catch((err: any) => {
                })
        }

    }, [rigHost, minerName])

    useEffect(() => {
        if (minerInstallableVersionsList.length > 0) {
            setMinerVersion(minerInstallableVersionsList[0])
        }

    }, [rigHost, minerName, minerInstallableVersionsList])

    useEffect(() => {
        const _minerAlias = (minerName && minerVersion) ? `${minerName}-${minerVersion}` : '';
        setMinerAlias(_minerAlias);

    }, [rigHost, minerName, minerVersion])

    useEffect(() => {
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
                <button type="button" className="btn-close m-2" aria-label="Close" onClick={() => setTabName('infos')}></button>
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
