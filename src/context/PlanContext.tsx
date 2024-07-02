"use client";
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect
} from "react";

export interface Plan {
	name: "Starter" | "Basic" | "Professional";
	monthlyRate: number;
}

interface Subscription {
	plan: Plan;
	nextBillingDate: string | null;
	email: string | null;
	prevPlanName: Plan["name"] | null;
}

interface PlanContextType {
	subscription: Subscription | null;
	updatePlan: (newPlanName: Plan["name"], email: string) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [subscription, setSubscription] = useState<Subscription | null>(null);

	useEffect(() => {
		const fetchSubscription = async () => {
			if (subscription?.email) {
				try {
					const response = await fetch(
						`/api/subscription?email=${subscription.email}`
					);
					if (!response.ok) {
						throw new Error("Failed to fetch subscription data");
					}
					const data = await response.json();
					console.log("Fetched subscription data:", data);
					setSubscription(data);
				} catch (error) {
					console.error("Failed to fetch subscription data", error);
				}
			}
		};

		fetchSubscription();
	}, [subscription?.email]);

	const updatePlan = async (newPlanName: Plan["name"], email: string) => {
		try {
			const planResponse = await fetch(`/api/plan/${newPlanName}`);
			if (!planResponse.ok) {
				throw new Error("Failed to fetch plan data");
			}
			const newPlan: Plan = await planResponse.json();
			console.log("Fetched plan data:", newPlan);
			const nextBillingDate = subscription?.nextBillingDate
				? subscription.nextBillingDate
				: new Date(
						new Date().setMonth(new Date().getMonth() + 1)
				  ).toISOString();

			const newSubscription: Subscription = {
				plan: newPlan,
				nextBillingDate: nextBillingDate,
				email: email,
				prevPlanName: subscription?.plan.name || null
			};

			const response = await fetch("/api/subscription", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newSubscription)
			});

			if (!response.ok) {
				throw new Error("Failed to update subscription");
			}

			console.log("Updated subscription data:", newSubscription);
			setSubscription(newSubscription);
		} catch (error) {
			console.error("Failed to update subscription", error);
		}
	};

	return (
		<PlanContext.Provider value={{ subscription, updatePlan }}>
			{children}
		</PlanContext.Provider>
	);
};

export const usePlan = () => {
	const context = useContext(PlanContext);
	if (context === undefined) {
		throw new Error("usePlan must be used within a PlanProvider");
	}
	return context;
};
