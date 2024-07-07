export const styleInputErrorAndFocus = (error: boolean, focused: boolean) =>
	`outline-none w-full flex bg-neutral-50 px-3.5 py-2.5 rounded border border-solid font-normal text-neutral-500 ${
		error
			? "border-red-600 shadow-error-focused"
			: focused
			? "border-blue-500 shadow-focused"
			: "border-neutral-200"
	}`;

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const day = date.getUTCDate();

	const month = date.toLocaleString("default", { month: "long" });

	const year = date.getUTCFullYear();

	const getOrdinalSuffix = (day: number): string => {
		if (day > 3 && day < 21) return "th";
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;

	return formattedDate;
}

export const getProratedChargeDescription = (
	newRate: number,
	oldRate: number
): string => {
	const now = new Date();
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	const remainingDays = endOfMonth.getDate() - now.getDate() + 1;
	const totalDaysInMonth = endOfMonth.getDate();
	const proratedCharge = Math.round(
		((newRate - oldRate) / totalDaysInMonth) * remainingDays
	);
	return `This will take immediate effect. You will be charged a prorated $${proratedCharge} now (for ${remainingDays} remaining days) and $${newRate} / month starting from the next billing cycle.`;
};
