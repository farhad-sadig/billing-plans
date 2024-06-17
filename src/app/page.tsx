import PlansSection from "@/components/PlansSection";

export default function Home() {
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
			<div className="flex flex-col desktop:flex-row desktop:items-start desktop:gap-8">
				<PlansSection />
				<div className="flex flex-col gap-6 p-4 rounded-lg border border-solid border-neutral-200">
					<span className="font-semibold text-lg text-neutral-900 whitespace-nowrap">
						Your current subscription
					</span>
					<div className="flex flex-col gap-3 text-sm">
						<div className="flex justify-between">
							<span className="font-normal text-neutral-400">Plan type</span>
							<span className="font-medium text-neutral-900">Starter plan</span>
						</div>
						<hr className="h-px bg-neutral-200"></hr>
						<div className="flex justify-between">
							<span className="font-normal text-neutral-400">Pricing</span>
							<span className="font-medium text-neutral-900">$0 per month</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
