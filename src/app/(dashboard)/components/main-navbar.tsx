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
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
		},
	];

	return (
		<nav
			className={cn('flex items-center space-x-4 lg:space-x-6', className)}
			{...props}
		>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'transition-colors flex items-center text-white hover:text-gray-200',
						route.active ? 'text-white dark:text-white' : 'text-white'
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
