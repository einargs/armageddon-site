export interface DeviceState {
  allowedUsers?: string[];
  reserved?: boolean;
}

export interface DeviceConfig {
  // Map of LED pin names to boolean on/off values
  leds: {[id: string]: boolean };
}

export interface Device {
  id: string;
  state: DeviceState;
  config: DeviceConfig;
}
