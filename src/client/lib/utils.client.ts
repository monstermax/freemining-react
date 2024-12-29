

import { useEffect, useState } from 'react';

import { GlobalContextType } from '../providers/global.provider';

import type { RigStatus } from '../types_client/freemining';
import { getRigStatus } from './rig_api';


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
            ret = round(n / (24 * 60 * 60)).toString() + ' day';
        } else if (n > 60 * 60) {
            ret = round(n / (60 * 60)).toString() + ' hour';
        } else if (n > 60) {
            ret = round(n / 60).toString() + ' min';
        } else {
            ret = round(n).toString() + ' sec';
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

