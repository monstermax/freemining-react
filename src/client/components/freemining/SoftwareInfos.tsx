
import React, { useContext, useEffect, useState } from 'react';

import { RigStatus } from '../../types_client/freemining';


export const SoftwareTabInfos: React.FC<{ rigStatus: RigStatus, openMinerPopup: (minerName: string) => void }> = function (props) {
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
