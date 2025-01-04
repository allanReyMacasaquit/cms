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
		const { storeId } = await params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		const { userId } = await auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		const body = await req.json();
		const { label, description, imageUrl } = body;

		if (!label) return new NextResponse('Label is required', { status: 400 });
		if (!imageUrl)
			return new NextResponse('Image URL is required', { status: 400 });

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
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

		return NextResponse.json(data);
	} catch (error) {
		console.error('[DASHBOARD_POST]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; dashboardId?: string } }
) {
	try {
		const { storeId, dashboardId } = params;
		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (dashboardId) {
			// Retrieve a specific dashboard by ID
			const dashboardData = await db.query.dashboard.findFirst({
				where: eq(dashboard.id, dashboardId),
			});

			if (!dashboardData) {
				return new NextResponse('Dashboard not found', { status: 404 });
			}

			return NextResponse.json(dashboardData);
		}

		// Retrieve all dashboards for the store
		const dashboards = await db.query.dashboard.findMany({
			where: eq(dashboard.storeId, storeId),
		});

		return NextResponse.json(dashboards);
	} catch (error) {
		console.error('[DASHBOARD_GET]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
