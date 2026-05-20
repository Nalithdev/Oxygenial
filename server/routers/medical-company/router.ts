import { listMedicalCompanies } from "./queries/list-medical-companies";
import { getMedicalCompany } from "./queries/get-medical-company";
import { getMyMedicalCompany } from "./queries/get-my-medical-company";
import { getAnalytics } from "./queries/get-analytics";
import { createMedicalCompany } from "./mutations/create-medical-company";
import { updateMedicalCompany } from "./mutations/update-medical-company";

export const medicalCompanyRouter = {
  list: listMedicalCompanies,
  get: getMedicalCompany,
  getMy: getMyMedicalCompany,
  getAnalytics,
  create: createMedicalCompany,
  update: updateMedicalCompany,
};

