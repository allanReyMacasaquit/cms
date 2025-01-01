import { db } from '@/app/db';
import { category, store } from '@/app/schema';
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
		const { name, dashboardId } = body;

		if (!name) return new NextResponse('Name is required', { status: 400 });
		if (!dashboardId)
			return new NextResponse('Dashboard ID is required', { status: 400 });

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const data = await db
			.insert(category)
			.values({
				id: uuidv4(),
				name,
				dashboardId,
				storeId,
			})
			.returning();

		return NextResponse.json(data);
	} catch (error) {
		console.error('[CATEGORY_POST]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; categoryId?: string } }
) {
	try {
		const { storeId, categoryId } = params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (categoryId) {
			// Retrieve a specific dashboard by ID
			const categoryData = await db.query.category.findFirst({
				where: eq(category.id, categoryId),
			});

			if (!categoryData) {
				return new NextResponse('Dashboard not found', { status: 404 });
			}

			return NextResponse.json(categoryData);
		}

		// Retrieve all categories for the dashboard
		const categories = await db.query.category.findMany({
			where: eq(category.storeId, storeId),
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.error('[CATEGORY_GET]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
