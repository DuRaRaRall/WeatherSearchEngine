import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasJSChartComponent } from './canvas-js-chart.component';

describe('CanvasJSChartComponent', () => {
  let component: CanvasJSChartComponent;
  let fixture: ComponentFixture<CanvasJSChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasJSChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasJSChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
