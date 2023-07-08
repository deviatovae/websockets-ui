import { Ship } from './ship';

export type Game = {
  id: number;
  ships: { [key: number]: Ship[] };
};
