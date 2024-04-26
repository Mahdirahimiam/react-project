import React from 'react';

import { fireEvent } from '@testing-library/react';
import { render as renderRTL, waitFor } from '@tests/utils';
import { Route } from 'react-router-dom';

import { ListSettingsView } from '../index';

const layout = {
  attributes: {
    address: {
      type: 'relation',
      relation: 'manyToOne',
    },
    averagePrice: {
      type: 'float',
    },
    cover: {
      type: 'media',
    },
    id: {
      type: 'integer',
    },
    since: {
      type: 'date',
    },
  },
  info: {
    displayName: 'michka',
  },
  metadatas: {
    address: {
      list: {
        label: '',
        sortable: false,
      },
    },
    averagePrice: {
      list: {
        label: 'AveragePrice',
        sortable: true,
      },
    },
    cover: {
      list: {
        label: 'Cover',
        sortable: false,
      },
    },
    id: {
      list: {
        label: 'id',
        sortable: true,
      },
    },
    since: {
      list: {
        label: 'since',
        sortable: false,
      },
    },
  },
  layouts: {
    list: ['id', 'address'],
  },
  options: {},
  settings: {
    bulkable: false,
    defaultSortBy: 'id',
    defaultSortOrder: 'ASC',
    filterable: true,
    pageSize: 10,
    searchable: true,
  },
  uid: 'api::restaurant.restaurant',
};

let testLocation;

const render = ({ initialEntries } = {}) => ({
  ...renderRTL(
    <ListSettingsView layout={layout} slug="api::restaurant.restaurant" updateLayout={jest.fn()} />,
    {
      initialEntries,
      renderOptions: {
        wrapper({ children }) {
          return (
            <>
              {children}
              <Route
                path="*"
                render={({ location }) => {
                  testLocation = location;

                  return null;
                }}
              />
            </>
          );
        },
      },
    }
  ),
});

describe('CM | LV | Configure the view', () => {
  it('renders and matches the snapshot', async () => {
    const { getByRole } = render();

    await waitFor(() =>
      expect(getByRole('heading', { name: 'Configure the view - Michka' })).toBeInTheDocument()
    );

    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();

    expect(getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Enable search' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Enable filters' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Enable bulk actions' })).toBeInTheDocument();
    expect(getByRole('combobox', { name: 'Entries per page' })).toBeInTheDocument();
    expect(getByRole('combobox', { name: 'Default sort attribute' })).toBeInTheDocument();
    expect(getByRole('combobox', { name: 'Default sort order' })).toBeInTheDocument();

    expect(getByRole('heading', { name: 'View' })).toBeInTheDocument();

    /**
     * For each attribute it should have the following
     */
    layout.layouts.list.forEach((attribute) => {
      expect(getByRole('button', { name: `Edit ${attribute}` })).toBeInTheDocument();
      expect(getByRole('button', { name: `Delete ${attribute}` })).toBeInTheDocument();
    });

    expect(getByRole('button', { name: 'Add a field' })).toBeInTheDocument();
  });

  it('should keep plugins query params when arriving on the page and going back', async () => {
    const { getByRole, user } = render({
      initialEntries: [
        '/content-manager/collection-types/api::category.category/configurations/list?plugins[i18n][locale]=fr',
      ],
    });

    await waitFor(() =>
      expect(getByRole('heading', { name: 'Configure the view - Michka' })).toBeInTheDocument()
    );

    expect(testLocation.search).toEqual('?plugins[i18n][locale]=fr');

    await user.click(getByRole('link', { name: 'Back' }));

    expect(testLocation.search).toEqual('?page=1&pageSize=10&sort=id:ASC&plugins[i18n][locale]=fr');
  });

  it('should add field', async () => {
    const { getByRole, user } = render();

    await waitFor(() =>
      expect(getByRole('heading', { name: 'Configure the view - Michka' })).toBeInTheDocument()
    );

    await user.click(getByRole('button', { name: 'Add a field' }));
    await user.click(getByRole('menuitem', { name: 'Cover' }));

    expect(getByRole('button', { name: `Edit Cover` })).toBeInTheDocument();
    expect(getByRole('button', { name: `Delete Cover` })).toBeInTheDocument();
  });

  describe('Edit modal', () => {
    it('should open edit modal & close upon editing and pressing finish', async () => {
      const { getByRole, queryByRole, user } = render();

      await waitFor(() =>
        expect(getByRole('heading', { name: 'Configure the view - Michka' })).toBeInTheDocument()
      );

      await user.click(getByRole('button', { name: 'Edit id' }));

      expect(getByRole('dialog', { name: 'Edit Id' })).toBeInTheDocument();
      expect(getByRole('heading', { name: 'Edit Id' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Label' })).toBeInTheDocument();
      expect(getByRole('checkbox', { name: 'Enable sort on this field' })).toBeInTheDocument();

      await user.type(getByRole('textbox', { name: 'Label' }), 'testname');

      expect(getByRole('button', { name: 'Finish' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

      fireEvent.click(getByRole('button', { name: 'Finish' }));

      expect(queryByRole('dialog', { name: 'Edit Id' })).not.toBeInTheDocument();
    });

    it('should close edit modal when pressing cancel', async () => {
      const { getByRole, queryByRole, user } = render();

      await waitFor(() =>
        expect(getByRole('heading', { name: 'Configure the view - Michka' })).toBeInTheDocument()
      );

      await user.click(getByRole('button', { name: 'Edit id' }));

      expect(getByRole('dialog', { name: 'Edit Id' })).toBeInTheDocument();

      await user.click(getByRole('button', { name: 'Cancel' }));

      expect(queryByRole('dialog', { name: 'Edit Id' })).not.toBeInTheDocument();
    });

    it('should not show sortable toggle input if field not sortable', async () => {
      const { getByRole, queryByRole, user } = render();

      await waitFor(() =>
        expect(getByRole('heading', { name: 'Configure the view - Michka' })).toBeInTheDocument()
      );

      await user.click(getByRole('button', { name: 'Edit address' }));

      expect(
        queryByRole('checkbox', { name: 'Enable sort on this field' })
      ).not.toBeInTheDocument();
    });
  });
});
