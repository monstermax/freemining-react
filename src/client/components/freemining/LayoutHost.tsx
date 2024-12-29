
import React, { useContext, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import { GlobalContext } from '../../providers/global.provider';
import { fetchJson } from '../../lib/utils.client';
import { RigStatus } from '../../types_client/freemining';


const LayoutHost: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const navigate = useNavigate();

    const { appPath, rigHost, setRigHost, rigStatus, setRigStatus, setRigStatusLoading, favoritesHosts, setFavoritesHosts } = context;

    const reloadHost = () => {
        setRigStatusLoading(true);

        fetchJson<RigStatus>(`http://${rigHost}/rig/status.json`, { useProxy: true })
            .then((newRigStatus) => {
                setRigStatus(newRigStatus ? newRigStatus.data : null);
            })
            .finally(() => {
                setRigStatusLoading(false);
            })
    }

    const disconnectHost = () => {
        localStorage.removeItem('lastHost');
        setRigHost(null);
    }

    const location = useLocation();

    useEffect(() => {
        if (rigHost) {
            localStorage.setItem('lastHost', rigHost);

            if (! favoritesHosts.includes(rigHost)) {
                setFavoritesHosts((hosts) => [... new Set([...hosts, rigHost])]);
            }
        }
    }, [rigHost]);

    useEffect(() => {
        window.localStorage.setItem('favoritesHosts', JSON.stringify(favoritesHosts));
    }, [favoritesHosts]);

    return (
        <>

            <nav className='navbar navbar-expand-lg bg-dark text-light mb-1 p-1'>
                <h1 className='h2 pointer' onClick={() => navigate(appPath)}>Riggle</h1>

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

                                <button type="button" className="btn btn-secondary" onClick={() => reloadHost()} title="Reload">↻</button>

                                <ul className="dropdown-menu">
                                    {favoritesHosts.map(host => {
                                        if (host === rigHost) return null;

                                        return (
                                            <li key={host}>
                                                <a className="dropdown-item pointer" onClick={() => setRigHost(host)}>{host}</a>
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
                    <Link to={`${appPath}/settings`} className={`nav-link ${location.pathname === `${appPath}/settings` ? "active" : ""}`}>Settings</Link>
                </li>
            </nav>

            <div className='bg-light p-1'>
                <Outlet />
            </div>
        </>
    )
};


export default LayoutHost;

