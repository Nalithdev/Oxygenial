import { medicalCompanyRouter } from "./routers/medical-company/router";
import { clientCompanyRouter } from "./routers/client-company/router";
import { membershipRequestRouter } from "./routers/membership-request/router";
import { employeeRouter } from "./routers/employee/router";
import { bookingRouter } from "./routers/booking/router";
import { documentRouter } from "./routers/document/router";
import { medicalRouter } from "./routers/medical/router";
import { onboardingRouter } from "./routers/onboarding/router";
import { conversationRouter } from "./routers/conversation/router";

export const appRouter = {
  medicalCompany: medicalCompanyRouter,
  clientCompany: clientCompanyRouter,
  membershipRequest: membershipRequestRouter,
  employee: employeeRouter,
  booking: bookingRouter,
  document: documentRouter,
  medical: medicalRouter,
  onboarding: onboardingRouter,
  conversation: conversationRouter,
};

export type AppRouter = typeof appRouter;
