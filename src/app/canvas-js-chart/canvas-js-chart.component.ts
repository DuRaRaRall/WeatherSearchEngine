import { Component, OnInit, Input } from '@angular/core';
import * as CanvasJS from 'node_modules/canvasjs-2.3.2/canvasjs.min'
import {SearchAndClearServiceService} from '../services/search-and-clear-service.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-canvas-js-chart',
  templateUrl: './canvas-js-chart.component.html',
  styleUrls: ['./canvas-js-chart.component.css']
})
export class CanvasJSChartComponent implements OnInit {
  weather2BigIcon = {
    "clear-day": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
    "clear-night": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
    "rain": "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png",
    "snow": "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png",
    "sleet": "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png",
    "wind": "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png",
    "fog": "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png",
    "cloudy": "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png",
    "partly-cloudy-day": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png",
    "partly-cloudy-night": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png"
  };

  constructor(private sService: SearchAndClearServiceService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.set_canvasJS_data();
  }

  set_canvasJS_data(){
    console.log("CanvasJS sucks");
    let ca_data_points = [];
    let data_source = this.sService.weather_storage_object['daily']['data'];
    let timezone = this.sService.weather_storage_object['timezone'];
    let lat = this.sService.weather_storage_object['latitude'];
    let lon = this.sService.weather_storage_object['longitude'];
    for(let i=0; i<7; i++){
      ca_data_points.push({ x: 8-i, y:[Math.round(data_source[i]['temperatureLow']), Math.round(data_source[i]['temperatureHigh'])], label: new Date(data_source[i]['time']*1000).toLocaleString("en-GB", {timeZone: timezone}).split(',')[0]});
    }
    console.log(ca_data_points);
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      dataPointWidth: 12,
      title: {
        text: "Weekly Weather"
      },
      axisX: {
        title: "Days"
      },
      axisY: {
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10,
        gridThickness: 0
      }, 
      legend: {
        verticalAlign: "top"
      },
      data: [{
        type: "rangeBar",
        showInLegend: true,
        color: "rgb(145, 203, 240)",
        indexLabel: "{y[#index]}",
        legendText: "Day wise temperature range",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        click: (e)=>{
          this.sService.getDailyWeather(lat, lon, data_source[e.dataPointIndex]['time']).subscribe(
            (res) => {
              const modalRef = this.modalService.open(NgbdModalContent);
              let daily_weather_data = res;
              console.log(res);
              modalRef.componentInstance.daily_data = {
                date_string: ca_data_points[e.dataPointIndex]['label'],
                city: this.sService.form_storage_object['city'],
                temperature: 'temperature' in daily_weather_data['currently']?Math.round(daily_weather_data['currently']['temperature']): "N/A",
                summary: 'summary' in daily_weather_data['currently']?daily_weather_data['currently']['summary']:"N/A",
                img_src: 'icon' in daily_weather_data['currently']?this.weather2BigIcon[daily_weather_data['currently']['icon']]:"",
                precip: 'precipIntensity' in daily_weather_data['currently']?Math.round(daily_weather_data['currently']['precipIntensity']*100)/100:"N/A",
                CoR: 'precipProbability' in daily_weather_data['currently']?Math.round(daily_weather_data['currently']['precipProbability']*100): "N/A",
                windSpeed: 'windSpeed' in daily_weather_data['currently']?Math.round(daily_weather_data['currently']['windSpeed']*100)/100:"N/A",
                humidity: 'humidity' in daily_weather_data['currently']?Math.round(daily_weather_data['currently']['humidity']*100):"N/A",
                visibility: 'visibility' in daily_weather_data['currently']?Math.round(daily_weather_data['currently']['visibility']):"N/A"
              };
            },
            (err) => {
              console.log('fault');
            }
          );
          console.log(e.dataPointIndex);
        },
        dataPoints: ca_data_points
      }]
    });
    chart.render();
  }

}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <style>
      @media (min-width: 992px) { 
        h4 {
          font-size: 24px;
        }
        .modal_first_row {
          margin: 0px 20px;
        }
        .modal_local_text {
          border-bottom: 1px solid rgba(1,1,1,0.1);
          padding-bottom: 10px;
        }
        .modal_icon {
          border-bottom: 1px solid rgba(1,1,1,0.1);
          padding-bottom: 10px;
        }
        .modal_city{
          font-size: 25px;
        }
        .modal_temp {
          font-size: 40px;
        }
        .modal_summary {
          font-size: 17px;
        }
        .daily_label{
          font-size: 15px;
        }
        #weather_icon {
          margin-top: 25px;
          padding-left: 10px;
          padding-right: 10px;

        }
        .daily_row {
          padding-top: 10px;
        }
      }
      @media (max-width: 576px) { 
        h4 {
          font-size: 20px;
        }
        .modal_first_row {
          margin: 0px 20px;
        }
        .modal_local_text {
          border-bottom: 1px solid rgba(1,1,1,0.1);
          padding-bottom: 10px;
        }
        .modal_icon {
          border-bottom: 1px solid rgba(1,1,1,0.1);
          padding-bottom: 10px;
          padding-left: 0;
          padding-right: 0;
        }
        .modal_city{
          font-size: 25px;
        }
        .modal_temp {
          font-size: 39px;
        }
        .modal_summary {
          font-size: 17px;
        }
        .daily_label{
          font-size: 15px;
        }
        #weather_icon {
          margin-top: 25px;
        }
        .daily_row {
          padding-top: 10px;
          margin: 0 20px;
        }
      }

      .inline_text{
        display: inline-block;
      }
      #daily_degree_circle{
        width: 10px;
        margin-right: 10px;
        display: inline-block;
        vertical-align: top;
      }
    </style>
    <div class="modal-header" style="background-color:rgb(90, 136, 164)">
      <h4 class="modal-title">{{daily_data.date_string}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="background-color:rgb(145, 203, 240)">
      <div class="row modal_first_row">
        <div class="col-sm-6 col-8 modal_local_text">
          <div class="modal_city">{{daily_data.city}}</div>
          <div>
            <div class="inline_text modal_temp"> {{daily_data.temperature}} </div>
            <img id="daily_degree_circle" src="https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png"/>
            <div class="inline_text modal_temp">F</div>
          </div>
          <div class="modal_summary">{{daily_data.summary}}</div>
        </div>
        <div class="col-sm-6 col-4 modal_icon">
          <img id="weather_icon" class="col-sm-6 col-12 offset-sm-3" [src]="daily_data.img_src" alt="N/A"/>
        </div>
      </div>
      <div class="row daily_row">
        <div class="col-sm-6 offset-sm-6 col-12">
          <div class="daily_label">Precipitation : {{daily_data.precip}}</div>
          <div class="daily_label">Chance of Rain : {{daily_data.CoR}} %</div>
          <div class="daily_label">Wind Speed : {{daily_data.windSpeed}} mph</div>
          <div class="daily_label">Humidity : {{daily_data.humidity}} %</div>
          <div class="daily_label">Visibility : {{daily_data.visibility}} miles</div>
        </div>
      </div>
    </div>
  `
})
export class NgbdModalContent {
  @Input() daily_data;

  constructor(public activeModal: NgbActiveModal) {}
}