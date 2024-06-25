import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/context/PlanContext";

interface ModalProps {
	show: boolean;
	onClose: () => void;
	currentPlan: "Starter" | "Basic" | "Professional";
}

const Modal: React.FC<ModalProps> = ({ show, onClose, currentPlan }) => {
	const [billingInfoExists, setBillingInfoExists] = useState(true);
	const [loading, setLoading] = useState(false);
	const { user, plan, updatePlan } = usePlan();
	const router = useRouter();

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/check-billing-info?email=${user.email}`
			);
			if (response.ok) {
				const data = await response.json();
				if (data.exists) {
					const newPlanRate = currentPlan === "Basic" ? 6 : 12;
					const newPlanExpiry = new Date(); // Set the new plan expiry date
					newPlanExpiry.setMonth(newPlanExpiry.getMonth() + 1); // Example: 1 month later

					const updateResponse = await fetch(`/api/update-plan`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: user.email,
							planType: currentPlan,
							planRate: newPlanRate,
							planExpiry: newPlanExpiry.toISOString()
						})
					});

					if (updateResponse.ok) {
						const updatedPlan = await updateResponse.json();
						updatePlan(updatedPlan);
						console.log("Plan updated successfully");
						onClose();
					} else {
						console.error("Error updating plan:", updateResponse.statusText);
					}
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
								<button
									className="w-6 h-6 flex justify-center items-center"
									onClick={onClose}
								>
									<svg
										width="11"
										height="12"
										viewBox="0 0 11 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5.50058 4.82208L9.62533 0.697266L10.8038 1.87577L6.67908 6.00058L10.8038 10.1253L9.62533 11.3038L5.50058 7.17908L1.37577 11.3038L0.197266 10.1253L4.32208 6.00058L0.197266 1.87577L1.37577 0.697266L5.50058 4.82208Z"
											fill="#525252"
										/>
									</svg>
								</button>
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
							<div className="flex justify-between items-center">
								<span className="font-semibold text-lg text-neutral-900">
									Oops, no billing information found
								</span>
								<button
									className="w-6 h-6 flex justify-center items-center"
									onClick={onClose}
								>
									<svg
										width="11"
										height="12"
										viewBox="0 0 11 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5.50058 4.82208L9.62533 0.697266L10.8038 1.87577L6.67908 6.00058L10.8038 10.1253L9.62533 11.3038L5.50058 7.17908L1.37577 11.3038L0.197266 10.1253L4.32208 6.00058L0.197266 1.87577L1.37577 0.697266L5.50058 4.82208Z"
											fill="#525252"
										/>
									</svg>
								</button>
							</div>
							<span className="font-normal text-sm text-neutral-600 mt-1">
								Please add your billing details to begin upgrading your plan.
							</span>
						</div>
						<div className="flex justify-center">
							<button
								className="bg-indigo-700 w-full px-4 py-2.5 text-white rounded ml-[6px] hover:bg-indigo-800 focus:bg-indigo-800"
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
