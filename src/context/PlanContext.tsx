"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
	id: string;
	name: string;
	email: string;
}

interface Plan {
	planType: "Starter" | "Basic" | "Professional";
	planRate: number;
	nextBillingDate: string;
	planExpiry: string;
}

interface PlanContextType {
	user: User;
	plan: Plan;
	updatePlan: (plan: Plan) => void;
	resetPlan: () => void;
	updateUser: (user: User) => void;
	resetUser: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		email: ""
	});

	const [plan, setPlan] = useState<Plan>({
		planType: "Starter",
		planRate: 0,
		nextBillingDate: "",
		planExpiry: ""
	});

	const updatePlan = (newPlan: Plan) => {
		setPlan(newPlan);
	};

	const resetPlan = () => {
		setPlan({
			planType: "Starter",
			planRate: 0,
			nextBillingDate: "",
			planExpiry: ""
		});
	};

	const updateUser = (newUser: User) => {
		setUser(newUser);
	};

	const resetUser = () => {
		setUser({
			id: "",
			name: "",
			email: ""
		});
	};

	return (
		<PlanContext.Provider
			value={{
				user,
				plan,
				updatePlan,
				resetPlan,
				updateUser,
				resetUser
			}}
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
