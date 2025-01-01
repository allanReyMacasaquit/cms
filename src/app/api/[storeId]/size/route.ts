import { db } from '@/app/db';
import { size, store } from '@/app/schema';
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
			.insert(size)
			.values({
				id: uuidv4(),
				storeId,
				name,
				value,
			})
			.returning();

		return NextResponse.json(data);
	} catch (error) {
		console.error('[SIZE_POST]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; sizeId?: string } }
) {
	try {
		const { storeId, sizeId } = params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (sizeId) {
			// Retrieve a specific size by ID
			const sizeData = await db.query.size.findFirst({
				where: eq(size.id, sizeId),
			});

			if (!sizeData) {
				return new NextResponse('Size not found', { status: 404 });
			}

			return NextResponse.json(sizeData);
		}

		// Retrieve all sizes for the store
		const sizes = await db.query.size.findMany({
			where: eq(size.storeId, storeId),
		});

		return NextResponse.json(sizes);
	} catch (error) {
		console.error('[SIZE_GET]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
