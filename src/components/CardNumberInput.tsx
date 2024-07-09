import React, { useState, useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import { styleInputErrorAndFocus } from "@/utils/utils";

interface CardNumberInputProps {
	cardNumber: string;
	setCardNumber: (value: string) => void;
}

const CardNumberInput: React.FC<CardNumberInputProps> = ({
	cardNumber,
	setCardNumber
}) => {
	const [error, setError] = useState<string | null>(null);
	const [, setIsTouched] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const plainCardNumber = value.replace(/\D/g, "");

		if (plainCardNumber.length <= 16) {
			setCardNumber(plainCardNumber);
		}
	};

	const handleBlur = () => {
		setIsTouched(true);
		setIsFocused(false);
		if (cardNumber.length !== 16) {
			setError("Card number must contain 16 digits.");
		} else {
			setError(null);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const formatCardNumber = (number: string) => {
		return number.replace(/(\d{4})(?=\d)/g, "$1 ");
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<label className="font-medium text-neutral-700" htmlFor="cardNumber">
				Card number
			</label>
			<div
				className={styleInputErrorAndFocus(Boolean(error), isFocused)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onClick={handleFocus}
			>
				<svg
					width="34"
					height="24"
					viewBox="0 0 34 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="ml-2"
				>
					<path
						d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H30C31.933 0.5 33.5 2.067 33.5 4V20C33.5 21.933 31.933 23.5 30 23.5H4C2.067 23.5 0.5 21.933 0.5 20V4Z"
						fill="white"
					/>
					<path
						d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H30C31.933 0.5 33.5 2.067 33.5 4V20C33.5 21.933 31.933 23.5 30 23.5H4C2.067 23.5 0.5 21.933 0.5 20V4Z"
						stroke="#E6E6E6"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M17.1791 16.8291C15.9951 17.8272 14.4591 18.4298 12.7807 18.4298C9.03582 18.4298 6 15.4301 6 11.7298C6 8.02948 9.03582 5.02979 12.7807 5.02979C14.4591 5.02979 15.9951 5.63233 17.1791 6.63045C18.3632 5.63233 19.8992 5.02979 21.5776 5.02979C25.3224 5.02979 28.3583 8.02948 28.3583 11.7298C28.3583 15.4301 25.3224 18.4298 21.5776 18.4298C19.8992 18.4298 18.3632 17.8272 17.1791 16.8291Z"
						fill="#ED0006"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M17.1792 16.8291C18.637 15.6002 19.5615 13.7717 19.5615 11.7298C19.5615 9.6879 18.637 7.85936 17.1792 6.63045C18.3633 5.63233 19.8992 5.02979 21.5776 5.02979C25.3225 5.02979 28.3583 8.02948 28.3583 11.7298C28.3583 15.4301 25.3225 18.4298 21.5776 18.4298C19.8992 18.4298 18.3633 17.8272 17.1792 16.8291Z"
						fill="#F9A000"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M17.1791 16.829C18.637 15.6001 19.5614 13.7716 19.5614 11.7297C19.5614 9.68782 18.637 7.85927 17.1791 6.63037C15.7213 7.85927 14.7969 9.68782 14.7969 11.7297C14.7969 13.7716 15.7213 15.6001 17.1791 16.829Z"
						fill="#FF5E00"
					/>
				</svg>
				<input
					ref={inputRef}
					className="outline-none ml-1 bg-neutral-50 pl-2"
					type="text"
					id="cardNumber"
					name="cardNumber"
					placeholder="1234 1234 1234 1234"
					value={formatCardNumber(cardNumber)}
					onChange={handleCardNumberChange}
					onBlur={handleBlur}
					maxLength={19}
					required
				/>
			</div>
			{error && <ErrorMessage message={error} />}
		</div>
	);
};

export default CardNumberInput;
