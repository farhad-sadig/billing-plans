import React, { useState } from "react";

const countries = [
	{ code: "US", name: "United States" },
	{ code: "CA", name: "Canada" }
	// Add more countries as needed
];

type States = {
	[key: string]: string[];
};

const states: States = {
	US: [
		"Alabama",
		"Alaska",
		"Arizona",
		"Arkansas",
		"California" /* ...more states */
	],
	CA: [
		"Alberta",
		"British Columbia",
		"Manitoba",
		"New Brunswick" /* ...more provinces */
	]
	// Add more states/provinces for other countries as needed
};

const AddressDetails: React.FC = () => {
	const [country, setCountry] = useState<string>("US");
	const [state, setState] = useState<string>("");
	const [addressLine1, setAddressLine1] = useState<string>("");
	const [addressLine2, setAddressLine2] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [zip, setZip] = useState<string>("");

	return (
		<div className="flex flex-col gap-6 text-sm">
			<div className="flex flex-col gap-1.5">
				<label className="font-medium text-neutral-700" htmlFor="country">
					Country/Region
				</label>
				<select
					id="country"
					name="country"
					value={country}
					onChange={(e) => setCountry(e.target.value)}
				>
					{countries.map((country) => (
						<option key={country.code} value={country.code}>
							{country.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col mb-4">
				<label htmlFor="addressLine1" className="mb-2">
					Address Line 1
				</label>
				<input
					type="text"
					id="addressLine1"
					name="addressLine1"
					value={addressLine1}
					onChange={(e) => setAddressLine1(e.target.value)}
					required
					className="w-full py-2 px-4 border rounded"
				/>
			</div>
			<div className="flex flex-col mb-4">
				<label htmlFor="addressLine2" className="mb-2">
					Address Line 2 (Optional)
				</label>
				<input
					type="text"
					id="addressLine2"
					name="addressLine2"
					value={addressLine2}
					onChange={(e) => setAddressLine2(e.target.value)}
					className="w-full py-2 px-4 border rounded"
				/>
			</div>
			<div className="flex flex-col mb-4">
				<label htmlFor="city" className="mb-2">
					City
				</label>
				<input
					type="text"
					id="city"
					name="city"
					value={city}
					onChange={(e) => setCity(e.target.value)}
					required
					className="w-full py-2 px-4 border rounded"
				/>
			</div>
			<div className="flex flex-col mb-4">
				<label htmlFor="state" className="mb-2">
					State
				</label>
				<select
					id="state"
					name="state"
					value={state}
					onChange={(e) => setState(e.target.value)}
					className="w-full py-2 px-4 border rounded"
					required
				>
					{states[country]?.map((state, index) => (
						<option key={index} value={state}>
							{state}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col mb-4">
				<label htmlFor="zip" className="mb-2">
					ZIP
				</label>
				<input
					type="text"
					id="zip"
					name="zip"
					value={zip}
					onChange={(e) => setZip(e.target.value)}
					required
					className="w-full py-2 px-4 border rounded"
				/>
			</div>
		</div>
	);
};

export default AddressDetails;
