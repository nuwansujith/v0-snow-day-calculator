import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page'; // Adjust the import path as needed

// Mock the SnowfallAnimation component as it might use browser APIs not available in JSDOM
jest.mock('@/components/snowfall-animation', () => ({
  SnowfallAnimation: () => <div data-testid="snowfall-animation-mock" />,
}));

// Mock the SnowDayCalculator component
jest.mock('@/components/snow-day-calculator', () => ({
    SnowDayCalculator: () => <div data-testid="snow-day-calculator-mock" />,
}));

// Mock the GPACalculator component
jest.mock('@/components/gpa-calculator', () => {
    return function DummyGPACalculator() {
        return <div data-testid="gpa-calculator-mock" />;
    }
});


describe('Home Page', () => {
  it('renders the main heading for Snow Day Calculator', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: /Snow Day Calculator/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the main heading for GPA Calculator', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: /GPA Calculator/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the SnowDayCalculator component', () => {
    render(<Home />);
    expect(screen.getByTestId('snow-day-calculator-mock')).toBeInTheDocument();
  });

  it('renders the GPACalculator component', () => {
    render(<Home />);
    expect(screen.getByTestId('gpa-calculator-mock')).toBeInTheDocument();
  });

  it('renders the SnowfallAnimation mock', () => {
    render(<Home />);
    expect(screen.getByTestId('snowfall-animation-mock')).toBeInTheDocument();
   });
});
