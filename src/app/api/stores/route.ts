import { db } from '@/app/db';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) return new NextResponse('Unauthorized', { status: 401 });
		if (!name) return new NextResponse('Name is Required', { status: 400 });

		const data = await db
			.insert(store)
			.values({
				id: uuidv4(),
				name,
				userId,
			})
			.returning();

		return NextResponse.json(data);
	} catch (error) {
		console.log('[STORES_POST]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
