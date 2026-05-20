import { createCompanyInvitation } from "./mutations/create-company-invitation";
import { getCompanyInvitation } from "./queries/get-my-company-invitation";

export const invitationCompanyRouter = {
    list: getCompanyInvitation,
    createInvitation: createCompanyInvitation,
};
