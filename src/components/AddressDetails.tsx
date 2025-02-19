import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { styleInputErrorAndFocus } from "@/utils/utils";

const countries = [
	{ code: "US", name: "United States" },
	{ code: "CA", name: "Canada" }
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
		"California",
		"Florida",
		"New York",
		"Washington"
	],
	CA: [
		"Alberta",
		"British Columbia",
		"Manitoba",
		"New Brunswick",
		"Ontario",
		"Quebec",
		"Saskatchewan"
	]
};

interface AddressDetailsProps {
	address: {
		country: string;
		state: string;
		addressLine1: string;
		addressLine2: string;
		city: string;
		zip: string;
	};
	setAddress: (name: string, value: string) => void;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({
	address,
	setAddress
}) => {
	const [errors, setErrors] = useState({
		country: false,
		state: false,
		addressLine1: false,
		city: false,
		zip: false
	});

	const [focused, setFocused] = useState({
		country: false,
		state: false,
		addressLine1: false,
		addressLine2: false,
		city: false,
		zip: false
	});

	const handleBlur = (name: string, value: string) => {
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: !value
		}));
		setFocused((prevFocused) => ({
			...prevFocused,
			[name]: false
		}));
	};

	const handleFocus = (name: string) => {
		setFocused((prevFocused) => ({
			...prevFocused,
			[name]: true
		}));
	};

	const validateZip = (zip: string) => /^\d{5}(-\d{4})?$/.test(zip);

	useEffect(() => {
		setErrors((prevErrors) => ({
			...prevErrors,
			zip: address.zip ? !validateZip(address.zip) : false
		}));
	}, [address.zip]);

	return (
		<div
			className="flex flex-col gap-6 text-sm mt-4"
			role="form"
			aria-labelledby="address-details"
		>
			<div className="flex flex-col gap-1.5 text-sm">
				<label className="font-medium text-neutral-700" htmlFor="country">
					Country / Region
				</label>
				<select
					className={styleInputErrorAndFocus(errors.country, focused.country)}
					id="country"
					name="country"
					value={address.country}
					onChange={(e) => setAddress("country", e.target.value)}
					onFocus={() => handleFocus("country")}
					onBlur={(e) => handleBlur("country", e.target.value)}
					required
					aria-required="true"
					aria-invalid={errors.country}
				>
					<option value="" disabled>
						Country
					</option>
					{countries.map((country) => (
						<option key={country.code} value={country.code}>
							{country.name}
						</option>
					))}
				</select>
				{errors.country && <ErrorMessage message="Country is required" />}
			</div>
			<div className="flex flex-col gap-1.5 text-sm">
				<label htmlFor="addressLine1" className="font-medium text-neutral-700">
					Address
				</label>
				<div className="flex flex-col gap-4">
					<input
						type="text"
						id="addressLine1"
						name="addressLine1"
						placeholder="Street address"
						value={address.addressLine1}
						onChange={(e) => setAddress("addressLine1", e.target.value)}
						onFocus={() => handleFocus("addressLine1")}
						onBlur={(e) => handleBlur("addressLine1", e.target.value)}
						required
						className={styleInputErrorAndFocus(
							errors.addressLine1,
							focused.addressLine1
						)}
						aria-required="true"
						aria-invalid={errors.addressLine1}
					/>
					{errors.addressLine1 && (
						<ErrorMessage message="Address is required" />
					)}
					<input
						type="text"
						id="addressLine2"
						name="addressLine2"
						placeholder="Apartment, suite, etc (optional)"
						value={address.addressLine2}
						onChange={(e) => setAddress("addressLine2", e.target.value)}
						onFocus={() => handleFocus("addressLine2")}
						onBlur={(e) => handleBlur("addressLine2", e.target.value)}
						className={styleInputErrorAndFocus(false, focused.addressLine2)}
					/>
				</div>
			</div>
			<div className="flex gap-8 text-sm">
				<div className="flex flex-col gap-1.5 w-1/3">
					<label htmlFor="city" className="font-medium text-neutral-700">
						City
					</label>
					<input
						type="text"
						id="city"
						name="city"
						value={address.city}
						onChange={(e) => setAddress("city", e.target.value)}
						onFocus={() => handleFocus("city")}
						onBlur={(e) => handleBlur("city", e.target.value)}
						required
						className={styleInputErrorAndFocus(errors.city, focused.city)}
						aria-required="true"
						aria-invalid={errors.city}
					/>
					{errors.city && <ErrorMessage message="City is required" />}
				</div>
				<div className="flex flex-col gap-1.5 w-1/3">
					<label htmlFor="state" className="font-medium text-neutral-700">
						State
					</label>
					<select
						id="state"
						name="state"
						value={address.state}
						onChange={(e) => setAddress("state", e.target.value)}
						onFocus={() => handleFocus("state")}
						onBlur={(e) => handleBlur("state", e.target.value)}
						className={styleInputErrorAndFocus(errors.state, focused.state)}
						required
						aria-required="true"
						aria-invalid={errors.state}
					>
						<option value="" disabled>
							State
						</option>
						{states[address.country]?.map((state, index) => (
							<option key={index} value={state}>
								{state}
							</option>
						))}
					</select>
					{errors.state && <ErrorMessage message="State is required" />}
				</div>
				<div className="flex flex-col gap-1.5 w-1/3">
					<label htmlFor="zip" className="font-medium text-neutral-700">
						ZIP
					</label>
					<input
						type="text"
						id="zip"
						name="zip"
						value={address.zip}
						onChange={(e) => setAddress("zip", e.target.value)}
						onFocus={() => handleFocus("zip")}
						onBlur={(e) => handleBlur("zip", e.target.value)}
						required
						className={styleInputErrorAndFocus(errors.zip, focused.zip)}
						aria-required="true"
						aria-invalid={errors.zip}
					/>
					{errors.zip && <ErrorMessage message="Invalid ZIP code" />}
				</div>
			</div>
		</div>
	);
};

export default AddressDetails;
