import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Home() {
	return (
		<div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
			<SignedIn>
				<div className='text-center'>
					<h1 className='text-2xl font-bold mb-4 text-gray-800'>
						You’re Signed In!
					</h1>
					<p className='text-sm text-gray-500 mb-6'>
						Redirecting to the homepage...
					</p>
					<div className='flex justify-center'>
						<UserButton afterSignOutUrl='/auth' />
					</div>
				</div>
			</SignedIn>
		</div>
	);
}
