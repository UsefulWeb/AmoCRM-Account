import qs from 'qs';
import {IClientRequest} from "./ClientRequest";
import {IAccountData} from "./Account";

export interface IAccountFactory {
    // get(): Promise<IAccount[]>;
    get(): Promise<IAccountData[]>;
    create(options: ICreateAccountOptions): Promise<ICreateAccountResponse>;
    isAvailable(subdomain: string): Promise<boolean>;
}

export interface ICreateAccountOptions {
    subdomain: string;
    account_name: string;
}

export interface ICheckAccountParams {
    subdomain: string;
}

export interface IGetAccountsResponse {
    _links: {
        self: {
            href: string,
            method: string
        }
    }
    _embedded: {
        items: IAccountData[]
    }
}

export interface ICreateAccountResult {
    response: ICreateAccountResponse;
}

export interface ICreateAccountResponse {
    auth: boolean;
    userid: number;
    user_api_key: string;
    accounts: ICreateAccountResponseAccount[];
    server_time: number;
    ip: string;
}

export interface ICreateAccountResponseAccount {
    id: number;
    name: string;
    subdomain: string;
    language: string;
    timezone: string;
    user_api_key: string;
    ip: string;
}

export class AccountFactory implements IAccountFactory {
    protected readonly request: IClientRequest;
    constructor(request: IClientRequest) {
        this.request = request;
    }

    async get() {
        const response = await this.request.make<IGetAccountsResponse, undefined>('/v3/accounts');
        const { data } = response;
        const { _embedded } = data;

        return _embedded.items;
    }

    async isAvailable(subdomain: string) {
        const url = '/account/check_subdomain.php';
        const response = await this.request.make<string, ICheckAccountParams>(url, {
            method: "POST",
            data: {
                subdomain
            }
        });

        const { data } = response;
        return data !== 'na';
    }

    async create(options: ICreateAccountOptions) {
        const available = await this.isAvailable(options.subdomain);
        if (!available) {
            throw new Error('ACCOUNT_IS_NOT_AVAILABLE');
        }
        const csrf = await this.request.getCSRF();
        const params = {
            ...options,
            csrf_token: csrf
        };
        const url = '/account/add.php';
        const response = await this.request.make<ICreateAccountResult, undefined>(url, {
            method: "POST",
            data: qs.stringify(params),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });
        const { data } = response;

        return data.response;
    }
}