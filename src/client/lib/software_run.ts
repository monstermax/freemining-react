
import { GlobalContextType } from "../providers/global.provider";
import { startMiner, stopMiner } from "./rig_api";
import { fetchHtml } from "./utils.client";


export type StartMinerOptions = {
    coin: string,
    algo: string,
    poolUrl: string,
    poolUser: string,
    extraArgs: string,
};

export type StopMinerOptions = {
    confirmed?: boolean,
    instanceName?: string,
}



// @ts-ignore
const alertify = window.alertify;



export const startMinerSafe = async (rigHost: string, minerName: string, minerAlias: string, options: StartMinerOptions) => {
    console.log(`startMiner ${minerAlias}`)

    const onStart = (minerName: string, minerAlias: string) => {};
    const onSuccess = (minerName: string, minerAlias: string, result: any) => {};
    const onFail = (minerName: string, minerAlias: string | undefined, err: any) => {};

    const {coin, algo, poolUrl, poolUser, extraArgs} = options;
    const instanceNameTmp = /* options?.instanceName || */ `${minerName}-${minerAlias}`;
    let error: string | null = null;

    if (! coin) {
        //error = `Missing {coin} parameter`;
    }
    if (! minerName) {
        error = `Missing {minerName} parameter`;
    }
    if (! algo) {
        error = `Missing {algo} parameter`;
    }
    if (! poolUrl) {
        error = `Missing {poolUrl} parameter`;
    }
    if (! poolUser) {
        error = `Missing {poolUser} parameter`;
    }

    if (error) {
        alertify.error(`Error: ${error}`);
        return;
    }

    if (typeof onStart === 'function') {
        onStart(minerName, minerAlias);
    }

    startMiner(rigHost, minerName, minerAlias, options)
        .then(({data, headers, status}) => {
            if (data && data.startsWith('OK:')) {
                if (typeof onSuccess === 'function') {
                    onSuccess(minerName, minerAlias, data);
                }

                alertify.success(`Miner ${instanceNameTmp} started`);

            } else {
                if (typeof onFail === 'function') {
                    onFail(minerName, minerAlias, { message: data });
                }

                alertify.error(`Miner ${instanceNameTmp} cannot be started. ${data}`);
            }

        })
        .catch((err: any) => {
            if (typeof onFail === 'function') {
                onFail(minerName, minerAlias, err);
            }

            alertify.error(`Miner ${instanceNameTmp} cannot be started. ${err.message}`);
        });
};


export const stopMinerSafe = (rigHost: string, minerName: string, minerAlias: string, options?: StopMinerOptions) => {
    console.log(`stopMiner ${minerAlias}`)

    const onStart = (minerName: string, minerAlias: string) => {};
    const onSuccess = (minerName: string, minerAlias: string, result: any) => {};
    const onFail = (minerName: string, minerAlias: string, err: any) => {};

    const confirmed = options?.confirmed || false;
    const instanceName = options?.instanceName || `${minerName}-${minerAlias}`;
    let error: string | null = null;

    if (! minerName) {
        error = `Missing {minerName} parameter`;
    }

    if (! instanceName) {
        error = `Missing {instanceName} parameter`;
    }

    if (error) {
        alertify.error(`Error: ${error}`);
        return;
    }

    //const minerFullName = `${minerName}-${minerAlias}`;
    //const minerFullTitle = (minerName === minerAlias || ! minerAlias) ? minerName : `${minerName} (${minerAlias}))`;

    function _stopMiner() {
        alertify.success(`Stopping miner ${instanceName}...`);

        if (typeof onStart === 'function') {
            onStart(minerName, minerAlias);
        }

        const data: {[key: string]: any} = {
            action: 'stop',
            miner: minerName,
            alias: minerAlias,
            instanceName,
        };

        stopMiner(rigHost, minerName, minerAlias, options)
            .then(({data, headers, status}) => {
                if (data && data.startsWith('OK:')) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(minerName, minerAlias, data);
                    }

                    alertify.success(`Miner ${instanceName} stopped<hr />`);

                } else {
                    if (typeof onFail === 'function') {
                        onFail(minerName, minerAlias, { message: data });
                    }

                    alertify.error(`Miner ${instanceName} cannot be stopped. ${data}`);
                }

            })
            .catch((err: any) => {
                if (typeof onFail === 'function') {
                    onFail(minerName, minerAlias, err);
                }

                alertify.error(`Miner ${instanceName} cannot be stopped. ${err.message}`);
            });
    }

    if (confirmed) {
        _stopMiner();

    } else {
        alertify.confirm("<b>Miner stopping - confirmation</b>", `Do you want to stop the miner '<b>${instanceName}</b>' ?`,
            _stopMiner,
            () => { /* alertify.error('Cancel'); */ }
        );
    }


};



