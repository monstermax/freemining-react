

import type express from 'express';
import { renderComponent } from '../routes';


export default (req: express.Request, res: express.Response) => {
    // GET /mining

    renderComponent(res, 'Freemining');
};

