import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
   private readonly TOKEN_KEY =  'access_token';
   private jwtHelperService = new JwtHelperService();
    constructor() {}
    //getter & setter
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
    getUserInfoFromToken(): any {
        debugger
        return this.jwtHelperService.decodeToken(this.getToken() ?? '');        
    }
    getUserId(): number {
        debugger
        let userObject = this.jwtHelperService.decodeToken(this.getToken() ?? '');
        console.log(this.jwtHelperService.decodeToken(this.getToken() ?? ''));
        return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
    }
    isTokenExpired(): boolean { 
        debugger
        if(this.getToken() == null) {
            return false;
        }       
        return this.jwtHelperService.isTokenExpired(this.getToken()!);
    }
}
