import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { MainNav } from './main-navbar';
import { Switcher } from './switcher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/app/db';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const Navbar = async () => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');

	// Fetch stores data
	let stores = await db.query.store.findMany();

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
				<nav className='flex items-center justify-between p-2 text-white'>
					{/* Logo */}
					<div className='text-xl font-semibold px-2'>
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

					{/* Mobile Menu */}
					<div className='md:hidden'>
						<Sheet>
							<SheetTrigger asChild>
								<div className='px-2'>
									<Button variant='secondary'>☰</Button>
								</div>
							</SheetTrigger>
							<SheetContent className='w-full px-0'>
								<SheetHeader className='mt-6'>
									<div className='flex items-center justify-between p-4 mb-4 bg-gradient-to-r from-blue-500 to-purple-600'>
										<UserButton afterSwitchSessionUrl='/auth' />
										<MainNav />
									</div>

									<VisuallyHidden>
										<SheetTitle>Nav Content</SheetTitle>
									</VisuallyHidden>
									{/* Corrected Container */}
									<div className='flex flex-col items-center justify-between h-[300px]'>
										<Switcher items={stores} />
									</div>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
