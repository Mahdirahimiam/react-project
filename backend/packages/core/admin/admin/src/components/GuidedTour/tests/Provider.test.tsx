import * as React from 'react';

import { useGuidedTour } from '@strapi/helper-plugin/';
import { fireEvent, render, screen } from '@testing-library/react';

import { GuidedTourProvider } from '../Provider';

describe('GuidedTour', () => {
  afterEach(() => {
    localStorage.removeItem('GUIDED_TOUR_CURRENT_STEP');
    localStorage.removeItem('GUIDED_TOUR_COMPLETED_STEPS');
  });

  it('should not crash', () => {
    const { getByText } = render(
      <GuidedTourProvider>
        <div>Test</div>
      </GuidedTourProvider>
    );

    expect(getByText('Test')).toBeInTheDocument();
  });

  it('should update isGuidedTourVisible to true', () => {
    const Test = () => {
      const { setGuidedTourVisibility, isGuidedTourVisible } = useGuidedTour();

      React.useEffect(() => {
        setGuidedTourVisibility(true);
      }, [setGuidedTourVisibility]);

      return <div>{isGuidedTourVisible && <p>hello guided tour</p>}</div>;
    };

    render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(screen.getByText('hello guided tour')).toBeInTheDocument();
  });

  it('should update isGuidedTourVisible to false', () => {
    const Test = () => {
      const { setGuidedTourVisibility, isGuidedTourVisible } = useGuidedTour();

      React.useEffect(() => {
        setGuidedTourVisibility(false);
      }, [setGuidedTourVisibility]);

      return <div>{isGuidedTourVisible && <p>hello guided tour</p>}</div>;
    };

    const { queryByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(queryByText('hello guided tour')).not.toBeInTheDocument();
  });

  it('should update currentStep with setCurrentStep', () => {
    const Test = () => {
      const { setCurrentStep, currentStep, setSkipped } = useGuidedTour();

      React.useEffect(() => {
        setSkipped(false);
      }, [setSkipped]);

      return (
        <div>
          <button type="button" onClick={() => setCurrentStep('contentTypeBuilder.create')}>
            Update current step
          </button>
          {currentStep === 'contentTypeBuilder.create' && <p>Current step updated</p>}
        </div>
      );
    };

    const { queryByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(queryByText('Current step updated')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Update current step'));

    expect(screen.getByText('Current step updated')).toBeInTheDocument();
  });

  it('should update guidedTourState with setStepState', () => {
    const Test = () => {
      const { setStepState, guidedTourState } = useGuidedTour();

      return (
        <div>
          <button type="button" onClick={() => setStepState('contentTypeBuilder.create', true)}>
            Update guided tour state
          </button>
          {guidedTourState && guidedTourState.contentTypeBuilder.create && (
            <p>Guided tour updated</p>
          )}
        </div>
      );
    };

    const { queryByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(queryByText('Guided tour updated')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Update guided tour state'));

    expect(screen.getByText('Guided tour updated')).toBeInTheDocument();
  });

  it('should not update currentStep with startSection when section does not exist', () => {
    const Test = () => {
      const { startSection, currentStep } = useGuidedTour();

      React.useEffect(() => {
        // @ts-expect-error – testing it doesn't do something we don't want it too.
        startSection('failTest');
      }, [startSection]);

      return <div>{currentStep && <p>Hello world</p>}</div>;
    };

    const { queryByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(queryByText('Hello world')).not.toBeInTheDocument();
  });

  it('should not update currentStep with startSection when first step of section is already done', () => {
    const Test = () => {
      const { startSection, currentStep, setStepState } = useGuidedTour();

      React.useEffect(() => {
        setStepState('contentTypeBuilder.create', true);
      }, [setStepState]);

      return (
        <div>
          {currentStep && <p>Hello world</p>}
          <button type="button" onClick={() => startSection('contentTypeBuilder')}>
            Start section
          </button>
        </div>
      );
    };

    const { queryByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(queryByText('Hello world')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Start section'));

    expect(queryByText('Hello world')).not.toBeInTheDocument();
  });

  it('should not update currentStep with startSection when previous sections are not done', () => {
    const Test = () => {
      const { startSection, currentStep } = useGuidedTour();

      React.useEffect(() => {
        startSection('contentManager');
      }, [startSection]);

      return <div>{currentStep && <p>Hello world</p>}</div>;
    };

    const { queryByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    expect(queryByText('Hello world')).not.toBeInTheDocument();
  });

  it('should update currentStep with startSection when first step of section is not done', async () => {
    const Test = () => {
      const { startSection, currentStep } = useGuidedTour();

      React.useEffect(() => {
        startSection('contentTypeBuilder');
      }, [startSection]);

      return <div>{currentStep && <p>Hello world</p>}</div>;
    };

    const { findByText } = render(
      <GuidedTourProvider>
        <Test />
      </GuidedTourProvider>
    );

    await findByText('Hello world');
  });
});
