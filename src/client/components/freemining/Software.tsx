
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
                                <SoftwareModal selectedMinerName={selectedMinerName} showInstallMiner={showInstallMiner} showStartMiner={showStartMiner} />
                            </>
                        )}
                    </>
                }
            </div>


        </>
    );
};



export default Software;


