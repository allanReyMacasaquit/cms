import { db } from '@/app/db';
import { image, product, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface PatchRequestBody {
	name: string;
	price: string;
	categoryId: string;
	sizeId: string;
	colorId: string;
	images: { url: string }[]; // Ensure images are an array of objects with `url` property
	isFeatured?: boolean;
	isArchived?: boolean;
}

interface PatchRequestParams {
	storeId: string;
	productId: string;
}

export async function PATCH(
	req: Request,
	{ params }: { params: PatchRequestParams }
) {
	try {
		// Authenticate the user
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'Unauthenticated' },
				{ status: 401 }
			);
		}

		// Parse request body
		const body: PatchRequestBody = await req.json();
		const {
			name,
			price,
			categoryId,
			sizeId,
			colorId,
			images,
			isFeatured,
			isArchived,
		} = body;

		// Validate required fields
		if (
			!name ||
			!price ||
			!categoryId ||
			!sizeId ||
			!colorId ||
			!images ||
			!images.length
		) {
			return NextResponse.json(
				{
					success: false,
					message: 'All fields except booleans and images are required',
				},
				{ status: 400 }
			);
		}

		// Validate params
		const { productId, storeId } = params;
		if (!productId || !storeId) {
			return NextResponse.json(
				{ success: false, message: 'Product ID and Store ID are required' },
				{ status: 400 }
			);
		}

		// Verify the store ownership
		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized access' },
				{ status: 403 }
			);
		}

		// Update product details
		const updatedProduct = await db
			.update(product)
			.set({
				name,
				price,
				categoryId,
				sizeId,
				colorId,
				isFeatured: isFeatured ?? false,
				isArchived: isArchived ?? false,
			})
			.where(and(eq(product.id, productId), eq(product.storeId, storeId)))
			.returning();

		// Check if update was successful
		if (updatedProduct.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Product not found' },
				{ status: 404 }
			);
		}

		// Delete existing images for the product
		await db.delete(image).where(eq(image.productId, productId));

		// Insert new images for the product
		const newImages = images.map((image) => ({
			id: uuidv4(),
			url: typeof image === 'string' ? image : image.url,
			productId,
		}));

		const insertedImages = await db.insert(image).values(newImages).returning();

		// Return the updated product and images
		const responseData = {
			product: updatedProduct[0],
			images: insertedImages.map((img) => ({ url: img.url })),
		};

		return NextResponse.json(
			{ success: true, data: responseData },
			{ status: 200 }
		);
	} catch (error) {
		console.error('[PATCH Product]', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
			},
			{ status: 500 }
		);
	}
}

interface DeleteRequestParams {
	storeId: string;
	productId: string;
}

export async function DELETE(
	req: Request,
	{ params }: { params: DeleteRequestParams }
) {
	try {
		// Authenticate the user
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'Unauthenticated' },
				{ status: 401 }
			);
		}
		const { storeId, productId } = await params;
		// Validate store ID
		if (!storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}
		if (!productId) {
			return NextResponse.json(
				{ success: false, message: 'DASHBOARD ID is required' },
				{ status: 400 }
			);
		}

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}
		const deletedImages = await db
			.delete(image)
			.where(eq(image.productId, productId));

		// Delete the product from the database
		const deletedProduct = await db
			.delete(product)
			.where(and(eq(product.storeId, storeId), eq(product.id, productId)));

		// Handle case where Product is not found
		if (!deletedProduct) {
			return NextResponse.json(
				{ success: false, message: 'Product not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Product and associated images deleted successfully',
				data: { deletedProduct, deletedImages },
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[Product_DELETE]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
interface GetRequestParams {
	productId: string;
}

export async function GET(
	req: Request,
	{ params }: { params: GetRequestParams }
) {
	try {
		// Validate dashboardId from params
		const { productId } = await params;

		if (productId === 'new') {
			return NextResponse.json({
				success: true,
				message: 'New Product Creation',
			});
		}
		if (!productId) {
			return new NextResponse('Store ID is Required', { status: 400 });
		}

		const products = await db.query.product.findFirst({
			where: eq(product.id, productId),
		});

		return NextResponse.json(products);
	} catch (error) {
		console.error('[PRODUCTS_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE_IMAGE(
	req: Request,
	{
		params,
	}: { params: { storeId: string; productId: string; imageId: string } }
) {
	try {
		// Authenticate the user
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'Unauthenticated' },
				{ status: 401 }
			);
		}
		const { storeId, productId, imageId } = params;

		// Validate store ID and product ID
		if (!storeId || !productId || !imageId) {
			return NextResponse.json(
				{ success: false, message: 'Invalid parameters' },
				{ status: 400 }
			);
		}

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		// Delete the image from the database
		const deletedImage = await db
			.delete(image)
			.where(and(eq(image.productId, productId), eq(image.id, imageId)));

		// Handle case where Image is not found
		if (!deletedImage) {
			return NextResponse.json(
				{ success: false, message: 'Image not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Image deleted successfully',
				data: deletedImage,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[Image_DELETE]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
