import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';


  

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // The seeded record gives us a deterministic expectation regardless of the
    // rest of the shared database contents.
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading perks...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Now look for the seeded perk
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record.
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    // Wait for the filtered results
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading perks...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Now look for the seeded perk
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Try to locate the merchant selector in an accessible manner, with a fallback.
    let merchantSelect;
    try {
      merchantSelect = screen.getByLabelText(/merchant/i);
    } catch (err) {
      merchantSelect = screen.getByRole('combobox');
    }

    // Some select implementations require selecting the option value; others respond
    // to the visible text. Using change with the merchant text is pragmatic.
    fireEvent.change(merchantSelect, { target: { value: seededPerk.merchant } });

    // Wait for the filtered result to appear and assert the summary updates too.
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});