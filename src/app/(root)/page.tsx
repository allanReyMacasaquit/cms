'use client';
import { useEffect } from 'react';
import { SignedIn, UserButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import User from '@/components/admin/user';
export default function Home() {
	const { isSignedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isSignedIn) {
			router.push('/auth');
		}
	}, [isSignedIn, router]);

	if (!isSignedIn) {
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='flex justify-between items-center p-6 bg-white shadow-md'>
				<h1 className='text-2xl font-bold text-gray-800'>E-Shop</h1>

				<div className='flex'>
					<SignedIn>
						<div className='flex items-center gap-4'>
							<UserButton afterSignOutUrl='/auth' />
						</div>
					</SignedIn>
					<User />
				</div>
			</header>

			{/* Hero Section */}
			<section className='relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-16'>
				<div className='max-w-5xl mx-auto text-center'>
					<h2 className='text-4xl font-bold mb-4'>
						Discover the Latest Trends
					</h2>
					<p className='text-lg mb-6'>
						Shop our exclusive collection and enjoy special discounts!
					</p>
					<a
						href='/shop'
						className='bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300'
					>
						Shop Now
					</a>
				</div>
				<div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-300 to-purple-300 opacity-30 rounded-full blur-3xl' />
			</section>

			{/* Categories Section */}
			<section className='py-16 bg-gray-100'>
				<div className='max-w-5xl mx-auto text-center'>
					<h2 className='text-3xl font-bold text-gray-800 mb-8'>
						Shop by Category
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						{['Men', 'Women', 'Kids', 'Accessories'].map((category) => (
							<a
								key={category}
								href={`/category/${category.toLowerCase()}`}
								className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition'
							>
								<h3 className='text-xl font-semibold text-gray-800'>
									{category}
								</h3>
								<p className='text-sm text-gray-500'>
									Explore the latest {category.toLowerCase()} styles.
								</p>
							</a>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products Section */}
			<section className='py-16'>
				<div className='max-w-5xl mx-auto'>
					<h2 className='text-3xl font-bold text-gray-800 text-center mb-8'>
						Featured Products
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						{[1, 2, 3, 4].map((product) => (
							<div key={product} className='bg-white rounded-lg shadow-lg p-6'>
								<Image
									src={`/products/product-${product}.jpg`}
									alt={`Product ${product}`}
									width={200}
									height={200}
									className='w-full h-40 object-cover rounded-md mb-4'
								/>
								<h3 className='text-lg font-semibold text-gray-800'>
									Product {product}
								</h3>
								<p className='text-sm text-gray-500 mb-4'>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								</p>
								<div className='flex justify-between items-center'>
									<span className='text-lg font-bold text-blue-500'>
										$99.99
									</span>
									<a
										href={`/product/${product}`}
										className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition'
									>
										View
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='bg-gray-800 text-gray-400 py-6'>
				<div className='max-w-5xl mx-auto text-center'>
					<p>&copy; {new Date().getFullYear()} E-Shop. All Rights Reserved.</p>
					<p>
						<a href='/terms' className='hover:underline'>
							Terms
						</a>{' '}
						|{' '}
						<a href='/privacy' className='hover:underline'>
							Privacy
						</a>
					</p>
				</div>
			</footer>
		</div>
	);
}
