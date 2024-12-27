
import { GlobalContextType } from "../providers/global.provider";
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
}



// @ts-ignore
const alertify = window.alertify;


export const showStopMiner = (context: GlobalContextType, minerName: string) => {
    if (! context.rigHost) return;
    console.log(`showStopMiner ${minerName}`)

    // TODO ?
    //const minerAlias = `${minerName}-test-todo`; // TODO: proposer tous les alias lancés pour ce miner
    //stopMiner(context, minerName, minerAlias, {});
};


export const startMiner = (context: GlobalContextType, minerName: string, minerAlias: string, options: StartMinerOptions) => {
    if (! context.rigHost) return;
    console.log(`startMiner ${minerAlias}`)

    const onStart = (minerName: string, minerAlias: string) => {};
    const onSuccess = (minerName: string, minerAlias: string, result: any) => {};
    const onFail = (minerName: string, minerAlias: string | undefined, err: any) => {};

    const {coin, algo, poolUrl, poolUser, extraArgs} = options;
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

    //const minerFullName = `${minerName}-${minerAlias}`;
    const minerFullTitle = (minerName === minerAlias || ! minerAlias) ? minerName : `${minerName} (${minerAlias}))`;

    const data: {[key: string]: any} = {
        action: 'start',
        miner: minerName,
        minerAlias,
        coin,
        algo,
        poolUrl,
        poolUser,
        extraArgs,
    };

    const url = `http://${context.rigHost}/rig/miners/${minerName}/run`;

    if (typeof onStart === 'function') {
        onStart(minerName, minerAlias);
    }


    fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) })
        .then(({data, headers, status}) => {
            if (data && data.startsWith('OK:')) {
                if (typeof onSuccess === 'function') {
                    onSuccess(minerName, minerAlias, data);
                }

                alertify.success(`Miner ${minerFullTitle} started`);

            } else {
                if (typeof onFail === 'function') {
                    onFail(minerName, minerAlias, { message: data });
                }

                alertify.error(`Miner ${minerFullTitle} cannot be started. ${data}`);
            }

        })
        .catch((err: any) => {
            if (typeof onFail === 'function') {
                onFail(minerName, minerAlias, err);
            }

            alertify.error(`Miner ${minerFullTitle} cannot be started. ${err.message}`);
        });
};


export const stopMiner = (context: GlobalContextType, minerName: string, minerAlias: string, options?: StopMinerOptions) => {
    if (! context.rigHost) return;
    console.log(`stopMiner ${minerAlias}`)

    const onStart = (minerName: string, minerAlias: string) => {};
    const onSuccess = (minerName: string, minerAlias: string, result: any) => {};
    const onFail = (minerName: string, minerAlias: string, err: any) => {};

    const confirmed = options?.confirmed || false;
    let error: string | null = null;

    if (! minerName) {
        error = `Missing {miner} parameter`;
    }

    if (error) {
        alertify.error(`Error: ${error}`);
        return;
    }

    //const minerFullName = `${minerName}-${minerAlias}`;
    const minerFullTitle = (minerName === minerAlias || ! minerAlias) ? minerName : `${minerName} (${minerAlias}))`;

    function _stopMiner() {
        alertify.success(`Stopping miner ${minerFullTitle}...`);

        if (typeof onStart === 'function') {
            onStart(minerName, minerAlias);
        }

        const data: {[key: string]: any} = {
            action: 'stop',
            miner: minerName,
            minerAlias,
        };

        const url = `http://${context.rigHost}/rig/miners/${minerName}/run`;

        fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) })
            .then(({data, headers, status}) => {
                if (data && data.startsWith('OK:')) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(minerName, minerAlias, data);
                    }

                    alertify.success(`Miner ${minerFullTitle} stopped<hr />`);

                } else {
                    if (typeof onFail === 'function') {
                        onFail(minerName, minerAlias, { message: data });
                    }

                    alertify.error(`Miner ${minerFullTitle} cannot be stopped. ${data}`);
                }

            })
            .catch((err: any) => {
                if (typeof onFail === 'function') {
                    onFail(minerName, minerAlias, err);
                }

                alertify.error(`Miner ${minerFullTitle} cannot be stopped. ${err.message}`);
            });
    }

    if (confirmed) {
        _stopMiner();

    } else {
        alertify.confirm("<b>Miner stopping - confirmation</b>", `Do you want to stop the miner '<b>${minerFullTitle}</b>' ?`,
            _stopMiner,
            () => { /* alertify.error('Cancel'); */ }
        );
    }


};



