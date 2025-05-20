import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component'; // تأكد من استيراده
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule) // ⬅️ هذا يساعد أيضًا لكن مش كفاية لو component مش بتشوفه
  ]
});