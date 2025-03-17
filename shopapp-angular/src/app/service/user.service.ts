import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDto } from '../dtos/user/register.dto';
import { LoginDto } from '../dtos/user/login.dto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}users/register`;
  private loginApiUrl =`${environment.apiBaseUrl}users/login`;
  constructor(private http: HttpClient) { }
  private createHeader(): HttpHeaders {
    return new HttpHeaders({ 
      'Content-Type': 'application/json' ,
      'Accept-Language': 'vi'
    });
  }
  private apiConfig = {
    headers: this.createHeader()
  }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(this.apiUrl, registerDto, this.apiConfig);
  }
  login(loginData: LoginDto): Observable<any> {
    return this.http.post(this.loginApiUrl, loginData, this.apiConfig);
  }
  
}
