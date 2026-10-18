const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function getGradeInfo(marks) {
  if (marks >= 85) return { grade: 'A', gradePoints: 4.0 };
  if (marks >= 80) return { grade: 'A-', gradePoints: 3.7 };
  if (marks >= 75) return { grade: 'B+', gradePoints: 3.3 };
  if (marks >= 70) return { grade: 'B', gradePoints: 3.0 };
  if (marks >= 65) return { grade: 'B-', gradePoints: 2.7 };
  if (marks >= 60) return { grade: 'C+', gradePoints: 2.3 };
  if (marks >= 50) return { grade: 'C', gradePoints: 2.0 };
  return { grade: 'F', gradePoints: 0.0 };
}

const processedResults = results.map(student => {
  const gradeInfo = getGradeInfo(student.marks);
  return {
    ...student,
    grade: gradeInfo.grade,
    gradePoints: gradeInfo.gradePoints,
    status: student.marks >= 50 ? 'Passed' : 'Failed'
  };
});

const rankedMeritList = [...processedResults].sort((a, b) => {
  if (b.marks !== a.marks) {
    return b.marks - a.marks;
  }
  return a.name.localeCompare(b.name);
});

const departmentStats = processedResults.reduce((acc, student) => {
  if (!acc[student.department]) {
    acc[student.department] = { students: 0, totalMarks: 0, highest: -Infinity, passed: 0 };
  }
  const dept = acc[student.department];
  dept.students += 1;
  dept.totalMarks += student.marks;
  if (student.marks > dept.highest) dept.highest = student.marks;
  if (student.marks >= 50) dept.passed += 1;
  return acc;
}, {});

Object.keys(departmentStats).forEach(dept => {
  departmentStats[dept].average = Number((departmentStats[dept].totalMarks / departmentStats[dept].students).toFixed(2));
  delete departmentStats[dept].totalMarks;
});

const firstAbove85 = processedResults.find(s => s.marks > 85);
const firstFailedIndex = processedResults.findIndex(s => s.marks < 50);
const hasAnyFailed = processedResults.some(s => s.marks < 50);
const allValidMarks = processedResults.every(s => s.marks >= 0 && s.marks <= 100);

const totalMarksAll = processedResults.reduce((sum, s) => sum + s.marks, 0);
const overallAverage = totalMarksAll / processedResults.length;

const studentsAboveAverage = processedResults.filter(s => s.marks > overallAverage);
const topThreeNames = [...processedResults]
  .sort((a, b) => b.marks - a.marks || a.name.localeCompare(b.name))
  .slice(0, 3)
  .map(s => s.name);

console.log('Processed Results:', processedResults);
console.log('Ranked List:', rankedMeritList);
console.log('Department Stats:', departmentStats);
console.log('First Scored > 85:', firstAbove85);
console.log('First Failed Index:', firstFailedIndex);
console.log('At least one failed:', hasAnyFailed);
console.log('All marks valid:', allValidMarks);
console.log('Above Average Students:', studentsAboveAverage);
console.log('Top 3 Names:', topThreeNames);