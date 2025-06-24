import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'mangaRocks';
  loading$: any;


  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }


}
