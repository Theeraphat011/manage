import prisma from "../prisma";
import { ProductCreateData, ProductWithCategory, ProductUpdateData } from "@/types/product";

export class ProductService {
	static async create(data: ProductCreateData): Promise<ProductWithCategory> {
		return await prisma.product.create({
			data,
			include: {
				category: true,
			},
		});
	}

	static async findMany(): Promise<ProductWithCategory[]> {
		return await prisma.product.findMany({
			include: {
				category: true,
			},
		});
	}

	static async findById(id: number): Promise<ProductWithCategory | null> {
		return await prisma.product.findUnique({
			where: { id },
			include: {
				category: true,
			},
		});
	}

	static async update(id: number, data: ProductUpdateData): Promise<ProductWithCategory | null> {
		return await prisma.product.update({
			where: { id },
			data,
			include: {
				category: true,
			},
		});
	}

	static async delete(id: number): Promise<ProductWithCategory | null> {
		return await prisma.product.delete({
			where: { id },
			include: {
				category: true,
			},
		});
	}
}
