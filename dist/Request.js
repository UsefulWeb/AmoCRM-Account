"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const set_cookie_parser_1 = tslib_1.__importDefault(require("set-cookie-parser"));
class Request {
    constructor(environment) {
        this.cookie = '';
        this.environment = environment;
        const sessionCookies = this.getCookiesFromSession();
        this.cookie = sessionCookies.join('\n');
        this.cookies = sessionCookies.map(cookie => this.parseCookie(cookie));
        const domain = this.environment.get('domain');
        const baseURL = 'https://' + domain;
        this.client = axios_1.default.create({
            baseURL,
            // withCredentials: true,
            headers: {
                'Host': domain
            }
        });
    }
    getCookiesFromSession() {
        const { filename } = this.environment.get('session');
        if (fs_1.default.existsSync(filename)) {
            const buffer = fs_1.default.readFileSync(filename);
            const contents = buffer.toString();
            const cookies = contents
                .split("\n");
            return cookies;
        }
        return [];
    }
    setCookiesFromResponse(response) {
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
    getCSRF() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.make('/');
            const html = response.data;
            const tokenRegExp = /id="csrf_token" .* value="(.*)"/;
            const matches = html.match(tokenRegExp);
            if (!matches) {
                throw new Error('NO_CSRF_TOKEN_FOUND');
            }
            return matches[1];
        });
    }
    parseCookie(cookie) {
        const data = set_cookie_parser_1.default.parseString(cookie);
        return Object.assign(Object.assign({}, data), { cookie });
    }
    setCookies(value) {
        const parsed = value.map(cookie => this.parseCookie(cookie));
        const parsedNames = parsed.map(({ name }) => name);
        const cookies = this.cookies
            .filter(({ name }) => !parsedNames.includes(name))
            .concat(parsed);
        this.cookies = cookies;
        this.cookie = cookies.map(({ cookie }) => cookie).join('; ');
        this.updateSession(cookies);
    }
    updateSession(cookies) {
        const contents = cookies.map(({ cookie }) => cookie).join('\n');
        const { filename } = this.environment.get('session');
        fs_1.default.writeFileSync(filename, contents);
    }
    clearCookies() {
        this.setCookies([]);
    }
    make(url, config = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { headers = {} } = config;
            const mergedConfig = Object.assign(Object.assign({}, config), { url, headers: Object.assign(Object.assign({}, headers), { Cookie: this.cookies.map(({ cookie }) => cookie) }) });
            const response = yield this.client.request(mergedConfig);
            // const response = await fetch(url, initWithHeaders);
            this.setCookiesFromResponse(response);
            return response;
        });
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map