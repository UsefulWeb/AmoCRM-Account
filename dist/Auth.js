"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const tslib_1 = require("tslib");
class Auth {
    constructor(environment, request) {
        this.cookies = '';
        this.connected = false;
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
    login() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const csrf = yield this.request.getCSRF();
            const { username, password } = this.environment.get('auth');
            const data = {
                username,
                password,
                csrf_token: csrf
            };
            const now = new Date;
            const response = yield this.request.make('/oauth2/authorize', {
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
        });
    }
    logout() {
        this.request.clearCookies();
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map