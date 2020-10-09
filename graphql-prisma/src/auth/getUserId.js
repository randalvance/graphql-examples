import jwt from 'jsonwebtoken';

import { config } from './config';

export const getUserId = (request, requireAuth = true) => {
    const header = request.request.headers.authorization;

    if (header) {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authentication required!');
    }

    return null;
};
