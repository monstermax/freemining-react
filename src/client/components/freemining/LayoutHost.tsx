
import React, { useContext, useEffect } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";

import { GlobalContext } from '../../providers/global.provider';
import { fetchJson } from '../../lib/utils.client';
import { RigStatus } from '../../types_client/freemining';


const LayoutHost: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, setRigHost, rigStatus, setRigStatus, setRigStatusLoading, favoritesHosts, setFavoritesHosts } = context;

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

    const location = useLocation();

    useEffect(() => {
        if (rigHost && ! favoritesHosts.includes(rigHost)) {
            setFavoritesHosts((hosts) => [... new Set([...hosts, rigHost])]);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem('favoritesHosts', JSON.stringify(favoritesHosts));
    }, [favoritesHosts]);

    return (
        <>

            <nav className='navbar navbar-expand-lg bg-secondary text-light mb-1 p-1 rounded'>
                <h1 className='h2 cursor-default'>Riggle</h1>

                <div className='ms-auto d-flex'>
                    {!rigStatus && (
                        <div className={`badge bg-danger m-1 cursor-default`}>
                            <span className='m-1'>{rigHost}</span>

                            <button type="button" className="btn-close m-1 pointer" aria-label="Close" onClick={() => setRigHost(null)}></button>
                        </div>
                    )}

                    {rigStatus && (
                        <div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    {rigHost}
                                </button>

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
                                        <button className='btn btn-danger btn-sm w-100' onClick={() => setRigHost(null)}>disconnect</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <button type="button" className="btn btn-secondary m-1" onClick={() => reloadHost()} title="Reload">🗘</button>
                </div>
            </nav>


            <nav className='nav nav-tabs'>
                <li className='nav-tem'>
                    <Link to="/mining" className={`nav-link ${location.pathname === '/mining' ? "active" : ""}`}>Rig</Link>
                </li>
                <li className='nav-tem'>
                    <Link to="/mining/hardware" className={`nav-link ${location.pathname === '/mining/hardware' ? "active" : ""}`}>Hardware</Link>
                </li>
                <li className='nav-tem'>
                    <Link to="/mining/software" className={`nav-link ${location.pathname === '/mining/software' ? "active" : ""}`}>Software</Link>
                </li>
                <li className='nav-tem'>
                    <Link to="/mining/mining" className={`nav-link ${location.pathname === '/mining/mining' ? "active" : ""}`}>Mining</Link>
                </li>
                <li className='nav-tem'>
                    <Link to="/mining/settings" className={`nav-link ${location.pathname === '/mining/settings' ? "active" : ""}`}>Settings</Link>
                </li>
            </nav>

            <div className='bg-light p-1'>
                <Outlet />
            </div>
        </>
    )
};


export default LayoutHost;

