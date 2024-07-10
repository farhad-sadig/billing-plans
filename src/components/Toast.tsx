import React, { useEffect } from "react";

interface ToastProps {
	onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="fixed self-center flex items-center gap-3 bg-green-50 pl-1 pr-2.5 pt-1 pb-1 rounded-full z-10">
			<div className="flex items-center bg-white px-2.5 py-0.5 rounded-full">
				<span className="font-medium text-sm text-center text-green-700">
					Success
				</span>
			</div>
			<div className="flex items-center gap-1">
				<span className="font-medium text-sm text-green-700">
					Plan upgraded successfully!
				</span>
			</div>
		</div>
	);
};

export default Toast;
