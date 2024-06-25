export const styleInputErrorAndFocus = (error: boolean, focused: boolean) =>
	`outline-none w-full flex bg-neutral-50 px-3.5 py-2.5 rounded border border-solid font-normal text-neutral-500 ${
		error
			? "border-red-600 shadow-error-focused"
			: focused
			? "border-blue-500 shadow-focused"
			: "border-neutral-200"
	}`;
