import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  alaQuote$: Observable<boolean>;
  //showAds = environment.showAds;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {
    this.alaQuote$ = this.appService.alaQuote$;
  }

}
