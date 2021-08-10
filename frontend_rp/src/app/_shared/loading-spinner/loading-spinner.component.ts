import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

  innerWidth:string = '0px';
  constructor() { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth +'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth +'px';
  }

}
