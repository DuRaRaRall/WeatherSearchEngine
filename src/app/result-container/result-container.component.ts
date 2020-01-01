import { Component, OnInit } from '@angular/core';
import {SearchAndClearServiceService} from '../services/search-and-clear-service.service'
import {of, Subscription} from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import {CanvasJSChartComponent} from "../canvas-js-chart/canvas-js-chart.component"
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-result-container',
  templateUrl: './result-container.component.html',
  styleUrls: ['./result-container.component.css']
})
export class ResultContainerComponent implements OnInit {
  // state_short = {'Mississippi': 'MS', 'Oklahoma': 'OK', 'Delaware': 'DE', 'Minnesota': 'MN', 
  // 'Illinois': 'IL', 'Arkansas': 'AR', 'New Mexico': 'NM', 'Indiana': 'IN', 'Louisiana': 'LA', 
  // 'Texas': 'TX', 'Wisconsin': 'WI', 'Kansas': 'KS', 'Connecticut': 'CT', 'California': 'CA', 
  // 'West Virginia': 'WV', 'Georgia': 'GA', 'North Dakota': 'ND', 'Pennsylvania': 'PA', 'Alaska': 'AK', 
  // 'Missouri': 'MO', 'South Dakota': 'SD', 'Colorado': 'CO', 'New Jersey': 'NJ', 'Washington': 'WA', 
  // 'New York': 'NY', 'Nevada': 'NV', 'District Of Columbia': 'DC', 'Maryland': 'MD', 'Idaho': 'ID', 
  // 'Wyoming': 'WY', 'Arizona': 'AZ', 'Iowa': 'IA', 'Michigan': 'MI', 'Utah': 'UT', 'Virginia': 'VA', 
  // 'Oregon': 'OR', 'Montana': 'MT', 'New Hampshire': 'NH', 'Massachusetts': 'MA', 'South Carolina': 'SC', 
  // 'Vermont': 'VT', 'Florida': 'FL', 'Hawaii': 'HI', 'Kentucky': 'KY', 'Rhode Island': 'RI', 'Nebraska': 'NE', 
  // 'Ohio': 'OH', 'Alabama': 'AL', 'North Carolina': 'NC', 'Tennessee': 'TN', 'Maine': 'ME'};
  is_result = true;
  is_searching = false;
  is_shown = false;
  is_error = false;
  has_touched = false;
  is_favorite = false;
  progress_percent_number = 0;
  weekly_data: Object;
  form_data: Object;
  state_seal_url = "";
  activated_tab = "nav-current-tab";
  selected_property = "temperature";
  local_favorites_storage = {};
  table_storage = [];
  result_rounded_temp: Number;

  //chart.js variables
  public barChartOptions: ChartOptions;
  public barChartLabels: Label[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  clear_subscription: Subscription;
  search_subscription: Subscription;

  constructor(private httpClient: HttpClient, public sService: SearchAndClearServiceService) { }

  pressResults(){
    this.is_result = true;
  }
  
  pressFavorites(){
    this.is_result = false;
    this.has_touched = true;
    this.getFormattedLocal();
  }

  ngOnInit() {

    this.clear_subscription = this.sService.clear_object.subscribe((ret)=>{
      this.is_result = true;
      this.is_shown = false;
      this.sService.progress_percent_number = 0;
      this.weekly_data = {};
      this.is_error = false;
      this.result_rounded_temp = 0;
      this.form_data = {};
      this.sService.weather_storage_object = {};
    });
    this.search_subscription = this.sService.weather_json_object.subscribe((retJson:any)=>{
      if('currently' in retJson && retJson['currently']!=""){
        this.sService.progress_percent_number = 100;
        this.sService.is_searching = false;
        this.is_result = true;
        this.weekly_data = retJson;
        this.result_rounded_temp = Math.round(this.weekly_data['currently']['temperature']);
        this.is_shown = true;
        this.is_error = false;
        this.activated_tab = "nav-current-tab";
        this.form_data = this.sService.form_storage_object;

        //this.state_seal_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png";
        this.GetStateSeal(this.form_data['state']).subscribe((ret)=>{
          console.log(ret);
          if('items' in ret && ret['items'] != ""){
            this.state_seal_url = ret['items'][0]['link'];
            console.log(this.state_seal_url);
          }
        })

        this.set_chartJS_data(this.selected_property);

        this.sService.weather_storage_object = retJson;

        if(this.form_data['city'] in localStorage){
          this.is_favorite = true;
        }else{
          this.is_favorite = false;
        }

        console.log(retJson)
      }else{
        this.sService.progress_percent_number = 100;
        this.sService.is_searching = false;
        this.is_result = true;
        this.is_shown = false;
        this.is_error = true;
      }
      
    }), (err)=>{
      this.sService.progress_percent_number = 100;
      this.sService.is_searching = false;
      this.is_result = true;
      this.is_shown = false;
      this.is_error = true;
    }
  }

  GetStateSeal(state_text: string){
    if (state_text === '') {
      return of([]);
    }
    return this.httpClient.get('/getStateSeal?state_name='+state_text);
  }

  switch_tabs(text: string){
    this.activated_tab = text;
  }

  switch_property(text: string){
    this.selected_property = text;
    this.set_chartJS_data(text);
  }

  nice_num(range, round){
    if(range == 0){
      if(!round){
        return 0;
      }else if(round){
        return 1;
      }
    }
       
    let exp = Math.floor(Math.log10(range));
    let fraction = range / Math.pow(10, exp);
    let niceFraction;
    if (round) {
      if (fraction < 1.5)
        niceFraction = 1;
      else if (fraction < 3)
        niceFraction = 2;
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    }else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exp);
  }

  set_chartJS_data(text: string){
    let tmp_temp_data = [], tmp_data = this.weekly_data['hourly']['data'], min_num, max_num;
    if(text=="humidity"){
      min_num = tmp_data[0][text]*100, max_num = tmp_data[0][text]*100;
      for(let i=0;i<24;i++){
        min_num = min_num > tmp_data[i][text]*100?tmp_data[i][text]*100:min_num;
        max_num = max_num < tmp_data[i][text]*100?tmp_data[i][text]*100:max_num;
        tmp_temp_data.push(tmp_data[i][text]*100);
      }      
    }else{
      min_num = tmp_data[0][text], max_num = tmp_data[0][text];
      for(let i=0;i<24;i++){
        min_num = min_num > tmp_data[i][text]?tmp_data[i][text]:min_num;
        max_num = max_num < tmp_data[i][text]?tmp_data[i][text]:max_num;
        tmp_temp_data.push(tmp_data[i][text]);
      }
    }
    
    let range = this.nice_num(max_num - min_num, false);
    let tickSpacing = this.nice_num(range / 9, true);
    let niceMin = Math.floor(min_num / tickSpacing) * tickSpacing;
    let niceMax = Math.ceil(max_num / tickSpacing) * tickSpacing;
    if(niceMin >= min_num){
      niceMin -= tickSpacing;
    }
    if(niceMax <= max_num){
      niceMax += tickSpacing;
    }
    if(niceMax === niceMin){
      niceMin = Math.floor(min_num)-1;
      niceMax = Math.ceil(max_num)+1;
    }
  
    this.barChartData = [{data: tmp_temp_data, label: text, 
      backgroundColor: 'rgb(166, 207, 238)', hoverBackgroundColor: 'rgb(93, 134, 163)', 
      borderColor: 'rgb(166, 207, 238)'}];
    let y_label: string;
    switch(text){
      case 'temperature': y_label = 'Fahrenheit'; break;
      case 'pressure': y_label = 'Millibars'; break;
      case 'humidity': y_label = '% Humidity'; break;
      case 'ozone': y_label = 'Dobson Units'; break;
      case 'visibility': y_label = 'Miles (Maximum 10)'; break;
      case 'windSpeed': y_label = 'Miles per Hour'; break;
    }
    this.barChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      legend: {
        onClick: (e)=>e.stopPropagation()
      },
      scales: { 
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          }
        }], 
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: y_label
          },
          ticks: {
            suggestedMin: niceMin,
            suggestedMax: niceMax
          }
        }] }
    };
  }

  click_favorites(){
    if(!this.is_favorite){
      this.addItemtoLocal({
        city: this.form_data['city'],
        state: this.form_data['state'],
        state_seal_url: this.state_seal_url,
        lat: this.form_data['lat'],
        lon: this.form_data['lon']
      });
    }else{
      this.deleteItemfromLocal(this.form_data['city']);
    }
    this.is_favorite = !this.is_favorite;
  }

  addItemtoLocal(data){
    localStorage[data['city']]=JSON.stringify(data);
    this.getFormattedLocal();
  }
  deleteItemfromLocal(key){
    delete localStorage[key];
    this.getFormattedLocal();
  }
  getFormattedLocal(){
    let ret = [], i=0, tmp;
    for(let key of Object.keys(localStorage)){
      i++;
      console.log(localStorage);
      tmp = JSON.parse(localStorage[key]);
      tmp['id'] = i;
      ret.push(tmp);
    }
    console.log(ret);
    this.table_storage = ret;
  }

  search_pos(data){
    this.sService.search_pos(data);
    this.activated_tab = "nav-current-tab";
  }

  ngOnDestroy() {
    this.clear_subscription.unsubscribe();
    this.search_subscription.unsubscribe();
  }

}
