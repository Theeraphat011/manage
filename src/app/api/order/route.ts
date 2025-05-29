import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import { OrderService } from "@/lib/services/order";
import { OrderWithDetails } from "@/types/order";
import { ProductService } from "@/lib/services/products";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const data = await request.json();
		const { items } = data;

		if (!items || !Array.isArray(items) || items.length === 0) {
			const response: ApiResponse<OrderWithDetails> = {
				success: false,
				error: "Invalid input data - items array required",
			};
			return NextResponse.json(response, { status: 400 });
		}

		// Validate and process each item
		const orderItems = [];

		for (const item of items) {
			const { productId, quantity } = item;

			if (!productId || !quantity || quantity <= 0) {
				const response: ApiResponse<OrderWithDetails> = {
					success: false,
					error: "Invalid item data",
				};
				return NextResponse.json(response, { status: 400 });
			}

			const product = await ProductService.findById(parseInt(productId));

			if (!product) {
				const response: ApiResponse<OrderWithDetails> = {
					success: false,
					error: `Product not found: ${productId}`,
				};
				return NextResponse.json(response, { status: 404 });
			}

			const orderQuantity = parseInt(quantity);
            
			if (product.quantity < orderQuantity) {
				const response: ApiResponse<OrderWithDetails> = {
					success: false,
					error: `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${orderQuantity}`,
				};
				return NextResponse.json(response, { status: 400 });
			}

			const itemPrice = parseFloat((product.price * orderQuantity).toFixed(2));

			orderItems.push({
				productId: product.id,
				quantity: orderQuantity,
				price: itemPrice,
			});
		}

		const order = await OrderService.create({
			items: {
				create: orderItems,
			},
		});

		if (!order) {
			const response: ApiResponse<OrderWithDetails> = {
				success: false,
				error: "Failed to create order",
			};
			return NextResponse.json(response, { status: 500 });
		}

		// Update stock for all products
		for (const item of items) {
			const product = await ProductService.findById(parseInt(item.productId));
			if (product) {
				await ProductService.updateStock(
					product.id,
					product.quantity - parseInt(item.quantity),
				);
			}
		}

		const orderWithDetails = await OrderService.findByIdWithDetails(order.id);

		if (!orderWithDetails) {
			const response: ApiResponse<OrderWithDetails> = {
				success: false,
				error: "Failed to fetch order details",
			};
			return NextResponse.json(response, { status: 500 });
		}

		const response: ApiResponse<OrderWithDetails> = {
			success: true,
			data: orderWithDetails,
		};

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		const response: ApiResponse<OrderWithDetails> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create order",
		};

		return NextResponse.json(response, { status: 500 });
	}
}

export async function GET(): Promise<NextResponse> {
	try {
		const orders = await OrderService.findMany();

		const response: ApiResponse<OrderWithDetails[]> = {
			success: true,
			data: orders,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const response: ApiResponse<OrderWithDetails[]> = {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch orders",
		};

		return NextResponse.json(response, { status: 500 });
	}
}
