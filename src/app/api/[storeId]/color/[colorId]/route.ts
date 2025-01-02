import { db } from '@/app/db';
import { color, store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface PatchRequestBody {
	name: string;
	value: string;
}

interface PatchRequestParams {
	storeId: string;
	colorId: string;
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

		const { colorId, storeId } = await params;

		const storeByUserId = await db.query.store.findFirst({
			where: eq(store.id, storeId),
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const updatedSize = await db
			.update(color)
			.set({ name, value })
			.where(and(eq(color.id, colorId), eq(color.storeId, storeId)))
			.returning();

		if (updatedSize.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Size not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: updatedSize },
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
	colorId: string;
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
		const { storeId, colorId } = await params;
		// Validate store ID
		if (!storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}
		if (!colorId) {
			return NextResponse.json(
				{ success: false, message: 'Size ID is required' },
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
		const deletedSize = await db
			.delete(color)
			.where(and(eq(color.storeId, storeId), eq(color.id, colorId)));

		// Handle case where Size is not found
		if (!deletedSize) {
			return NextResponse.json(
				{ success: false, message: 'Size not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Size deleted successfully',
				data: deletedSize,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[SIZE_DELETE]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
interface GetRequestParams {
	colorId: string;
}

export async function GET(
	req: Request,
	{ params }: { params: GetRequestParams }
) {
	try {
		// Validate colorId from params
		const { colorId } = await params;

		if (colorId === 'new') {
			return NextResponse.json({
				success: true,
				message: 'New color creation',
			});
		}
		if (!colorId) {
			return new NextResponse('Store ID is Required', { status: 400 });
		}

		const colors = await db.query.color.findFirst({
			where: eq(color.id, colorId),
		});

		return NextResponse.json(colors);
	} catch (error) {
		console.error('[COLOR_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
