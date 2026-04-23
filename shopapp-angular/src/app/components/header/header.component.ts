import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';  
import { NavigationEnd } from '@angular/router';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [    
    CommonModule,
    NgbModule,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit{
  userResponse?:UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  totalQuantity: number = 0;

  constructor(
    private userService: UserService, 
    private cartService: CartService,
    private tokenService: TokenService,    
    private router: Router,
  ) {
    
   }
   ngOnInit() {
    this.userResponse = this.userService.getUserFromSession();

    this.cartService.loadCart().subscribe();

    this.cartService.cartItems$.subscribe(items => {
      this.totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
  
        if (url === '/') {
          this.activeNavItem = 0;
        } else if (url.includes('/notifications')) {
          this.activeNavItem = 1;
        } else if (url.includes('/orders')) {
          this.activeNavItem = 2;
        }
      }
    });
  }
  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //alert(`Clicked on "${index}"`);
    if(index === 0) {
      debugger
      this.router.navigate(['/user-profile']);                      
    } else if (index === 2) {
      this.userService.logout();
      this.tokenService.removeToken();
      this.userResponse = null;
      this.cartService.clearCart();
      
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item    
  }

  
  setActiveNavItem(index: number) {    
    this.activeNavItem = index;
    //alert(this.activeNavItem);
  }  
}

