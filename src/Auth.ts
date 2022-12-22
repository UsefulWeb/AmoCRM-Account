import {IEnvironment} from "./Environment";
import {IRequest} from "./Request";
import {IClientAuthOptions} from "./Client";

export interface IAuth {
    login(): Promise<boolean>;
    logout(): void;

    isLoggedIn(): boolean;
}

export interface IToken {
    token_type: string;
    expires_in: number,
    access_token: string;
    refresh_token: string;
}
export interface ILoginData {
    username: string;
    password: string;
    csrf_token: string;
}
export class Auth implements IAuth {
    protected cookies = '';
    protected connected = false;
    protected environment: IEnvironment;
    protected request: IRequest;

    constructor(environment: IEnvironment, request: IRequest) {
        this.environment = environment;
        this.request = request;
    }

    isLoggedIn() {
        const cookies = this.request.getCookies();
        const accessToken = cookies.find(({ name }) => name === 'access_token');

        if (!accessToken) {
            return false;
        }
        const { expires } = accessToken;

        const expiresDate = new Date(expires);

        const now = new Date;
        if (now > expiresDate) {
            return false;
        }
        return true;
    }

    async login() {
        const csrf = await this.request.getCSRF();
        const { username, password } = this.environment.get<IClientAuthOptions>('auth');

        const data: ILoginData = {
            username,
            password,
            csrf_token: csrf
        };

        const now = new Date;
        const response = await this.request.make<IToken, ILoginData>('/oauth2/authorize', {
            method: 'POST',
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data) {
            return false;
        }
        const token = response.data;
        const { access_token, refresh_token, expires_in } = token;

        const expires = new Date;
        expires.setTime(now.getTime() + expires_in * 1000);

        const cookieOptions = {
            expires
        };

        return true;
        // this.request.addCookie('access_token', access_token, cookieOptions);
        // this.request.addCookie('refresh_token', refresh_token, cookieOptions);
    }

    logout() {
        this.request.clearCookies();
    }
}