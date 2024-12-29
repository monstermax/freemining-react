
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { GlobalContext } from '../../providers/global.provider';
import { formatNumber } from '../../lib/utils.client';
import { stopMiner } from '../../lib/software_start';



const Mining: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();

    const { appPath, rigHost, rigStatus } = context;


    return (
        <>
            {/*
            <pre>
                {JSON.stringify(rigStatus?.status.minersStats, null, 4)}
            </pre>
            */}

            <div className='m-2 mt-3'>

                {Object.entries(rigStatus?.status.runningMinersAliases || {}).map(minerEntry => {
                    const [minerName, minerInstances] = minerEntry;

                    return (
                        <div key={minerName}>
                            {Object.entries(minerInstances).map(instanceEntry => {
                                const [instanceName, instanceDetails] = instanceEntry;
                                const minerInstanceStats = rigStatus?.status.minersStats[instanceName];
                                const coin = instanceDetails.params.coin;
                                const minerAlias = instanceDetails.alias;
                                const coinDetails = rigStatus?.config.coins[coin];

                                return (
                                    <div key={instanceName} className='alert alert-info mb-3'>
                                        <div className='d-flex'>
                                            <div>
                                                <h2 className='h4 truncate mb-1'>
                                                    <img src={`http://${rigHost}/img/coins/${coin}.webp`} alt={coin} style={{ height: '32px' }} />

                                                    <span className='m-2 cursor-default'>{coinDetails?.coinName || coin}</span>
                                                </h2>
                                            </div>
                                            <div className='ms-auto'>
                                                <span className={`badge ${minerInstanceStats?.miner.hashRate ? "bg-success" : "bg-warning"}`}>{minerInstanceStats ? (formatNumber(minerInstanceStats.miner.hashRate, 'size') + 'H/s') : 'n/a'}</span>
                                            </div>
                                        </div>

                                        <div className='d-flex cursor-default'>
                                            <ul className='nav flex-column m-2'>
                                                <li>
                                                    <b>Miner:</b>
                                                    &nbsp;
                                                    <span>{minerName}</span>
                                                </li>
                                                <li>
                                                    <b>Alias:</b>
                                                    &nbsp;
                                                    <span>{minerAlias}</span>
                                                </li>
                                            </ul>

                                            <ul className='nav flex-column m-2'>
                                                <li>
                                                    <b>Coin:</b>
                                                    &nbsp;
                                                    <span>{coin || 'n/a'}</span>
                                                </li>
                                                <li>
                                                    <b>Algo:</b>
                                                    &nbsp;
                                                    <span>{instanceDetails.params.algo}</span>
                                                </li>
                                            </ul>

                                            <div className='ms-auto'>
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => stopMiner(context, minerName, minerAlias, { instanceName }) }>stop</button>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                {minerInstanceStats?.devices.cpus.map(cpuStat => {
                                                    return (
                                                        <div key={cpuStat.id} className='alert alert-secondary p-2 mb-0 mt-2'>
                                                            <div className='d-flex justify-content-between cursor-default'>
                                                                <h3 className='h5 bold m-0 truncate' title={cpuStat.name}>
                                                                    {cpuStat.name}
                                                                </h3>

                                                                <div className={`badge ${cpuStat.hashRate ? "bg-success" : "bg-warning"}`}>{formatNumber(cpuStat.hashRate, 'size')}H/s</div>
                                                            </div>

                                                            <div className='cursor-default'>
                                                                <span className='badge bg-secondary m-1'><b>Temp:</b> {(! isNaN(Number(cpuStat.temperature))) ? `${formatNumber(cpuStat.temperature)}°` : 'n/a'}</span>
                                                                <span className='badge bg-secondary m-1'><b>Fan:</b> {(! isNaN(Number(cpuStat.fanSpeed))) ? `${formatNumber(cpuStat.fanSpeed)}%` : 'n/a'}</span>
                                                                <span className='badge bg-secondary m-1'><b>Power:</b> {(! isNaN(Number(cpuStat.power))) ? `${formatNumber(cpuStat.power)} W` : 'n/a'}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div>
                                                {minerInstanceStats?.devices.gpus.map(gpuStat => {
                                                    const gpu: any | null = null; //rigStatus?.systemInfos.gpus.find(gpu => gpu.subDeviceId && gpu.subDeviceId === gpuStat.subDeviceId) ?? null;

                                                    return (
                                                        <div key={gpuStat.id} className='alert alert-secondary p-2 mb-0 mt-2'>
                                                            <div className='d-flex justify-content-between cursor-default'>
                                                                <h3 className='h5 bold m-0 truncate'>
                                                                    {gpu?.name || gpu?.model || gpuStat.name}
                                                                </h3>

                                                                <div className={`badge ${gpuStat.hashRate ? "bg-success" : "bg-warning"}`}>{formatNumber(gpuStat.hashRate, 'size')}H/s</div>
                                                            </div>

                                                            <div className='cursor-default'>
                                                                <span className='badge bg-secondary m-1'><b>Temp:</b> {(! isNaN(Number(gpuStat.temperature))) ? `${formatNumber(gpuStat.temperature)}°` : 'n/a'}</span>
                                                                <span className='badge bg-secondary m-1'><b>Fan:</b> {(! isNaN(Number(gpuStat.fanSpeed))) ? `${formatNumber(gpuStat.fanSpeed)}%` : 'n/a'}</span>
                                                                <span className='badge bg-secondary m-1'><b>Power:</b> {(! isNaN(Number(gpuStat.power))) ? `${formatNumber(gpuStat.power)} W` : 'n/a'}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {Object.entries(rigStatus?.status.runningMinersAliases || {}).length === 0 && (
                    <div className='alert alert-warning'>
                        No active miner
                    </div>
                )}

                <div className='my-1 alert alert-info p-2'>
                    <a className='btn btn-primary btn-sm m-1' onClick={() => navigate(`${appPath}/software/run`) }>Run miner...</a>
                </div>

            </div>
        </>
    );
}



export default Mining;

