export default function formatDate(dateString: string): string {
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
