export interface TokenResponse {
    access_token: string,
    expires_in: number,
    scope: string,
    token_type: string,
    id_token: string,
    refresh_token: string
}