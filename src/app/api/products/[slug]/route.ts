import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services/products";
import { ProductWithCategory, ProductUpdateData } from "@/types/product";
import { ApiResponse } from "@/types/api";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { slug: string } },
): Promise<NextResponse<ApiResponse<ProductWithCategory>>> {
	const slug = params.slug;
	const data: ProductUpdateData = await request.json();

	try {
		const updatedProduct = await ProductService.update(parseInt(slug), data);

		if (!updatedProduct) {
			return NextResponse.json(
				{
					success: false,
					message: "Product not found",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Product updated successfully",
			data: updatedProduct,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : "An error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { slug: string } },
): Promise<NextResponse<ApiResponse<null>>> {
	const slug = params.slug;

	try {
		await ProductService.delete(parseInt(slug));
		return NextResponse.json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : "An error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { slug: string } },
): Promise<NextResponse<ApiResponse<ProductWithCategory>>> {
	const slug = params.slug;

	try {
		const product = await ProductService.findById(parseInt(slug));
		if (!product) {
			return NextResponse.json(
				{
					success: false,
					message: "Product not found",
				},
				{ status: 404 },
			);
		}
		return NextResponse.json({
			success: true,
			message: "Product retrieved successfully",
			data: product,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : "An error occurred",
			},
			{ status: 500 },
		);
	}
}
