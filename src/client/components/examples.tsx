
import { useEffect, useState } from 'react';

import { fetchJson, useFetchJson } from '../lib/utils.client';



export const BasicReactComponent = (props: any) => {
    return (
        <>
            It works
        </>
    )
}


export const ExampleReactComponent = (props: any) => {
    const fetchResult = useFetchJson('/example/api/date');
    const [val, setVal] = useState(fetchResult || 'loading (10%)...');

    // toggle button text
    const btnClick = () => setVal(val === 'ying' ? 'yang' : 'ying');

    const btnTwoClick = () => {
        // reload api data
        fetchJson('/example/api/date')
            .then(fetchResponse => setVal(fetchResponse?.data ?? ''));
    }

    useEffect(() => {
        setVal(fetchResult || 'loading (80%)');
    }, [fetchResult]);

    return (
        <>
            Example React + API
            <hr />
            <button onClick={() => btnClick()}>click me</button>
            <button onClick={() => btnTwoClick()}>reload</button>
            <hr />
            {(val === null) && <>loading (40%)...</>}
            {(val !== null) && <>{JSON.stringify(val)}</>}
        </>
    );
}

