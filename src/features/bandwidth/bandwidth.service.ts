import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { getDownloadSpeedMbps } from './lib/get-download-speed-mbps';
import { mapSpeedMbpsToBandwidth } from './lib/map-speed-mbps-to-bandwidth';
import { Bandwidth } from './model/bandwidth';

@Injectable({
  providedIn: 'root'
})
export class BandwidthService {
  constructor() { }

  getBandwidth(): Observable<Bandwidth> {
    return from(getDownloadSpeedMbps())
      .pipe(
        map(mapSpeedMbpsToBandwidth),
      );
  }
}
