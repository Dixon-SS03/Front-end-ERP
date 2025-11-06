import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true, // siempre va antes o después del selector, pero dentro del @Component
  imports: [CommonModule, RouterLink, RouterLinkActive], // importa lo necesario
  templateUrl: './sidenav.html', // usa el nombre correcto del archivo
  styleUrls: ['./sidenav.css'], // debe ser 'styleUrls' en plural
})
export class SidenavComponent { 
 submenuOpen: Record<string, boolean> = {};

  toggleSubmenu(menu: string) {
    this.submenuOpen[menu] = !this.submenuOpen[menu];
  }

}
