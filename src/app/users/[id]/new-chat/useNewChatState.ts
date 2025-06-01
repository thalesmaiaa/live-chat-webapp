import * as React from 'react';

const initialState = {
  selectedUserIds: [] as string[],
  isModalOpen: false,
  chatName: '',
};

type State = typeof initialState;

type Action =
  | { type: 'SET_SELECTED_USER_IDS'; payload: string[] }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_CHAT_NAME'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SELECTED_USER_IDS':
      return { ...state, selectedUserIds: action.payload };
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false };
    case 'SET_CHAT_NAME':
      return { ...state, chatName: action.payload };
    default:
      return state;
  }
}

export const useNewChatState = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const setSelectedUserIds = React.useCallback(
    (ids: string[]) => dispatch({ type: 'SET_SELECTED_USER_IDS', payload: ids }),
    [dispatch],
  );

  const openModal = React.useCallback(() => dispatch({ type: 'OPEN_MODAL' }), [dispatch]);
  const closeModal = React.useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), [dispatch]);

  const setChatName = React.useCallback(
    (name: string) => dispatch({ type: 'SET_CHAT_NAME', payload: name }),
    [dispatch],
  );

  return {
    state,
    setSelectedUserIds,
    openModal,
    closeModal,
    setChatName,
  };
};
