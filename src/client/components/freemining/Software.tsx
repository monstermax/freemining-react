
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';

import { SoftwareModal } from './SoftwareModal';
import { useNavigate } from 'react-router-dom';


// @ts-ignore
const bootstrap = window.bootstrap;


const Software: React.FC<{}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();

    const { appPath, rigStatus } = context;

    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const [selectedMinerName, setSelectedMinerName] = useState<string | null>(null);
    //const [selectedPool, setSelectedPool] = useState<string | null>(null);

    const openSoftwarePopup = (minerName: string) => {
        setSelectedMinerName(minerName);
        setModalOpened(true);
    }

    const closeSoftwarePopup = () => {
        const $modal = document.getElementById('modal-miner');

        if ($modal) {
            const modalProducts = bootstrap.Modal.getInstance($modal);

            if (modalProducts) {
                modalProducts.hide();
            }
        }

        setModalOpened(false);
        setSelectedMinerName(null);
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

    const showInstallMiner = (context: GlobalContextType, minerName: string, coin?: string) => {
        if (! context.rigHost) return;
        //console.log(`showInstallMiner ${minerName}`);

        closeSoftwarePopup();
        navigate(`${appPath}/software/install`, { state: { selectedMinerName: minerName, selectedCoin: coin } });
    };

    const showStartMiner = (context: GlobalContextType, minerName: string, coin?: string) => {
        if (! context.rigHost) return;
        //console.log(`showStartMiner ${minerName}`)

        closeSoftwarePopup();
        navigate(`${appPath}/software/run`, { state: { selectedMinerName: minerName, selectedCoin: coin } });
    };


    const runnableMinersNames: string[] = !rigStatus ? [] : rigStatus?.status.installableMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));


    const installablesMiners = (! rigStatus) ? [] : rigStatus.status.installableMiners
        .filter(minerName => runnableMinersNames.includes(minerName));

    const changeTab = (tabName: string, selectedMinerName?: string | null) => {
        navigate(`${appPath}/software/${tabName}`, { state: { selectedMinerName } });
    }

    return (
        <>
            <div>
                {!rigStatus && <div className='alert alert-info'>Loading software infos</div>}

                {rigStatus && 
                    <>
                        <div className='m-2 mt-3'>
                            <div className='m-1'>
                                <div>
                                    {installablesMiners.map(minerName => {
                                        return (
                                            <div key={minerName} className='alert alert-info p-2 my-2'>
                                                <div className='d-flex'>
                                                    <h2 className='h4 cursor-default'>
                                                        <span>{minerName}</span>
                                                        <span className='m-1 pointer' onClick={() => openSoftwarePopup(minerName)}>ⓘ</span>
                                                    </h2>

                                                    <div className='ms-auto'>
                                                        <div className='btn-group'>
                                                            {rigStatus.status.runningMiners.includes(minerName) && (
                                                                <>
                                                                    <button type="button" className="btn btn-success btn-sm cursor-default">running</button>

                                                                    <button type="button" className="btn btn-success btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                            {!rigStatus.status.runningMiners.includes(minerName) && rigStatus.status.installedMiners.includes(minerName) && (
                                                                <>
                                                                    <button type="button" className="btn btn-info btn-sm cursor-default">installed</button>

                                                                    <button type="button" className="btn btn-info btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                            {!rigStatus.status.runningMiners.includes(minerName) && !rigStatus.status.installedMiners.includes(minerName) && (
                                                                <>
                                                                    <button type="button" className="btn btn-warning btn-sm cursor-default">installable</button>

                                                                    <button type="button" className="btn btn-warning btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                                    </button>
                                                                </>
                                                            )}

                                                            <ul className="dropdown-menu">
                                                                {rigStatus.status.installedMiners.includes(minerName) && (
                                                                    <li>
                                                                        <span className='dropdown-item pointer' onClick={() => changeTab('run', minerName)}>run...</span>
                                                                    </li>
                                                                )}

                                                                {rigStatus.status.runningMiners.includes(minerName) && (
                                                                    <li>
                                                                        <span className='dropdown-item pointer' onClick={() => openSoftwarePopup(minerName)}>stop...</span>
                                                                    </li>
                                                                )}

                                                                {(rigStatus.status.installedMiners.includes(minerName) || rigStatus.status.runningMiners.includes(minerName)) && (
                                                                    <li>
                                                                        <hr className="dropdown-divider" />
                                                                    </li>
                                                                )}

                                                                <li>
                                                                    <span className='dropdown-item pointer' onClick={() => changeTab('install', minerName)}>install...</span>
                                                                </li>

                                                                {rigStatus.status.installedMiners.includes(minerName) && (
                                                                    <li>
                                                                        <span className='dropdown-item pointer' onClick={() => openSoftwarePopup(minerName)}>uninstall...</span>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className='alert alert-info p-2'>
                                    <a className='btn btn-primary btn-sm m-1' onClick={() => changeTab('run')}>Run miner...</a>
                                    <a className='btn btn-primary btn-sm m-1' onClick={() => changeTab('install')}>Install miner...</a>
                                </div>
                            </div>
                        </div>

                        {modalOpened && selectedMinerName && (
                            <>
                                <SoftwareModal selectedMinerName={selectedMinerName} closeSoftwarePopup={closeSoftwarePopup} showInstallMiner={showInstallMiner} showStartMiner={showStartMiner} />
                            </>
                        )}
                    </>
                }
            </div>

        </>
    );
};



export default Software;


