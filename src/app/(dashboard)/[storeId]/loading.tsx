import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface LoadingProps {
	message?: string;
	className?: string;
}

function Loading({ message = 'Loading...', className }: LoadingProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-4',
				className
			)}
		>
			<Loader size={10} className='animate-spin' />
			{message && <p className='text-sm text-muted-foreground'>{message}</p>}
		</div>
	);
}

export default Loading;
