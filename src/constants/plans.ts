export interface Plan {
	name: "Starter" | "Basic" | "Professional";
	monthlyRate: number;
}

export const PLANS: Record<string, Plan> = {
	Starter: { name: "Starter", monthlyRate: 0 },
	Basic: { name: "Basic", monthlyRate: 6 },
	Professional: { name: "Professional", monthlyRate: 12 }
};
