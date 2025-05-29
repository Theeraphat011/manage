import prisma from "@/lib/prisma";
import { CategoryCreateData, CategoryUpdateData, CategoryWithProducts } from "@/types/category";

export class CategoryService {
    static async create(data: CategoryCreateData): Promise<CategoryWithProducts> {
        return await prisma.category.create({
            data,
            include: {
                products: true,
            },
        });
    }

    static async findMany(): Promise<CategoryWithProducts[]> {
        return await prisma.category.findMany({
            include: {
                products: true,
            },
        });
    }

    static async findById(id: number): Promise<CategoryWithProducts | null> {
        return await prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
    }

    static async update(id: number, data: CategoryUpdateData): Promise<CategoryWithProducts | null> {
        return await prisma.category.update({
            where: { id },
            data,
            include: {
                products: true,
            },
        });
    }

    static async delete(id: number): Promise<CategoryWithProducts | null> {
        return await prisma.category.delete({
            where: { id },
            include: {
                products: true,
            },
        });
    }
}