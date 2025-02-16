import { DoodlerInterface } from '@/types/socket/doodler';

export interface DoodlerServiceInterface {
  addDoodler: (doodler: {
    id: string;
    name: string;
    avatar: object;
  }) => Promise<{
    doodlerId: string;
  }>;
  removeDoodler: (doodlerId: string) => Promise<boolean>;
  findDooder: (doodlerId: string) => Promise<{ doodler: DoodlerInterface }>;
  getDoodlers: (doodlerIds: string[]) => Promise<DoodlerInterface[]>;
}
