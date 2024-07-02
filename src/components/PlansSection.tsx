import React, { useState, useEffect } from "react";
import { usePlan, Plan } from "@/context/PlanContext";
import { BasicPlanIcon, ProfessionalPlanIcon, StarterPlanIcon } from "./Icons";
import RadioButton from "./RadioButton";
import SaveChangesButton from "./SaveChangesButton";
import Modal from "./Modal";

import { formatDate } from "@/utils/utils";

const PlansSection: React.FC = () => {
	const { subscription, updatePlan } = usePlan();
	const email = subscription?.email || "";
	const planName = subscription?.plan.name || "Starter";
	const [newPlanName, setNewPlanName] = useState(planName);
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		setIsButtonEnabled(newPlanName !== planName);
	}, [newPlanName, planName]);

	const handlePlanChange = (planType: Plan["name"]) => {
		setNewPlanName(planType);
	};

	const handleSaveChanges = () => {
		setShowModal(true);
	};

	const handleConfirmChange = () => {
		updatePlan(newPlanName, email);
		setShowModal(false);
	};

	return (
		<div className="flex flex-col w-full gap-8 py-8 px-4 bg-white tablet:px-8 tablet:py-16 desktop:mx-auto desktop:max-w-7xl">
			<div className="flex flex-col gap-2">
				<h1 className="font-semibold text-xl text-neutral-900">
					Billing plans
				</h1>
				<p className="font-normal text-sm text-neutral-500">
					Explore billing plans tailored for teams of all sizes, from solo
					ventures to groups of up to 50.
				</p>
			</div>
			{planName === "Starter" && subscription?.nextBillingDate && (
				<>Cancel Unsubscribe</>
			)}
			{planName === "Basic" &&
				subscription?.prevPlanName === "Professional" && <>Cancel Downgrade</>}
			<div className="flex flex-col desktop:flex-row desktop:items-start desktop:gap-8">
				<div className="flex flex-col gap-4 w-full">
					{showModal && (
						<Modal
							show={showModal}
							onClose={() => setShowModal(false)}
							newPlanName={newPlanName}
							onConfirm={handleConfirmChange}
							email={email}
						/>
					)}
					<div
						className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
							newPlanName === "Starter"
								? "border-indigo-600"
								: "border-neutral-200"
						}`}
					>
						<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
							<StarterPlanIcon />
							<div className="flex flex-col gap-2">
								<div className="font-semibold text-lg text-neutral-900">
									Starter • $0/month
								</div>
								<div className="font-normal text-sm text-neutral-600">
									Includes up to 10 users, 20GB individual data, and access to
									all features.
								</div>
							</div>
						</div>
						<RadioButton
							value="Starter"
							checked={newPlanName === "Starter"}
							handlePlanChange={handlePlanChange}
						/>
					</div>
					<div
						className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
							newPlanName === "Basic"
								? "border-indigo-600"
								: "border-neutral-200"
						}`}
					>
						<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
							<BasicPlanIcon />
							<div className="flex flex-col gap-2">
								<div className="font-semibold text-lg text-neutral-900">
									Basic • $6/month
								</div>
								<div className="font-normal text-sm text-neutral-600">
									Includes up to 20 users, 40GB individual data, and access to
									all features.
								</div>
							</div>
						</div>
						<RadioButton
							value="Basic"
							checked={newPlanName === "Basic"}
							handlePlanChange={handlePlanChange}
						/>
					</div>
					<div
						className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
							newPlanName === "Professional"
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
									Includes up to 50 users, 100GB individual data, and access to
									all features.
								</div>
							</div>
						</div>
						<RadioButton
							value="Professional"
							checked={newPlanName === "Professional"}
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
				<div className="flex flex-col gap-6 p-4 my-8 rounded-lg border border-solid border-neutral-200 desktop:my-0">
					<span className="font-semibold text-lg text-neutral-900 whitespace-nowrap">
						Your current subscription
					</span>
					<div className="flex flex-col gap-3 text-sm">
						<div className="flex justify-between">
							<span className="font-normal text-neutral-400">Plan type</span>
							<span className="font-medium text-neutral-900">
								{planName} plan
							</span>
						</div>
						<hr className="h-px bg-neutral-200"></hr>
						<div className="flex justify-between">
							<span className="font-normal text-neutral-400">Pricing</span>
							<span className="font-medium text-neutral-900">
								${subscription?.plan.monthlyRate} per month
							</span>
						</div>
						{planName !== "Starter" && (
							<div className="flex flex-col gap-3">
								<hr className="h-px bg-neutral-200"></hr>
								<div className="flex justify-between">
									<span className="font-normal text-neutral-400">
										Next billing
									</span>
									<span className="font-medium text-neutral-900">
										{formatDate(subscription?.nextBillingDate!)}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlansSection;
