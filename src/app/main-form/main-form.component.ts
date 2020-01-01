import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  debounceTime,
  map,
  distinctUntilChanged
} from "rxjs/operators";
import { fromEvent, of, pipe} from 'rxjs';
import {SearchAndClearServiceService} from '../services/search-and-clear-service.service'


@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css']
})
export class MainFormComponent implements OnInit {
  @ViewChild("city_input", { static: true }) city_input: ElementRef;
  statenames:string[];
  state_short =  {};
  mainForm = {
    street: '',
    city: '',
    state: 'default',
    is_cur_loc: false,
  };
  options: string[] = [];


  constructor(private httpClient: HttpClient, private sService: SearchAndClearServiceService) { 
    this.statenames = ['Alabama',  'Alaska',  'Arizona',  'Arkansas',  
    'California',  'Colorado',  'Connecticut',  'Delaware',  
    'District Of Columbia',  'Florida',  'Georgia',  'Hawaii',  
    'Idaho',  'Illinois',  'Indiana',  'Iowa',  'Kansas',  'Kentucky',  
    'Louisiana',  'Maine',  'Maryland',  'Massachusetts',  'Michigan',  
    'Minnesota',  'Mississippi',  'Missouri',  'Montana',  'Nebraska',  
    'Nevada',  'New Hampshire',  'New Jersey',  'New Mexico',  'New York',
    'North Carolina',  'North Dakota',  'Ohio',  'Oklahoma',  'Oregon',  
    'Pennsylvania',  'Rhode Island',  'South Carolina',  'South Dakota',  
    'Tennessee',  'Texas',  'Utah',  'Vermont',  'Virginia',  'Washington',  
    'West Virginia',  'Wisconsin',  'Wyoming'];
    
    this.state_short = {'Mississippi': 'MS', 'Oklahoma': 'OK', 'Delaware': 'DE', 'Minnesota': 'MN', 
    'Illinois': 'IL', 'Arkansas': 'AR', 'New Mexico': 'NM', 'Indiana': 'IN', 'Louisiana': 'LA', 
    'Texas': 'TX', 'Wisconsin': 'WI', 'Kansas': 'KS', 'Connecticut': 'CT', 'California': 'CA', 
    'West Virginia': 'WV', 'Georgia': 'GA', 'North Dakota': 'ND', 'Pennsylvania': 'PA', 'Alaska': 'AK', 
    'Missouri': 'MO', 'South Dakota': 'SD', 'Colorado': 'CO', 'New Jersey': 'NJ', 'Washington': 'WA', 
    'New York': 'NY', 'Nevada': 'NV', 'District Of Columbia': 'DC', 'Maryland': 'MD', 'Idaho': 'ID', 
    'Wyoming': 'WY', 'Arizona': 'AZ', 'Iowa': 'IA', 'Michigan': 'MI', 'Utah': 'UT', 'Virginia': 'VA', 
    'Oregon': 'OR', 'Montana': 'MT', 'New Hampshire': 'NH', 'Massachusetts': 'MA', 'South Carolina': 'SC', 
    'Vermont': 'VT', 'Florida': 'FL', 'Hawaii': 'HI', 'Kentucky': 'KY', 'Rhode Island': 'RI', 'Nebraska': 'NE', 
    'Ohio': 'OH', 'Alabama': 'AL', 'North Carolina': 'NC', 'Tennessee': 'TN', 'Maine': 'ME'};
  }


  ngOnInit() {
    const source = fromEvent(this.city_input.nativeElement, 'keyup');
    source.pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // Time in milliseconds between key events
      ,debounceTime(400)        
      // If previous query is diffent from current   
      ,distinctUntilChanged()
    ).subscribe((text: string) => {
      console.log(text);
      this.GetAutoCompleteJSON(text).subscribe((res)=>{
        console.log('res',res);
        this.options = [];
        if(res != "" && res['status'] == "OK"){
          for(let i=0; i<res['predictions'].length; i++){
            this.options.push(res['predictions'][i]['structured_formatting']['main_text']);
          }
        }
        
      },(err)=>{
        this.options = [];
        console.log('error',err);
      });
    });
  }

  GetAutoCompleteJSON(text: string){
    if (text.trim() === '') {
      return of([]);
    }
    return this.httpClient.get('/getAutoC?AutoC='+text);
  }

  onSubmit(){
    this.sService.search(this.mainForm);
    //this.sService.pseudo_search()
  }
  
  onClear(){
    this.mainForm.street="";
    this.mainForm.city="";
    this.mainForm.state="default";
    this.mainForm.is_cur_loc= false;
    this.options = [];
    this.sService.clear();
  }
}
