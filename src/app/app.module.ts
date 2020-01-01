import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { ResultContainerComponent } from './result-container/result-container.component'; 

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { HttpClientModule } from '@angular/common/http';

import { ChartsModule } from 'ng2-charts';
import { CanvasJSChartComponent, NgbdModalContent } from './canvas-js-chart/canvas-js-chart.component';
import { ToolTipDirective } from './tool-tip.directive';
import { NoSpacesDirective } from './no-spaces.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    ResultContainerComponent,
    CanvasJSChartComponent,
    NgbdModalContent,
    ToolTipDirective,
    NoSpacesDirective
  ],
  imports: [
    BrowserModule, NgbModule, BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule, MatAutocompleteModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent]
})
export class AppModule { }
