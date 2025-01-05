import { db } from '@/app/db';
import { productName, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { storeId } = params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		const { userId } = await auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		const body = await req.json();
		const { name, value } = body;

		if (!name) return new NextResponse('Name is required', { status: 400 });
		if (!value) return new NextResponse('Value is required', { status: 400 });

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const data = await db
			.insert(productName)
			.values({
				id: uuidv4(),
				storeId,
				name,
				value,
			})
			.returning();

		return NextResponse.json(data);
	} catch (error) {
		console.error('[PRODUCT_NAME_POST]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; productNameId?: string } }
) {
	try {
		const { storeId, productNameId } = params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (productNameId) {
			// Retrieve a specific product name by ID
			const productNames = await db.query.productName.findFirst({
				where: eq(productName.id, productNameId),
			});

			if (!productNames) {
				return new NextResponse('Product Name not found', { status: 404 });
			}

			return NextResponse.json(productNames);
		}

		// Retrieve all productNames for the store
		const productNames = await db.query.productName.findMany({
			where: eq(productName.storeId, storeId),
		});

		return NextResponse.json(productNames);
	} catch (error) {
		console.error('[PRODUCT_NAME_GET]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
