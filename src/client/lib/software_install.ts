
import { GlobalContextType } from "../providers/global.provider";
import { installMiner, uninstallMiner } from "./rig_api";
import { fetchHtml } from "./utils.client";


export type InstallMinerOptions = {
    minerVersion: string,
    confirmed?: boolean,
}

export type UninstallMinerOptions = {
    minerVersion: string,
    confirmed?: boolean,
}


// @ts-ignore
const alertify = window.alertify;


export const showUninstallMiner = (context: GlobalContextType, minerName: string) => {
    if (! context.rigHost) return;
    console.log(`showUninstallMiner ${minerName}`)

    // TODO ?
    //const minerAlias = `${minerName}-test-todo`; // TODO: proposer tous les alias installés pour ce miner
    //uninstallMiner(context, minerName, minerAlias);
};



export const installMinerSafe = (rigHost: string, minerName: string, minerAlias?: string, options?: InstallMinerOptions) => {
    console.log(`installMiner ${minerName} / ${minerAlias}`);

    const onStart = (minerName: string, minerAlias?: string) => {};
    const onSuccess = (minerName: string, minerAlias: string | undefined, result: any) => {};
    const onFail = (minerName: string, minerAlias: string | undefined, err: any) => {};

    const confirmed = options?.confirmed || false;
    const minerVersion = options?.minerVersion || '';
    let error: string | null = null;

    if (! minerName) {
        error = `Missing {minerName} parameter`;
    }

    if (! minerVersion) {
        error = `Missing {minerVersion} parameter`;
    }

    if (error) {
        alertify.error(`Error: ${error}`);
        return;
    }


    //const minerFullName = `${minerName}-${minerAlias}`;
    const minerFullTitle = (minerName === minerAlias || ! minerAlias) ? minerName : `${minerName} (${minerAlias})`;

    function _installMiner() {
        alertify.success(`Starting miner ${minerFullTitle} installation...`);

        if (typeof onStart === 'function') {
            onStart(minerName, minerAlias);
        }

        installMiner(rigHost, minerName, minerAlias, options)
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
    }

    if (confirmed) {
        _installMiner();

    } else {
        alertify.confirm("<b>Miner installation - confirmation</b>", `Do you want to install the miner '<b>${minerFullTitle}</b>' ?`,
            _installMiner,
            () => { /* alertify.error('Cancel'); */ }
        );
    }
};


export const uninstallMinerSafe = (rigHost: string, minerName: string, minerAlias?: string, options?: UninstallMinerOptions) => {
    console.log(`uninstallMiner ${minerName} / ${minerAlias}`);

    //const minerVersion = options?.minerVersion || '';
    const confirmed = options?.confirmed || false;
    let error: string | null = null;

    if (! minerName) {
        error = `Missing {minerName} parameter`;
    }

    if (error) {
        alertify.error(`Error: ${error}`);
        return;
    }

    const onStart = (minerName: string, minerAlias?: string) => {};
    const onSuccess = (minerName: string, minerAlias: string | undefined, result: any) => {};
    const onFail = (minerName: string, minerAlias: string | undefined, err: any) => {};


    //const minerFullName = `${minerName}-${minerAlias}`;
    const minerFullTitle = (minerName === minerAlias || ! minerAlias) ? minerName : `${minerName} (${minerAlias}))`;

    function _uninstallMiner() {
        alertify.success(`Starting miner ${minerFullTitle} uninstallation...`);

        if (typeof onStart === 'function') {
            onStart(minerName, minerAlias);
        }

        uninstallMiner(rigHost, minerName, minerAlias)
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
    }

    if (confirmed) {
        _uninstallMiner();

    } else {
        alertify.confirm("<b>Miner uninstallation - confirmation</b>", `Do you want to uninstall the miner '<b>${minerFullTitle}</b>' ?`,
            _uninstallMiner,
            () => { /* alertify.error('Cancel'); */ }
        );
    }
};
