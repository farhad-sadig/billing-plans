"use client";
import { PlanChangeType } from "@/components/PlansSection";
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
}

interface PlanContextType {
	subscription: Subscription | null;
	updatePlan: (
		newPlanName: string,
		email: string,
		planChange: PlanChangeType
	) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [subscription, setSubscription] = useState<Subscription | null>(null);

	useEffect(() => {
		if (subscription?.email) {
			const fetchSubscription = async () => {
				try {
					const response = await fetch(
						`/api/subscription?email=${subscription.email}`
					);
					if (!response.ok) {
						throw new Error("Failed to fetch subscription data");
					}
					const data = await response.json();
					setSubscription(data);
				} catch (error) {
					console.error("Failed to fetch subscription data", error);
				}
			};

			fetchSubscription();
		}
	}, [subscription?.email]);

	const updatePlan = async (
		newPlanName: string,
		email: string,
		planChangeType: PlanChangeType
	) => {
		try {
			const planResponse = await fetch(`/api/plan/${newPlanName}`);
			if (!planResponse.ok) {
				throw new Error("Failed to fetch plan data");
			}
			const newPlan: Plan = await planResponse.json();

			const nextBillingDate =
				planChangeType === "upgrade"
					? new Date(
							new Date().setMonth(new Date().getMonth() + 1)
					  ).toISOString()
					: subscription!.nextBillingDate;

			const newSubscription: Subscription = {
				plan: newPlan,
				nextBillingDate: nextBillingDate,
				email: email
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
