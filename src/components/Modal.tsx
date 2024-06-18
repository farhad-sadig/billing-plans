// Modal.tsx

import React from "react";

interface ModalProps {
	show: boolean;
	onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show }) => {
	if (!show) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-75 z-10">
			<div className="flex flex-col gap-8 bg-white p-6 rounded-lg w-80">
				<div className="flex flex-col gap-1">
					<div className="flex">
						<span className="font-semibold text-lg text-neutral-900">
							Upgrade your plan to the Basic plan?
						</span>
						<button className="w-6 h-6 flex justify-center items-center">
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
						This will take effect immediately. You will be charged $6 / month.
					</span>
				</div>

				<div className="flex gap-3 font-medium text-base">
					<button className="bg-white w-1/2 px-4 py-2.5 text-neutral-900 rounded border-[0.5px] border-solid border-neutral-200 mr-[6px] tablet:w-full hover:bg-neutral-50 focus:bg-neutral-50">
						Cancel
					</button>
					<button className="bg-indigo-700 w-full px-4 py-2.5 text-white rounded ml-[6px] hover:bg-indigo-800 focus:bg-indigo-800">
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
