import React, {createContext, useReducer} from 'react';
import {ClientReducer} from './ClientReducer';
import {
  deleteClientCRUD,
  deleteClientsCRUD,
  getAllClientsBySalonId,
  insertClientCRUD,
  updateClientCRUD,
} from '../../services/ClientService';

export const ClientContext = createContext();

const initialState = {
  clients: [],
  registeredClients: [],
  isClientsLoading: true,
};

const ClientProvider = ({children}) => {
  const [state, dispatch] = useReducer(ClientReducer, initialState);

  const loadAllClients = payload => {
    return new Promise(async (resolve, reject) => {
      try {
        await getAllClientsBySalonId(payload, false).then(clients => {
          resolve(dispatch({type: 'LOAD_CLIENTS', clients}));

          // console.log((state.clients = clients));
        });
      } catch (e) {
        reject(`Deu ruim ao listar clientes ${e}`);
      }
    });
  };

  const addClient = payload => {
    dispatch({type: 'ADD_CLIENT', payload});
  };

  const updateClientInView = payload => {
    dispatch({type: 'UPDATE_CLIENTS_INVIEW', payload});
  };

  const editClient = payload => {
    dispatch({type: 'EDIT_CLIENT', payload});
  };

  const saveClient = payload => {
    return new Promise((resolve, reject) => {
      try {
        state.registeredClients.forEach(client => {
          insertClientCRUD(client, false).then(newClient => {
            dispatch({type: 'SAVE_CLIENTS', newClient});
          });
        });
        resolve('OK');
      } catch (e) {
        reject(`Deu ruim ao salvar clientes ${e}`);
      }
    });
  };

  const updateClient = payload => {
    return new Promise(async (resolve, reject) => {
      try {
        updateClientCRUD(payload, false).then(updatedClient => {
          dispatch({type: 'UPDATE_CLIENT', updatedClient});
        });

        resolve('Deu bom');
      } catch (e) {
        reject(`Deu ruim ao editar clientes ${e}`);
      }
    });
  };

  const deleteUniqueClient = payload => {
    return new Promise(async (resolve, reject) => {
      const {id} = payload;
      try {
        deleteClientCRUD(id).then(deletedClient => {
          resolve(dispatch({type: 'DELETE_CLIENT', deletedClient}));
        });
      } catch (e) {
        reject(`Deu ruim ao excluir cliente ${e}`);
      }
    });
  };

  const deleteClientList = payload => {
    return new Promise(async (resolve, reject) => {
      const clients = payload;
      try {
        await deleteClientsCRUD(clients);
        resolve(dispatch({type: 'DELETE_CLIENTS', clients}));
      } catch (e) {
        reject(`Deu ruim ao excluir clientes ${e}`);
      }
    });
  };

  const deleteClientInView = payload => {
    dispatch({type: 'DELETE_CLIENT_INVIEW', payload});
  };

  const cleanRegisteredClients = payload => {
    dispatch({type: 'CLEAN_REGISTERED_CLIENTS', payload});
  };

  const cleanClients = payload => {
    dispatch({type: 'CLEAN_CLIENTS', payload});
  };

  const contextValues = {
    loadAllClients,
    addClient,

    saveClient,
    cleanRegisteredClients,
    cleanClients,

    updateClient,
    deleteUniqueClient,
    deleteClientList,
    deleteClientInView,
    updateClientInView,
    editClient,
    ...state,
  };

  return (
    <ClientContext.Provider value={contextValues}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
