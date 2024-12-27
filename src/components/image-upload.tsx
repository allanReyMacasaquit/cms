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
		console.log('Upload result:', result); // Log the entire result object

		if (result.event === 'success') {
			console.log('Uploaded URL:', result.info.secure_url); // Log the URL for verification
			onChange(result.info.secure_url);
		}
	};

	if (!isMounted) {
		return null;
	}

	console.log('Image URLs:', value); // Log the value prop

	return (
		<div>
			<div className='flex items-center'>
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
						<Image src={url} alt='Uploaded' fill />
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
							className='mt-4'
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
