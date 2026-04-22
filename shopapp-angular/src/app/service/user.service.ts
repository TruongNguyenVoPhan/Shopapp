import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDto } from '../dtos/user/register.dto';
import { LoginDto } from '../dtos/user/login.dto';
import { environment } from '../environment/environment';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}users/register`;
  private apiLogin =`${environment.apiBaseUrl}users/login`;
  private apiUserDetail =`${environment.apiBaseUrl}users/details`;
  localStorage?:Storage;
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
    return this.http.post(this.apiLogin, loginData, this.apiConfig);
  }
  getUserDetails(token: string){
    return this.http.get(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }
  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    debugger
    let userResponse = this.getUserFromSession();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  // saveUserResponseToLocalStorage(userResponse?: UserResponse) {
  //   try {
  //     debugger
  //     if(userResponse == null || userResponse == undefined) {
  //       return;
  //     }
  //     //Convert the userResponse object to a string and save it to localStorage
  //     const userResponseString = JSON.stringify(userResponse);
  //     localStorage.setItem('user', userResponseString);
  //   }catch (error) {
  //     console.error('Error saving user response to local storage:', error);
  //   }
  // }
  // getUserResponseFromLocalStorage(){
  //   try {
  //     const userResponseJson = localStorage.getItem('user');
  //     if(userResponseJson == null || userResponseJson == undefined) {
  //       return;
  //     }
  //     const userResponse = JSON.parse(userResponseJson!);
  //     console.log('User response from local storage:', userResponse);
  //     return userResponse;
  //   } catch (error) {
  //     console.error('Error retrieving user response from local storage:', error);
  //     return null;
  //   }
  // }
  // removeUserFromLocalStorage(): void {
  //   try {
  //     localStorage.removeItem('user'); // dùng trực tiếp global localStorage
  //     console.log('User data removed from local storage.');
  //   } catch (error) {
  //     console.error('Error removing user data from local storage:', error);
  //   }
  // }

  saveUserResponseToSession(userResponse?: UserResponse) {
    try {
      if (!userResponse) return;

      const userResponseString = JSON.stringify(userResponse);
      sessionStorage.setItem('user', userResponseString);
    } catch (error) {
      console.error('Error saving user response:', error);
    }
  }

  getUserFromSession(): UserResponse | null {
    try {
      const data = sessionStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  removeUserFromSession(): void {
    try {
      sessionStorage.removeItem('user');
      console.log('User data removed from session storage.');
    } catch (error) {
      console.error('Error removing user data from session storage:', error);
    }
  }
  
  logout(): void {
    try {
      sessionStorage.clear();

      localStorage.clear();

      console.log('Đã logout sạch sẽ');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
