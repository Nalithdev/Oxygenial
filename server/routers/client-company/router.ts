import { getMyCompany } from "./queries/get-my-company";
import { createCompany } from "./mutations/create-company";
import { updateCompany } from "./mutations/update-company";
import {joinCompanyWithToken} from "@/server/routers/client-company/mutations/join-company-with-token";

export const clientCompanyRouter = {
  getMyCompany,
  create: createCompany,
  update: updateCompany,
  join: joinCompanyWithToken
};

