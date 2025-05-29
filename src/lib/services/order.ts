import prisma from "../prisma";
import { OrderCreateData, OrderUpdateData, OrderWithDetails } from "@/types/order";

export class OrderService {
	static async create(data: OrderCreateData): Promise<OrderWithDetails> {
		return await prisma.order.create({
			data,
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async findMany(): Promise<OrderWithDetails[]> {
		return await prisma.order.findMany({
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async findById(id: number): Promise<OrderWithDetails | null> {
		return await prisma.order.findUnique({
			where: { id },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async findByIdWithDetails(orderId: number) {
		return await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async update(id: number, data: OrderUpdateData): Promise<OrderWithDetails | null> {
		return await prisma.order.update({
			where: { id },
			data,
			include: {
				items: true,
			},
		});
	}

	static async delete(id: number): Promise<OrderWithDetails | null> {
		return await prisma.order.delete({
			where: { id },
			include: {
				items: true,
			},
		});
	}
}
