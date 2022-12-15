import fetch from 'cross-fetch';

export interface IAuth {
    username: string;
    password: string;
    sessionFilename?: string;
}
export class Auth {
    protected cookies = '';
    protected connected = false;
    protected options: IAuth;

    constructor(options: IAuth) {
        this.options = options;
    }

    getCookies() {
        return this.cookies;
    }

    async getCSRF() {
        const response = await fetch('https://www.amocrm.ru/', {
            headers: {
                'Cookie': this.cookies
            }
        });
        const html = await response.text();

        const tokenRegExp = /id="csrf_token" .* value="(.*)"/;
        const matches = html.match(tokenRegExp);

        this.setCookies(response);

        return matches && matches[1];
    }

    setCookies(response: Response) {
        const { headers } = response;
        const cookies = headers.get('set-cookie');
        if (cookies) {
            this.cookies = cookies;
        }
    }
    async login() {
        const csrf = await this.getCSRF();
        const { username, password } = this.options;

        const params = {
            username,
            password,
            csrf_token: csrf
        };

        console.log(params);
        const body = JSON.stringify(params);

        const response = await fetch('https://www.amocrm.ru/oauth2/authorize', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': this.cookies
            }
        });
        // const token = await response.json();

        this.setCookies(response);
    }

    logout() {
    }
}