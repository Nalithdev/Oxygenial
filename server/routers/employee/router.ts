import {listEmployees} from "./queries/list-employees";
import {getEmployee} from "./queries/get-employee";
import {getMyProfile} from "./queries/get-my-profile";
import {createEmployee} from "./mutations/create-employee";
import {updateEmployee} from "./mutations/update-employee";
import {deleteEmployee} from "./mutations/delete-employee";
import {getEmployeeByUserId} from "./queries/get-employee_by_userId";

export const employeeRouter = {
    list: listEmployees,
    get: getEmployee,
    getMyProfile,
    get_by_userId: getEmployeeByUserId,
    create: createEmployee,
    update: updateEmployee,
    delete: deleteEmployee,
};

