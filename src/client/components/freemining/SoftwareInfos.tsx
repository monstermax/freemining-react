
import React, { useContext, useEffect, useState } from 'react';

import { RigStatus } from '../../types_client/freemining';
import { Link, useNavigate } from 'react-router-dom';


export const SoftwareTabInfos: React.FC<{ rigStatus: RigStatus, openSoftwarePopup: (minerName: string) => void }> = function (props) {
    const rigStatus = props.rigStatus;

    const navigate = useNavigate();

    const runnableMinersNames: string[] = !rigStatus ? [] : rigStatus?.status.installableMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));

    const openSoftwarePopup = props.openSoftwarePopup;

    const installablesMiners = (! rigStatus) ? [] : rigStatus.status.installableMiners
        .filter(minerName => runnableMinersNames.includes(minerName));

    const changeTab = (tabName: string, selectedMinerName?: string | null) => {
        navigate(`/mining/software/${tabName}`, { state: { selectedMinerName } });
    }

    return (
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
    );
};
