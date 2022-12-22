import config from './config';
import { Client } from '../src';

describe('Client', () => {
    test('base constructor', () => {
        const client = new Client(config);
        expect(client).toBeDefined();
    });
    test.only('getAccounts', async () => {
        const client = new Client(config);
        const list = await client.getAccounts();
        console.log({
            list
        });
    }, 30 * 1000);
    test('createAccount', async () => {
        const client = new Client(config);
        const accountDomain = Math.random().toString(36).substring(2) + Date.now();
        const { accounts } = await client.createAccount({
            subdomain: accountDomain,
            account_name: accountDomain
        });
        const { name, subdomain } = accounts[0];
        expect(name).toBe(accountDomain);
        expect(subdomain).toBe(accountDomain);
        const currentAccounts = await client.getAccounts();
        const [lastAccount] = currentAccounts;
        expect(lastAccount.subdomain).toBe(accountDomain);
        expect(lastAccount.name).toBe(accountDomain);
    });
});