
import React, { useContext } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { formatNumber } from '../../lib/utils.client';


export const Home: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Conext GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const runningMiners = Object.keys(rigStatus?.status.minersStats || {}).length;

    return (
        <>
            <div className='alert alert-info m-2 mt-3' style={{ fontSize: "1.2em" }}>
                <ul className='list-group'>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>Rig connection:</span>
                        <span>{rigHost}</span>
                    </li>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>Rig name:</span>
                        <span>{rigStatus?.rig.name}</span>
                    </li>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>Host name:</span>
                        <span>{rigStatus?.rig.hostname}</span>
                    </li>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>IP:</span>
                        <span>{rigStatus?.rig.ip}</span>
                    </li>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>OS:</span>
                        <span>{rigStatus?.rig.os}</span>
                    </li>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>Uptime:</span>
                        <span>{rigStatus ? formatNumber(rigStatus.usage.uptime, 'seconds') : '-'}</span>
                    </li>
                    <li className='list-group-item truncate cursor-default'>
                        <span className='bold me-2'>Status:</span>
                        <span>
                            {runningMiners === 0 && (
                                <div className='badge bg-warning'>idle</div>
                            )}

                            {runningMiners > 0 && (
                                <div className='badge bg-success'>{runningMiners} active miners</div>
                            )}
                        </span>
                    </li>
                </ul>
            </div>
        </>
    );
};

