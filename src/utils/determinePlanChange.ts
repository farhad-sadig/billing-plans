import { PlanChangeType } from "@/components/PlansSection";
import { Plan } from "@/context/PlanContext";

export const determinePlanChangeType = (
	newPlan: Plan["name"],
	currentPlan: Plan["name"]
): PlanChangeType => {
	if (newPlan === currentPlan) {
		return "upgrade";
	}

	switch (newPlan) {
		case "Basic":
			return currentPlan === "Starter" ? "upgrade" : "downgrade";
		case "Professional":
			return currentPlan === "Starter" ? "upgrade" : "proratedUpgrade";
		case "Starter":
			return "unsubscribe";
		default:
			return "downgrade";
	}
};
