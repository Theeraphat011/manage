import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services/products";
import { ProductWithCategory } from "@/types/product";
import { ApiResponse } from "@/types/api";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const price = parseFloat(formData.get("price") as string);
		const categoryId = formData.get("categoryId") as string;
		const images = formData.getAll("images") as File[];

		if (!name || !description || !price || isNaN(price) || !categoryId) {
			const response: ApiResponse<ProductWithCategory> = {
				success: false,
				error: "Invalid input data",
			};

			return NextResponse.json(response, { status: 400 });
		}

		const dataURI = await Promise.all(
			images.map(async (image) => {
				const buffer = Buffer.from(await image.arrayBuffer());
				const base64 = buffer.toString("base64");
				return `data:${image.type};base64,${base64}`;
			}),
		);

		const uploadResults = await Promise.all(
			dataURI.map(async (dataUri) => {
				return await cloudinary.uploader.upload(dataUri, {
					folder: "products",
				});
			}),
		);

		console.log("Cloudinary upload successful:", uploadResults);

		const product = await ProductService.create({
			name,
			description,
			price,
			category: { connect: { id: parseInt(categoryId) } },
			images: uploadResults.map((result) => result.secure_url),
		});

		const response: ApiResponse<ProductWithCategory> = {
			success: true,
			data: product,
		};

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		const response: ApiResponse<ProductWithCategory> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create product",
		};
		console.error("Error creating product:", error);

		return NextResponse.json(response, { status: 500 });
	}
}

export async function GET(): Promise<NextResponse> {
	try {
		const products: ProductWithCategory[] = await ProductService.findMany();

		const response: ApiResponse<ProductWithCategory[]> = {
			success: true,
			data: products,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const response: ApiResponse<ProductWithCategory[]> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch products",
		};

		return NextResponse.json(response, { status: 500 });
	}
}
