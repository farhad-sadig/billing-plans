"use client";
import React, { useState, useCallback, useRef } from "react";
import CardNumberInput from "./CardNumberInput";
import CardholderNameInput from "./CardholderNameInput";
import ExpiryDateInput from "./ExpiryDateInput";
import CVVInput from "./CVVInput";
import AddressDetails from "./AddressDetails";
import SaveChangesButton from "./SaveChangesButton";
import EmailInput from "./EmailInput";

const BillingForm: React.FC = () => {
	const [formState, setFormState] = useState({
		cardNumber: "",
		cardholderName: "",
		expiry: "",
		cvv: "",
		email: "",
		address: {
			country: "",
			state: "",
			addressLine1: "",
			addressLine2: "",
			city: "",
			zip: ""
		}
	});

	const isFormValid = Boolean(
		formState.cardNumber &&
			formState.cardholderName &&
			formState.expiry &&
			formState.cvv &&
			formState.email &&
			formState.address.country &&
			formState.address.state &&
			formState.address.addressLine1 &&
			formState.address.city &&
			formState.address.zip
	);

	const formRef = useRef<HTMLFormElement>(null);

	const handleAddressChange = useCallback((name: string, value: string) => {
		setFormState((prevState) => ({
			...prevState,
			address: {
				...prevState.address,
				[name]: value
			}
		}));
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (isFormValid) {
				try {
					const response = await fetch("/api/save-billing-info", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							name: "123",
							...formState,
							address: formState.address
						})
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Response:", data);
					} else {
						console.error("Error:", response.statusText);
					}
				} catch (error) {
					console.error("Error:", error);
				}
			}
		},
		[formState, isFormValid]
	);
	const handleClick = useCallback(() => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	}, []);

	return (
		<div className="flex flex-col gap-4 bg-white py-16 px-4">
			<div className="flex flex-col gap-2 mt-4">
				<span className="font-semibold text-xl text-neutral-900">
					Billing Information
				</span>
				<span className="font-normal text-sm text-neutral-500">
					Update your billing details and address
				</span>
			</div>
			<form
				ref={formRef}
				onSubmit={handleSubmit}
				className="flex flex-col gap-6"
			>
				<span className="font-medium text-base text-neutral-900">
					Payment Details
				</span>
				<CardNumberInput
					cardNumber={formState.cardNumber}
					setCardNumber={(value) =>
						setFormState({ ...formState, cardNumber: value })
					}
				/>
				<CardholderNameInput
					cardholderName={formState.cardholderName}
					setCardholderName={(value) =>
						setFormState({ ...formState, cardholderName: value })
					}
				/>
				<div className="flex justify-between">
					<ExpiryDateInput
						expiryDate={formState.expiry}
						setExpiryDate={(value) =>
							setFormState({ ...formState, expiry: value })
						}
					/>
					<CVVInput
						cvv={formState.cvv}
						setCvv={(value) => setFormState({ ...formState, cvv: value })}
					/>
				</div>
				<hr className="h-px bg-neutral-200" />
				<span className="font-medium text-base text-neutral-900">
					Email Address
				</span>
				<EmailInput
					email={formState.email}
					setEmail={(value) => setFormState({ ...formState, email: value })}
				/>
				<hr className="h-px bg-neutral-200" />

				<span className="font-medium text-base text-neutral-900">
					Address details
				</span>
				<AddressDetails
					address={formState.address}
					setAddress={handleAddressChange}
				/>
				<div className="flex justify-end items-center gap-4 py-4">
					<SaveChangesButton isEnabled={isFormValid} onClick={handleClick} />
				</div>
			</form>
		</div>
	);
};

export default BillingForm;
