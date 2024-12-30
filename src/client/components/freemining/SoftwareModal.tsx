

import React, { useContext } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';
import { stopMinerSafe } from '../../lib/software_run';
import { uninstallMinerSafe } from '../../lib/software_install';



export const SoftwareModal: React.FC<{ selectedMinerName: string, closeSoftwarePopup: () => void, showInstallMiner: (minerName: string, coin?: string) => void, showStartMiner: (minerName: string, coin?: string) => void }> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const selectedMinerName = props.selectedMinerName ?? null;
    const showInstallMiner = props.showInstallMiner;
    const showStartMiner = props.showStartMiner;
    const closeSoftwarePopup = props.closeSoftwarePopup;

    const minerCoins = Object.entries(rigStatus?.config.coinsMiners || {}).filter(coinEntry => Object.keys(coinEntry[1]).includes(selectedMinerName)).map(coinEntry => coinEntry[0]);

    const runnableInstalledMinersNames: string[] = !rigStatus ? [] : rigStatus?.status.installedMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));

    const isRunnable = runnableInstalledMinersNames.includes(selectedMinerName) || false;

    const submitStopMiner = (minerName: string, minerAlias: string) => {
        if (rigHost) {
            stopMinerSafe(rigHost, minerName, minerAlias);
        }
        closeSoftwarePopup();
    }

    const submitUninstallMiner = (minerName: string, minerAlias: string) => {
        if (rigHost) {
            uninstallMinerSafe(rigHost, minerName, minerAlias);
        }
        closeSoftwarePopup();
    }


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
                            <div className='p-1'>
                                {!(rigStatus && selectedMinerName) && <>Loading miner infos</>}

                                {selectedMinerName && rigStatus && (
                                    <div>

                                        <div className='my-2 alert alert-info pb-1'>
                                            <h3 className='h5 cursor-default'>Coins</h3>

                                            {minerCoins.length === 0 && (
                                                <>
                                                    no coin available
                                                </>
                                            )}

                                            {minerCoins.map(coin => {
                                                return (
                                                    <div key={coin} className={`badge bg-info m-1 ${isRunnable ? "pointer" : "cursor-default"}`} onClick={() => { if (isRunnable) { showStartMiner(selectedMinerName, coin); }}}>
                                                        <img src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '16px' }} />

                                                        <span className='m-2'>{coin}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className='d-flex justify-content-around pb-1'>
                                            <div className='my-2 alert alert-info me-1' style={{ flexGrow:1 }}>
                                                <h3 className='h5 cursor-default'>Install</h3>

                                                <div>
                                                    {!rigStatus.status.installableMiners.includes(selectedMinerName) && (
                                                        <>
                                                            <div className='badge bg-warning m-1 cursor-default'>Not installable</div>
                                                        </>
                                                    )}

                                                    {rigStatus.status.installableMiners.includes(selectedMinerName) && (
                                                        <>
                                                            <button className={`btn btn-primary btn-sm m-1`} onClick={() => showInstallMiner(selectedMinerName)}>install...</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='my-2 alert alert-info ms-1' style={{ flexGrow:1 }}>
                                                <h3 className='h5 cursor-default'>Run</h3>

                                                {!rigStatus.status.installedMiners.includes(selectedMinerName) && (
                                                    <>
                                                        <div className='badge bg-warning m-1 cursor-default'>Not installed</div>
                                                    </>
                                                )}

                                                {rigStatus.status.installedMiners.includes(selectedMinerName) && !runnableInstalledMinersNames.includes(selectedMinerName) && (
                                                    <>
                                                        <div className='badge bg-warning m-1 cursor-default'>Not runnable</div>
                                                    </>
                                                )}

                                                <div>
                                                    {runnableInstalledMinersNames.includes(selectedMinerName) && (
                                                        <>
                                                            <button className={`btn btn-primary btn-sm m-1`} onClick={() => showStartMiner(selectedMinerName)}>start...</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>


                                        <div className='d-flex justify-content-around pb-1'>
                                            <div className='my-2 alert alert-info me-1' style={{ flexGrow:1 }}>
                                                <h3 className='h5 cursor-default'>Uninstall</h3>

                                                {!rigStatus.status.installedMiners.includes(selectedMinerName) && (
                                                    <>
                                                        <div className='badge bg-warning m-1 cursor-default'>Not installed</div>
                                                    </>
                                                )}

                                                <div>
                                                    {rigStatus.status.installedMiners.includes(selectedMinerName) && (
                                                        <>
                                                            {Object.keys(rigStatus.status.installedMinersAliases[selectedMinerName]?.versions || {}).map(minerAlias => {
                                                                const isRunning = Object.values(rigStatus.status.runningMinersAliases[selectedMinerName] || {}).filter(instanceDetails => instanceDetails.alias === minerAlias).length > 0;

                                                                return (
                                                                    <button key={minerAlias} className={`btn btn-danger btn-sm m-1 ${isRunning ? "disabled" : ""}`} onClick={() => submitUninstallMiner(selectedMinerName, minerAlias)}>
                                                                        💥 uninstall {minerAlias}
                                                                    </button>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='my-2 alert alert-info ms-1' style={{ flexGrow:1 }}>
                                                <h3 className='h5 cursor-default'>Stop</h3>

                                                {!rigStatus.status.runningMiners.includes(selectedMinerName) && (
                                                    <>
                                                        <div className='badge bg-warning m-1 cursor-default'>Not running</div>
                                                    </>
                                                )}

                                                <div>
                                                    {rigStatus.status.runningMiners.includes(selectedMinerName) && (
                                                        <>
                                                            {Object.values(rigStatus.status.runningMinersAliases[selectedMinerName] || {}).map(minerInstance => {
                                                                return (
                                                                    <button key={minerInstance.alias} className='btn btn-danger btn-sm m-1' onClick={() => submitStopMiner(selectedMinerName, minerInstance.alias)}>
                                                                        💥 stop {minerInstance.alias}
                                                                    </button>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
