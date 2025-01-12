
import React, { useContext, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';
import { downloadFile, refreshRigStatus, uploadFile } from '../../lib/utils.client';
import { updateRigConfig } from '../../lib/rig_api';
import { RigStatusConfigCoinMiners, RigStatusConfigMiner } from '../../types_client/freemining_types.client';



export const SettingsMiners: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;
    if (! rigHost || ! rigHost) return <div>No host</div>

    const [miners, setMiners] = useState<{[minerName: string]: RigStatusConfigMiner}>(rigStatus?.config.miners ?? {});

    const downloadConfigFile = () => {
        const fileName = `freemining_config_miners.${rigStatus?.rig.name}.json`;
        return downloadFile(miners, fileName, "application/json");
    }

    const uploadConfigFile = () => {
        return uploadFile(context)
            .then((content) => {
                return JSON.parse(content ?? '{}')
            })
            .then((config: {[minerName: string]: RigStatusConfigMiner}) => updateRigConfig(rigHost, 'miners', config))
            .then(() => refreshRigStatus(context))
    }


    return (
        <div>
            <h2 className='h4'>Miners configuration</h2>

            <div>
                {Object.entries(miners).map(minerEntry => {
                    const [minerName, minerConfig] = minerEntry;

                    const [showCoinDetails, setShowCoinDetails] = useState(false);

                    const changeMinerExtraArgs = (newExtraArgs: string) => {
                        if (minerConfig.extraArgs === newExtraArgs) {
                            return;
                        }

                        minerConfig.extraArgs = newExtraArgs;

                        updateRigConfig(rigHost, 'miners', miners)
                            .then((result) => {
                                refreshRigStatus(context);
                            })
                    }

                    return (
                        <div key={minerName} className='alert alert-info m-2 pb-0'>
                            <div className='d-flex pointer' onClick={() => setShowCoinDetails(!showCoinDetails)}>
                                <h3 className='h5 m-1'>{minerName}</h3>

                                <div className='d-flex align-items-center ms-auto'>
                                    <i className={`bi text-secondary ${showCoinDetails ? "bi-chevron-double-up" : "bi-chevron-double-down"}`}></i>
                                </div>
                            </div>

                            <table className={`table mt-1 ${showCoinDetails ? "" : "d-none"}`}>
                                <tbody>
                                    <tr>
                                        <td className='cursor-default'>Optional arguments</td>
                                        <td>
                                            <input
                                                type="text"
                                                className='form-control'
                                                defaultValue={minerConfig.extraArgs}
                                                onBlur={(event) => changeMinerExtraArgs(event.currentTarget.value)}
                                                onKeyDown={(event) => { if (event.key === 'Enter') { changeMinerExtraArgs(event.currentTarget.value); } }}
                                                placeholder='ex: --devices 0,1 --disable-cpu'
                                                />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

            <div className='mt-2'>
                <button className='btn btn-primary m-1' onClick={() => uploadConfigFile()}>Load miners config</button>

                <button className='btn btn-primary m-1' onClick={() => downloadConfigFile()}>Save miners config</button>
            </div>

        </div>
    );
}

