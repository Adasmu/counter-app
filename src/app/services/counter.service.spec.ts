import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from './counter.service';

vi.mock('@capacitor/preferences', () => ({ Preferences: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }));

describe('CounterService', () => {
  let service: CounterService;
  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);
  const first: SavedCounter = { id: 'first', name: 'První', value: 1, createdAt: '2026-09-17T08:00:00.000Z' };
  const second: SavedCounter = { id: 'second', name: 'Druhé', value: 2, createdAt: '2026-09-17T09:00:00.000Z' };

  beforeEach(() => {
    vi.resetAllMocks();
    getMock.mockResolvedValue({ value: null });
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);
    TestBed.configureTestingModule({ providers: [CounterService] });
    service = TestBed.inject(CounterService);
  });
  afterEach(() => vi.restoreAllMocks());

  it('initializes only once, including concurrent calls and missing data', async () => {
    await Promise.all([service.initialize(), service.initialize()]);
    await service.initialize();
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
  });
  it('loads previously saved JSON', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([second, first]) });
    await service.initialize();
    expect(service.counters()).toEqual([second, first]);
    expect(getMock).toHaveBeenCalledWith({ key: 'saved-counters' });
  });
  it('adds newest first and persists the correct key and JSON', async () => {
    await service.add(first);
    await service.add(second);
    expect(service.counters()).toEqual([second, first]);
    expect(setMock).toHaveBeenLastCalledWith({ key: 'saved-counters', value: JSON.stringify([second, first]) });
  });
  it('removes only the selected counter and persists the result', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([second, first]) });
    await service.remove('first');
    expect(service.counters()).toEqual([second]);
    expect(setMock).toHaveBeenCalledWith({ key: 'saved-counters', value: JSON.stringify([second]) });
  });
  it('clears history using remove for its own key only', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first]) });
    await service.clear();
    expect(service.counters()).toEqual([]);
    expect(removeMock).toHaveBeenCalledExactlyOnceWith({ key: 'saved-counters' });
  });
  it.each(['not JSON', JSON.stringify({ name: 'test' })])('recovers from malformed stored data: %s', async (value) => {
    getMock.mockResolvedValue({ value });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await service.initialize();
    expect(service.counters()).toEqual([]);
    expect(service.initialized()).toBe(true);
    expect(spy).toHaveBeenCalledWith('Historii počítadel se nepodařilo načíst.', expect.any(Error));
  });
  it('rejects invalid record shapes without crashing initialization', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([{ id: 'x', name: 'Test', value: 'wrong' }]) });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await service.initialize();
    expect(service.counters()).toEqual([]);
    expect(service.loadError()).not.toBeNull();
    expect(service.initialized()).toBe(true);
  });
  it('preserves in-memory state if saving fails and allows retrying', async () => {
    setMock.mockRejectedValueOnce(new Error('Disk full'));
    await expect(service.add(first)).rejects.toThrow('Disk full');
    expect(service.counters()).toEqual([]);
    await service.add(first);
    expect(service.counters()).toEqual([first]);
  });
  it('preserves existing history if clear fails', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first]) });
    removeMock.mockRejectedValueOnce(new Error('Blocked storage'));
    await expect(service.clear()).rejects.toThrow('Blocked storage');
    expect(service.counters()).toEqual([first]);
  });
  it('serializes concurrent additions without losing a record', async () => {
    await Promise.all([service.add(first), service.add(second)]);
    expect(service.counters()).toEqual([second, first]);
    expect(setMock).toHaveBeenNthCalledWith(1, { key: 'saved-counters', value: JSON.stringify([first]) });
    expect(setMock).toHaveBeenNthCalledWith(2, { key: 'saved-counters', value: JSON.stringify([second, first]) });
  });
  it('keeps write order when add and clear are requested together', async () => {
    await Promise.all([service.add(first), service.clear()]);
    expect(service.counters()).toEqual([]);
    expect(removeMock).toHaveBeenCalledOnce();
  });
  it('rejects duplicate IDs rather than breaking Angular tracking', async () => {
    await service.add(first);
    await expect(service.add(first)).rejects.toThrow();
    expect(service.counters()).toEqual([first]);
  });

});
