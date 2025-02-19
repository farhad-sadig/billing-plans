import React from "react";

const ProcessingModal: React.FC = () => {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-75 z-10"
			role="dialog"
			aria-labelledby="processing-title"
			aria-modal="true"
		>
			<div className="w-80 flex flex-col items-center gap-5 bg-white p-6 rounded border border-solid border-neutral-200">
				<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
					<svg
						className="spinner text-indigo-700"
						width="36"
						height="36"
						viewBox="0 0 36 36"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="18"
							cy="18"
							r="16"
							stroke="currentColor"
							strokeWidth="4"
							strokeLinecap="round"
						/>
					</svg>
				</div>
				<span className="text-neutral-900" id="processing-title">
					Payment is processing
				</span>
			</div>
		</div>
	);
};

export default ProcessingModal;
