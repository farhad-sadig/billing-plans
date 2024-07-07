import React, { useState, useEffect } from "react";
import { usePlan } from "@/context/PlanContext";
import { PLANS, Plan } from "@/constants/plans";
import { BasicPlanIcon, ProfessionalPlanIcon, StarterPlanIcon } from "./Icons";
import RadioButton from "./RadioButton";
import SaveChangesButton from "./SaveChangesButton";
import Modal from "./Modal";
import { formatDate } from "@/utils/utils";

const PlansSection: React.FC = () => {
	const { subscription, updatePlan, cancelPendingChange } = usePlan();
	const email = subscription?.email || "";
	const actualPlanName = subscription?.plan.name || "Starter";
	const currentPlanName = subscription?.changePending
		? subscription.prevPlanName
		: actualPlanName;
	const [newPlanName, setNewPlanName] = useState(actualPlanName);
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		setIsButtonEnabled(newPlanName !== actualPlanName);
	}, [newPlanName, actualPlanName]);

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

	const handleCancelPendingChange = () => {
		cancelPendingChange();
	};

	const renderPendingChangeBanner = () => {
		if (subscription?.changePending && subscription.pendingPlanName) {
			const pendingPlanName = subscription.pendingPlanName;
			const isDowngrade = pendingPlanName === "Basic";

			return (
				<div className="bg-yellow-100 p-4 rounded-lg">
					<p className="text-yellow-800">
						{isDowngrade
							? `You will be downgraded to the ${pendingPlanName} plan at the end of your current billing period.`
							: "Your membership will be cancelled at the end of your billing period."}
					</p>
					<button
						className="text-blue-500 underline"
						onClick={handleCancelPendingChange}
					>
						Cancel {isDowngrade ? "Downgrade" : "Unsubscribe"}
					</button>
				</div>
			);
		}
		return null;
	};

	const renderPlanOption = (
		planName: Plan["name"],
		planIcon: React.ReactNode,
		description: string
	) => (
		<div
			className={`flex items-start p-5 gap-5 rounded-lg border border-solid hover:bg-neutral-50 tablet:items-center ${
				newPlanName === planName ? "border-indigo-600" : "border-neutral-200"
			}`}
		>
			<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
				{planIcon}
				<div className="flex flex-col gap-2">
					<div className="font-semibold text-lg text-neutral-900">
						{planName} • ${PLANS[planName].monthlyRate}/month
					</div>
					<div className="font-normal text-sm text-neutral-600">
						{description}
					</div>
				</div>
			</div>
			<RadioButton
				value={planName}
				checked={newPlanName === planName}
				handlePlanChange={handlePlanChange}
			/>
		</div>
	);

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
			{renderPendingChangeBanner()}
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
					{renderPlanOption(
						"Starter",
						<StarterPlanIcon />,
						"Includes up to 10 users, 20GB individual data, and access to all features."
					)}
					{renderPlanOption(
						"Basic",
						<BasicPlanIcon />,
						"Includes up to 20 users, 40GB individual data, and access to all features."
					)}
					{renderPlanOption(
						"Professional",
						<ProfessionalPlanIcon />,
						"Includes up to 50 users, 100GB individual data, and access to all features."
					)}
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
								{currentPlanName} plan
							</span>
						</div>
						<hr className="h-px bg-neutral-200"></hr>
						<div className="flex justify-between">
							<span className="font-normal text-neutral-400">Pricing</span>
							<span className="font-medium text-neutral-900">
								${subscription?.plan.monthlyRate} per month
							</span>
						</div>
						{currentPlanName !== "Starter" && (
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
