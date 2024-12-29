import { db } from '@/app/db';
import { dashboard, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface PatchRequestBody {
	label: string;
	description: string;
	imageUrl: string;
}

interface PatchRequestParams {
	storeId: string;
	dashboardId: string;
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
		const { label, description, imageUrl } = body;

		if (!label || !description || !imageUrl) {
			return NextResponse.json(
				{ success: false, message: 'All fields are required' },
				{ status: 400 }
			);
		}

		const { dashboardId, storeId } = await params;

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const updatedDashboard = await db
			.update(dashboard)
			.set({ label, imageUrl, description })
			.where(and(eq(dashboard.id, dashboardId), eq(dashboard.storeId, storeId)))
			.returning();

		if (updatedDashboard.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Dashboard not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: updatedDashboard },
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
	dashboardId: string;
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
		const { storeId, dashboardId } = await params;
		// Validate store ID
		if (!storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}
		if (!dashboardId) {
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

		// Delete the store from the database
		const deletedDashboard = await db
			.delete(dashboard)
			.where(and(eq(dashboard.id, dashboardId), eq(store.userId, userId)))
			.returning();

		// Handle case where Dashboard is not found
		if (deletedDashboard.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Dashboard not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Store deleted successfully',
				data: deletedDashboard,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[DASHBOARD_DELETE]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
interface GetRequestParams {
	dashboardId: string;
}

export async function GET(
	req: Request,
	{ params }: { params: GetRequestParams }
) {
	try {
		// Validate dashboardId from params
		const { dashboardId } = await params;

		if (dashboardId === 'new') {
			return NextResponse.json({
				success: true,
				message: 'New dashboard creation',
			});
		}
		if (!dashboardId) {
			return new NextResponse('Store ID is Required', { status: 400 });
		}

		const dashboards = await db.query.dashboard.findFirst({
			where: eq(dashboard.id, dashboardId),
		});

		return NextResponse.json(dashboards);
	} catch (error) {
		console.error('[DASHBOARD_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
