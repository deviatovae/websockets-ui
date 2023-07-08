import { Room } from '../entity/room';
import { Player } from '../entity/player';

export class RoomRepository {
  private static lastId = 1;
  private readonly rooms: Room[] = [];

  create(player: Player): Room {
    const newRoom: Room = { id: RoomRepository.lastId++, users: [player] };

    this.rooms.push(newRoom);

    return newRoom;
  }

  getAvailableRooms(): Room[] | null {
    return this.rooms.filter(({ users }) => users.length < 2);
  }

  getRoom(id: number): Room | null {
    const room = this.rooms.find(({ id: roomId }) => id === roomId);

    return room ? { ...room } : null;
  }

  updateRoom(room: Room): boolean {
    const roomIdx = this.rooms.findIndex(({ id }) => id === room.id);
    if (roomIdx < 0) {
      return false;
    }
    this.rooms[roomIdx] = { ...room };
    return true;
  }
}