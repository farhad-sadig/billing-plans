import React from "react";

interface CardNumberInputProps {
	cardNumber: string;
	setCardNumber: React.Dispatch<React.SetStateAction<string>>;
}

const CardNumberInput: React.FC<CardNumberInputProps> = ({
	cardNumber,
	setCardNumber
}) => {
	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const formattedValue = value
			.replace(/\D/g, "") // Remove all non-digit characters
			.replace(/(\d{4})(?=\d)/g, "$1 "); // Add a space every 4 digits

		setCardNumber(formattedValue);
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<label className="font-medium text-neutral-700" htmlFor="cardNumber">
				Card number
			</label>
			<div className="flex w-full bg-neutral-50 px-3.5 py-2.5 rounded border border-solid border-neutral-200 font-normal text-neutral-500">
				<svg
					width="34"
					height="24"
					viewBox="0 0 34 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
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
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M17.1791 16.8291C15.9951 17.8272 14.4591 18.4298 12.7807 18.4298C9.03582 18.4298 6 15.4301 6 11.7298C6 8.02948 9.03582 5.02979 12.7807 5.02979C14.4591 5.02979 15.9951 5.63233 17.1791 6.63045C18.3632 5.63233 19.8992 5.02979 21.5776 5.02979C25.3224 5.02979 28.3583 8.02948 28.3583 11.7298C28.3583 15.4301 25.3224 18.4298 21.5776 18.4298C19.8992 18.4298 18.3632 17.8272 17.1791 16.8291Z"
						fill="#ED0006"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M17.1792 16.8291C18.637 15.6002 19.5615 13.7717 19.5615 11.7298C19.5615 9.6879 18.637 7.85936 17.1792 6.63045C18.3633 5.63233 19.8992 5.02979 21.5776 5.02979C25.3225 5.02979 28.3583 8.02948 28.3583 11.7298C28.3583 15.4301 25.3225 18.4298 21.5776 18.4298C19.8992 18.4298 18.3633 17.8272 17.1792 16.8291Z"
						fill="#F9A000"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M17.1791 16.829C18.637 15.6001 19.5614 13.7716 19.5614 11.7297C19.5614 9.68782 18.637 7.85927 17.1791 6.63037C15.7213 7.85927 14.7969 9.68782 14.7969 11.7297C14.7969 13.7716 15.7213 15.6001 17.1791 16.829Z"
						fill="#FF5E00"
					/>
				</svg>

				<input
					className="ml-1 bg-neutral-50 pl-2"
					type="text"
					id="cardNumber"
					name="cardNumber"
					placeholder="1234 1234 1234 1234"
					value={cardNumber}
					onChange={handleCardNumberChange}
					maxLength={19}
					required
				/>
			</div>
		</div>
	);
};

export default CardNumberInput;
