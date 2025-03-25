import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { Component } from '@angular/core';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: LoginComponent, canActivate: [authGuard]},
    // {path: 'transactions', loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent)} ,
    // {path: 'reports', loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent) },
    // {path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: '**', redirectTo: '/login'}

];
