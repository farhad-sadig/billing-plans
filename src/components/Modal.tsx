"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan, Plan } from "@/context/PlanContext";
import CloseButton from "./CloseButton";

interface ModalProps {
	show: boolean;
	onClose: () => void;
	currentPlan: Plan["name"];
	onConfirm: () => void;
	email: string;
}

const Modal: React.FC<ModalProps> = ({
	show,
	onClose,
	currentPlan,
	onConfirm,
	email
}) => {
	const [billingInfoExists, setBillingInfoExists] = useState(true);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/check-billing-info?email=${email}`);
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

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-75 z-10">
			<div className="flex flex-col gap-8 bg-white p-6 rounded-lg w-80">
				{billingInfoExists ? (
					<>
						<div className="flex flex-col gap-1">
							<div className="flex justify-between items-center">
								<span className="font-semibold text-lg text-neutral-900">
									Upgrade your plan to the {currentPlan} plan?
								</span>
								<CloseButton onClose={onClose} />
							</div>
							<span className="font-normal text-sm text-neutral-600 mt-1">
								This will take effect immediately. You will be charged{" "}
								{currentPlan === "Basic" ? "$6" : "$12"} / month.
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
									router.push("/billing");
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
