export interface DeviceState {
  allowedUsers?: string[];
  reserved?: boolean;
}

export interface Device {
  id: string;
  state: DeviceState;
}
