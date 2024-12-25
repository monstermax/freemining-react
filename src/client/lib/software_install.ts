
import { GlobalContextType } from "../providers/global.provider";
import { fetchHtml } from "./utils.client";


// @ts-ignore
const alertify = window.alertify;


export const showUninstallMiner = (context: GlobalContextType, minerName: string) => {
    if (! context.rigHost) return;
    console.log(`showUninstallMiner ${minerName}`)

    // TODO
    const minerAlias = `${minerName}-test-todo`; // TODO: proposer tous les alias installés pour ce miner
    uninstallMiner(context, minerName, minerAlias);
};



export const installMiner = (context: GlobalContextType, minerName: string, minerAlias?: string, options?: {[key: string]: any}) => {
    if (! context.rigHost) return;
    console.log(`installMiner ${minerName} / ${minerAlias}`);

    const onStart = (minerName: string, minerAlias?: string) => {};
    const onSuccess = (minerName: string, minerAlias: string | undefined, result: any) => {};
    const onFail = (minerName: string, minerAlias: string | undefined, err: any) => {};

    let error: string | null = null;

    if (! minerName) {
        error = `Missing {miner} parameter`;
    }

    if (error) {
        alertify.error(`Error: ${error}`);
        return;
    }


    //const minerFullName = `${minerName}-${minerAlias}`;
    const minerFullTitle = (minerName === minerAlias || ! minerAlias) ? minerName : `${minerName} (${minerAlias})`;

    alertify.confirm("<b>Miner installation - confirmation</b>", `Do you want to install the miner '<b>${minerFullTitle}</b>' ?`,
        function(){
            alertify.success(`Starting miner ${minerFullTitle} installation...`);

            if (typeof onStart === 'function') {
                onStart(minerName, minerAlias);
            }

            const data: {[key: string]: any} = {
                action: 'start',
                miner: minerName,
                minerAlias,
            };

            const url = `http://${context.rigHost}/rig/miners/${minerName}/install`;

            fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) })
                .then(({data, headers, status}) => {
                    if (data && data.startsWith('OK:')) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(minerName, minerAlias, data);
                        }
                        alertify.success(`Miner ${minerFullTitle} installation started`);

                    } else {
                        if (typeof onFail === 'function') {
                            onFail(minerName, minerAlias, { message: data });
                        }
                        alertify.error(`Miner ${minerFullTitle} installation cannot be started. ${data}`);
                    }

                })
                .catch((err: any) => {
                    if (typeof onFail === 'function') {
                        onFail(minerName, minerAlias, err);
                    }

                    alertify.error(`Miner ${minerFullTitle} installation cannot be started. ${err.message}`);
                });
        },
        function(){
            //alertify.error('Cancel');
        }
    );
};


export const uninstallMiner = (context: GlobalContextType, minerName: string, minerAlias?: string) => {
    if (! context.rigHost) return;
    console.log(`uninstallMiner ${minerName} / ${minerAlias}`);

    const onStart = (minerName: string, minerAlias?: string) => {};
    const onSuccess = (minerName: string, minerAlias: string | undefined, result: any) => {};
    const onFail = (minerName: string, minerAlias: string | undefined, err: any) => {};

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

    alertify.confirm("<b>Miner uninstallation - confirmation</b>", `Do you want to uninstall the miner '<b>${minerFullTitle}</b>' ?`,
        function(){
            alertify.success(`Starting miner ${minerFullTitle} uninstallation...`);

            if (typeof onStart === 'function') {
                onStart(minerName, minerAlias);
            }

            const data: {[key: string]: any} = {
                action: 'start',
                miner: minerName,
                minerAlias,
            };

            const url = `http://${context.rigHost}/rig/miners/${minerName}/uninstall`;

            fetchHtml(url, { useProxy: true, method: 'POST', body: JSON.stringify(data) })
                .then(({data, headers, status}) => {
                    if (data && data.startsWith('OK:')) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(minerName, minerAlias, data);
                        }
                        alertify.success(`Miner ${minerFullTitle} uninstallation started`);

                    } else {
                        if (typeof onFail === 'function') {
                            onFail(minerName, minerAlias, { message: data });
                        }
                        alertify.error(`Miner ${minerFullTitle} uninstallation cannot be started. ${data}`);
                    }

                })
                .catch((err: any) => {
                    if (typeof onFail === 'function') {
                        onFail(minerName, minerAlias, err);
                    }

                    alertify.error(`Miner ${minerFullTitle} uninstallation cannot be started. ${err.message}`);
                });
        },
        function(){
            //alertify.error('Cancel');
        }
    );
};
