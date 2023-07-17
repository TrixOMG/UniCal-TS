import React from "react";
import { useGlobalContext } from "../context/context";

const CreateTaskButton = () => {
	const { setShowEventModal } = useGlobalContext();
	return (
		<button
			className='border p-2 rounded-full flex items-center shadow-md hover:shadow'
			onClick={() => setShowEventModal(true)}
		>
			<div className='w-7 h-7'>IC</div>
			<span className='pl-3 pr-7'>Create</span>
		</button>
	);
};

export default CreateTaskButton;
