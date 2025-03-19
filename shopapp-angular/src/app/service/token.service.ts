import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDto } from '../dtos/user/register.dto';
import { LoginDto } from '../dtos/user/login.dto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
   private readonly TOKEN_KEY =  'access_token';
    constructor() {}
    //getter & setter
    getToken(): String | null {
        return localStorage.getItem(this.TOKEN_KEY);

    }
    
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}
