import { listMedicalCompanies } from "./queries/list-medical-companies";
import { getMedicalCompany } from "./queries/get-medical-company";
import { getMyMedicalCompany } from "./queries/get-my-medical-company";
import { createMedicalCompany } from "./mutations/create-medical-company";
import { updateMedicalCompany } from "./mutations/update-medical-company";

export const medicalCompanyRouter = {
  list: listMedicalCompanies,
  get: getMedicalCompany,
  getMy: getMyMedicalCompany,
  create: createMedicalCompany,
  update: updateMedicalCompany,
};

