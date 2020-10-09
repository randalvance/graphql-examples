import jwt from 'jsonwebtoken';

import { config } from './config';

export const getUserId = (request) => {
    const header = request.request.headers.authorization;

    if (!header) {
        throw new Error('Authentication required!');
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    return decoded.userId;
};
