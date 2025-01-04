import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/app/db';
import { image, product, store } from '@/app/schema';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { storeId } = params;

		// Validate `storeId`
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		// Authenticate user
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		// Parse and validate the request body
		const body = await req.json();
		const {
			name,
			price,
			colorId,
			categoryId,
			sizeId,
			images,
			isFeatured = false,
			isArchived = false,
		} = body;

		if (!name) return new NextResponse('Name is required', { status: 400 });
		if (!price) return new NextResponse('Price is required', { status: 400 });
		if (!colorId)
			return new NextResponse('Color ID is required', { status: 400 });
		if (!categoryId)
			return new NextResponse('Category ID is required', { status: 400 });
		if (!sizeId)
			return new NextResponse('Size ID is required', { status: 400 });
		if (!images || !images.length)
			return new NextResponse('At least one image is required', {
				status: 400,
			});

		// Verify if the store belongs to the authenticated user
		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		// Insert the product into the database
		const [newProduct] = await db
			.insert(product)
			.values({
				id: uuidv4(),
				name,
				price,
				storeId,
				categoryId,
				sizeId,
				colorId,
				isFeatured,
				isArchived,
			})
			.returning();

		if (!newProduct?.id) {
			throw new Error('Failed to create the product');
		}

		// Insert images linked to the new product
		await db.insert(image).values(
			images.map((url: string) => ({
				id: uuidv4(),
				url,
				productId: newProduct.id,
			}))
		);

		// Construct response data
		const responseData = {
			product: newProduct,
			images: images.map((url: string) => ({ url })),
		};

		// Log the response data
		console.log('[Product_POST] Response Data:', responseData);

		// Return the response
		return new NextResponse(JSON.stringify(responseData), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('[Product_POST] Error:', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; productId?: string } }
) {
	try {
		const { storeId, productId } = params;

		// Validate store ID
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (productId) {
			// Retrieve a specific product with its images
			const productData = await db.query.product.findFirst({
				where: eq(product.id, productId),
				with: {
					images: true, // Fetch related images
				},
			});

			if (!productData) {
				return new NextResponse('Product not found', { status: 404 });
			}

			return NextResponse.json(productData);
		}

		// Retrieve all products for the store with their images
		const products = await db.query.product.findMany({
			where: eq(product.storeId, storeId),
			with: {
				images: true, // Fetch related images for all products
			},
		});
		console.log(
			`Product Result ${productId} - Product with images: ${products}`
		);

		// Respond with products and their associated images
		return NextResponse.json({ data: products });
	} catch (error) {
		console.error('[PRODUCTS_GET]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
