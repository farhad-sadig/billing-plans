"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plan, usePlan } from "@/context/PlanContext";
import CloseButton from "./CloseButton";
import { PlanChangeType } from "./PlansSection";
import formatDate from "@/utils/formatDate";

interface ModalProps {
	show: boolean;
	onClose: () => void;
	currentPlan: Plan["name"];
	onConfirm: () => void;
	email: string;
	planChangeType: PlanChangeType;
}

const Modal: React.FC<ModalProps> = ({
	show,
	onClose,
	currentPlan,
	onConfirm,
	email,
	planChangeType: changeType
}) => {
	const [billingInfoExists, setBillingInfoExists] = useState(true);
	const [loading, setLoading] = useState(false);
	const { subscription } = usePlan();
	const router = useRouter();

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/billing?email=${email}`);
			if (response.ok) {
				const data = await response.json();
				if (data.exists) {
					onConfirm();
					onClose();
				} else {
					setBillingInfoExists(false);
				}
			} else {
				setBillingInfoExists(false);
			}
		} catch (error) {
			console.error("Error checking billing info:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!show) return null;

	let title = "";
	let description = "";

	switch (changeType) {
		case "upgrade":
			title = `Upgrade to the ${currentPlan} plan?`;
			description = `This will take effect immediately. You will be charged ${
				currentPlan === "Basic" ? "$6" : "$12"
			} / month.`;
			break;
		case "proratedUpgrade":
			title = `Upgrade your plan to the Professional Plan?`;
			description = `This will take immediate effect. You will be charged a prorated $3 now (for 14 remaining days) and $12 / month starting from the next billing cycle.`;
			break;
		case "downgrade":
			title = `Are you sure you want to downgrade your plan?`;
			description = `Your plan privileges will be downgraded on ${formatDate(
				subscription!.nextBillingDate!
			)}, at the end of your current billing cycle.`;
			break;
		case "unsubscribe":
			title = `Are you sure you want to unsubscribe?`;
			description = `You will be downgraded to the Starter plan. This will take effect at the end of your current billing cycle.`;
			break;
		default:
			title = "";
			description = "";
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-75 z-10">
			<div className="flex flex-col gap-8 bg-white p-6 rounded-lg w-80">
				{billingInfoExists ? (
					<>
						<div className="flex flex-col gap-1">
							<div className="flex justify-between items-center">
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
								className="bg-white w-1/2 px-4 py-2.5 text-neutral-900 rounded border-[0.5px] border-solid border-neutral-200 mr-[6px] tablet:w-full hover:bg-neutral-50 focus:bg-neutral-50"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								className="bg-indigo-700 w-full px-4 py-2.5 text-white rounded ml-[6px] hover:bg-indigo-800 focus:bg-indigo-800"
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
								className="bg-indigo-700 w-full px-4 py-2.5 text-white rounded hover:bg-indigo-800 focus:bg-indigo-800"
								onClick={() => {
									onClose();
									router.push(`/billing?plan=${currentPlan}`);
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

export default Modal;
