import { Prisma } from '@prisma/client';

export type CategoryCreateData = Prisma.CategoryCreateInput;
export type CategoryUpdateData = Prisma.CategoryUpdateInput;
export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: { products: true };
}>;

