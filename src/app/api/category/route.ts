import { CategoryService } from "@/lib/services/category";
import { ApiResponse } from "@/types/api";
import { CategoryCreateData, CategoryWithProducts } from "@/types/category";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const data: CategoryCreateData = await request.json();

		const existingCategory = await CategoryService.findMany();
		const categoryExists = existingCategory.find((category) => category.name === data.name);

		if (categoryExists) {
			const response: ApiResponse<CategoryWithProducts> = {
				success: false,
				error: "Category already exists",
			};
			return NextResponse.json(response, { status: 400 });
		}

		const category = await CategoryService.create(data);

		const response: ApiResponse<CategoryWithProducts> = {
			success: true,
			data: category,
		};

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		const response: ApiResponse<CategoryWithProducts> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create category",
		};

		return NextResponse.json(response, { status: 500 });
	}
}

export async function GET(): Promise<NextResponse> {
	try {
		const categories = await CategoryService.findMany();

		const response: ApiResponse<CategoryWithProducts[]> = {
			success: true,
			data: categories,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const response: ApiResponse<CategoryWithProducts[]> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch categories",
		};

		return NextResponse.json(response, { status: 500 });
	}
}

