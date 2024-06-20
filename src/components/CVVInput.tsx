import React from "react";

interface CVVInputProps {
	cvv: string;
	setCvv: React.Dispatch<React.SetStateAction<string>>;
}

const CVVInput: React.FC<CVVInputProps> = ({ cvv, setCvv }) => {
	const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
		setCvv(value);
	};

	const isValidCvv = (cvv: string) => {
		return /^\d{3,4}$/.test(cvv); // Valid if 3 or 4 digits
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm w-1/2">
			<label htmlFor="cvv" className="font-medium text-neutral-700">
				CVV
			</label>
			<input
				type="text"
				id="cvv"
				name="cvv"
				placeholder="123"
				value={cvv}
				onChange={handleCvvChange}
				maxLength={4}
				required
				className="flex bg-neutral-50 px-3.5 py-2.5 rounded border border-solid border-neutral-200 font-normal text-neutral-500"
				pattern="\d{3,4}"
				title="Enter 3 or 4 digit CVV"
			/>
			{!isValidCvv(cvv) && cvv.length > 0 && (
				<span className="text-red-500 text-sm">Invalid CVV</span>
			)}
		</div>
	);
};

export default CVVInput;
