import React, { useState } from "react";
import { styleInputErrorAndFocus } from "@/utils/style";
import ErrorMessage from "./ErrorMessage"; // Assuming the ErrorMessage component exists

interface EmailInputProps {
	email: string;
	setEmail: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => {
	const [error, setError] = useState<string | null>(null);
	const [isTouched, setIsTouched] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
	};

	const handleBlur = () => {
		setIsTouched(true);
		setIsFocused(false);
		if (!isValidEmail(email)) {
			setError("Invalid email address.");
		} else {
			setError(null);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<label className="font-medium text-neutral-700" htmlFor="email">
				Email
			</label>
			<input
				className={`outline-none flex w-full bg-neutral-50 px-3.5 py-2.5 rounded border border-solid font-normal text-neutral-500 ${
					error && isTouched
						? "border-red-600 shadow-error-focused"
						: isFocused
						? "shadow-focused border-blue-500"
						: "border-neutral-200"
				}`}
				type="email"
				id="email"
				name="email"
				placeholder="user@example.com"
				value={email}
				onChange={handleEmailChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				required
			/>
			{isTouched && error && <ErrorMessage message={error} />}
		</div>
	);
};

export default EmailInput;
