import { Prisma } from "@prisma/client";

export type ProductCreateData = Prisma.ProductCreateInput;
export type ProductUpdateData = Prisma.ProductUpdateInput;
export type ProductWithCategory = Prisma.ProductGetPayload<{
	include: { category: true }
}>;

// Add image-related types
export interface ProductImage {
	public_id: string;
	secure_url: string;
}

