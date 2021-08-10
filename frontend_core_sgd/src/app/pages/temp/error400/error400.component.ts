import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error400',
  templateUrl: './error400.component.html',
  styleUrls: ['./error400.component.scss']
})
export class Error400Component implements OnInit {

  error: any | null;
  private errors: any[] | null;

  constructor(private _activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    
  }
  
  ngOnDestroy(): void {}

}
