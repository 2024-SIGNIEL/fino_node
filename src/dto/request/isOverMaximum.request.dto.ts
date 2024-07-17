import { User } from 'src/prisma/client';

export class IsOverMaximumRequestDto {
  user: User;
}
