
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import { GlobalContext } from '../../providers/global.provider';
import { refreshRigStatus } from '../../lib/utils.client';

import { SoftwareInstall } from "./SoftwareInstall";
import { SoftwareRun } from "./SoftwareRun";
import { Mining } from "./Mining";
import { Settings } from "./Settings";
import { Status } from "./Status";
import { Coins } from "./Coins";
import { Home } from "./Home"
import { Software } from "./Software";
import { Hardware } from "./Hardware";
import { NoPage } from "./NoPage";
import { SettingsCoins } from './SettingsCoins';
import { SettingsCoinsWallets } from './SettingsCoinsWallets';
import { SettingsCoinsPools } from './SettingsCoinsPools';
import { SettingsCoinsMiners } from './SettingsCoinsMiners';
import { SettingsMiners } from './SettingsMiners';



export const LayoutHostRouter: React.FC = function () {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, setRigHost, rigStatus, setRigStatus, favoritesHosts, setFavoritesHosts } = context;

    useEffect(() => {
        // rigHost CHANGED => refresh rig status
        setRigStatus(undefined);
        refreshRigStatus(context);

    }, [rigHost]);

    useEffect(() => {
        // rigHost and/or rigStatus CHANGED => save lastHost

        if (rigHost && rigStatus) {
            // save lastHost
            localStorage.setItem('lastHost', rigHost);

            // add host to favorites
            if (! favoritesHosts.includes(rigHost)) {
                const _favoritesHosts = [... new Set([...favoritesHosts, rigHost])];
                setFavoritesHosts(_favoritesHosts);
                window.localStorage.setItem('favoritesHosts', JSON.stringify(_favoritesHosts));
            }
        }
    }, [rigHost, rigStatus]);


    if (typeof rigStatus === 'undefined') {
        // CONNECTING TO THE RIG...
        return (
            <div>
                <div className="badge bg-warning m-1">
                    <span className='m-1'>{rigHost}</span>
                    <button type="button" className="btn-close m-1" aria-label="Close" onClick={() => setRigHost(null)}></button>
                </div>
                <div className="alert alert-info m-1">
                    Connecting to the rig...
                </div>
            </div>
        )
    }

    if (rigStatus === null) {
        // RIG OFFLINE
        return (
            <div>
                <div className="badge bg-danger m-1">
                    <span className='m-1'>{rigHost}</span>
                    <button type="button" className="btn-close m-1" aria-label="Close" onClick={() => setRigHost(null)}></button>
                </div>
                <div className="alert alert-danger m-1">
                    Rig disconnected
                </div>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="mining" element={<LayoutHost />}>
                    <Route index element={<Home />} />
                    <Route path="hardware" element={<Hardware />} />
                    <Route path="software" element={<Software />} />
                    <Route path="software/install" element={<SoftwareInstall />} />
                    <Route path="software/uninstall" element={<Software />} />
                    <Route path="software/run" element={<SoftwareRun />} />
                    <Route path="software/stop" element={<Software />} />
                    <Route path="mining" element={<Mining />} />
                    <Route path="coins" element={<Coins />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/coins" element={<SettingsCoins />} />
                    <Route path="settings/coins-wallets" element={<SettingsCoinsWallets />} />
                    <Route path="settings/coins-pools" element={<SettingsCoinsPools />} />
                    <Route path="settings/coins-miners" element={<SettingsCoinsMiners />} />
                    <Route path="settings/miners" element={<SettingsMiners />} />
                    <Route path="status" element={<Status />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}



export const LayoutHost: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();
    const location = useLocation();

    const { appPath, rigHost, setRigHost, rigStatus, favoritesHosts } = context;


    const connectHost = (host: string) => {
        setRigHost(host);
    }

    const disconnectHost = () => {
        localStorage.removeItem('lastHost');
        setRigHost(null);
    }


    return (
        <>

            <nav className='navbar navbar-expand-lg bg-dark text-light mb-1 p-1'>
                <h1 className='h2 pointer' onClick={() => navigate(appPath)}>Freemining</h1>

                <div className='ms-auto d-flex'>
                    {!rigStatus && (
                        <div className={`badge bg-danger m-1 cursor-default`}>
                            <span className='m-1'>{rigHost}</span>

                            <button type="button" className="btn-close m-1 pointer" aria-label="Close" onClick={() => disconnectHost()}></button>
                        </div>
                    )}

                    {rigStatus && (
                        <div>
                            <div className="input-group m-1">
                                <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    {rigHost}
                                </button>

                                <button type="button" id="btn-rig-status-refresh" className="btn btn-secondary" onClick={() => refreshRigStatus(context)} title="Reload">
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>

                                <ul className="dropdown-menu">
                                    {favoritesHosts.map(host => {
                                        if (host === rigHost) return null;

                                        return (
                                            <li key={host}>
                                                <a className="dropdown-item pointer" onClick={() => connectHost(host)}>{host}</a>
                                            </li>
                                        );
                                    })}

                                    <li key={'no host'} className='p-1'>
                                        <button className='btn btn-danger btn-sm w-100' onClick={() => disconnectHost()}>disconnect</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
            </nav>


            <nav id="nav-menu" className='nav nav-tabs bold bg-secondary'>
                {/*
                <li className='nav-tem'>
                    <Link to={`${appPath}`} className={`nav-link ${location.pathname === `/mining` ? "active" : ""}`}>Rig</Link>
                </li>
                */}
                <li className='nav-tem'>
                    <Link to={`${appPath}/hardware`} className={`nav-link ${location.pathname === `${appPath}/hardware` ? "active" : ""}`}>Hardware</Link>
                </li>
                <li className='nav-tem'>
                    <Link to={`${appPath}/software`} className={`nav-link ${location.pathname.startsWith(`${appPath}/software`) ? "active" : ""}`}>Software</Link>
                </li>
                <li className='nav-tem'>
                    <Link to={`${appPath}/mining`} className={`nav-link ${location.pathname === `${appPath}/mining` ? "active" : ""}`}>Mining</Link>
                </li>
                <li className='nav-tem'>
                    <Link to={`${appPath}/coins`} className={`nav-link ${location.pathname === `${appPath}/coins` ? "active" : ""}`}>Coins</Link>
                </li>
                <li className='nav-tem'>
                    <Link to={`${appPath}/settings`} className={`nav-link ${location.pathname.startsWith(`${appPath}/settings`) ? "active" : ""}`}>Settings</Link>
                </li>
            </nav>

            <div className='bg-light p-1'>
                <Outlet />
            </div>
        </>
    )
};

