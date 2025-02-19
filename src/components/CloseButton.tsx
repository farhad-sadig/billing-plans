import React from "react";
import { CloseModalIcon } from "./Icons";

interface CloseButtonProps {
	onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
	return (
		<button
			className="w-6 h-6 flex justify-center items-start mt-2"
			onClick={onClose}
			aria-label="Close"
		>
			<CloseModalIcon />
		</button>
	);
};

export default CloseButton;
