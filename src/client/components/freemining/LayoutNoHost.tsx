
import React, { useContext, useEffect, useRef, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';



const rigHostPlaceholder = '127.0.0.1';


export const LayoutNoHost: React.FC = function () {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, setRigHost } = context;
    const { favoritesHosts } = context;
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        // set focus to <INPUT ...>
        inputRef.current?.focus();
    })


    const _setRigHostPort = (_rigHost: string) => {
        if (! _rigHost.includes(':')) {
            _rigHost += ':1234';
        }

        setRigHost(_rigHost);
    }

    return (
        <div>

            <nav className='navbar navbar-expand-lg bg-dark text-light mb-1 p-1'>
                <h1 className='h2 cursor-default'>Riggle</h1>

                <div className="ms-auto">
                    <div className={`badge bg-danger m-1 cursor-default`}>
                        <span className='m-1'>not connected</span>
                        <button type="button" className="btn m-1"></button>
                    </div>
                </div>
            </nav>

            <div className="m-1">
                <form onSubmit={(event) => event.preventDefault()}>
                    <div className="m-1 alert alert-info text-center">
                        <label className="text-start">
                            <span className="m-1">Connect to the rig:</span>

                            <div className="d-flex">
                                <input ref={inputRef} type="text" className="form-control m-1" defaultValue={rigHost || ''} placeholder={rigHostPlaceholder || 'localhost'} />

                                <button type="submit" className="btn btn-primary m-1" onClick={(event) => _setRigHostPort(inputRef.current?.value || '')}>connect</button>
                            </div>
                        </label>
                    </div>
                    <br />

                    {favoritesHosts.length > 0 && (
                        <div className="m-1 alert alert-info text-center">
                            <h2 className="h4">Favorites</h2>

                            {favoritesHosts.map(host => {
                                return (
                                    <button key={host} type="button" className="btn btn-outline-secondary m-1" onClick={(event) => setRigHost(host)}>{host.replace(':1234', '')}</button>
                                );
                            })}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
