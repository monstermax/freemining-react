

import { useEffect, useState } from 'react';

import { GlobalContextType } from '../providers/global.provider';
import { getRigStatus, updateRigConfig } from './rig_api';

import type { RigConfigs, RigConfigType, RigStatus } from '../types_client/freemining_types.client';


type fetchDataOptions = {
    signal?: AbortSignal,
    useProxy?: boolean,
    method?: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'UPDATE',
    body?: string | any,
    headers?: {[key: string]: string},
};

type FetchResponse<T=any> = {
    data: T,
    status: number,
    headers: {[key: string]: string},
}


export async function sleep(duration: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => resolve(), duration));
}


export async function fetchHtml(url: string, options?: fetchDataOptions): Promise<FetchResponse<string | null>> {
    const signal = options?.signal;
    let data: string | null = null;
    let status = 0;
    let headers: {[key: string]: string} = {};

    if (options?.useProxy) {
        url = `/api/corsproxy?url=${encodeURIComponent(url)}`;
    }

    options = options || {};
    options.headers = options?.headers || {};

    if (options.method === 'POST' && !options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
    }

    const fetchInit: RequestInit = {
        signal,
        method: options.method || 'GET',
        body: options.body ? (typeof options.body === 'object' && options.headers['Content-Type'] === 'application/json' ? JSON.stringify(options.body) : options.body) : undefined,
        headers: options?.headers,
    };

    try {
        const response = await fetch(url, fetchInit);

        //await sleep(1500); // DEBUG

        if (! signal || ! signal.aborted) {
            if (response.ok) {
                data = await response.text();
                status = response.status;
                headers = Object.fromEntries(response.headers);

            } else {
                console.error(`HTTP error! Status: ${response.status}`);
            }
        }

    } catch (error) {
        if (! signal || ! signal.aborted) {
            console.error(error);
        }
    }

    return { data, status, headers } as FetchResponse<string | null>;
}


export async function fetchJson<T>(url: string, options?: fetchDataOptions): Promise<FetchResponse<T> | null> {
    const signal = options?.signal;

    if (options?.useProxy) {
        url = `/api/corsproxy?url=${encodeURIComponent(url)}`;
    }

    return fetch(url, { signal })
        //.then(async (response) => { await sleep(1500); return response}) // DEBUG
        .then(async (response) => {
            if (signal?.aborted) {
                throw new Error(`signal aborted`);
            }
            if (! response.ok) {
                throw new Error(`response not ok`);
            }

            const status = response.status;
            const headers = Object.fromEntries(response.headers);
            const data: T = await response.json() as T;

            return { data, status, headers } as FetchResponse<T>;
        })
        .catch((err: any) => {
            if (! signal || ! signal.aborted) {
                console.error(`fetch error. ${err.message}`);
            }

            return null;
        });
}


export function useFetchJson<T>(url: string, useProxy=false): T | undefined | null {
    const [result, setResult] = useState<T | undefined | null>(undefined);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetchJson<T>(url, { signal, useProxy })
            .then((result) => setResult(result?.data))
            .catch(err => setResult(null))

        return () => {
            abortController.abort();
        }

    }, [url]);

    return result;
}


export function stripTags(text: string): string {
    if (!text) return '';
    const regex = /(<([^>]+)>)/ig;
    return text.replace(regex, "");
}



function fixedRound(precision: number=0) {
    return function (val: number) {
        return Math.round(val * 10 ** precision) / 10 ** precision;
    }
}


export function formatNumber(n: number, type?:null | 'seconds' | 'size'): string {
    let ret = '';

    const round = fixedRound(1);

    if (type === 'seconds') {
        if (n > 24 * 60 * 60) {
            const val = round(n / (24 * 60 * 60));
            ret = `${val} day${val > 1 ? "s" : ""}`;
        } else if (n > 60 * 60) {
            const val = round(n / (60 * 60));
            ret = ` ${val}hour${val > 1 ? "s" : ""}`;
        } else if (n > 60) {
            const val = round(n / 60);
            ret = `${val} min`;
        } else {
            const val = round(n);
            ret = `${val} sec`;
        }

    } else if (type === 'size') {
        if (n > 10 ** 21) {
            ret = round(n / 10 ** 21).toString() + ' Y';
        } else if (n > 10 ** 18) {
            ret = round(n / 10 ** 18).toString() + ' Z';
        } else if (n > 10 ** 15) {
            ret = round(n / 10 ** 15).toString() + ' E';
        } else if (n > 10 ** 12) {
            ret = round(n / 10 ** 12).toString() + ' T';
        } else if (n > 10 ** 9) {
            ret = round(n / 10 ** 9).toString() + ' G';
        } else if (n > 10 ** 6) {
            ret = round(n / 10 ** 6).toString() + ' M';
        } else if (n > 10 ** 3) {
            ret = round(n / 10 ** 3).toString() + ' K';
        } else {
            ret = round(n).toString() + ' ';
        }

    } else {
        ret = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(n);
    }

    return ret;
}



export const refreshRigStatus = (context: GlobalContextType): void => {
    const { rigHost, setRigStatus } = context;

    if (! rigHost) {
        return;
    }

    document.getElementById('btn-rig-status-refresh')?.classList.add('disabled');

    getRigStatus(rigHost)
        .then((newRigStatus) => {
            setRigStatus(newRigStatus ?? null);
        })
        .catch((err: any) => {
            setRigStatus(null);
        })
        .finally(() => {
            document.getElementById('btn-rig-status-refresh')?.classList.remove('disabled');
        });

}




export const importRigConfig = <T extends RigConfigType>(rigHost: string, configType: T, config: RigConfigs<T>) => {
    // TODO: upload file + parse

}

export const exportRigConfig = <T extends RigConfigType>(rigHost: string, configType: T, config: RigConfigs<T>) => {
    // TODO: upload file + parse

}


export const downloadFile = (data: any, fileName='data.json', contentType="application/json") => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: contentType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


export const uploadFile = async <T>(context: GlobalContextType, options?: {[key: string]: string}): Promise<string | null> => {
    const { rigHost } = context;
    if (! rigHost) return null;

    const hiddenFileInput = document.createElement('input');
    hiddenFileInput.type = "file";
    hiddenFileInput.style.display = 'none';

    return new Promise<string | null>((resolve, reject) => {

        for (const optionName in options) {
            // @ts-ignore
            hiddenFileInput[optionName] = options[optionName];
        }
        //hiddenFileInput.accept = ".json";

        hiddenFileInput.onchange = (event: Event) => {
            const files = event.target?.files ?? [];
            const file = files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const fileContent = e.target?.result as string || '{}';
                        resolve(fileContent);

                    } catch (err) {
                        console.error("Erreur lors du parsing du fichier JSON :", err);
                        reject(err);
                    }
                };

                reader.readAsText(file);

            } else {
                reject(new Error("no upload file found"));
            }
        }

        hiddenFileInput.onerror = () => {
            reject(new Error("upload error"));
        }

        document.body.appendChild(hiddenFileInput);

        hiddenFileInput.click();
    })
    .finally(() => {
        hiddenFileInput.remove();
    })
}


