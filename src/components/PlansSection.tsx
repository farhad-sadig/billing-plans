"use client";
import { useEffect, useState } from "react";
import { BasicPlanIcon, ProfessionalPlanIcon, StarterPlanIcon } from "./Icons";
import RadioButton from "./RadioButton";
import SaveChangesButton from "./SaveChangesButton";
import Modal from "./Modal";

export type PlanType = "Starter" | "Basic" | "Professional";

export default function PlansSection() {
	const [currentPlan, setCurrentPlan] = useState<PlanType>("Starter");
	const [previousPlan, setPreviousPlan] = useState<PlanType>("Starter");
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);
	const [showModal, setShowModal] = useState(true);

	useEffect(() => {
		setIsButtonEnabled(currentPlan !== previousPlan);
	}, [currentPlan, previousPlan]);

	const handlePlanChange = (plan: PlanType) => {
		setCurrentPlan(plan);
	};

	const handleSaveChanges = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<div className="flex flex-col gap-4 desktop:w-full">
			<div
				className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
					currentPlan === "Starter" ? "border-indigo-600" : "border-neutral-200"
				}`}
			>
				<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
					<StarterPlanIcon />
					<div className="flex flex-col gap-2">
						<div className="font-semibold text-lg text-neutral-900">
							Starter • $0/month
						</div>
						<div className="font-normal text-sm text-neutral-600">
							Includes up to 10 users, 20GB individual data and access to all
							features.
						</div>
					</div>
				</div>

				<RadioButton
					value="Starter"
					checked={currentPlan === "Starter"}
					handlePlanChange={handlePlanChange}
				/>
			</div>

			<div
				className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
					currentPlan === "Basic" ? "border-indigo-600" : "border-neutral-200"
				}`}
			>
				<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
					<BasicPlanIcon />
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-3 tablet:flex-row tablet:items-center">
							<div className="font-semibold text-lg text-neutral-900">
								Basic plan • $6/month
							</div>
							<div className="mr-auto bg-green-50 px-2 py-0.5 rounded-full border border-solid border-green-200">
								<span className="font-normal text-sm text-center text-green-700">
									Recommended
								</span>
							</div>
						</div>

						<div className="font-normal text-sm text-neutral-600">
							Includes up to 20 users, 40GB individual data and access to all
							features.
						</div>
					</div>
				</div>

				<RadioButton
					value="Basic"
					checked={currentPlan === "Basic"}
					handlePlanChange={handlePlanChange}
				/>
			</div>
			<div
				className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
					currentPlan === "Professional"
						? "border-indigo-600"
						: "border-neutral-200"
				}`}
			>
				<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
					<ProfessionalPlanIcon />
					<div className="flex flex-col gap-2">
						<div className="font-semibold text-lg text-neutral-900">
							Professional plan • $12/month
						</div>
						<div className="font-normal text-sm text-neutral-600">
							Includes up to 50 users, 100GB individual data and access to all
							features.
						</div>
					</div>
				</div>
				<RadioButton
					value="Professional"
					checked={currentPlan === "Professional"}
					handlePlanChange={handlePlanChange}
				/>
			</div>
			<div className="flex justify-end items-center gap-4 py-4">
				<SaveChangesButton
					isEnabled={isButtonEnabled}
					onClick={handleSaveChanges}
				/>
			</div>
			<Modal show={showModal} onClose={handleCloseModal} />
		</div>
	);
}
