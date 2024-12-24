import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { MainNav } from './main-navbar';
import { Switcher } from './switcher';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

const Navbar = async () => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');

	// Fetch stores data
	let stores = await db.query.store.findMany({
		where: eq(store.userId, userId),
	});

	// Ensure stores is an array and matches the expected format
	stores = stores.map((store) => ({
		name: store.name,
		id: store.id,
		userId: store.userId,
		createdAt: store.createdAt,
		updatedAt: store.updatedAt,
	}));

	return (
		<div className='bg-gradient-to-r from-blue-500 to-purple-600 mb-4'>
			<div className='max-w-7xl mx-auto'>
				<nav className='flex items-center justify-between p-4 text-white'>
					{/* Logo */}
					<div className='text-xl font-semibold'>
						<Link className='hover:text-gray-200' href='/'>
							Home
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className='hidden md:flex space-x-4'>
						<Switcher items={stores} />
						<MainNav />
						<div className='flex items-center justify-center'>
							<UserButton afterSwitchSessionUrl='/auth' />
						</div>
					</div>

					{/* Mobile Menu Toggle Button */}
					<div className='md:hidden'>
						<Button variant='secondary'>☰</Button>
					</div>

					{/* Mobile Menu */}
					<div className='absolute top-16 left-0 w-full bg-gray-800 p-4 space-y-4 md:hidden'>
						<Switcher items={stores} />
						<MainNav />
						<UserButton afterSwitchSessionUrl='/auth' />
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
