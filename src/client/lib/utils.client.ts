

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../providers/global.provider';


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
    let data: T | null = null;
    let status = 0;
    let headers: {[key: string]: string} = {};

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
            const data = await response.json();

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


/*
export function checkHost(): boolean {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost } = context;

    const navigate = useNavigate();

    useEffect(() => {
        if (!rigHost) {
            navigate('/mining');
        }
    }, [rigHost, navigate]);

    return !! rigHost;
}

*/