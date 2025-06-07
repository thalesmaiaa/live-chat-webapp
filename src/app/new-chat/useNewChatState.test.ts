import { renderHook, act } from '@testing-library/react';
import { useNewChatState } from './useNewChatState';

describe('useNewChatState', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useNewChatState());
    expect(result.current.state).toEqual({
      selectedUserIds: [],
      isModalOpen: false,
      chatName: '',
    });
  });

  it('setSelectedUserIds updates selectedUserIds', () => {
    const { result } = renderHook(() => useNewChatState());
    act(() => {
      result.current.setSelectedUserIds(['1', '2']);
    });
    expect(result.current.state.selectedUserIds).toEqual(['1', '2']);
  });

  it('openModal sets isModalOpen to true', () => {
    const { result } = renderHook(() => useNewChatState());
    act(() => {
      result.current.openModal();
    });
    expect(result.current.state.isModalOpen).toBe(true);
  });

  it('closeModal sets isModalOpen to false', () => {
    const { result } = renderHook(() => useNewChatState());
    act(() => {
      result.current.openModal();
    });
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.state.isModalOpen).toBe(false);
  });

  it('setChatName updates chatName', () => {
    const { result } = renderHook(() => useNewChatState());
    act(() => {
      result.current.setChatName('My Chat');
    });
    expect(result.current.state.chatName).toBe('My Chat');
  });

  it('multiple actions update state as expected', () => {
    const { result } = renderHook(() => useNewChatState());
    act(() => {
      result.current.setSelectedUserIds(['a']);
      result.current.openModal();
      result.current.setChatName('abc');
    });
    expect(result.current.state).toEqual({
      selectedUserIds: ['a'],
      isModalOpen: true,
      chatName: 'abc',
    });
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.state.isModalOpen).toBe(false);
  });
});