import { MessageType } from './messageType';

export type Message = {
  type: MessageType;
  data: string;
  id: number;
};
