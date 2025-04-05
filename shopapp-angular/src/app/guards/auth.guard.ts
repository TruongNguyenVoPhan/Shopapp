import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateFn,
} from '@angular/router';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(
        private tokenService: TokenService,
        private router: Router,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserIdValid = this.tokenService.getUserId() > 0;
        debugger
        if (!isTokenExpired && isUserIdValid) {
            return true; // Allow access to the route
        }else {
            // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
            // Ví dụ trả về trang login:
            this.router.navigate(['/login']);
            return false; 
        }
    }
    
}
export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean => {
    debugger
    return inject(AuthGuard).canActivate(next, state); // Sử dụng inject để lấy AuthGuard instance
} 