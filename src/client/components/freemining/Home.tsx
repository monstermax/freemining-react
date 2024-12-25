
import React, { useContext } from 'react';

import { GlobalContext } from '../../providers/global.provider';


const Home: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Conext GlobalProvider not found");

    const { rigHost } = context;

    return (
        <>
            <h1 className='h3'>Home</h1>

            <hr />
        </>
    );
};


export default Home;
