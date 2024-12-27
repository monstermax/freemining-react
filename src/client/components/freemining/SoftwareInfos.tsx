
import React, { useContext, useEffect, useState } from 'react';

import { RigStatus } from '../../types_client/freemining';
import { Link } from 'react-router-dom';


export const SoftwareTabInfos: React.FC<{ rigStatus: RigStatus, selectedMinerName?: string | null, setSelectedMinerName: React.Dispatch<React.SetStateAction<string | null>>, openSoftwarePopup: (minerName: string) => void, closeSoftwarePopup: () => void, setTabName: React.Dispatch<React.SetStateAction<string>> }> = function (props) {
    const rigStatus = props.rigStatus;

    const runnableMinersNames: string[] = !rigStatus ? [] : rigStatus?.status.installableMiners
        .filter(minerName => rigStatus?.status.runnableMiners.includes(minerName))
        .filter(minerName => rigStatus?.status.managedMiners.includes(minerName));

    const selectedMinerName = props.selectedMinerName ?? null;
    const openSoftwarePopup = props.openSoftwarePopup;
    const closeSoftwarePopup = props.closeSoftwarePopup;
    const setTabName = props.setTabName;
    const setSelectedMinerName = props.setSelectedMinerName;

    const installablesMiners = (! rigStatus) ? [] : rigStatus.status.installableMiners
        .filter(minerName => ! rigStatus?.status.installedMiners.includes(minerName))
        .filter(minerName => runnableMinersNames.includes(minerName));

    const changeTab = (tabName: string, _selectedMinerName?: string | null) => {
        setSelectedMinerName(_selectedMinerName ?? null);
        setTabName(tabName);
    }

    return (
        <>
            <div className='alert alert-info'>
                <h2 className='h4'>Running Miners</h2>

                <div className='m-2'>
                    {rigStatus.status.runningMiners.map(minerName => {
                        return (
                            <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => openSoftwarePopup(minerName)}>{minerName}</span>
                        );
                    })}
                </div>
            </div>

            <div className='alert alert-info'>
                <h2 className='h4'>Installed Miners</h2>

                <div className='m-2'>
                    {rigStatus.status.installedMiners.map(minerName => {
                        return (
                            <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => openSoftwarePopup(minerName)}>{minerName}</span>
                        );
                    })}
                </div>

                <a className='btn btn-primary btn-sm' onClick={() => changeTab('run')}>Run miner...</a>
            </div>

            <div className='alert alert-info'>
                <h2 className='h4'>Installable Miners</h2>

                <div className='m-2'>
                    {installablesMiners.map(minerName => {
                        return (
                            <span key={minerName} className='badge bg-secondary m-1 pointer' onClick={() => changeTab('install', minerName)}>{minerName}</span>
                        );
                    })}
                </div>

                <a className='btn btn-primary btn-sm' onClick={() => changeTab('install')}>Install miner...</a>
            </div>
        </>
    );
};
