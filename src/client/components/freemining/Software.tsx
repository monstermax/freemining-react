
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router";

import { GlobalContext } from '../../providers/global.provider';


// @ts-ignore
const bootstrap = window.bootstrap;


const Software: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus, installMiner, uninstallMiner, startMiner, stopMiner, showInstallMiner, showUninstallMiner, showStartMiner, showStopMiner } = context;

    const [modalMinerName, setModalMinerName] = useState<string | null>(null);

    const minerClick = (minerName: string) => {
        setModalMinerName(minerName);

        const modalProducts = new bootstrap.Modal(document.getElementById('modal-miner'), {})
        modalProducts.show();
    }

    const labelYes = <div className='badge bg-success m-1'>YES</div>
    const labelNo = <div className='badge bg-danger m-1'>NO</div>

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
                        <div className='alert alert-info'>
                            <label>
                                <h2 className='h4'>Installable Miners</h2>
                                {rigStatus.status.installableMiners.map(minerName => {
                                    return (
                                        <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => minerClick(minerName)}>{minerName}</span>
                                    );
                                })}
                            </label>
                        </div>

                        <div className='alert alert-info'>
                            <label>
                                <h2 className='h4'>Installed Miners</h2>
                                {rigStatus.status.installedMiners.map(minerName => {
                                    return (
                                        <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => minerClick(minerName)}>{minerName}</span>
                                    );
                                })}
                            </label>
                        </div>

                        <div className='alert alert-info'>
                            <label>
                                <h2 className='h4'>Running Miners</h2>
                                {rigStatus.status.runningMiners.map(minerName => {
                                    return (
                                        <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => minerClick(minerName)}>{minerName}</span>
                                    );
                                })}
                            </label>
                        </div>
                    </>
                }
            </div>


            <div id="modal-miner" className='modal'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {modalMinerName}

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <div className='p-3'>
                                {! (modalMinerName && rigStatus) && <>Loading miner infos</>}

                                {modalMinerName && rigStatus && (
                                    <>
                                        <ul>
                                            <li>
                                                installable: {rigStatus.status.installableMiners.includes(modalMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.installableMiners.includes(modalMinerName) && (
                                                    <>
                                                        <button className={`btn btn-primary btn-sm m-1 ${rigStatus.status.installedMiners.includes(modalMinerName) ? "disabled" : ""}`} onClick={() => showInstallMiner(context, modalMinerName)}>install</button>
                                                    </>
                                                )}
                                            </li>
                                            <li>
                                                installed: {rigStatus.status.installedMiners.includes(modalMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.installedMiners.includes(modalMinerName) && (
                                                    <>
                                                        <button className={`btn btn-primary btn-sm m-1 ${rigStatus.status.runningMiners.includes(modalMinerName) ? "disabled" : ""}`} onClick={() => showUninstallMiner(context, modalMinerName)}>uninstall</button>
                                                    </>
                                                )}
                                            </li>
                                            <li>managed: {rigStatus.status.managedMiners.includes(modalMinerName) ? labelYes : labelNo}</li>
                                            <li>
                                                runnable: {rigStatus.status.runnableMiners.includes(modalMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.runnableMiners.includes(modalMinerName) && (
                                                    <>
                                                        <button className={`btn btn-primary btn-sm m-1 ${((!rigStatus.status.installedMiners.includes(modalMinerName)) || rigStatus.status.runningMiners.includes(modalMinerName)) ? "disabled" : ""}`} onClick={() => showStartMiner(context, modalMinerName)}>start</button>
                                                    </>
                                                )}
                                            </li>
                                            <li>
                                                running: {rigStatus.status.runningMiners.includes(modalMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.runningMiners.includes(modalMinerName) && (
                                                    <>
                                                        {Object.keys(rigStatus.status.runningMinersAliases[modalMinerName]).map(minerAlias => {
                                                            return (
                                                                    <button key={minerAlias} className='btn btn-primary btn-sm m-1' onClick={() => stopMiner(context, modalMinerName, minerAlias)}>stop {minerAlias}</button>
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



