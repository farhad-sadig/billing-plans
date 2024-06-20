import React from "react";
import UIProvider from "./UIProvider";

const CombinedProvider = ({ children }: { children: React.ReactNode }) => {
	return <UIProvider>{children}</UIProvider>;
};

export default CombinedProvider;
