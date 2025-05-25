import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GPACalculator from '@/components/gpa-calculator';

// Mock the global alert function
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('GPACalculator', () => {
  beforeEach(() => {
    mockAlert.mockClear();
  });

  const addCourse = async (name: string, credits: string, grade: string) => {
    const user = userEvent.setup();
    const courseNameInput = screen.getByLabelText(/Course Name/i);
    const creditsInput = screen.getByLabelText(/Credits/i);
    const gradeSelectTrigger = screen.getByRole('combobox', { name: /Grade/i });

    if (name) await user.type(courseNameInput, name);
    else await user.clear(courseNameInput);
    
    if (credits) await user.type(creditsInput, credits);
    else await user.clear(creditsInput);

    await user.click(gradeSelectTrigger);
    // Wait for the select content to appear using the data-testid
    const selectContent = await screen.findByTestId('grade-select-content');
    const gradeOption = within(selectContent).getByRole('option', { name: grade });
    await user.click(gradeOption);

    const addButton = screen.getByRole('button', { name: /Add Course/i });
    await user.click(addButton);
  };

  const getDisplayedGPA = () => {
    const gpaDisplay = screen.getByText(/Cumulative GPA:/i);
    return gpaDisplay.textContent?.split(':')[1]?.trim() || '';
  };

  test('initial state shows GPA 0.00', () => {
    render(<GPACalculator />);
    expect(getDisplayedGPA()).toBe('0.00');
    expect(screen.queryByText(/Course List/i)).not.toBeInTheDocument();
  });

  test('adding a single course (Math, 3 credits, A) correctly calculates GPA to 4.00', async () => {
    render(<GPACalculator />);
    await addCourse('Math', '3', 'A');
    expect(getDisplayedGPA()).toBe('4.00');
    expect(screen.getByText('Math')).toBeInTheDocument();
  });

  test('adding multiple courses (A and B) correctly calculates GPA to 3.50', async () => {
    render(<GPACalculator />);
    await addCourse('Math', '3', 'A'); 
    await addCourse('History', '3', 'B'); 
    expect(getDisplayedGPA()).toBe('3.50');
  });

  test('adding courses with various grade points (A-, B+, C) calculates GPA to 3.19', async () => {
    render(<GPACalculator />);
    await addCourse('Physics', '4', 'A-'); 
    await addCourse('English', '3', 'B+'); 
    await addCourse('Art', '2', 'C');      
    expect(getDisplayedGPA()).toBe('3.19');
  });

  test('removing a course updates GPA correctly', async () => {
    const user = userEvent.setup();
    render(<GPACalculator />);
    await addCourse('Math', '3', 'A'); 
    await addCourse('History', '3', 'B'); 

    const courseItemDiv = screen.getByText('History').closest('div.flex.items-center.justify-between');
    expect(courseItemDiv).toBeInTheDocument();

    const removeButton = within(courseItemDiv!).getByRole('button'); 
    await user.click(removeButton);
    
    expect(screen.queryByText('History')).not.toBeInTheDocument();
    expect(getDisplayedGPA()).toBe('4.00'); 
  });

  test('attempting to add a course with 0 credits shows alert and does not change GPA', async () => {
    render(<GPACalculator />);
    await addCourse('Science', '3', 'B'); 
    expect(getDisplayedGPA()).toBe('3.00');
    
    await addCourse('Invalid Course', '0', 'A');
    expect(mockAlert).toHaveBeenCalledWith('Please enter a valid course name and positive, non-zero credits.');
    expect(getDisplayedGPA()).toBe('3.00'); 
    expect(screen.queryByText('Invalid Course')).not.toBeInTheDocument();
  });

  test('attempting to add a course with negative credits shows alert and does not change GPA', async () => {
    render(<GPACalculator />);
    await addCourse('Art', '2', 'C'); 
    expect(getDisplayedGPA()).toBe('2.00');

    await addCourse('Bad Credit Course', '-2', 'A');
    expect(mockAlert).toHaveBeenCalledWith('Please enter a valid course name and positive, non-zero credits.');
    expect(getDisplayedGPA()).toBe('2.00');
    expect(screen.queryByText('Bad Credit Course')).not.toBeInTheDocument();
  });
  
  test('attempting to add a course with empty name shows alert and does not change GPA', async () => {
    const user = userEvent.setup(); // Ensure user is set up for this test too
    render(<GPACalculator />);
    await addCourse('Valid Course', '3', 'A');
    expect(getDisplayedGPA()).toBe('4.00');
    
    // Intentionally do not type into courseNameInput, or clear it
    const courseNameInput = screen.getByLabelText(/Course Name/i);
    await user.clear(courseNameInput);
    // Credits and Grade are still needed for the addCourse helper to proceed
    const creditsInput = screen.getByLabelText(/Credits/i);
    await user.clear(creditsInput);
    await user.type(creditsInput, '3'); // Provide valid credits for this attempt

    await addCourse('', '3', 'B'); // Call addCourse with empty name
    expect(mockAlert).toHaveBeenCalledWith('Please enter a valid course name and positive, non-zero credits.');
    expect(getDisplayedGPA()).toBe('4.00'); 
  });

  test('GPA is 0.00 if all courses have F grade', async () => {
    render(<GPACalculator />);
    await addCourse('Chemistry', '3', 'F'); 
    await addCourse('Biology', '4', 'F');   
    expect(getDisplayedGPA()).toBe('0.00');
  });
  
  test('GPA calculation with numeric grade strings (e.g., "3.7" instead of "A-")', async () => {
    render(<GPACalculator />);
    await addCourse('Philosophy', '3', '3.7'); 
    await addCourse('Economics', '3', '2.3'); 
    expect(getDisplayedGPA()).toBe('3.00');
  });

  test('GPA is displayed with two decimal places consistently (e.g. 3.00)', async () => {
    render(<GPACalculator />);
    await addCourse('Stats', '3', 'B'); 
    expect(getDisplayedGPA()).toBe('3.00');
  });
});
