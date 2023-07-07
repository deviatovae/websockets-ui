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

  getRoom(index: number): Room | null {
    const room = this.rooms.find(({ id: roomId }) => index === roomId);

    return room ? { ...room } : null;
  }
}
