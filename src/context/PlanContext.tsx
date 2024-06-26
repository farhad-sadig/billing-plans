"use client";
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect
} from "react";

export interface Plan {
	id: string;
	name: "Starter" | "Basic" | "Professional";
	monthlyRate: number;
}

interface Subscription {
	plan: Plan;
	startDate: string;
	nextBillingDate: string | null;
	status: string;
	email: string;
	endDate: string | null;
}

interface PlanContextType {
	subscription: Subscription;
	updatePlan: (newPlan: Plan, email: string, endDate?: string | null) => void;
}

const defaultPlan: Plan = {
	id: "starter",
	name: "Starter",
	monthlyRate: 0
};

const defaultSubscription: Subscription = {
	plan: defaultPlan,
	startDate: new Date().toISOString(),
	nextBillingDate: null,
	status: "active",
	email: "",
	endDate: null
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [subscription, setSubscription] =
		useState<Subscription>(defaultSubscription);

	useEffect(() => {
		const savedSubscription = localStorage.getItem("subscription");
		if (savedSubscription) {
			setSubscription(JSON.parse(savedSubscription));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("subscription", JSON.stringify(subscription));
	}, [subscription]);

	const updatePlan = (
		newPlan: Plan,
		email: string,
		endDate: string | null = null
	) => {
		const isDowngrade =
			newPlan.name === "Starter" && subscription.plan.name !== "Starter";

		const newSubscription: Subscription = {
			plan: newPlan,
			startDate: new Date().toISOString(),
			nextBillingDate: isDowngrade
				? subscription.nextBillingDate
				: new Date(
						new Date().setMonth(new Date().getMonth() + 1)
				  ).toISOString(),
			status: "active",
			email: email,
			endDate: null
		};

		if (isDowngrade && endDate) {
			newSubscription.status = "downgraded";
			newSubscription.endDate = endDate;
		}

		setSubscription(newSubscription);
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
