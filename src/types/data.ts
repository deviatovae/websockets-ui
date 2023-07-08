export type RegData = {
  name: string;
  password: string;
};

export type RegDataResult = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type UpdateRoomResult = {
  roomId: number;
  roomUsers: RoomUser[];
};

export type RoomUser = {
  name: string;
  index: number;
};

export type AddToRoom = {
  indexRoom: number;
};
