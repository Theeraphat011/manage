import { Prisma } from "@prisma/client";

export type ProductCreateData = Prisma.ProductCreateInput;
export type ProductUpdateData = Prisma.ProductUpdateInput;
export type ProductWithCategory = Prisma.ProductGetPayload<{
	include: { category: true };
}>;
