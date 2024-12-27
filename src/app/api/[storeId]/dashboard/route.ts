import { db } from '@/app/db';
import { dashboard, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		// Validate storeId from params
		const { storeId } = await params;
		if (!storeId) {
			return new NextResponse('Store ID is Required', { status: 400 });
		}

		// Authenticate user
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		// Parse and validate request body
		const body = await req.json();
		const { label, description, imageUrl } = body;

		if (!label) {
			return new NextResponse('Label is Required', { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse('Image is Required', { status: 400 });
		}

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, params.storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const data = await db
			.insert(dashboard)
			.values({
				id: uuidv4(),
				label,
				description,
				storeId,
				imageUrl,
			})
			.returning();

		// Return the inserted data
		return NextResponse.json(data);
	} catch (error) {
		console.error('[DASHBOARD_POST]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		// Validate storeId from params
		const { storeId } = await params;
		if (!storeId) {
			return new NextResponse('Store ID is Required', { status: 400 });
		}

		const dashboards = await db.query.dashboard.findMany({
			where: eq(store.id, params.storeId),
		});

		return NextResponse.json(dashboards);
	} catch (error) {
		console.error('[DASHBOARD_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
