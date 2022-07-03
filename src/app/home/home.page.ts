import { Component } from '@angular/core';
import { LatestMovie } from 'src/Models/Movie/LatestMovie';
import { MovieService } from '../api/movies/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  movie: LatestMovie;

  constructor(private movieService: MovieService) {}
  
  ngOnInit() {
    this.getLatestMovie();
  }

  async getLatestMovie() {
    this.movieService.getLatestMovie().then((response: LatestMovie) => {
      this.movie = response;
      console.log(response);
    });
  }

}
