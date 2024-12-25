import { db } from '@/app/db';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Type definitions for request body and params
interface PatchRequestBody {
	name: string;
}

interface PatchRequestParams {
	storeId: string;
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
		const { name } = body;

		// Validate inputs
		if (!name) {
			return NextResponse.json(
				{ success: false, message: 'Name is required' },
				{ status: 400 }
			);
		}

		if (!params.storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}

		// Update the store in the database
		const updatedStore = await db
			.update(store)
			.set({ name })
			.where(and(eq(store.id, params.storeId), eq(store.userId, userId)))
			.returning();

		// Handle case where store is not found
		if (updatedStore.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Store not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{ success: true, data: updatedStore },
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[STORE_PATCH]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}

interface DeleteRequestParams {
	storeId: string;
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

		// Validate store ID
		if (!params.storeId) {
			return NextResponse.json(
				{ success: false, message: 'Store ID is required' },
				{ status: 400 }
			);
		}

		// Delete the store from the database
		const deletedStore = await db
			.delete(store)
			.where(and(eq(store.id, params.storeId), eq(store.userId, userId)))
			.returning();

		// Handle case where store is not found
		if (deletedStore.length === 0) {
			return NextResponse.json(
				{ success: false, message: 'Store not found' },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Store deleted successfully',
				data: deletedStore,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Log and return error response
		console.error('[STORE_DELETE]', error);
		return NextResponse.json(
			{ success: false, message: 'Internal error' },
			{ status: 500 }
		);
	}
}
