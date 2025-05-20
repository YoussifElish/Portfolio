import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParticlesDirective } from './particles.directive';
import { AnimatedSkillBarsDirective } from './animated-skill-bars.directive';
import { ProjectCardAnimationsDirective } from './project-card-animations.directive';
import { ContactIconAnimationsDirective } from './contact-icon-animations.directive';
import { ApiService, Project } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ParticlesDirective,
    AnimatedSkillBarsDirective,
    ProjectCardAnimationsDirective,
    ContactIconAnimationsDirective,
    HttpClientModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // Contact form
  contactForm!: FormGroup;
  submitted = false;
  success = false;
  loading = false;
  errorMessage = '';
  
  // Education data - static content
  education = {
    degree: 'Bachelor of Computer Science',
    period: '2018 - 2022',
    institution: 'Cairo University',
    courses: [
      'Web Development',
      'Database Systems',
      'Software Engineering',
      'Data Structures & Algorithms'
    ]
  };
  
  // Experience data - static content
  experience = {
    title: '.NET Developer',
    period: '2022 - Present',
    company: 'Tech Solutions Inc.',
    responsibilities: [
      'Developed and maintained ASP.NET Core web applications',
      'Implemented RESTful APIs using C# and Entity Framework',
      'Optimized database queries and improved application performance',
      'Collaborated with cross-functional teams to deliver high-quality software'
    ]
  };
  
  // Skills data - static content
  skills = {
    programming: [
      { name: 'C#', level: 95 },
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'SQL', level: 90 }
    ],
    frameworks: [
      { name: 'ASP.NET Core', level: 95 },
      { name: 'Entity Framework', level: 90 },
      { name: 'Angular', level: 80 },
      { name: 'React', level: 75 }
    ],
    tools: [
      { name: 'Visual Studio', level: 95 },
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 80 },
      { name: 'Azure DevOps', level: 85 }
    ],
    databases: [
      { name: 'SQL Server', level: 95 },
      { name: 'MongoDB', level: 80 },
      { name: 'PostgreSQL', level: 75 }
    ]
  };
  
  // Projects data from API
  projects: Project[] = [];
  projectsLoading = true;
  projectsError = false;
  
  // Project filters
  filters = ['all', 'web', 'api', 'mobile'];
  activeFilter = 'all';
  
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}
  
  ngOnInit() {
    // Initialize form
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    // Load projects from API
    this.loadProjects();
  }
  
  ngAfterViewInit() {
    // Visual enhancements are now handled by directives
    // No need to manually load scripts here
  }
  
  // Load projects from API
 loadProjects() {
    this.projectsLoading = true;
    this.projectsError = false;
    
    this.apiService.getProjects().subscribe({
      next: (data) => {
        // Filter out Draft projects and add link
        this.projects = data
          .filter(project => project.status !== 'Draft')
          .map(project => ({
            ...project,
            link: project.link || `/projects/${project.id}`
          }));
        this.projectsLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.projectsError = true;
        this.projectsLoading = false;
        this.projects = [];
      }
    });
  }
  
  // Form controls accessor
  get f() { return this.contactForm.controls; }
  
  // Filter projects based on active filter
filteredProjects() {
    if (this.activeFilter === 'all') {
      return this.projects; // Already filtered for non-Draft in loadProjects
    }
    
    // Add category filtering if API supports it later
    return this.projects;
  }
  
  // Set active filter
  setFilter(filter: string) {
    this.activeFilter = filter;
  }
  
  // Form submission
  onSubmit() {
    this.submitted = true;
    this.success = false;
    this.errorMessage = '';
    
    // Check if form is valid
    if (this.contactForm.invalid) {
      return;
    }
    
    // Submit form to API
    this.loading = true;
    
    const formData = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message
    };
    
    this.apiService.submitContactForm(formData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.submitted = false;
        this.contactForm.reset();
      },
      error: (error) => {
        console.error('Error submitting contact form:', error);
        this.errorMessage = 'Failed to submit the form. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  // Scroll methods
  scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  
getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return ''; // Trigger placeholder
    }
    // Handle full URLs if API returns them
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://elish-portfolio.runasp.net/${imagePath}`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none'; // Show placeholder
  }
}
