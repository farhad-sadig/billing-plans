"use client";
import React, { useState } from "react";
import CardNumberInput from "./CardNumberInput";
import CardholderNameInput from "./NameInput";
import ExpiryDateInput from "./ExpiryDateInput";
import CVVInput from "./CVVInput";
import AddressDetails from "./AddressDetails";

const BillingForm: React.FC = () => {
	const [cardNumber, setCardNumber] = useState<string>("");
	const [cardholderName, setCardholderName] = useState<string>("");
	const [expiryDate, setExpiryDate] = useState<string>("");
	const [cvv, setCvv] = useState<string>("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Add validation and submission logic here
		console.log("Card Number:", cardNumber);
	};

	return (
		<div className="flex flex-col gap-8 grow bg-white py-16 px-4">
			<div className="flex flex-col justify-center gap-2 self-stretch">
				<span className="font-semibold text-xl text-neutral-900">
					Billing Information
				</span>
				<span className="font-normal text-sm text-neutral-500">
					Update your billing details and address
				</span>
			</div>
			<div className="flex flex-col gap-6">
				<CardNumberInput
					cardNumber={cardNumber}
					setCardNumber={setCardNumber}
				/>
				<CardholderNameInput
					cardholderName={cardholderName}
					setCardholderName={setCardholderName}
				/>
				<div className="flex">
					<ExpiryDateInput
						expiryDate={expiryDate}
						setExpiryDate={setExpiryDate}
					/>
					<CVVInput cvv={cvv} setCvv={setCvv} />
				</div>
				<hr className="h-px bg-neutral-200" />
			</div>
			<span className="font-medium text-base text-neutral-900">
				Address details
			</span>
			<AddressDetails />
		</div>
	);
};

export default BillingForm;
