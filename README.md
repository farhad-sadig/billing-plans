# Billing Plans Section

This project includes a Billing Plan section that allows users to view, change, and manage their subscription plans. The section consists of several components and a context to handle subscription state, plan changes, and interactions with the backend API. Note that mock email and payment systems are used for demonstration purposes and are not real, but the components can easily be integrated into real systems. This project is implemented using TypeScript.

The project leverages Next.js with the App Router and Tailwind CSS.

## Components

### PlansSection

The PlansSection component is responsible for displaying different billing plans (Starter, Basic, Professional), showing the current subscription details, and allowing users to change their subscription plan.

**Key features:**

- Displays various billing plans.
- Shows the current subscription details.
- Allows users to change their subscription plan.
- Triggers a modal to confirm changes before updating the plan.
- Uses the usePlan context to manage the subscription state.
- Formats and displays the next billing date.
- Updates the highlighted plan based on the saved subscription.

### Modal

The Modal component is used to confirm plan changes or prompt the user to add billing information if not found.

**Key features:**

- Confirms upgrading the plan.
- Prompts the user to add billing information if necessary.
- Uses the usePlan context to update the plan.
- Displays a loading state while the API call is in progress.

### PlanContext

The PlanContext manages the global state for the subscription plan, providing functions to update the plan and retrieve the current subscription state.

**Key features:**

- Manages the subscription state.
- Saves the subscription plan to local storage to persist state across page reloads.
- Provides functions for updating the plan.
- Includes logic for prorated upgrades, immediate upgrades, downgrades, and unsubscriptions.
- Handles prevPlanName and newPlanName to determine the timing of plan changes.
- Fields change_pending and pending_plan_name are used to manage pending changes.

### Plan Interface

- **Responsive:** Ensures that the plan details are clearly visible on all devices (desktop, tablet, mobile) with consistent styling and functionality.
- **Current subscription information:** Dynamically displays the user's current subscription information, including the "plan type", "pricing", and the "date of the next billing" (not for the Starter plan, since it is free).
- **Plan selection:** Allows users to select one plan at a time. Changing from their current plan allows them to "Save changes", triggering the upgrade or downgrade logic.

## Plan Management

### Upgrading from the Free plan ("Starter" plan):

- Effected immediately.
- Displays a confirmation modal before triggering the billing.
- After billing is completed, returns the user to the plan module, with the current plan information updated and a success notification.

### Mid-cycle downgrades (including unsubscriptions / plan cancellations):

- Effected at the end of the current subscription cycle.
- Displays a confirmation modal before confirming.
- Displays a banner to allow users to cancel the downgrade before the end of the current subscription cycle.

### Mid-cycle upgrades:

- Billed and effected immediately.
- Prorated based on the remaining duration till the end of the current subscription cycle. The prorated charge is calculated as: (New monthly rate - Old monthly rate / Total days in month) x Remaining days in month after upgrade.
- Displays a confirmation modal before triggering the billing, including information about the prorated amount to be billed.
- After billing is completed, returns the user to the plan module, with the current plan information updated and a success notification.

### Billing information:

If the user has not filled their billing information, a prompt will be triggered to complete it.
