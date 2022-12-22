import { IClientRequest } from "./ClientRequest";
import { IAccountData } from "./Account";
export interface IAccountFactory {
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
            href: string;
            method: string;
        };
    };
    _embedded: {
        items: IAccountData[];
    };
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
export declare class AccountFactory implements IAccountFactory {
    protected readonly request: IClientRequest;
    constructor(request: IClientRequest);
    get(): Promise<IAccountData[]>;
    isAvailable(subdomain: string): Promise<boolean>;
    create(options: ICreateAccountOptions): Promise<ICreateAccountResponse>;
}
