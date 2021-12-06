import React, {createContext, useReducer} from 'react';
import {ScheduleReducer} from './ScheduleReducer';
import {
  confirmSchedulesList,
  deleteScheduleCRUD,
  deleteSchedulesCRUD,
  getAllSchedules,
  insertScheduleCRUD,
  updateScheduleCRUD,
} from '../../services/ScheduleService';
import {deleteClientCRUD} from '../../services/ClientService';
import {deleteProcedureEmployee} from '../../services/ProcedureEmployeeService';
import {deleteScheduleProcedureById} from '../../services/ScheduleProcedureService';
import {buildCalendar} from '../../factory/Schedule';

export const ScheduleContext = createContext();

const initialState = {
  isSchedulesLoading: true,
  schedules: [],
  calendarSchedule: [],
  registeredSchedules: [],
  scheduleInView: {},
};

const ScheduleProvider = ({children}) => {
  const [state, dispatch] = useReducer(ScheduleReducer, initialState);

  const loadAllSchedulesByPartner = payload => {
    const {employeeId, salonId, employeeType} = payload;
    return new Promise(async (resolve, reject) => {
      try {
        await getAllSchedules(employeeId, salonId, employeeType, false).then(
          schedules => {
            resolve(buildCalendar(schedules));
          },
        );
      } catch (e) {
        reject(`Deu ruim ao listar agendamentos ${e}`);
      }
    });
  };

  const loadAllSchedules = payload => {
    const {employeeId, salonId, employeeType} = payload;
    return new Promise(async (resolve, reject) => {
      try {
        await getAllSchedules(employeeId, salonId, employeeType, false).then(
          schedules => {
            dispatch({type: 'LOAD_SCHEDULES', schedules});
            sortScheduleList();
            resolve(state.schedules);

            // console.log((state.clients = clients));
          },
        );
      } catch (e) {
        reject(`Deu ruim ao listar agendamentos ${e}`);
      }
    });
  };

  const checkSchedule = payload => {
    const id = payload;
    dispatch({type: 'CHECK_SCHEDULE', id});
  };

  const confirmSchedules = payload => {
    const toConfirmSchedules = payload;

    toConfirmSchedules.forEach(({id, procedures, checked}) => {
      confirmSchedulesList(id, procedures, checked).then(confirmedSchedule => {
        dispatch({type: 'CONFIRM_SCHEDULE', confirmedSchedule});
      });
    });
  };

  const addSchedule = payload => {
    dispatch({type: 'ADD_SCHEDULE', payload});
  };

  const saveSchedule = payload => {
    return new Promise((resolve, reject) => {
      try {
        state.registeredSchedules.forEach(schedule => {
          insertScheduleCRUD(schedule, false).then(newSchedule => {
            resolve(dispatch({type: 'SAVE_SCHEDULE', newSchedule}));
          });
        });
      } catch (e) {
        reject(`Deu ruim ao salvar agendamentos ${e}`);
      }
    });
  };

  const updateSchedule = payload => {
    return new Promise(async (resolve, reject) => {
      try {
        updateScheduleCRUD(payload, false).then(updatedSchedule => {
          resolve(dispatch({type: 'UPDATE_SCHEDULE', updatedSchedule}));
        });
      } catch (e) {
        reject(`Deu ruim ao editar agendamentos ${e}`);
      }
    });
  };

  const deleteUniqueSchedule = payload => {
    return new Promise(async (resolve, reject) => {
      const schedule = payload;
      try {
        dispatch({type: 'DELETE_SCHEDULE', deletedScheduleId: schedule.id});
        await deleteScheduleCRUD(schedule);
        resolve(sortScheduleList);
      } catch (e) {
        reject(`Deu ruim ao excluir agendamentos ${e}`);
      }
    });
  };

  const deleteScheduleList = payload => {
    return new Promise(async (resolve, reject) => {
      const schedules = payload;
      try {
        dispatch({type: 'DELETE_SCHEDULES', schedules});
        await deleteSchedulesCRUD(schedules);
        resolve(sortScheduleList);
      } catch (e) {
        reject(`Deu ruim ao excluir agendamentos ${e}`);
      }
    });
  };

  const deleteScheduleProcedure = payload => {
    return new Promise(async (resolve, reject) => {
      const {scheduleProcedureId} = payload;
      try {
        deleteScheduleProcedureById(scheduleProcedureId, false).then(
          deletedScheduleProcedure => {
            dispatch({
              type: 'DELETE_SCHEDULE_PROCEDURE',
              deletedScheduleProcedure,
            });
            resolve(sortScheduleList);
          },
        );
      } catch (e) {
        reject(`Deu ruim ao excluir procedimento ${e}`);
      }
    });
  };

  const deleteScheduleInView = payload => {
    dispatch({type: 'DELETE_SCHEDULE_INVIEW', payload});
  };

  const updateScheduleInView = payload => {
    dispatch({type: 'UPDATE_SCHEDULE_INVIEW', payload});
  };

  const editSchedule = payload => {
    dispatch({type: 'EDIT_SCHEDULE', payload});
  };

  const sortScheduleList = payload => {
    dispatch({type: 'SORT_SCHEDULES', payload});
  };

  const cleanRegisteredSchedules = payload => {
    dispatch({type: 'CLEAN_REGISTERED_SCHEDULES', payload});
  };

  const cleanSchedules = payload => {
    dispatch({type: 'CLEAN_SCHEDULES', payload});
  };

  const contextValues = {
    loadAllSchedules,
    addSchedule,
    deleteScheduleProcedure,
    saveSchedule,
    sortScheduleList,
    cleanRegisteredSchedules,
    cleanSchedules,
    deleteUniqueSchedule,
    deleteScheduleList,
    updateSchedule,
    checkSchedule,
    deleteScheduleInView,
    updateScheduleInView,
    editSchedule,
    confirmSchedules,
    loadAllSchedulesByPartner,
    ...state,
  };

  return (
    <ScheduleContext.Provider value={contextValues}>
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleProvider;
