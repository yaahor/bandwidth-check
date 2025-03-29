import { Bandwidth } from '../model/bandwidth';

export function mapSpeedMbpsToBandwidth(speedMbps: number): Bandwidth {
  if (speedMbps < 2) {
    return Bandwidth.LOW;
  }
  if (speedMbps < 5) {
    return Bandwidth.MEDIUM;
  }

  return Bandwidth.HIGH;
}
