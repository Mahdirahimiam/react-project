import React from 'react';

import { lightTheme, ThemeProvider } from '@strapi/design-system';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { TableList } from '..';

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useQueryParams: jest.fn(() => [{ query: {} }]),
}));

const PROPS_FIXTURE = {
  canUpdate: true,
  indeterminate: false,
  rows: [
    {
      alternativeText: 'alternative text',
      createdAt: '2021-10-18T08:04:56.326Z',
      ext: '.jpeg',
      formats: {
        thumbnail: {
          url: '/uploads/thumbnail_3874873_b5818bb250.jpg',
        },
      },
      id: 1,
      mime: 'image/jpeg',
      name: 'michka',
      size: 11.79,
      updatedAt: '2021-10-18T08:04:56.326Z',
      url: '/uploads/michka.jpg',
      type: 'asset',
    },
  ],
  onEditAsset: jest.fn(),
  onEditFolder: jest.fn(),
  onSelectOne: jest.fn(),
  onSelectAll: jest.fn(),
  selected: [],
};

const ComponentFixture = (props) => {
  const customProps = {
    ...PROPS_FIXTURE,
    ...props,
  };

  return (
    <MemoryRouter>
      <IntlProvider locale="en" messages={{}}>
        <ThemeProvider theme={lightTheme}>
          <TableList {...customProps} />
        </ThemeProvider>
      </IntlProvider>
    </MemoryRouter>
  );
};

const setup = (props) => render(<ComponentFixture {...props} />);

describe('TableList', () => {
  it('should render table headers labels', () => {
    const { getByText, getByRole } = setup();

    expect(getByRole('gridcell', { name: 'preview' })).toBeInTheDocument();
    expect(getByText('name')).toBeInTheDocument();
    expect(getByRole('gridcell', { name: 'extension' })).toBeInTheDocument();
    expect(getByRole('gridcell', { name: 'size' })).toBeInTheDocument();
    expect(getByText('created')).toBeInTheDocument();
    expect(getByText('last update')).toBeInTheDocument();
  });

  it('should render a visually hidden edit table headers label', () => {
    const { getByRole } = setup();

    expect(getByRole('gridcell', { name: 'actions' })).toBeInTheDocument();
  });

  it('should call onChangeSort callback when changing sort order', () => {
    const onChangeSortSpy = jest.fn();
    const { getByRole } = setup({ sortQuery: 'updatedAt:ASC', onChangeSort: onChangeSortSpy });

    const sortButton = getByRole('button', { name: 'Sort on last update' });
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);

    expect(onChangeSortSpy).toHaveBeenCalledWith('updatedAt:DESC');
  });

  it('should call onChangeSort callback when changing sort by', () => {
    const onChangeSortSpy = jest.fn();
    const { getByRole } = setup({ sortQuery: 'updatedAt:ASC', onChangeSort: onChangeSortSpy });

    const sortButton = getByRole('button', { name: 'Sort on name' });
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);

    expect(onChangeSortSpy).toHaveBeenCalledWith('name:ASC');
  });

  it('should call onSelectAll callback when bulk selecting', () => {
    const onSelectAllSpy = jest.fn();
    const { getByRole } = setup({ onSelectAll: onSelectAllSpy });

    fireEvent.click(getByRole('checkbox', { name: 'Select all folders & assets' }));

    expect(onSelectAllSpy).toHaveBeenCalledTimes(1);
  });

  it('should display indeterminate state of bulk select checkbox', () => {
    const { getByRole } = setup({ indeterminate: true });

    expect(getByRole('checkbox', { name: 'Select all folders & assets' })).toBePartiallyChecked();
  });

  it('should not display indeterminate state of bulk select checkbox if checkbox is disabled', () => {
    const { getByRole } = setup({ indeterminate: true, shouldDisableBulkSelect: true });

    expect(
      getByRole('checkbox', { name: 'Select all folders & assets' })
    ).not.toBePartiallyChecked();
  });

  it('should disable bulk select when users do not have update permissions', () => {
    const { getByRole } = setup({ shouldDisableBulkSelect: true });

    expect(getByRole('checkbox', { name: 'Select all folders & assets' })).toBeDisabled();
  });

  it('should render assets', () => {
    const { getByText } = setup();

    expect(getByText('michka')).toBeInTheDocument();
    expect(getByText('JPEG')).toBeInTheDocument();
  });

  it('should render folders', () => {
    const { getByText } = setup({
      rows: [
        {
          createdAt: '2022-11-17T10:40:06.022Z',
          id: 2,
          name: 'folder 1',
          type: 'folder',
          updatedAt: '2022-11-17T10:40:06.022Z',
        },
      ],
    });

    expect(getByText('folder 1')).toBeInTheDocument();
  });
});
