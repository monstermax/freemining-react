
import React, { useContext } from 'react';

import { GlobalContext } from '../../providers/global.provider';


export const Hardware: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;

    let cpuActive = false;

    if (rigStatus) {
        for (const minerAlias in rigStatus.status.minersStats) {
            const minerAliasStats = rigStatus.status.minersStats[minerAlias];
            const cpusStats = minerAliasStats.devices.cpus[0];

            if (cpusStats) {
                cpuActive = true;
                break;
            }
        }
    }

    return (
        <>
            <div>
                {!rigStatus && <div className='alert alert-info'>Loading hardware infos</div>}

                {rigStatus && 
                    <>
                        <div className='alert alert-info m-2 mt-3 mb-3 p-2'>
                            <h2 className='h4 cursor-default'>CPU :</h2>

                            <div className='alert alert-secondary'>
                                <div className='d-flex justify-content-between cursor-default'>
                                    <h3 className='h5 bold m-0 truncate' title={rigStatus.systemInfos.cpu.manufacturer + ' ' + rigStatus.systemInfos.cpu.brand}>
                                        {rigStatus.systemInfos.cpu.manufacturer} {rigStatus.systemInfos.cpu.brand}
                                    </h3>

                                    {! cpuActive && <div className='badge bg-warning'>idle</div>}
                                    {cpuActive && <div className='badge bg-success'>mining</div>}
                                </div>

                                {/*
                                {Object.keys(rigStatus.systemInfos.cpu).map((key) => {
                                    const cpuInfoKey = key as keyof typeof rigStatus.systemInfos.cpu;

                                    return (
                                        <div key={key} className='badge bg-secondary m-1'>
                                            <b>{key}</b>: {rigStatus.systemInfos.cpu[cpuInfoKey]}
                                        </div>
                                    );
                                })}
                                */}
                            </div>
                        </div>

                        <div className='alert alert-info m-2 mt-3 p-2'>
                            <h2 className='h4 cursor-default'>GPUS ({rigStatus.systemInfos.gpus.length}) :</h2>

                            {rigStatus.systemInfos.gpus.map((gpu) => {
                                let gpuActive = false;

                                for (const minerAlias in rigStatus.status.minersStats) {
                                    const minerAliasStats = rigStatus.status.minersStats[minerAlias];
                                    const gpusStats = minerAliasStats.devices.gpus;
                                    const gpuStat = gpusStats.find(_gpu => _gpu.id === gpu.idx);
                                    if (gpuStat) {
                                        gpuActive = true;
                                        break;
                                    }
                                }

                                return (
                                    <div key={gpu.idx}>
                                        <div className='alert alert-secondary'>
                                            <div className='d-flex justify-content-between cursor-default'>
                                                <h3 className='h5 bold m-0 truncate' title={gpu.name || gpu.model}>
                                                    {gpu.name || gpu.model}
                                                </h3>

                                                {! gpuActive && <div className='badge bg-warning'>idle</div>}
                                                {gpuActive && <div className='badge bg-success'>mining</div>}
                                            </div>

                                            {/*
                                            <div>
                                                {Object.keys(gpu).map(key => {
                                                    const gpuInfoKey = key as keyof typeof gpu;

                                                    return (
                                                        <div key={key} className='badge bg-secondary m-1'>
                                                            <b>{key}</b>: {gpu[gpuInfoKey]}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                }
            </div>
        </>
    );
};

