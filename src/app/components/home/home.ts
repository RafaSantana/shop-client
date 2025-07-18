import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Monitor, Server, Search, Zap } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  readonly icons = {
    Monitor,
    Server,
    Search,
    Zap,
  };
}
