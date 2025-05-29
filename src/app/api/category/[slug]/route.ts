import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/lib/services/category";
import { CategoryWithProducts, CategoryCreateData } from "@/types/category";
import { ApiResponse } from "@/types/api";

export async function GET(
	request: NextRequest,
	{ params }: { params: { slug: string } },
): Promise<NextResponse> {
	try {
		const { slug } = await params;
		const category = await CategoryService.findById(parseInt(slug));
		if (!category) {
			const response: ApiResponse<CategoryWithProducts> = {
				success: false,
				error: "Category not found",
			};
			return NextResponse.json(response, { status: 404 });
		}
		const response: ApiResponse<CategoryWithProducts> = {
			success: true,
			data: category,
		};
		return NextResponse.json(response, { status: 200 });
	}
	catch (error) {
		const response: ApiResponse<CategoryWithProducts> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch category",
		};
		return NextResponse.json(response, { status: 500 });
	}

}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { slug: string } },
): Promise<NextResponse> {
	try {
		const { slug } = await params;
		const data: CategoryCreateData = await request.json();

		const category = await CategoryService.update(parseInt(slug), data);

		if (!category) {
			const response: ApiResponse<CategoryWithProducts> = {
				success: false,
				error: "Category not found",
			};
			return NextResponse.json(response, { status: 404 });
		}

		const response: ApiResponse<CategoryWithProducts> = {
			success: true,
			data: category,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const response: ApiResponse<CategoryWithProducts> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update category",
		};

		return NextResponse.json(response, { status: 500 });
	}
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } },
): Promise<NextResponse> {
    try {
        const { slug } = await params;

        const deleted = await CategoryService.delete(parseInt(slug));

        if (!deleted) {
            const response: ApiResponse<CategoryWithProducts> = {
                success: false,
                error: "Category not found",
            };
            return NextResponse.json(response, { status: 404 });
        }

		const response: ApiResponse<CategoryWithProducts> = {
			success: true,
		};

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        const response: ApiResponse<CategoryWithProducts> = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete category",
        };

        return NextResponse.json(response, { status: 500 });
    }
}