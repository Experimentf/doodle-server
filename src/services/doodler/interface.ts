import { DoodlerInterface } from '@/types/socket/doodler';

export interface DoodlerServiceInterface {
  addDoodler: (doodler: {
    id: string;
    name: string;
    avatar: object;
  }) => Promise<DoodlerInterface>;
  removeDoodler: (doodlerId: string) => Promise<boolean>;
  findDooder: (doodlerId: string) => Promise<DoodlerInterface>;
  getDoodlers: (doodlerIds: string[]) => Promise<DoodlerInterface[]>;
  incrementScore: (doodlerId: string, value: number) => Promise<void>;
  clearScore: (doodlerId: string) => Promise<void>;
}
