'use client';
import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useAuth,
} from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
	const { isSignedIn } = useAuth();
	const router = useRouter();

	// Redirect to root if signed in
	useEffect(() => {
		if (isSignedIn) {
			router.push('/');
		}
	}, [isSignedIn, router]);

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50'>
			<div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
				<SignedOut>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-4 text-gray-800'>
							Welcome Back!
						</h1>
						<p className='text-sm text-gray-500 mb-6'>
							Sign in to access your account and explore amazing features.
						</p>
						<SignInButton redirecturl='/'>
							<button className='w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300'>
								Sign In
							</button>
						</SignInButton>
					</div>
				</SignedOut>

				<SignedIn>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-4 text-gray-800'>
							You’re Signed In!
						</h1>
						<p className='text-sm text-gray-500 mb-6'>
							Redirecting to the homepage...
						</p>
						<div className='flex justify-center'>
							<UserButton />
						</div>
					</div>
				</SignedIn>
			</div>
		</div>
	);
};

export default AuthPage;
