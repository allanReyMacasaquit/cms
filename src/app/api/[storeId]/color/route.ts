import { db } from '@/app/db';
import { color, store } from '@/app/schema';
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

		const colorData = await db
			.insert(color)
			.values({
				id: uuidv4(),
				storeId,
				name,
				value,
			})
			.returning();

		return NextResponse.json(colorData);
	} catch (error) {
		console.error('[COLOR_POST]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; colorId?: string } }
) {
	try {
		const { storeId, colorId } = params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (colorId) {
			// Retrieve a specific color by ID
			const colorData = await db.query.color.findFirst({
				where: eq(color.id, colorId),
			});

			if (!colorData) {
				return new NextResponse('Size not found', { status: 404 });
			}

			return NextResponse.json(colorData);
		}

		// Retrieve all colors for the store
		const colors = await db.query.color.findMany({
			where: eq(color.storeId, storeId),
		});

		return NextResponse.json(colors);
	} catch (error) {
		console.error('[COLOR_GET]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
