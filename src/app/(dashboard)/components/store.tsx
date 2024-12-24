import { db } from '@/app/db';
import { store } from '@/app/schema';

async function Store() {
	try {
		const stores = await db.select().from(store);
		return stores;
	} catch (error) {
		console.error('Error fetching stores:', error);
		throw new Error('Failed to fetch stores.');
	}
}

export default Store;
