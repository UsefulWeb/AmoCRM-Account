import fs from "fs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {IEnvironment} from "./Environment";
import {IClientSessionOptions} from "./Client";
import setCookie from 'set-cookie-parser';

export interface IRequest {
    make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
    getCSRF(): Promise<string>;
    getCookies(): any[];
    clearCookies(): void;
}

export class Request implements IRequest {
    protected cookies: any[];
    protected cookie = '';
    protected readonly environment: IEnvironment;
    protected readonly client;
    constructor(environment: IEnvironment) {
        this.environment = environment;
        const sessionCookies = this.getCookiesFromSession();
        this.cookie = sessionCookies.join('\n');
        this.cookies = sessionCookies.map(cookie => this.parseCookie(cookie));

        const domain = this.environment.get<string>('domain');
        const baseURL = 'https://' + domain;

        this.client = axios.create({
            baseURL,
            // withCredentials: true,
            headers: {
                'Host': domain
            }
        });
    }

    protected getCookiesFromSession(): any[] {
        const { filename } = this.environment.get<IClientSessionOptions>('session');
        if (fs.existsSync(filename)) {
            const buffer = fs.readFileSync(filename);
            const contents = buffer.toString();
            const cookies = contents
                .split("\n");
            return cookies;
        }
        return [];
    }

    protected setCookiesFromResponse<T, D>(response: AxiosResponse<T, D>): void {
        const { headers } = response;
        const cookies = headers['set-cookie'];
        if (!cookies) {
            return;
        }
        this.setCookies(cookies);
    }

    getCookies() {
        return this.cookies;
    }

    async getCSRF() {
        const response = await this.make<string, undefined>('/');
        const html = response.data;
        const tokenRegExp = /id="csrf_token" .* value="(.*)"/;
        const matches = html.match(tokenRegExp);

        if (!matches) {
            throw new Error('NO_CSRF_TOKEN_FOUND');
        }
        return matches[1];
    }

    parseCookie(cookie: string) {
        const data = setCookie.parseString(cookie);
        return {
            ...data,
            cookie,
        };
    }
    setCookies(value: string[]) {
        const parsed = value.map(cookie => this.parseCookie(cookie));
        const parsedNames = parsed.map(({ name }) => name);
        const cookies = this.cookies
            .filter(({ name }) => !parsedNames.includes(name))
            .concat(parsed);

        this.cookies = cookies;
        this.cookie = cookies.map(({ cookie }) => cookie).join('; ');
        this.updateSession(cookies);
    }

    updateSession(cookies: any[]) {
        const contents = cookies.map(({cookie}) => cookie).join('\n');
        const { filename } = this.environment.get<IClientSessionOptions>('session');
        fs.writeFileSync(filename, contents);
    }

    clearCookies() {
        this.setCookies([]);
    }

    async make<T, D>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T, D>> {
        const { headers = {}} = config;
        const mergedConfig = {
            ...config,
            url,
            headers: {
                ...headers,
                Cookie: this.cookies.map(({ cookie }) => cookie)
            }
        };
        const response = await this.client.request(mergedConfig);
        // const response = await fetch(url, initWithHeaders);

        this.setCookiesFromResponse(response);
        return response;
    }
}