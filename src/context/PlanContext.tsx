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
	changePending: boolean;
	pendingPlanName: Plan["name"] | null;
}

interface PlanContextType {
	subscription: Subscription | null;
	updatePlan: (newPlanName: Plan["name"], email: string) => void;
	cancelPendingChange: () => void;
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
				plan: subscription?.plan || newPlan, // Keep the current plan for now
				nextBillingDate: nextBillingDate,
				email: email,
				prevPlanName: subscription?.plan.name || null,
				changePending: false,
				pendingPlanName: null
			};

			if (newPlan.monthlyRate < (subscription?.plan.monthlyRate || 0)) {
				// Downgrade or Unsubscribe: schedule for next billing cycle
				newSubscription.changePending = true;
				newSubscription.pendingPlanName = newPlanName;
			} else {
				// Upgrade: apply immediately after confirmation in modal
				newSubscription.plan = newPlan; // Apply the new plan immediately
			}

			// Save subscription to database
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

	const cancelPendingChange = async () => {
		if (subscription) {
			const updatedSubscription: Subscription = {
				...subscription,
				changePending: false,
				pendingPlanName: null
			};

			try {
				const response = await fetch("/api/subscription", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(updatedSubscription)
				});

				if (!response.ok) {
					throw new Error("Failed to cancel pending change");
				}

				console.log("Cancelled pending change:", updatedSubscription);
				setSubscription(updatedSubscription);
			} catch (error) {
				console.error("Failed to cancel pending change", error);
			}
		}
	};

	return (
		<PlanContext.Provider
			value={{ subscription, updatePlan, cancelPendingChange }}
		>
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
