import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService, ContactRequest } from '../../services/api.service';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-requests.component.html',
  styleUrls: ['./contact-requests.component.scss']
})
export class ContactRequestsComponent implements OnInit {
  contactRequests: ContactRequest[] = [];
  loading = true;
  error = false;
  
  selectedRequest: ContactRequest | null = null;
  showMessageDetail = false;
  
  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}
  
  ngOnInit(): void {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }
    
    // Load contact requests from API
    this.loadContactRequests();
  }
  
  loadContactRequests(): void {
    this.loading = true;
    this.error = false;
    
    this.apiService.getContactRequests().subscribe({
      next: (data) => {
        this.contactRequests = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contact requests:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/admin/login']);
  }
  
  viewMessage(request: ContactRequest): void {
    this.selectedRequest = request;
    this.showMessageDetail = true;
    
    // Mark as read if it was unread
    if (!request.read) {
      this.markAsRead(request.id);
    }
  }
  
  closeMessageDetail(): void {
    this.showMessageDetail = false;
    this.selectedRequest = null;
  }
  
  deleteMessage(id: number): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.apiService.deleteContactRequest(id).subscribe({
        next: () => {
          // Remove from local array
          this.contactRequests = this.contactRequests.filter(request => request.id !== id);
          
          // Close detail view if the deleted message was selected
          if (this.selectedRequest && this.selectedRequest.id === id) {
            this.closeMessageDetail();
          }
        },
        error: (error) => {
          console.error(`Error deleting contact request ${id}:`, error);
          alert('Failed to delete message. Please try again.');
        }
      });
    }
  }
  
  markAsRead(id: number): void {
    this.apiService.markAsRead(id).subscribe({
      next: (updatedRequest) => {
        // Update in local array
        const index = this.contactRequests.findIndex(r => r.id === id);
        if (index !== -1) {
          this.contactRequests[index].read = true;
        }
        
        // Update selected request if it's the one being marked
        if (this.selectedRequest && this.selectedRequest.id === id) {
          this.selectedRequest.read = true;
        }
      },
      error: (error) => {
        console.error(`Error marking contact request ${id} as read:`, error);
      }
    });
  }
  
  markAsUnread(id: number): void {
    this.apiService.markAsUnread(id).subscribe({
      next: (updatedRequest) => {
        // Update in local array
        const index = this.contactRequests.findIndex(r => r.id === id);
        if (index !== -1) {
          this.contactRequests[index].read = false;
        }
        
        // Update selected request if it's the one being marked
        if (this.selectedRequest && this.selectedRequest.id === id) {
          this.selectedRequest.read = false;
        }
      },
      error: (error) => {
        console.error(`Error marking contact request ${id} as unread:`, error);
      }
    });
  }
  
  getUnreadCount(): number {
    return this.contactRequests.filter(request => !request.read).length;
  }
}
