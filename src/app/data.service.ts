import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockData } from './model_data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getMockData() {
    return this.http.get<MockData>('http://192.168.0.104:8085/api/Mock/CIP/GetCIPSummary?startDateTime=2020-02-02%2010:00:00&endDateTime=2020-02-02%2023:00:00');
  }

}
