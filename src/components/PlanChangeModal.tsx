"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/context/PlanContext";
import { PLANS, Plan } from "@/constants/plans";
import CloseButton from "./CloseButton";
import { formatDate, getProratedChargeDescription } from "@/utils/utils";

interface PlanChangeModalProps {
	show: boolean;
	onClose: () => void;
	newPlanName: Plan["name"];
	onConfirm: () => void;
	email: string;
}

const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
	show,
	onClose,
	newPlanName,
	onConfirm,
	email
}) => {
	const [billingInfoExists, setBillingInfoExists] = useState(true);
	const [loading, setLoading] = useState(false);
	const { subscription } = usePlan();
	const router = useRouter();

	const currentPlanName = subscription?.plan.name;

	const handleConfirm = async () => {
		setLoading(true);
		let billingInfoFound = true;

		try {
			const response = await fetch(`/api/billing?email=${email}`);
			if (response.ok) {
				const data = await response.json();
				if (data.exists) {
					onConfirm();
					onClose();
				} else {
					billingInfoFound = false;
				}
			} else if (response.status === 400) {
				billingInfoFound = false;
			} else {
				console.error("Error:", response.statusText);
			}
		} catch (error) {
			console.error("Error checking billing info:", error);
			billingInfoFound = false;
		} finally {
			setLoading(false);
			setBillingInfoExists(billingInfoFound);
		}
	};

	if (!show) return null;

	let title = "";
	let description = "";

	switch (newPlanName) {
		case "Starter":
			title = `Are you sure you want to unsubscribe?`;
			description = `You will be downgraded to the Starter plan. This will take effect at the end of your current billing cycle.`;
			break;
		case "Professional":
			if (currentPlanName === "Basic") {
				title = `Upgrade your plan to the Professional Plan?`;
				description = getProratedChargeDescription(
					PLANS["Professional"].monthlyRate,
					PLANS["Basic"].monthlyRate
				);
			} else {
				title = `Upgrade to the Professional plan?`;
				description = `This will take effect immediately. You will be charged $12 / month.`;
			}
			break;
		case "Basic":
			if (currentPlanName === "Professional") {
				title = `Are you sure you want to downgrade to the Basic plan?`;
				description = `Your plan privileges will be downgraded on ${formatDate(
					subscription!.nextBillingDate!
				)}, at the end of your current billing cycle.`;
			} else {
				title = `Upgrade to the Basic plan?`;
				description = `This will take effect immediately. You will be charged $6 / month.`;
			}
			break;
		default:
			break;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-75 z-10">
			<div className="flex flex-col gap-8 bg-white p-6 rounded-lg w-80">
				{billingInfoExists ? (
					<>
						<div className="flex flex-col gap-1">
							<div className="flex justify-between">
								<span className="font-semibold text-lg text-neutral-900">
									{title}
								</span>
								<CloseButton onClose={onClose} />
							</div>
							<span className="font-normal text-sm text-neutral-600 mt-1">
								{description}
							</span>
						</div>
						<div className="flex gap-3 font-medium text-base">
							<button
								className="shadow bg-white w-1/2 px-4 py-2.5 text-neutral-900 rounded border-[0.5px] border-solid border-neutral-200 mr-[6px] tablet:w-full hover:bg-neutral-50 focus:bg-neutral-50"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								className="shadow bg-indigo-700 w-full px-4 py-2.5 text-white rounded ml-[6px] hover:bg-indigo-800 focus:bg-indigo-800"
								onClick={handleConfirm}
								disabled={loading}
							>
								{loading ? "Loading..." : "Confirm"}
							</button>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col gap-1">
							<div className="flex justify-between">
								<span className="font-semibold text-lg text-neutral-900">
									Oops, no billing information found
								</span>
								<CloseButton onClose={onClose} />
							</div>
							<span className="font-normal text-sm text-neutral-600 mt-1">
								Please add your billing details to begin upgrading your plan.
							</span>
						</div>
						<div className="flex justify-center">
							<button
								className="shadow bg-indigo-700 w-full px-4 py-2.5 text-white rounded hover:bg-indigo-800 focus:bg-indigo-800"
								onClick={() => {
									onClose();
									router.push(`/billing?plan=${newPlanName}`);
								}}
							>
								Add billing information
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PlanChangeModal;
