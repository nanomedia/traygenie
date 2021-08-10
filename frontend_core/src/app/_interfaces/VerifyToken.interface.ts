export interface IVerifyTokenIdpResponse {
    success: boolean;
    consent: boolean;
    redirectUri?: string;
    data?: any;
}