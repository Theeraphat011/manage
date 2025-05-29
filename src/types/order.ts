import { Prisma} from '@prisma/client';

export type OrderCreateData = Prisma.OrderCreateInput;
export type OrderUpdateData = Prisma.OrderUpdateInput;
export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: { items: true };
}>;