'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './ui/button';
import { ImagePlus, Trash } from 'lucide-react';

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onUpload = (result: any) => {
		if (result.event === 'success') {
			onChange(result.info.secure_url);
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
				{value.map((url) => (
					<div
						key={url}
						className='relative w-[400px] h-[250px] rounded-md overflow-hidden'
					>
						<div className='z-50 absolute top-2 right-2'>
							<Button
								variant='destructive'
								type='button'
								onClick={() => onRemove(url)}
							>
								<Trash className='size-10' />
							</Button>
						</div>
						<Image
							src={url}
							fill
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							priority
							className='object-cover rounded-md'
							alt='Uploaded'
						/>
					</div>
				))}
			</div>
			<CldUploadWidget
				uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
				onSuccess={onUpload}
			>
				{({ open }) => {
					const onClick = () => {
						open();
					};
					return (
						<Button
							className='md:mt-4'
							type='button'
							disabled={disabled}
							onClick={onClick}
						>
							<ImagePlus className='size-10' />
							Background Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
