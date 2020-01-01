import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchAndClearServiceService {
  clear_object = new Subject();
  weather_json_object = new Subject();
  form_storage_object = {
    street: '',
    city: '',
    state: 'default',
    is_cur_loc: false,
    lat: 0,
    lon: 0
  };
  weather_storage_object = {};
  is_searching = false;
  progress_percent_number = 0;
  constructor(private httpClient: HttpClient) {
    
  }

  pseudoJSON_object = new Subject();

  pseudo_search(){
    this.is_searching = true;
    this.progress_percent_number = 50;
    this.httpClient.get('assets/sample_data_daily.json')
    .subscribe(data=>{
      this.form_storage_object.city = "Los Angeles";
      this.form_storage_object.state = "California";
      this.form_storage_object.lat = 37.8267;
      this.form_storage_object.lon = -122.4233;
      this.pseudoJSON_object.next(data);
      console.log(data)
    });
  }

  search(form_data){
    this.is_searching = true;
    this.progress_percent_number = 50;
    this.form_storage_object.is_cur_loc = form_data.is_cur_loc;

    if(form_data.is_cur_loc){


      this.getLocalPos().subscribe((res)=>{
        console.log(res);
        if('status' in res && res['status']=='success')
        {
          let lat = res['lat'], lon = res['lon'];
          console.log(lat);
          this.form_storage_object.lat = lat;
          this.form_storage_object.lon = lon;
          this.form_storage_object.street = '';
          this.form_storage_object.city = res['city'];
          this.form_storage_object.state = res['region'];

          this.getWeather(lat, lon).subscribe(res=>{
            console.log(res);
            if('currently' in res){
              this.weather_json_object.next(res);
              this.weather_storage_object = res;
            }else{
              this.weather_json_object.next(res);
            }
          })
        }else{
          this.weather_json_object.next(res);
        }
      })

    }else{
      this.form_storage_object.street = form_data.street;
      this.form_storage_object.city = form_data.city;
      this.form_storage_object.state = form_data.state;

      let street = form_data['street'], city = form_data['city'], state = form_data['state'];
      this.getPosFromAddr(street, city, state).subscribe((res)=>{
        console.log(res);
        if(res['status']=='OK'){
          let lat = res['results'][0]['geometry']['location']['lat'], lon = res['results'][0]['geometry']['location']['lng'];
          console.log(lat);
          this.form_storage_object.lat = lat;
          this.form_storage_object.lon = lon;
          this.getWeather(lat, lon).subscribe(res=>{
            console.log(res);
            if('currently' in res){
              this.weather_json_object.next(res);
              this.weather_storage_object = res;
            }else{
              this.weather_json_object.next(res);
            }
          })
        }else {
          this.weather_json_object.next(res);
        }
      })
    }
  }

  search_pos(data){
    this.is_searching = true;
    this.progress_percent_number = 50;
    this.form_storage_object.city = data['city'];
    this.form_storage_object.state = data['state'];
    this.form_storage_object.lat = data['lat'];
    this.form_storage_object.lon = data['lon'];
    this.getWeather(data['lat'], data['lon']).subscribe(res=>{
      console.log(res);
      if('currently' in res){
        this.weather_json_object.next(res);
        //this.pseudoJSON_object.next(res);
        this.weather_storage_object = res;
      }else{
        this.weather_json_object.next(res);
      }
    })
  }

  clear(){
    //Actually no argument is needed here
    this.clear_object.next("clear");
  }

  getLocalPos(){
    return this.httpClient.get('http://ip-api.com/json');
  }

  getWeather(a_lat, a_lon){
    return this.httpClient.get('/getWeather?lat='+a_lat+'&lon='+a_lon);
  }

  getPosFromAddr(a_street, a_city, a_state){
    return this.httpClient.get('/getLocFromAddr?street='+a_street+'&city='+a_city+'&state='+a_state);
  }

  getDailyWeather(a_lat, a_lon, a_time){
    return this.httpClient.get('/getDailyWeather?lat='+a_lat+'&lon='+a_lon+'&time='+a_time);
    //return this.httpClient.get('assets/sample_data_daily2.json');
  }

}
