import authConfig from './config/auth';
import { Auth } from '../src/Auth';

describe('Auth', () => {
    test('login', async () => {
        const auth = new Auth(authConfig);
        await auth.login();
    });
});