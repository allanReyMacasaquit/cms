import React from 'react';

interface HeadingProps {
	title: string;
	description?: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
	return (
		<div className='mb-4'>
			<h1 className='text-2xl font-bold'>{title}</h1>
			{description && <p className='text-sm text-gray-600'>{description}</p>}
		</div>
	);
};

export default Heading;
