import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AppComponent implements OnInit {
  countries: any[] = [];
  selectedCountry: string = '';
  weatherData: any = null;
  apiKey: string = '48dbcc17dfccd5ff9806342da5fe98cb'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (response) => {
        this.countries = response.map((country) => ({
          name: country.name.common,
          capital: country.capital ? country.capital[0] : 'Unknown'
        }));
        console.log('all countries : ' ,response);
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  onCountrySelect(): void {
    const selectedCountry = this.countries.find(
      (country) => country.name === this.selectedCountry
    );
    const capital = selectedCountry?.capital;
    console.log('country', selectedCountry, 'capital : ', capital)
    if (capital && capital !== 'Unknown') {
      this.fetchWeather(capital);
    } else {
      this.weatherData = { error: 'No capital city data available.' };
    }
  }

  fetchWeather(city: string): void {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
    console.log('url : ', url);
    this.http.get(url).subscribe(
      (data) => {
        this.weatherData = data;
        console.log('weather : ', data);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.weatherData = { error: 'Could not retrieve weather data.' };
      }
    );
  }
}
