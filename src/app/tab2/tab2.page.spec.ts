import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { FeedbackService } from '../services/feedback.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let page: Tab2Page;
  const counters = signal<SavedCounter[]>([]);
  const initialize = vi.fn();
  const remove = vi.fn();
  const clear = vi.fn();
  const show = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    counters.set([]);
    initialize.mockResolvedValue(undefined);
    remove.mockResolvedValue(undefined);
    clear.mockResolvedValue(undefined);
    show.mockResolvedValue(undefined);
    TestBed.configureTestingModule({ providers: [
      { provide: CounterService, useValue: { counters, initialized: signal(true), initialize, remove, clear } },
      { provide: FeedbackService, useValue: { show } },
    ] });
    page = TestBed.runInInjectionContext(() => new Tab2Page());
  });
  it('loads the shared service when the history page opens', async () => {
    await page.ngOnInit();
    expect(initialize).toHaveBeenCalledOnce();
  });
  it('updates the full total when saved data changes, independently of search', () => {
    counters.set([
      { id: 'a', name: 'Auta', value: 4, createdAt: '2026-10-12T08:00:00Z' },
      { id: 'b', name: 'Knihy', value: 6, createdAt: '2026-10-12T09:00:00Z' },
    ]);
    page.search.set('Auta');
    expect(page.visibleCounters()).toHaveLength(1);
    expect(page.total()).toBe(10);
    expect(page.statistics().average).toBe(5);
    counters.set([]);
    expect(page.total()).toBe(0);
    expect(page.statistics().average).toBeNull();
  });
  it('opens a real alert without immediately clearing the data', () => {
    page.requestClear();
    expect(page.alertOpen()).toBe(true);
    expect(clear).not.toHaveBeenCalled();
  });
  it('does not clear history on cancel or backdrop dismissal', async () => {
    await page.confirmClear('cancel');
    await page.confirmClear('backdrop');
    expect(clear).not.toHaveBeenCalled();
    expect(page.alertOpen()).toBe(false);
  });
  it('clears and notifies only after confirmation', async () => {
    await page.confirmClear('confirm');
    expect(clear).toHaveBeenCalledOnce();
    expect(show).toHaveBeenCalledWith('Celá historie byla vymazána.');
  });
  it('shows a success toast after removing a record', async () => {
    await page.remove('abc');
    expect(remove).toHaveBeenCalledWith('abc');
    expect(show).toHaveBeenCalledWith('Záznam byl odstraněn.');
  });
});
