import Parse from 'parse/react-native';
import {convertToObj} from '../pipe/conversor';
import {SalonObject} from './SalonService';
import {deleteProcedureEmployeeByProcedureId} from './ProcedureEmployeeService';
import {buildProcedure, buildProcedureList} from '../factory/Procedure';
import {deleteScheduleProcedureByProcedureId} from './ScheduleProcedureService';
import {EmployeeObject} from './EmployeeService';
import {deleteScheduleByClientId} from './ScheduleService';
import {ClientObject} from './ClientService';

export const ProcedureObject = Parse.Object.extend('procedure');

export const getAllProceduresBySalonId = (salonId, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salon = new SalonObject({objectId: salonId});
      const ProcedureQuery = new Parse.Query(ProcedureObject);
      ProcedureQuery.equalTo('salon_id', salon);
      if (returnParseObject) {
        resolve(await ProcedureQuery.find());
      } else {
        const procedures = await ProcedureQuery.find();

        if (procedures.length > 0)
          resolve(buildProcedureList(convertToObj(procedures)));
        else resolve([]);
      }
    } catch (e) {
      console.error(`Procedimento ${e}`);
      reject(`Procedimento ${JSON.stringify(e)}`);
    }
  });
};

export const getProcedureById = (procedureId, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ProcedureQuery = new Parse.Query(ProcedureObject);
      ProcedureQuery.equalTo('objectId', procedureId);

      if (returnParseObject) {
        resolve(await ProcedureQuery.first());
      } else {
        resolve(convertToObj(await ProcedureQuery.first()));
      }
    } catch (e) {
      reject(`Procedimento ${JSON.stringify(e)}`);
    }
  });
};

export const saveProcedure = (procedureObj, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        maintenanceValue,
        maintenanceDays,
        name,
        time,
        value,
        commissionValue,
        commissionPercentage,
        employeeId,
        salonId,
      } = procedureObj;

      const newProcedure = new ProcedureObject();

      if (maintenanceValue !== '' && maintenanceDays !== '') {
        newProcedure.set(
          'maintenance_value',
          parseFloat(maintenanceValue.replace('.', '').replace(',', '.')),
        );
        newProcedure.set('maintenance_days', parseInt(maintenanceDays));
      }
      newProcedure.set('name', name);
      newProcedure.set('time', parseInt(time));
      newProcedure.set(
        'value',
        parseFloat(value.replace('.', '').replace(',', '.')),
      );
      newProcedure.set(
        'commission_value',
        parseFloat(
          commissionValue !== 0
            ? commissionValue.replace('.', '').replace(',', '.')
            : 0,
        ),
      );
      newProcedure.set('commission_percentage', parseInt(commissionPercentage));
      newProcedure.set(
        'employee_id',
        new EmployeeObject({objectId: employeeId}),
      );
      newProcedure.set('salon_id', new SalonObject({objectId: salonId}));

      newProcedure.save().then(
        savedProcedure => {
          if (returnParseObject) {
            resolve(savedProcedure);
          } else {
            resolve(buildProcedure(convertToObj(savedProcedure)));
          }
        },
        error => {
          console.error(`Procedimentoee ${error}`);
          reject(`Procedimentoeee ${JSON.stringify(error)}`);
        },
      );
    } catch (e) {
      console.error(`Procedimentoeee ${e}`);
      reject(`Procedimentoeee ${JSON.stringify(e)}`);
    }
  });
};

export const getProcedureByName = (procedureName, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ProcedureQuery = new Parse.Query(ProcedureObject);
      ProcedureQuery.equalTo('name', procedureName);

      if (returnParseObject) {
        resolve(await ProcedureQuery.first());
      } else {
        resolve(convertToObj(await ProcedureQuery.first()));
      }
    } catch (e) {
      console.error(`Procedimento   ${e}`);
      reject(`Procedimento ${JSON.stringify(e)}`);
    }
  });
};

export const deleteProcedureCRUD = (procedureId, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const procedure = new ProcedureObject({objectId: procedureId});

      procedure.destroy().then(async deletedProcedure => {
        await deleteProcedureEmployeeByProcedureId(deletedProcedure.id);
        await deleteScheduleProcedureByProcedureId(procedureId, false);
        if (returnParseObject) {
          resolve(deletedProcedure);
        } else {
          resolve(buildProcedure(convertToObj(deletedProcedure)));
        }
      });
    } catch (e) {
      console.error(`Procedimento   ${e}`);
      reject(`Procedimento ${JSON.stringify(e)}`);
    }
  });
};

export const deleteProceduresCRUD = async procedures => {
  try {
    for (const procedure of procedures) {
      const procedureToDelete = new ClientObject({objectId: procedure.id});
      await procedureToDelete.destroy();
      await deleteProcedureEmployeeByProcedureId(procedure.id);
      await deleteScheduleProcedureByProcedureId(procedure.id, false);
    }
  } catch (e) {
    console.error(`Procedimento ${e}`);
  }
};

export const updateProcedureCRUD = (procedureObj, returnParseObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        time,
        value,
        commissionValue,
        commissionPercentage,
        maintenanceValue,
        maintenanceDays,
        id,
      } = procedureObj;

      const procedure = new ProcedureObject({objectId: id});

      if (maintenanceValue !== undefined && maintenanceDays !== undefined) {
        procedure.set(
          'maintenance_value',
          parseFloat(maintenanceValue.replace(',', '')),
        );
        procedure.set('maintenance_days', parseInt(maintenanceDays));
      }
      procedure.set('name', name);
      procedure.set('time', parseInt(time));
      procedure.set(
        'value',
        parseFloat(value.replace('.', '').replace(',', '.')),
      );
      procedure.set(
        'commission_value',
        parseFloat(
          commissionValue !== 0
            ? commissionValue.replace('.', '').replace(',', '.')
            : 0,
        ),
      );
      procedure.set('commission_percentage', parseInt(commissionPercentage));

      if (returnParseObject) {
        resolve(await procedure.save());
      } else {
        resolve(buildProcedure(convertToObj(await procedure.save())));
      }
    } catch (e) {
      console.error(`Procedimento   ${e}`);
      reject(`Procedimento ${JSON.stringify(e)}`);
    }
  });
};
