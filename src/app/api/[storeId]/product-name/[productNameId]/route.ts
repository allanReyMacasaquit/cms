import { db } from '@/app/db';
import { productName, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface PatchRequestBody {
	name: string;
	value: string;
}

interface PatchRequestParams {
	storeId: string;
	productNameId: string;
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
		const { name, value } = body;

		if (!name || !value) {
			return NextResponse.json(
				{ success: false, message: 'All fields are required' },
				{ status: 400 }
			);
		}

		const { productNameId, storeId } = await params;

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const updatedProductName = await db
			.update(productName)
			.set({ name, value })
			.where(
				and(eq(productName.id, productNameId), eq(productName.storeId, storeId))
			)
			.returning();

		if (updatedProductName.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Product Name not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: updatedProductName },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Internal error', error },
			{ status: 500 }
		);
	}
}

interface DeleteRequestParams {
	storeId: string;
	productNameId: string;
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
		const { storeId, productNameId } = await params;
		// Validate store ID
		if (!storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}
		if (!productNameId) {
			return NextResponse.json(
				{ success: false, message: 'productName ID is required' },
				{ status: 400 }
			);
		}

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		// Delete the store from the database
		const deletedProductName = await db
			.delete(productName)
			.where(
				and(eq(productName.storeId, storeId), eq(productName.id, productNameId))
			);

		// Handle case where productName is not found
		if (!deletedProductName) {
			return NextResponse.json(
				{ success: false, message: 'Product Name not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Product Name deleted successfully',
				data: deletedProductName,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[ProductName]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
interface GetRequestParams {
	productNameId: string;
}

export async function GET(
	req: Request,
	{ params }: { params: GetRequestParams }
) {
	try {
		// Validate sizeId from params
		const { productNameId } = await params;

		if (productNameId === 'new') {
			return NextResponse.json({
				success: true,
				message: 'New Product Name creation',
			});
		}
		if (!productNameId) {
			return new NextResponse('Store ID is Required', { status: 400 });
		}

		const productNames = await db.query.productName.findFirst({
			where: eq(productName.id, productNameId),
		});

		return NextResponse.json(productNames);
	} catch (error) {
		console.error('[PRODUCTNAME_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
