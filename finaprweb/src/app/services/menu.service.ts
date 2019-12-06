import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject  } from 'rxjs';



interface Menu{
  title:string,
  url:string,
  icon:string
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private appMenu:Menu[]=[{
    title: 'Login',
    url: '/login',
    icon: 'log-in'
  },
  {
    title: 'Reset Password',
    url: '/reset-password',
    icon: 'key'
  },
  {
    title: 'Register User',
    url: '/register',
    icon: 'person-add'
  }
  ];

  private menuList=new BehaviorSubject<Menu[]>(this.appMenu);

  constructor() { }

  getMenuItems():Observable<Menu[]> {
    return this.menuList.asObservable();
  }

  setUserMenu(){
    console.log('In MenuService setUserMenu');
    this.appMenu=[
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'My Payments',
        url: '/listtrans',
        icon: 'book'
      },
      {
        title: 'My Messages',
        url: '/my-messages',
        icon: 'chatboxes'
      },
      {
        title: 'Make Payment',
        url: '/pay',
        icon: 'briefcase'
      },
      {
        title: 'Logout',
        url: '/logout',
        icon: 'log-out'
      }
    ]
    this.menuList.next(this.appMenu);
  }
  setAdminMenu(){
    console.log('In Menu Service setAdminMenu');
    this.appMenu=[
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'All Apartment Expenses',
        url: '/allexpenses',
        icon: 'albums'
      },
      {
        title: 'DashBoard',
        url: '/dashboard',
        icon: 'analytics'
      },
      {
        title: 'Add Expense',
        url: '/add-expense',
        icon: 'add'
      },
      {
        title: 'Message from Admin',
        url: '/admin-messages',
        icon: 'chatboxes'
      },
      {
        title: 'Reports',
        url: '/admin-reports',
        icon: 'book'
      },
      
      {
        title: 'Logout',
        url: '/logout',
        icon: 'log-out'
      }
    ];
    this.menuList.next(this.appMenu);
  }

  setLoginMenu(){
    this.appMenu=[
      {
      title: 'Login',
      url: '/login',
      icon: 'log-in'
      },
      {
      title: 'Reset Password',
      url: '/reset-password',
      icon: 'key'
      },
      {
      title: 'Register User',
      url: '/register',
      icon: 'person-add'
      }
    ];
    this.menuList.next(this.appMenu);

  }

}
