import { NextRequest, NextResponse} from 'next/server';
import { ProductService } from '@/lib/services/products';
import { ProductWithCategory } from '@/types/product';
import { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const data = await request.json();
        const product: ProductWithCategory = await ProductService.create(data);

        const response: ApiResponse<ProductWithCategory> = {
            success: true,
            data: product,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        const response: ApiResponse<ProductWithCategory> = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create product',
        };

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
            error: error instanceof Error ? error.message : 'Failed to fetch products',
        };

        return NextResponse.json(response, { status: 500 });
    }
}