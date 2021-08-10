export interface IRpAuthRequest {
    prompt: string;
    scopes: string;
    acr: string;
    responseTypes: string;
    maxAge: string;
    loginHint: string;
}