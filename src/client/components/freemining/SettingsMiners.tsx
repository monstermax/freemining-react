
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';



export const SettingsMiners: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    const [miners, setMiners] = useState<{[minerName: string]: { extraArgs?: string, sampleArgs?: string }}>(rigStatus?.config.miners ?? {});


    return (
        <div>
            <h2 className='h4'>Miners configuration</h2>

            <div>
                {Object.entries(miners).map(minerEntry => {
                    const [minerName, minerConfig] = minerEntry;

                    const [showCoinDetails, setShowCoinDetails] = useState(false);

                    return (
                        <div key={minerName} className='alert alert-info m-2 pb-0'>
                            <div className='d-flex pointer' onClick={() => setShowCoinDetails(!showCoinDetails)}>
                                <h3 className='h5 m-1'>{minerName}</h3>

                                <div className='ms-auto'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <table className={`table mt-1 ${showCoinDetails ? "" : "d-none"}`}>
                                <tr>
                                    <td className='cursor-default'>Optional arguments</td>
                                    <td><input type="text" className='form-control' defaultValue={minerConfig.extraArgs} placeholder={minerConfig.sampleArgs} /></td>
                                </tr>
                                <tr>
                                    <td className='cursor-default'>Sample arguments</td>
                                    <td><input type="text" className='form-control' defaultValue={minerConfig.sampleArgs} /></td>
                                </tr>
                            </table>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

