import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
   private readonly TOKEN_KEY =  'access_token';
   private jwtHelper = new JwtHelperService();
    constructor() {}
    //getter & setter
    getToken(): string | null {
        const token = localStorage.getItem(this.TOKEN_KEY);
        return token !== null ? String(token) : null;
    }
    
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
    getUserInfoFromToken(): any {
        debugger
        return this.jwtHelper.decodeToken(this.getToken() ?? '');        
    }
    getUserId(): number {
        let userObject = this.jwtHelper.decodeToken(this.getToken() ?? '');
        return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
    }
    isTokenExpired(): boolean { 
        if(this.getToken() == null) {
            return false;
        }       
        return this.jwtHelper.isTokenExpired(this.getToken()!);
    }
}
