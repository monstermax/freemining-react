
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router";

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';
import { RigStatus } from '../../types_client/freemining';


// @ts-ignore
const bootstrap = window.bootstrap;


const Software: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus, installMiner, uninstallMiner, startMiner, stopMiner } = context;

    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [selectedMinerName, setSelectedMinerName] = useState<string | null>(null);
    //const [selectedMinerAlias, setSelectedMinerAlias] = useState<string | null>(null);
    const [tabName, setTabName] = useState<string>('infos');

    const openMinerPopup = (minerName: string) => {
        setSelectedMinerName(minerName);
        setModalOpened(true);
    }

    const closeMinerPopup = () => {
        const $modal = document.getElementById('modal-miner');

        if ($modal) {
            const modalProducts = bootstrap.Modal.getInstance($modal);

            if (modalProducts) {
                modalProducts.hide();
            }
        }

        setModalOpened(false);
    }

    useEffect(() => {
        if (modalOpened) {
            const $modal = document.getElementById('modal-miner');

            if ($modal) {
                const modalProducts = new bootstrap.Modal($modal, {})
                modalProducts.show();

                $modal.addEventListener('hidden.bs.modal', function (event) {
                    setModalOpened(false);
                });
            }
        }
    }, [modalOpened])

    const showInstallMiner = (context: GlobalContextType, minerName: string) => {
        if (! context.rigHost) return;
        console.log(`showInstallMiner ${minerName}`);

        //setSelectedMinerName(selectedMinerName);
        setTabName('install');
        closeMinerPopup();

        function onSubmit() {
            // TODO
            const minerAlias = `${minerName}-test-todo`; // TODO: a recuperer dans le formulaire

            const options: {[key: string]: any} = { // TODO: a recuperer dans le formulaire
                //version: '',
            };

            installMiner(context, minerName, minerAlias, options);
        }
    };

    const showStartMiner = (context: GlobalContextType, minerName: string) => {
        if (! context.rigHost) return;
        console.log(`showStartMiner ${minerName}`)

        //setSelectedMinerName(selectedMinerName);
        setTabName('run');
        closeMinerPopup();

        function onSubmit() {
            // TODO
            const minerAlias = `${minerName}-test-todo`; // TODO: a recuperer dans le formulaire

            const options: {[key: string]: any} = { // TODO: a recuperer dans le formulaire
            };

            startMiner(context, minerName, minerAlias, options);
        }
    };


    return (
        <>
            <h1 className='h3'>
                Software
            </h1>

            <hr />

            <div>
                {!rigStatus && <div className='alert alert-info'>Loading software infos</div>}

                {rigStatus && 
                    <>
                        {/*
                        <div>
                            <button onClick={() => setTabName('infos')}>infos</button>
                            <button onClick={() => setTabName('run')}>run</button>
                            <button onClick={() => setTabName('install')}>install</button>
                        </div>
                        */}

                        <div>
                            {tabName === 'infos' && (
                                <SoftwareTabInfos rigStatus={rigStatus} openMinerPopup={openMinerPopup} />
                            )}

                            {tabName === 'run' && (
                                <>
                                    {!selectedMinerName && <>Error: missing selectedMinerName</>}

                                    {selectedMinerName && (
                                        <>
                                            <SoftwareTabRun selectedMinerName={selectedMinerName} setTabName={setTabName} />
                                        </>
                                    )}
                                </>
                            )}

                            {tabName === 'install' && (
                                <>
                                    {!selectedMinerName && <>Error: missing selectedMinerName</>}

                                    {selectedMinerName && (
                                        <>
                                            <SoftwareTabInstall selectedMinerName={selectedMinerName} setTabName={setTabName} />
                                        </>
                                    )}
                                </>
                            )}
                        </div>


                        {modalOpened && selectedMinerName && (
                            <>
                                <SoftwareMinerModal selectedMinerName={selectedMinerName} showInstallMiner={showInstallMiner} showStartMiner={showStartMiner} />
                            </>
                        )}
                    </>
                }
            </div>


        </>
    );
};



const SoftwareTabInfos: React.FC<{ rigStatus: RigStatus, openMinerPopup: (minerName: string) => void }> = function (props) {
    const rigStatus = props.rigStatus;
    const openMinerPopup = props.openMinerPopup;

    return (
        <>
            <div className='alert alert-info'>
                <label>
                    <h2 className='h4'>Running Miners</h2>
                    {rigStatus.status.runningMiners.map(minerName => {
                        return (
                            <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => openMinerPopup(minerName)}>{minerName}</span>
                        );
                    })}
                </label>
            </div>

            <div className='alert alert-info'>
                <label>
                    <h2 className='h4'>Installed Miners</h2>
                    {rigStatus.status.installedMiners.map(minerName => {
                        return (
                            <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => openMinerPopup(minerName)}>{minerName}</span>
                        );
                    })}
                </label>
            </div>

            <div className='alert alert-info'>
                <label>
                    <h2 className='h4'>Installable Miners</h2>
                    {rigStatus.status.installableMiners.map(minerName => {
                        return (
                            <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => openMinerPopup(minerName)}>{minerName}</span>
                        );
                    })}
                </label>
            </div>
        </>
    );
};



const SoftwareTabInstall: React.FC<{selectedMinerName: string, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const selectedMinerName = props.selectedMinerName;
    const setTabName = props.setTabName;

    return (
        <>
            <button onClick={() => setTabName('infos')}>back</button>
            <br />
            install miner {selectedMinerName}
        </>
    );
};


const SoftwareTabRun: React.FC<{selectedMinerName: string, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const selectedMinerName = props.selectedMinerName;
    const setTabName = props.setTabName;

    return (
        <>
            <button onClick={() => setTabName('infos')}>back</button>
            <br />
            run miner {selectedMinerName}

            <form onSubmit={(event) => event.preventDefault()}>
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Coin</span>
                        <select name="" className='form-control'>
                            <option value=""></option>
                        </select>
                    </label>
                </div>
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Wallet</span>
                        <select name="" className='form-control'>
                            <option value=""></option>
                        </select>
                    </label>
                </div>
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Pool</span>
                        <div className='input-group'>
                            <select name="" className='form-control'>
                                <option value=""></option>
                            </select>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => document.getElementById('run-miner-pool-details')?.classList.toggle('d-none')}>...</button>
                        </div>
                    </label>
                </div>
                <div id="run-miner-pool-details" className='d-none'>
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Pool url</span>
                            <input type="text" className='form-control' />
                        </label>
                    </div>
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Pool account</span>
                            <input type="text" className='form-control' />
                        </label>
                    </div>
                </div>
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Miner</span>
                        <div className='input-group'>
                            <select name="" className='form-control'>
                                <option value=""></option>
                            </select>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => document.getElementById('run-miner-miner-details')?.classList.toggle('d-none')}>...</button>
                        </div>
                    </label>
                </div>
                <div id="run-miner-miner-details" className='d-none'>
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Alias</span>
                            <select name="" className='form-control'>
                                <option value=""></option>
                            </select>
                        </label>
                    </div>
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Algo</span>
                            <select name="" className='form-control'>
                                <option value=""></option>
                            </select>
                        </label>
                    </div>
                    <div className='m-1'>
                        <label className='w-100'>
                            <span>Miner optional parameters</span>
                            <input type="text" className='form-control' />
                        </label>
                    </div>
                </div>
                <div className='m-1'>
                    <label className='w-100'>
                        <span>Worker</span>
                        <input type="text" className='form-control' />
                    </label>
                </div>
            </form>
        </>
    );
};




const SoftwareMinerModal: React.FC<{ selectedMinerName: string, showInstallMiner: (context: GlobalContextType, minerName: string) => void, showStartMiner: (context: GlobalContextType, minerName: string) => void }> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const selectedMinerName = props.selectedMinerName;
    const showInstallMiner = props.showInstallMiner;
    const showStartMiner = props.showStartMiner;

    const { rigStatus, uninstallMiner, stopMiner } = context;

    const labelYes = <div className='badge bg-success m-1'>YES</div>
    const labelNo = <div className='badge bg-danger m-1'>NO</div>

    return (
        <>
            <div id="modal-miner" className='modal show'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {selectedMinerName}

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <div className='p-3'>
                                {!(rigStatus && selectedMinerName) && <>Loading miner infos</>}

                                {selectedMinerName && rigStatus && (
                                    <>
                                        <ul>
                                            <li>
                                                installable: {rigStatus.status.installableMiners.includes(selectedMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.installableMiners.includes(selectedMinerName) && (
                                                    <>
                                                        <button className={`btn btn-primary btn-sm m-1 ${rigStatus.status.installedMiners.includes(selectedMinerName) ? "disabled" : ""}`} onClick={() => showInstallMiner(context, selectedMinerName)}>install...</button>
                                                    </>
                                                )}
                                            </li>
                                            <li>
                                                installed: {rigStatus.status.installedMiners.includes(selectedMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.installedMiners.includes(selectedMinerName) && (
                                                    <>
                                                        {Object.keys(rigStatus.status.installedMinersAliases[selectedMinerName].versions).map(minerAlias => {
                                                            return (
                                                                <button key={minerAlias} className={`btn btn-primary btn-sm m-1 ${rigStatus.status.runningMiners.includes(selectedMinerName) ? "disabled" : ""}`} onClick={() => uninstallMiner(context, selectedMinerName, minerAlias || '')}>uninstall {minerAlias}</button>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </li>
                                            <li>managed: {rigStatus.status.managedMiners.includes(selectedMinerName) ? labelYes : labelNo}</li>
                                            <li>
                                                runnable: {rigStatus.status.runnableMiners.includes(selectedMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.runnableMiners.includes(selectedMinerName) && (
                                                    <>
                                                        <button className={`btn btn-primary btn-sm m-1 ${((!rigStatus.status.installedMiners.includes(selectedMinerName)) || rigStatus.status.runningMiners.includes(selectedMinerName)) ? "disabled" : ""}`} onClick={() => showStartMiner(context, selectedMinerName)}>start...</button>
                                                    </>
                                                )}
                                            </li>
                                            <li>
                                                running: {rigStatus.status.runningMiners.includes(selectedMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.runningMiners.includes(selectedMinerName) && (
                                                    <>
                                                        {Object.values(rigStatus.status.runningMinersAliases[selectedMinerName]).map(minerInstance => {
                                                            return (
                                                                <button key={minerInstance.alias} className='btn btn-primary btn-sm m-1' onClick={() => stopMiner(context, selectedMinerName, minerInstance.alias)}>stop {minerInstance.alias}</button>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};



export default Software;



