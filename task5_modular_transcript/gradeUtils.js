export function calculateGrade(marks) {
  if (marks >= 85) return { grade: 'A', gpa: 4.0 };
  if (marks >= 80) return { grade: 'A-', gpa: 3.7 };
  if (marks >= 75) return { grade: 'B+', gpa: 3.3 };
  if (marks >= 70) return { grade: 'B', gpa: 3.0 };
  if (marks >= 65) return { grade: 'B-', gpa: 2.7 };
  if (marks >= 60) return { grade: 'C+', gpa: 2.3 };
  if (marks >= 50) return { grade: 'C', gpa: 2.0 };
  return { grade: 'F', gpa: 0.0 };
}

export function calculateAverage(courses) {
  if (!courses || courses.length === 0) return 0;
  const sum = courses.reduce((acc, course) => acc + course.marks, 0);
  return sum / courses.length;
}

export function calculateGPA(courses) {
  if (!courses || courses.length === 0) return 0;
  const totalGpa = courses.reduce((acc, course) => acc + calculateGrade(course.marks).gpa, 0);
  return totalGpa / courses.length;
}