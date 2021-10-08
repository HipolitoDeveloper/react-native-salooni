import Parse from 'parse/react-native';
import {convertToObj} from '../pipe/conversor';
import {SalonObject} from './SalonService';
import {
  deleteProcedureEmployee,
  deleteProcedureEmployeeByEmployeeId,
  saveProcedureEmployee,
} from './ProcedureEmployeeService';
import {ProcedureObject} from './ProcedureService';
import {buildEmployeeList, buildEmployeeObject} from '../factory/Employee';
import {deleteScheduleByEmployeeId} from './ScheduleService';

export const EmployeeObject = Parse.Object.extend('employee');

export const getAllPartnersBySalonId = (salonId, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salon = new SalonObject({objectId: salonId});
      const EmployeeQuery = new Parse.Query(EmployeeObject);
      // EmployeeQuery.equalTo('employee_type', 'PRC');
      EmployeeQuery.equalTo('salon_id', salon);
      if (returnParseObject) {
        resolve(await EmployeeQuery.find());
      } else {
        const partners = await EmployeeQuery.find();

        if (partners.length > 0)
          resolve(
            await buildEmployeeList(convertToObj(await EmployeeQuery.find())),
          );
        else resolve([]);
      }
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};

export const getEmployeeByEmail = (employeeEmail, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const EmployeeQuery = new Parse.Query(EmployeeObject);
      EmployeeQuery.equalTo('email', employeeEmail.trim());
      // EmployeeQuery.include('salon_id');

      if (returnParseObject) {
        resolve(await EmployeeQuery.first());
      } else {
        resolve(
          buildEmployeeObject(convertToObj(await EmployeeQuery.first()), []),
        );
      }
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};

export const getEmployeeById = (employeeId, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const EmployeeQuery = new Parse.Query(EmployeeObject);
      EmployeeQuery.equalTo('objectId', employeeId);

      if (returnParseObject) {
        resolve(await EmployeeQuery.first());
      } else {
        resolve(
          buildEmployeeObject(convertToObj(await EmployeeQuery.first()), []),
        );
      }
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};

export const saveEmployee = (employeeObj, returnParseObject, currentUser) => {
  return new Promise((resolve, reject) => {
    try {
      const {cnpj, tel, tel2, employeeType, name, salonId, email, procedures} =
        employeeObj;

      const newEmployee = new EmployeeObject();
      newEmployee.set('name', name.trim());
      newEmployee.set('cnpj', cnpj);
      newEmployee.set('employee_type', employeeType);
      newEmployee.set('tel', tel);
      newEmployee.set('tel2', tel2);
      newEmployee.set('salon_id', salonId);
      newEmployee.set('email', email.trim());

      newEmployee.save().then(
        async savedEmployee => {
          if (procedures !== undefined) {
            for (const procedure of procedures) {
              const procedureEmployee = await saveProcedureEmployee({
                procedureId: new ProcedureObject({objectId: procedure.id}),
                employeeId: new EmployeeObject({objectId: savedEmployee.id}),
              });

              procedure.procedureEmployeeId = procedureEmployee.objectId;
            }
          }

          if (returnParseObject) {
            resolve(savedEmployee);
          } else {
            resolve(
              await buildEmployeeObject(
                convertToObj(savedEmployee),
                procedures,
              ),
            );
          }
        },
        error => {
          console.error(`Empregador ${error}`);
          reject(`Empregador ${JSON.stringify(error)}`);
        },
      );
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};

export const saveEmployeeWithoutProcedures = (
  employeeObj,
  returnParseObject,
) => {
  return new Promise((resolve, reject) => {
    try {
      let {cnpj, tel, tel2, employeeType, name, salonId, email} = employeeObj;

      const newEmployee = new EmployeeObject();
      newEmployee.set('name', name.trim());
      newEmployee.set('cnpj', cnpj);
      newEmployee.set('employee_type', employeeType);
      newEmployee.set('tel', tel);
      newEmployee.set('tel2', tel2);
      newEmployee.set('salon_id', salonId);
      newEmployee.set('email', email.trim());

      newEmployee.save().then(
        async savedEmployee => {
          if (returnParseObject) {
            resolve(savedEmployee);
          } else {
            resolve(await buildEmployeeObject(convertToObj(savedEmployee), []));
          }
        },
        error => {
          console.error(`Empregador ${error}`);
          reject(`Empregador ${JSON.stringify(error)}`);
        },
      );
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};
export const deleteEmployeeCRUD = (employeeId, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const partner = new EmployeeObject({objectId: employeeId});
      await deleteProcedureEmployeeByEmployeeId(employeeId);
      await deleteScheduleByEmployeeId(employeeId, false);
      partner.destroy().then(deletedPartner => {
        if (returnParseObject) {
          resolve(deletedPartner);
        } else {
          resolve(convertToObj(deletedPartner));
        }
      });
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};

export const updateEmployeeCRUD = (
  partnerObj,
  proceduresList,
  returnParseObject,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        tel,
        tel2,
        cnpj,
        email,
        procedures,
        procedureListWithoutChanges,
        id,
      } = partnerObj;
      const employee = new EmployeeObject({objectId: id});

      employee.set('name', name.trim());
      employee.set('cnpj', cnpj);
      employee.set('tel', tel);
      employee.set('tel2', tel2);
      employee.set('email', email.trim());

      employee.save().then(async employee => {
        if (returnParseObject) {
          resolve(employee);
        } else {
          procedureListWithoutChanges.map(async pl => {
            if (!procedures.some(p => p.name === pl.name)) {
              await deleteProcedureEmployee(pl.procedureEmployeeId);
            }
          });

          for (const procedure of procedures) {
            if (
              !procedureListWithoutChanges.some(pl => pl.id === procedure.id)
            ) {
              const procedureEmployeer = {
                procedureId: new ProcedureObject({objectId: procedure.id}),
                employeeId: employee,
              };
              const procedureEmployee = await saveProcedureEmployee(
                procedureEmployeer,
                false,
              );
              procedure.procedureEmployeeId = procedureEmployee.objectId;
            }
          }
          resolve(
            await buildEmployeeObject(convertToObj(employee), procedures),
          );
        }
      });
    } catch (e) {
      console.error(`Empregador ${e}`);
      reject(`Empregador ${JSON.stringify(e)}`);
    }
  });
};
