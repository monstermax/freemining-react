

import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';



export const SoftwareModal: React.FC<{ selectedMinerName: string, closeSoftwarePopup: () => void, showInstallMiner: (context: GlobalContextType, minerName: string) => void, showStartMiner: (context: GlobalContextType, minerName: string) => void }> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigStatus, uninstallMiner, stopMiner } = context;

    const selectedMinerName = props.selectedMinerName ?? null;
    const showInstallMiner = props.showInstallMiner;
    const showStartMiner = props.showStartMiner;
    const closeSoftwarePopup = props.closeSoftwarePopup;

    const submitStopMiner = (context: GlobalContextType, minerName: string, minerAlias: string) => {
        stopMiner(context, minerName, minerAlias);
        closeSoftwarePopup();
    }

    const submitUninstallMiner = (context: GlobalContextType, minerName: string, minerAlias: string) => {
        uninstallMiner(context, minerName, minerAlias);
        closeSoftwarePopup();
    }


    const labelYes = <div className='badge bg-success m-1'>YES</div>
    const labelNo = <div className='badge bg-danger m-1'>NO</div>

    return (
        <>
            <div id="modal-miner" className='modal show'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className='h4'>{selectedMinerName}</h2>

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
                                                        <button className={`btn btn-primary btn-sm m-1`} onClick={() => showInstallMiner(context, selectedMinerName)}>install...</button>
                                                    </>
                                                )}
                                            </li>

                                            <li>
                                                installed: {rigStatus.status.installedMiners.includes(selectedMinerName) ? labelYes : labelNo}

                                                {rigStatus.status.installedMiners.includes(selectedMinerName) && (
                                                    <>
                                                        {Object.keys(rigStatus.status.installedMinersAliases[selectedMinerName].versions).map(minerAlias => {
                                                            //const isRunning = rigStatus.status.runningMiners.includes(selectedMinerName);
                                                            const isRunning = Object.values(rigStatus.status.runningMinersAliases[selectedMinerName] || {}).filter(instanceDetails => instanceDetails.alias === minerAlias).length > 0;

                                                            return (
                                                                <button key={minerAlias} className={`btn btn-primary btn-sm m-1 ${isRunning ? "disabled" : ""}`} onClick={() => submitUninstallMiner(context, selectedMinerName, minerAlias)}>💥 uninstall {minerAlias}</button>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </li>

                                            {/*
                                            <li>managed: {rigStatus.status.managedMiners.includes(selectedMinerName) ? labelYes : labelNo}</li>
                                            */}

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
                                                                <button key={minerInstance.alias} className='btn btn-primary btn-sm m-1' onClick={() => submitStopMiner(context, selectedMinerName, minerInstance.alias)}>💥 stop {minerInstance.alias}</button>
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
