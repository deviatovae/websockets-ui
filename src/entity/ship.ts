export type Ship = {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: ShipType;
};

export type ShipPosition = {
  x: number;
  y: number;
};

export enum ShipType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Huge = 'huge',
}
