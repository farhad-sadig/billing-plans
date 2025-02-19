import React from "react";

interface ErrorMessageProps {
	message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	return (
		<span className="font-normal text-sm text-red-600" role="alert">
			{message}
		</span>
	);
};

export default ErrorMessage;
