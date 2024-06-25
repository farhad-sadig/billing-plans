import React, { useState, useEffect } from "react";
import { usePlan } from "@/context/PlanContext";
import { BasicPlanIcon, ProfessionalPlanIcon, StarterPlanIcon } from "./Icons";
import RadioButton from "./RadioButton";
import SaveChangesButton from "./SaveChangesButton";
import Modal from "./Modal";

const PlansSection: React.FC = () => {
	const { plan } = usePlan();
	const [currentPlan, setCurrentPlan] = useState(plan.planType);
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		setIsButtonEnabled(currentPlan !== plan.planType);
	}, [currentPlan, plan.planType]);

	const handlePlanChange = (planType: "Starter" | "Basic" | "Professional") => {
		setCurrentPlan(planType);
	};

	const handleSaveChanges = () => {
		setShowModal(true);
	};

	return (
		<div className="flex flex-col gap-4 w-full">
			{showModal && (
				<Modal
					show={showModal}
					onClose={() => setShowModal(false)}
					currentPlan={currentPlan}
				/>
			)}
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
							Includes up to 10 users, 20GB individual data, and access to all
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
						<div className="font-semibold text-lg text-neutral-900">
							Basic • $6/month
						</div>
						<div className="font-normal text-sm text-neutral-600">
							Includes up to 20 users, 40GB individual data, and access to all
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
							Professional • $12/month
						</div>
						<div className="font-normal text-sm text-neutral-600">
							Includes up to 50 users, 100GB individual data, and access to all
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
		</div>
	);
};

export default PlansSection;
