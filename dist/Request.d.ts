import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IEnvironment } from "./Environment";
export interface IRequest {
    make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
    getCSRF(): Promise<string>;
    getCookies(): any[];
    clearCookies(): void;
}
export declare class Request implements IRequest {
    protected cookies: any[];
    protected cookie: string;
    protected readonly environment: IEnvironment;
    protected readonly client: import("axios").AxiosInstance;
    constructor(environment: IEnvironment);
    protected getCookiesFromSession(): any[];
    protected setCookiesFromResponse<T, D>(response: AxiosResponse<T, D>): void;
    getCookies(): any[];
    getCSRF(): Promise<string>;
    parseCookie(cookie: string): {
        cookie: string;
        name: string;
        value: string;
        path?: string | undefined;
        expires?: Date | undefined;
        maxAge?: number | undefined;
        domain?: string | undefined;
        secure?: boolean | undefined;
        httpOnly?: boolean | undefined;
        sameSite?: string | undefined;
    };
    setCookies(value: string[]): void;
    updateSession(cookies: any[]): void;
    clearCookies(): void;
    make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
}
