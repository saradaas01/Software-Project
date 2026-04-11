import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { OsmService } from './osm/osm.service'
import { WeatherService } from './weather/weather.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    })
  ],
  providers: [OsmService, WeatherService],
  exports: [OsmService, WeatherService]
})

export class IntegrationsModule { }
