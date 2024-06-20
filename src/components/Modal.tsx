import React, { useState } from "react";

interface ModalProps {
	show: boolean;
	onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
	const [billingInfoExists, setBillingInfoExists] = useState(true); // Assume billing info exists initially
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/check-billing-info"); // Make API call to check billing info
			if (response.ok) {
				const data = await response.json();
				if (data.exists) {
					// Billing info exists
					// Perform actions if billing info exists
				} else {
					// Billing info does not exist
					setBillingInfoExists(false);
				}
			} else {
				console.error("Error checking billing info:", response.statusText);
				// Handle error appropriately
			}
		} catch (error) {
			console.error("Error checking billing info:", error);
			// Handle error appropriately
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
							<div className="flex">
								<span className="font-semibold text-lg text-neutral-900">
									Upgrade your plan to the Basic plan?
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
								This will take effect immediately. You will be charged $6 /
								month.
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
							<span className="font-semibold text-lg text-neutral-900">
								Billing Information Required
							</span>
							<span className="font-normal text-sm text-neutral-600 mt-1">
								Please provide your billing information to upgrade your plan.
							</span>
						</div>

						<div className="flex justify-center font-medium text-base">
							<button
								className="bg-indigo-700 w-full px-4 py-2.5 text-white rounded ml-[6px] hover:bg-indigo-800 focus:bg-indigo-800"
								onClick={() => {
									onClose();
									// Redirect to billing info form
									window.location.href = "/billing-info";
								}}
							>
								Go to Billing Info
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Modal;
