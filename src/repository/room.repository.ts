import { Room } from '../entity/room';

export class RoomRepository {
  private static lastId = 1;
  private readonly rooms: Room[] = [];

  create(): Room {
    const newRoom: Room = { id: RoomRepository.lastId++, users: [] };

    this.rooms.push(newRoom);

    return newRoom;
  }

  getAvailableRooms(): Room[] | null {
    return this.rooms.filter(({ users }) => users.length < 2);
  }

  getRoom(index: number): Room | null {
    const room = this.rooms.find(({ id: roomId }) => index === roomId);

    return room ? { ...room } : null;
  }
}
