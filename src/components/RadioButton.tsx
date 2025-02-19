import React from "react";
import { Plan } from "@/constants/plans";

interface RadioButtonProps {
	value: Plan["name"];
	checked: boolean;
	handlePlanChange: (plan: Plan["name"]) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
	value,
	checked,
	handlePlanChange
}) => (
	<label
		className={`group w-6 h-6 ml-auto flex-shrink-0 mt-2 tablet:mt-0 rounded-full cursor-pointer`}
	>
		<input
			type="radio"
			name="plan"
			value={value}
			checked={checked}
			onChange={() => handlePlanChange(value)}
			className="hidden"
		/>
		{checked ? (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="12" cy="12" r="7" fill="#4338CA" />
				<circle cx="12" cy="12" r="11" stroke="#4338CA" strokeWidth="2" />
			</svg>
		) : (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					className="group-hover:stroke-[#4338CA]"
					cx="12"
					cy="12"
					r="11"
					stroke="#f5f5f5"
					strokeWidth="2"
				/>
			</svg>
		)}
	</label>
);

export default RadioButton;
