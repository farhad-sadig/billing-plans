import React from "react";

interface CardholderNameInputProps {
	cardholderName: string;
	setCardholderName: React.Dispatch<React.SetStateAction<string>>;
}

const CardholderNameInput: React.FC<CardholderNameInputProps> = ({
	cardholderName,
	setCardholderName
}) => {
	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<label className="font-medium text-neutral-700" htmlFor="cardholderName">
				Cardholder name
			</label>

			<input
				className="flex w-full bg-neutral-50 px-3.5 py-2.5 rounded border border-solid border-neutral-200 font-normal text-neutral-500"
				type="text"
				id="cardholderName"
				name="cardholderName"
				placeholder="Full name on card"
				value={cardholderName}
				onChange={(e) => setCardholderName(e.target.value)}
				required
			/>
		</div>
	);
};

export default CardholderNameInput;
