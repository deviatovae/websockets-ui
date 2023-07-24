import { MessageType } from './messageType';

export type Message = {
  type: MessageType;
  data: string;
  id: number;
};

export const createResultMessage = <T>({
  id,
  type,
  data,
}: {
  id: number;
  type: MessageType;
  data: T;
}): Message => ({
  id,
  type,
  data: JSON.stringify(data),
});
