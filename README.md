import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { ProductService } from '@/lib/services/products';
import { ApiResponse } from '@/types/api';
import { ProductWithCategory } from '@/types/product';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const name = formData.get('name')?.toString();
    const price = Number(formData.get('price'));

    if (!image || !name || isNaN(price)) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataURI = `data:${image.type};base64,${base64}`;

    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      folder: 'products',
    });

    const product = await ProductService.create({
      name,
      price,
      imageUrl: uploadRes.secure_url,
    });

    const response: ApiResponse<ProductWithCategory> = {
      success: true,
      data: product,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<ProductWithCategory> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
