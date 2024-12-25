'use client';

import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();
	const params = useParams();

	const routes = [
		{
			href: `/${params.storeId}`,
			label: 'Overview',
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
		},
	];

	return (
		<nav
			className={cn(
				'flex items-center rounded-md bg-white p-2 md:p-0 md:px-2 space-x-4 lg:space-x-6',
				className
			)}
			{...props}
		>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'transition-colors flex items-center text-black',
						route.active ? ' dark:text-white' : 'text-zinc-400 '
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
