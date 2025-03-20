export interface ExchangeCodeRequest{
    AuthCode : string
    CodeVerifier : string | null
    IsMobile : boolean 
}