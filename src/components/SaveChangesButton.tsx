import React from "react";

interface SaveChangesButtonProps {
	isEnabled: boolean;
	onClick: () => void;
}

const SaveChangesButton: React.FC<SaveChangesButtonProps> = ({
	isEnabled,
	onClick
}) => {
	return (
		<button
			className={`shadow w-44 flex justify-center px-5 py-3 rounded font-medium text-base focus:shadow-custom-blue ${
				isEnabled
					? "bg-indigo-700 text-white hover:bg-indigo-800"
					: "bg-neutral-100 text-neutral-400"
			}`}
			onClick={onClick}
			disabled={!isEnabled}
			aria-disabled={!isEnabled}
		>
			Save Changes
		</button>
	);
};

export default SaveChangesButton;
