import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/services/order";
import { ApiResponse } from "@/types/api";
import { OrderWithDetails } from "@/types/order";

export async function GET(
	request: NextRequest,
	{ params }: { params: { slug: string } },
): Promise<NextResponse> {
	try {
		const orderId = parseInt(params.slug);

		if (isNaN(orderId)) {
			const response: ApiResponse<OrderWithDetails> = {
				success: false,
				error: "Invalid order ID",
			};
			return NextResponse.json(response, { status: 400 });
		}

		const order = await OrderService.findById(orderId);

		if (!order) {
			const response: ApiResponse<OrderWithDetails> = {
				success: false,
				error: "Order not found",
			};
			return NextResponse.json(response, { status: 404 });
		}

		const response: ApiResponse<OrderWithDetails> = {
			success: true,
			data: order,
		};
		return NextResponse.json(response);
	} catch {
		const response: ApiResponse<OrderWithDetails> = {
			success: false,
			error: "Failed to fetch order",
		};
		return NextResponse.json(response, { status: 500 });
	}
}
