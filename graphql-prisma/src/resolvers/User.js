import { getUserId } from '../auth/getUserId';

export const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false);
            
            if (userId && userId === parent.id) {
                return parent.email;
            } else {
                return null;
            }
        }
    }
};