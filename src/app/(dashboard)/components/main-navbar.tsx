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
			href: `/${params.storeId}/dashboard`,
			label: 'Dashboard',
			active: pathname === `/${params.storeId}/dashboard`,
		},
		{
			href: `/${params.storeId}/category`,
			label: 'Category',
			active: pathname === `/${params.storeId}/category`,
		},
		{
			href: `/${params.storeId}/size`,
			label: 'Size',
			active: pathname === `/${params.storeId}/size`,
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
				'md:flex items-center md:rounded-md md:bg-white md:p-0 md:px-2 md:space-x-4 lg:space-x-6',
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
						route.active
							? 'md:border border-spacing-4 border-slate-600 rounded-md md:px-2 transition md:bg-gradient-to-r from-blue-500 to-purple-600 dark:text-white text-white'
							: 'text-zinc-500 hover:text-black '
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
