import React from 'react';

import { lightTheme, ThemeProvider } from '@strapi/design-system';
import { render as renderTL } from '@testing-library/react';

import en from '../../../translations/en.json';
import { ImageAssetCard } from '../ImageAssetCard';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  getTrad: (x) => x,
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: jest.fn(({ id }) => en[id]) }),
}));

describe('ImageAssetCard', () => {
  it('snapshots the component', () => {
    const { container } = renderTL(
      <ThemeProvider theme={lightTheme}>
        <ImageAssetCard
          alt=""
          name="hello.png"
          extension="png"
          height={40}
          width={40}
          thumbnail="http://somewhere.com/hello.png"
          selected={false}
          onSelect={jest.fn()}
          onEdit={jest.fn()}
          isUrlSigned={false}
        />
      </ThemeProvider>
    );

    expect(container).toMatchInlineSnapshot(`
      .c17 {
        border: 0;
        -webkit-clip: rect(0 0 0 0);
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      .c24 {
        font-size: 0.75rem;
        line-height: 1.33;
        font-weight: 600;
        color: #32324d;
      }

      .c25 {
        font-size: 0.75rem;
        line-height: 1.33;
        color: #666687;
      }

      .c33 {
        font-weight: 600;
        font-size: 0.6875rem;
        line-height: 1.45;
        text-transform: uppercase;
        color: #666687;
      }

      .c0 {
        background: #ffffff;
        border-radius: 4px;
        border-style: solid;
        border-width: 1px;
        border-color: #eaeaef;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
        height: 100%;
      }

      .c2 {
        position: relative;
      }

      .c5 {
        position: start;
      }

      .c10 {
        position: end;
      }

      .c14 {
        background: #ffffff;
        padding: 8px;
        border-radius: 4px;
        border-color: #dcdce4;
        border: 1px solid #dcdce4;
        cursor: pointer;
      }

      .c20 {
        padding-top: 8px;
        padding-right: 12px;
        padding-bottom: 8px;
        padding-left: 12px;
      }

      .c23 {
        padding-top: 4px;
      }

      .c27 {
        padding-top: 4px;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
      }

      .c29 {
        background: #eaeaef;
        padding-right: 8px;
        padding-left: 8px;
        min-width: 20px;
      }

      .c3 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .c6 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
      }

      .c21 {
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
      }

      .c30 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .c31 {
        border-radius: 4px;
        height: 1.5rem;
      }

      .c15 {
        position: relative;
        outline: none;
      }

      .c15 > svg {
        height: 12px;
        width: 12px;
      }

      .c15 > svg > g,
      .c15 > svg path {
        fill: #ffffff;
      }

      .c15[aria-disabled='true'] {
        pointer-events: none;
      }

      .c15:after {
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -4px;
        bottom: -4px;
        left: -4px;
        right: -4px;
        border: 2px solid transparent;
      }

      .c15:focus-visible {
        outline: none;
      }

      .c15:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c9 {
        height: 18px;
        min-width: 18px;
        margin: 0;
        border-radius: 4px;
        border: 1px solid #c0c0cf;
        -webkit-appearance: none;
        background-color: #ffffff;
        cursor: pointer;
      }

      .c9:checked {
        background-color: #4945ff;
        border: 1px solid #4945ff;
      }

      .c9:checked:after {
        content: '';
        display: block;
        position: relative;
        background: url("data:image/svg+xml,%3csvg%20width='10'%20height='8'%20viewBox='0%200%2010%208'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M8.55323%200.396973C8.63135%200.316355%208.76051%200.315811%208.83931%200.395768L9.86256%201.43407C9.93893%201.51157%209.93935%201.6359%209.86349%201.7139L4.06401%207.67724C3.9859%207.75755%203.85707%207.75805%203.77834%207.67834L0.13866%203.99333C0.0617798%203.91549%200.0617102%203.79032%200.138504%203.7124L1.16213%202.67372C1.24038%202.59432%201.36843%202.59422%201.4468%202.67348L3.92174%205.17647L8.55323%200.396973Z'%20fill='white'%20/%3e%3c/svg%3e") no-repeat no-repeat center center;
        width: 10px;
        height: 10px;
        left: 50%;
        top: 50%;
        -webkit-transform: translateX(-50%) translateY(-50%);
        -ms-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
      }

      .c9:checked:disabled:after {
        background: url("data:image/svg+xml,%3csvg%20width='10'%20height='8'%20viewBox='0%200%2010%208'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M8.55323%200.396973C8.63135%200.316355%208.76051%200.315811%208.83931%200.395768L9.86256%201.43407C9.93893%201.51157%209.93935%201.6359%209.86349%201.7139L4.06401%207.67724C3.9859%207.75755%203.85707%207.75805%203.77834%207.67834L0.13866%203.99333C0.0617798%203.91549%200.0617102%203.79032%200.138504%203.7124L1.16213%202.67372C1.24038%202.59432%201.36843%202.59422%201.4468%202.67348L3.92174%205.17647L8.55323%200.396973Z'%20fill='%238E8EA9'%20/%3e%3c/svg%3e") no-repeat no-repeat center center;
      }

      .c9:disabled {
        background-color: #dcdce4;
        border: 1px solid #c0c0cf;
      }

      .c9:indeterminate {
        background-color: #4945ff;
        border: 1px solid #4945ff;
      }

      .c9:indeterminate:after {
        content: '';
        display: block;
        position: relative;
        color: white;
        height: 2px;
        width: 10px;
        background-color: #ffffff;
        left: 50%;
        top: 50%;
        -webkit-transform: translateX(-50%) translateY(-50%);
        -ms-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
      }

      .c9:indeterminate:disabled {
        background-color: #dcdce4;
        border: 1px solid #c0c0cf;
      }

      .c9:indeterminate:disabled:after {
        background-color: #8e8ea9;
      }

      .c7 > * {
        margin-left: 0;
        margin-right: 0;
      }

      .c7 > * + * {
        margin-left: 8px;
      }

      .c8 {
        position: absolute;
        top: 12px;
        left: 12px;
      }

      .c12 {
        position: absolute;
        top: 12px;
        right: 12px;
      }

      .c19 {
        margin: 0;
        padding: 0;
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
      }

      .c18 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        height: 10.25rem;
        width: 100%;
        background: repeating-conic-gradient(#f6f6f9 0% 25%,transparent 0% 50%) 50% / 20px 20px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      .c28 {
        margin-left: auto;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }

      .c32 {
        margin-left: 4px;
      }

      .c22 {
        word-break: break-all;
      }

      .c4 {
        border-bottom: 1px solid #eaeaef;
      }

      .c16 {
        border-color: #dcdce4;
        height: 2rem;
        width: 2rem;
      }

      .c16 svg g,
      .c16 svg path {
        fill: #8e8ea9;
      }

      .c16:hover svg g,
      .c16:focus svg g,
      .c16:hover svg path,
      .c16:focus svg path {
        fill: #666687;
      }

      .c16[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c26 {
        text-transform: uppercase;
      }

      .c13 {
        opacity: 0;
      }

      .c13:focus-within {
        opacity: 1;
      }

      .c1 {
        cursor: pointer;
      }

      .c1:hover .c11 {
        opacity: 1;
      }

      <div>
        <article
          aria-labelledby=":r0:-title"
          class="c0 c1"
          role="button"
          tabindex="-1"
        >
          <div
            class="c2 c3 c4"
          >
            <div>
              <div
                class="c5 c6 c7 c8"
              >
                <div
                  class=""
                >
                  <input
                    aria-labelledby=":r0:-title"
                    class="c9"
                    type="checkbox"
                  />
                </div>
              </div>
            </div>
            <div
              class="c10 c6 c7 c11 c12 c13"
            >
              <span>
                <button
                  aria-disabled="false"
                  aria-labelledby=":r1:"
                  class="c14 c3 c15 c16"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="c17"
                  >
                    Edit
                  </span>
                  <svg
                    aria-hidden="true"
                    fill="none"
                    focusable="false"
                    height="1rem"
                    viewBox="0 0 24 24"
                    width="1rem"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clip-rule="evenodd"
                      d="M23.604 3.514c.528.528.528 1.36 0 1.887l-2.622 2.607-4.99-4.99L18.6.396a1.322 1.322 0 0 1 1.887 0l3.118 3.118ZM0 24v-4.99l14.2-14.2 4.99 4.99L4.99 24H0Z"
                      fill="#212134"
                      fill-rule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              class="c18"
            >
              <img
                alt=""
                aria-hidden="true"
                class="c19"
                src="http://somewhere.com/hello.png"
              />
            </div>
          </div>
          <div
            class="c20"
          >
            <div
              class="c21"
            >
              <div
                class="c22"
              >
                <div
                  class="c23"
                >
                  <h2
                    class="c24"
                    id=":r0:-title"
                  >
                    hello.png
                  </h2>
                </div>
                <div
                  class="c25"
                >
                  <span
                    class="c26"
                  >
                    png
                  </span>
                   - 40✕40
                </div>
              </div>
              <div
                class="c27 c6"
              >
                <div
                  class="c28"
                >
                  <div
                    class="c29 c30 c31 c32"
                  >
                    <span
                      class="c33"
                    >
                      Image
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <div
          class="c17"
        >
          <p
            aria-live="polite"
            aria-relevant="all"
            id="live-region-log"
            role="log"
          />
          <p
            aria-live="polite"
            aria-relevant="all"
            id="live-region-status"
            role="status"
          />
          <p
            aria-live="assertive"
            aria-relevant="all"
            id="live-region-alert"
            role="alert"
          />
        </div>
      </div>
    `);
  });
});
