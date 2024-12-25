import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { store } from '../schema';

interface Props {
	children: React.ReactNode;
}
const HomeLayout = async ({ children }: Props) => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');

	const data = await db.query.store.findFirst({
		where: eq(store.userId, userId),
	});

	if (data) redirect(`/${data.id}`);

	return <div>{children}</div>;
};
export default HomeLayout;
