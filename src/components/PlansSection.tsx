"use client";
import { useRef, useState } from "react";
import { BasicPlanIcon, ProfessionalPlanIcon, StarterPlanIcon } from "./Icons";

type PlanType = "starter" | "basic" | "professional";

export default function PlansSection() {
	const [selectedPlan, setSelectedPlan] = useState<PlanType>("starter");

	const handlePlanChange = (plan: PlanType) => {
		setSelectedPlan(plan);
	};

	return (
		<div className="flex flex-col gap-4 desktop:w-full">
			<div
				className={`flex items-start p-5 gap-5 rounded-lg border border-solid tablet:items-center  ${
					selectedPlan === "starter"
						? "border-indigo-600"
						: "border-neutral-200"
				}`}
			>
				<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
					<StarterPlanIcon />
					<div className="flex flex-col gap-2">
						<div className="font-semibold text-lg text-neutral-900">
							Starter plan • $0/month
						</div>
						<div className="font-normal text-sm text-neutral-600">
							Includes up to 10 users, 20GB individual data and access to all
							features.
						</div>
					</div>
				</div>

				<input
					className="w-6 h-6 ml-auto flex-shrink-0 mt-2 tablet:mt-0"
					name="plan"
					type="radio"
					value="starter"
					checked={selectedPlan === "starter"}
					onChange={() => handlePlanChange("starter")}
				/>
				<label htmlFor="starter" className="sr-only">
					Starter plan
				</label>
			</div>

			<div
				className={`flex items-start p-5 gap-5 rounded-lg border border-solid tablet:items-center  ${
					selectedPlan === "basic" ? "border-indigo-600" : "border-neutral-200"
				}`}
			>
				<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
					<BasicPlanIcon />
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-3 tablet:flex-row tablet:items-center">
							<div className="font-semibold text-lg text-neutral-900">
								Basic plan • $6/month
							</div>
							<div className="mr-auto bg-green-50 px-2 py-0.5 rounded-full border border-solid border-green-200">
								<span className="font-normal text-sm text-center text-green-700">
									Recommended
								</span>
							</div>
						</div>

						<div className="font-normal text-sm text-neutral-600">
							Includes up to 20 users, 40GB individual data and access to all
							features.
						</div>
					</div>
				</div>

				<input
					className="w-6 h-6 ml-auto flex-shrink-0 mt-2 tablet:mt-0"
					name="plan"
					type="radio"
					value="basic"
					checked={selectedPlan === "basic"}
					onChange={() => handlePlanChange("basic")}
				/>
				<label htmlFor="basic" className="sr-only">
					Basic plan
				</label>
			</div>
			<div
				className={`flex items-start p-5 gap-5 rounded-lg border border-solid tablet:items-center  ${
					selectedPlan === "professional"
						? "border-indigo-600"
						: "border-neutral-200"
				}`}
			>
				<div className="flex flex-col items-start tablet:flex-row gap-5 tablet:items-center">
					<ProfessionalPlanIcon />
					<div className="flex flex-col gap-2">
						<div className="font-semibold text-lg text-neutral-900">
							Professional plan • $12/month
						</div>
						<div className="font-normal text-sm text-neutral-600">
							Includes up to 50 users, 100GB individual data and access to all
							features.
						</div>
					</div>
				</div>

				<input
					className="w-6 h-6 ml-auto flex-shrink-0 mt-2 tablet:mt-0"
					name="plan"
					type="radio"
					value="professional"
					checked={selectedPlan === "professional"}
					onChange={() => handlePlanChange("professional")}
				/>
				<label htmlFor="professional" className="sr-only">
					Professional plan
				</label>
			</div>
			<div className="flex justify-end items-center gap-4 py-4">
				<button className="w-44 flex justify-center bg-neutral-100 px-5 py-3 rounded font-medium text-base text-neutral-400">
					Save Changes
				</button>
			</div>
		</div>
	);
}
