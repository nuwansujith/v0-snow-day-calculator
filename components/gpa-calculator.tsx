import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: { [key: string]: number } = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
  '4.0': 4.0, '3.7': 3.7, '3.3': 3.3, '3.0': 3.0, '2.7': 2.7,
  '2.3': 2.3, '2.0': 2.0, '1.7': 1.7, '1.3': 1.3, '1.0': 1.0, '0.0': 0.0,
};

const gradeOptions = Object.keys(gradePoints);

const GPACalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [gpa, setGpa] = useState<number>(0);

  const [courseName, setCourseName] = useState<string>('');
  const [courseCredits, setCourseCredits] = useState<string>('');
  const [courseGrade, setCourseGrade] = useState<string>(gradeOptions[0]);

  useEffect(() => {
    const calculateGpa = () => {
      if (courses.length === 0) {
        setGpa(0);
        return;
      }
      let totalPoints = 0;
      let totalCredits = 0;
      courses.forEach(course => {
        const credits = Number(course.credits);
        const point = gradePoints[course.grade];
        if (!isNaN(credits) && point !== undefined && credits > 0) {
          totalPoints += credits * point;
          totalCredits += credits;
        }
      });
      setGpa(totalCredits === 0 ? 0 : totalPoints / totalCredits);
    };
    calculateGpa();
  }, [courses]);

  const handleAddCourse = () => {
    const credits = parseFloat(courseCredits);
    if (!courseName.trim() || isNaN(credits) || credits <= 0) {
      alert("Please enter a valid course name and positive, non-zero credits.");
      return;
    }
    if (!courseGrade) {
      alert("Please select a grade.");
      return;
    }
    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseName,
      credits: credits,
      grade: courseGrade,
    };
    setCourses([...courses, newCourse]);
    setCourseName('');
    setCourseCredits('');
    setCourseGrade(gradeOptions[0]);
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto"> {/* Removed mt-8, should be handled by parent */}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">GPA Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="courseName" className="block text-sm font-medium text-muted-foreground mb-1">Course Name</label>
            <Input
              id="courseName"
              type="text"
              placeholder="e.g., Calculus 101"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="courseCredits" className="block text-sm font-medium text-muted-foreground mb-1">Credits</label>
            <Input
              id="courseCredits"
              type="number"
              placeholder="e.g., 3"
              value={courseCredits}
              onChange={(e) => setCourseCredits(e.target.value)}
              min="0.1" // Still allow 0.1, but validation checks > 0
              step="0.1"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="courseGrade" className="block text-sm font-medium text-muted-foreground mb-1">Grade</label>
            <Select value={courseGrade} onValueChange={setCourseGrade}>
              <SelectTrigger id="courseGrade" className="w-full">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent data-testid="grade-select-content">
                {gradeOptions.map(grade => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mb-6"> {/* Aligns button to the right */}
          <Button onClick={handleAddCourse}>Add Course</Button>
        </div>

        {courses.length > 0 && (
          <div className="mt-6"> {/* Added mt-6 for spacing above list */}
            <h3 className="text-lg font-semibold mb-3">Course List</h3> {/* Increased mb for title */}
            <div className="space-y-3"> {/* Increased space between items */}
              {courses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-muted rounded-md shadow-sm">
                  <div>
                    <p className="font-medium text-foreground">{course.name}</p>
                    <p className="text-sm text-muted-foreground">Credits: {course.credits}, Grade: {course.grade}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCourse(course.id)}> {/* Made button icon only for tighter look */}
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-accent rounded-lg shadow text-center">
          <h3 className="text-xl font-bold text-accent-foreground">Cumulative GPA: {gpa.toFixed(2)}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPACalculator;
