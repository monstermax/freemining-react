
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';

import { SoftwareTabRun } from './SoftwareRun';
import { SoftwareTabInstall } from './SoftwareInstall';
import { SoftwareTabInfos } from './SoftwareInfos';
import { SoftwareModal } from './SoftwareModal';


// @ts-ignore
const bootstrap = window.bootstrap;


const Software: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus, installMiner, uninstallMiner, startMiner, stopMiner } = context;

    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const [selectedMinerName, setSelectedMinerName] = useState<string | null>(null);
    //const [selectedPool, setSelectedPool] = useState<string | null>(null);
    const [tabName, setTabName] = useState<string>('infos');

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
        //console.log(`showInstallMiner ${minerName}`);

        setSelectedMinerName(minerName);
        setTabName('install');
        closeSoftwarePopup();
    };

    const showStartMiner = (context: GlobalContextType, minerName: string) => {
        if (! context.rigHost) return;
        //console.log(`showStartMiner ${minerName}`)

        setSelectedMinerName(minerName);
        setTabName('run');
        closeSoftwarePopup();
    };


    return (
        <>
            <div>
                {!rigStatus && <div className='alert alert-info'>Loading software infos</div>}

                {rigStatus && 
                    <>
                        {/*
                        <div>
                            <button onClick={() => setTabName('infos')}>infos</button>
                            <button onClick={() => setTabName('install')}>install</button>
                            <button onClick={() => setTabName('run')}>run</button>
                        </div>
                        */}

                        <div className='m-2 mt-3'>
                            {tabName === 'infos' && (
                                <SoftwareTabInfos rigStatus={rigStatus} selectedMinerName={selectedMinerName} setSelectedMinerName={setSelectedMinerName} openSoftwarePopup={openSoftwarePopup} closeSoftwarePopup={closeSoftwarePopup} setTabName={setTabName} />
                            )}

                            {tabName === 'run' && (
                                <>
                                    <SoftwareTabRun selectedCoin={selectedCoin} selectedMinerName={selectedMinerName} closeSoftwarePopup={closeSoftwarePopup} setTabName={setTabName} />
                                </>
                            )}

                            {tabName === 'install' && (
                                <>
                                    <SoftwareTabInstall selectedMinerName={selectedMinerName} closeSoftwarePopup={closeSoftwarePopup} setTabName={setTabName} />
                                </>
                            )}
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


