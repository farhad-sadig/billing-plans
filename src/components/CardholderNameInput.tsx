import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage"; // Assuming the ErrorMessage component exists
import { styleInputErrorAndFocus } from "@/utils/utils";

interface CardholderNameInputProps {
	cardholderName: string;
	setCardholderName: (value: string) => void;
}

const CardholderNameInput: React.FC<CardholderNameInputProps> = ({
	cardholderName,
	setCardholderName
}) => {
	const [error, setError] = useState<string | null>(null);
	const [isTouched, setIsTouched] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const handleCardholderNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setCardholderName(value);
	};

	const handleBlur = () => {
		setIsTouched(true);
		setIsFocused(false);
		if (cardholderName.trim().length < 2) {
			setError("Cardholder name must have at least two characters");
		} else {
			setError(null);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<label className="font-medium text-neutral-700" htmlFor="cardholderName">
				Cardholder name
			</label>
			<input
				className={styleInputErrorAndFocus(Boolean(error), isFocused)}
				type="text"
				id="cardholderName"
				name="cardholderName"
				placeholder="Full name on card"
				value={cardholderName}
				onChange={handleCardholderNameChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				required
			/>
			{error && <ErrorMessage message={error} />}
		</div>
	);
};

export default CardholderNameInput;
