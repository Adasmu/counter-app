import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { FeedbackService } from '../services/feedback.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  const add = vi.fn();
  const show = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    add.mockResolvedValue(undefined);
    show.mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: CounterService, useValue: { add } },
        { provide: FeedbackService, useValue: { show } },
      ],
    });
  });
  it('forwards a completed counter to the shared service', async () => {
    const page = TestBed.runInInjectionContext(() => new Tab1Page());
    const counter: SavedCounter = {
      id: 'one',
      name: 'Test',
      value: 3,
      createdAt: '2026-10-12T08:00:00.000Z',
    };
    await page.onSaved(counter);
    expect(add).toHaveBeenCalledWith(counter);
    expect(show).toHaveBeenCalledWith('Počítadlo bylo uloženo.');
  });
  it('does not report a successful save when persistence fails', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      add.mockRejectedValueOnce(new Error('Blocked storage'));
      const page = TestBed.runInInjectionContext(() => new Tab1Page());
      await page.onSaved({ id: 'x', name: 'Test', value: 1, createdAt: '2026-10-12T08:00:00Z' });
      expect(show).not.toHaveBeenCalledWith('Počítadlo bylo uloženo.');
      expect(show).toHaveBeenCalledWith('Počítadlo se nepodařilo uložit.', 'danger');
      expect(page.saving()).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });
});
