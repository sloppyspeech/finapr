import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from '../app/home/home.page';
import { AuthGuard } from './access/auth.guard';

const routes: Routes =
  [
    // {path: '',redirectTo: 'login',pathMatch: 'full'},
    { path: '', loadChildren: './access/login/login.module#LoginPageModule' },
    { path: 'login', loadChildren: './access/login/login.module#LoginPageModule' },
    { path: 'reset-password', loadChildren: './access/reset-password/reset-password.module#ResetPasswordPageModule' },
    { path: 'register', loadChildren: './access/register/register.module#RegisterPageModule'},
    { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
    { path: 'access', loadChildren: './access/access.module#AccessPageModule', canActivate: [AuthGuard] },
    { path: 'pay', loadChildren: './payment/payment.module#PaymentPageModule', canActivate: [AuthGuard] },
    { path: 'listtrans', loadChildren: './listtrans/listtrans.module#ListtransPageModule', canActivate: [AuthGuard] },
    { path: 'logout', loadChildren: './access/logout/logout.module#LogoutPageModule', canActivate: [AuthGuard] },
    { path: 'add-expense', loadChildren: './expenses/expenses.module#ExpensesPageModule', canActivate: [AuthGuard] },
    { path: 'allexpenses', loadChildren: './listexpenses/listexpenses.module#ListexpensesPageModule', canActivate: [AuthGuard] },
    { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule', canActivate: [AuthGuard] },
    { path: 'admin-messages', loadChildren: './admin-messages/admin-messages.module#AdminMessagesPageModule', canActivate: [AuthGuard]   },
    { path: 'my-messages', loadChildren: './my-messages/my-messages.module#MyMessagesPageModule', canActivate: [AuthGuard]  },
    { path: 'admin-reports', loadChildren: './admin-reports/admin-reports.module#AdminReportsPageModule' }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
