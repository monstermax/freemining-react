
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';

import { SoftwareTabRun } from './SoftwareRun';
import { SoftwareTabInstall } from './SoftwareInstall';
import { SoftwareTabInfos } from './SoftwareInfos';
import { SoftwareModal } from './SoftwareModal';
import { useNavigate } from 'react-router-dom';


// @ts-ignore
const bootstrap = window.bootstrap;


const Software: React.FC<{}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();

    const { rigStatus } = context;

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

    const showInstallMiner = (context: GlobalContextType, minerName: string) => {
        if (! context.rigHost) return;
        //console.log(`showInstallMiner ${minerName}`);

        navigate('/mining/software/install');
    };

    const showStartMiner = (context: GlobalContextType, minerName: string) => {
        if (! context.rigHost) return;
        //console.log(`showStartMiner ${minerName}`)

        navigate('/mining/software/run');
    };

    // TODO: changer les tab en routes

    return (
        <>
            <div>
                {!rigStatus && <div className='alert alert-info'>Loading software infos</div>}

                {rigStatus && 
                    <>
                        <div className='m-2 mt-3'>
                            <SoftwareTabInfos rigStatus={rigStatus} openSoftwarePopup={openSoftwarePopup} />
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


