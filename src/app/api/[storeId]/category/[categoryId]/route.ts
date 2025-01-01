import { db } from '@/app/db';
import { category, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface PatchRequestBody {
	name: string;
	dashboardId: string;
}

interface PatchRequestParams {
	storeId: string;
	categoryId: string;
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
		const { name, dashboardId } = body;

		if (!name || !dashboardId) {
			return NextResponse.json(
				{ success: false, message: 'All fields are required' },
				{ status: 400 }
			);
		}

		const { categoryId, storeId } = await params;

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const updatedCategory = await db
			.update(category)
			.set({ name, dashboardId })
			.where(and(eq(category.id, categoryId), eq(category.storeId, storeId)))
			.returning();

		if (updatedCategory.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Category not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: updatedCategory },
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
	categoryId: string;
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
		const { storeId, categoryId } = await params;
		// Validate store ID
		if (!storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}
		if (!categoryId) {
			return NextResponse.json(
				{ success: false, message: 'CATEGORY ID is required' },
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
		const deletedCategory = await db
			.delete(category)
			.where(and(eq(category.storeId, storeId), eq(category.id, categoryId)));

		// Handle case where Dashboard is not found
		if (!deletedCategory) {
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
				data: deletedCategory,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[Category_DELETE]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
interface GetRequestParams {
	categoryId: string;
}

export async function GET(
	req: Request,
	{ params }: { params: GetRequestParams }
) {
	try {
		// Validate dashboardId from params
		const { categoryId } = await params;

		if (categoryId === 'new') {
			return NextResponse.json({
				success: true,
				message: 'New category creation',
			});
		}
		if (!categoryId) {
			return new NextResponse('Category ID is Required', { status: 400 });
		}

		const categorys = await db.query.category.findFirst({
			where: eq(category.id, categoryId),
		});

		return NextResponse.json(categorys);
	} catch (error) {
		console.error('[Category_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
