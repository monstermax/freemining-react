

import type express from 'express';
import { renderComponent } from '../routes';


export const corsProxyGet = async function (req: express.Request, res: express.Response) {
    // GET /api/corsproxy

    const url = req.query.url?.toString();

    if (! url) {
        res.status(400);
        res.send("missing url");
        return;
    }

    const fetchHeaders: {[key: string]: string} = {};

    if (req.headers['accept']) {
        fetchHeaders['Accept'] = req.headers['accept'];
    }

    if (req.headers['content-type']) {
        fetchHeaders['Content-Type'] = req.headers['content-type'];
    }

    const fetchOptions: RequestInit = {
        method: 'GET',
        headers: fetchHeaders,
    };

    try {
        const fetchResponse = await fetch(url, fetchOptions);
        const fetchResult = await fetchResponse.text();
        const resultContentType = fetchResponse.headers.get('Content-Type');

        if (resultContentType) {
            res.header("Content-Type", resultContentType);
        }

        res.status(fetchResponse.status).send(fetchResult);

    } catch (err: any) {
        console.error('Error in GET proxy:', err);
        res.status(500).send('Error');
    }

};



export const corsProxyPost = async function (req: express.Request, res: express.Response) {
    // POST /api/corsproxy

    const url = req.query.url?.toString();

    if (! url) {
        res.status(400).send("missing url");
        return;
    }

    const body = req.body && typeof req.body === 'object'
        ? new URLSearchParams(req.body).toString()
        : req.body;

    const fetchHeaders: {[key: string]: string} = {};

    fetchHeaders['Accept'] = "*/*";
    fetchHeaders['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
    //fetchHeaders['Content-Length'] = body.length;

    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: fetchHeaders,
        body,
    };

    try {
        const fetchResponse = await fetch(url, fetchOptions);
        const fetchResult = await fetchResponse.text();
        const resultContentType = fetchResponse.headers.get('Content-Type');

        if (resultContentType) {
            res.header("Content-Type", resultContentType);
        }

        res.status(fetchResponse.status).send(fetchResult);

    } catch (err: any) {
        console.error('Error in POST proxy:', err);
        res.status(500).send('Error');
    }
};

