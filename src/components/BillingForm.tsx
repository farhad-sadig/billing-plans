"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/context/PlanContext";
import { Plan } from "@/constants/plans";
import CardNumberInput from "./CardNumberInput";
import CardholderNameInput from "./CardholderNameInput";
import ExpiryDateInput from "./ExpiryDateInput";
import CVVInput from "./CVVInput";
import AddressDetails from "./AddressDetails";
import SaveChangesButton from "./SaveChangesButton";
import EmailInput from "./EmailInput";
import ProcessingModal from "./ProcessingModal";

const BillingForm: React.FC = () => {
	const { subscription, updatePlan } = usePlan();
	const router = useRouter();
	const [initialPlan, setInitialPlan] = useState<Plan["name"]>("Starter");

	const [formState, setFormState] = useState({
		cardNumber: "",
		cardholderName: "",
		expiry: "",
		cvv: "",
		email: subscription?.email || "",
		address: {
			country: "",
			state: "",
			addressLine1: "",
			addressLine2: "",
			city: "",
			zip: ""
		},
		planType: initialPlan as Plan["name"]
	});
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const searchParams = new URLSearchParams(window.location.search);
			const plan = (searchParams.get("plan") || "Starter") as Plan["name"];
			setInitialPlan(plan);
			setFormState((prevState) => ({
				...prevState,
				planType: plan
			}));
		}
	}, [subscription]);

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
					setProcessing(true);
					const response = await fetch("/api/billing", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							...formState,
							planType: formState.planType,
							planRate: subscription?.plan.monthlyRate || 0,
							planExpiry: subscription?.nextBillingDate || null,
							changePending: false,
							pendingPlanName: null
						})
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Response:", data);
						updatePlan(formState.planType, formState.email);
						setTimeout(() => {
							router.push("/");
							setProcessing(false);
						}, 2000);
					} else {
						console.error("Error:", response.statusText);
						setProcessing(false);
					}
				} catch (error) {
					console.error("Error:", error);
					setProcessing(false);
				}
			}
		},
		[formState, isFormValid, subscription, updatePlan, router]
	);

	const handleClick = useCallback(() => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	}, []);

	return (
		<div className="flex flex-col gap-4 bg-white py-16 px-4">
			{processing && <ProcessingModal />}

			{!processing && (
				<>
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
						aria-labelledby="billing-information"
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
							<SaveChangesButton
								isEnabled={isFormValid}
								onClick={handleClick}
							/>
						</div>
					</form>
				</>
			)}
		</div>
	);
};

export default BillingForm;
