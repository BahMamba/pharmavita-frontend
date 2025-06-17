import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService, UserProfile } from '../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  userProfile$: Observable<UserProfile | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.userProfile$ = this.authService.getProfile();
  }

  ngOnInit(): void {
    const storedProfile = this.authService.getProfileFromStorage();
    if (!storedProfile) {
      this.authService.getProfile().subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}