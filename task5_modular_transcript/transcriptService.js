import { calculateAverage as calcAvg, calculateGPA, calculateGrade } from './gradeUtils.js';

export function processTranscriptJSON(jsonString) {
  let parsedData;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (err) {
    throw new TypeError('Malformed JSON data received');
  }

  if (!Array.isArray(parsedData)) {
    throw new TypeError('Parsed JSON content must be an array');
  }

  const seenIds = new Set();

  const report = parsedData.map(studentData => {
    if (!studentData.id) {
      throw new Error('Student missing mandatory ID field');
    }

    if (seenIds.has(studentData.id)) {
      throw new Error(`Duplicate student ID detected: ${studentData.id}`);
    }
    seenIds.add(studentData.id);

    if (!Array.isArray(studentData.courses)) {
      throw new TypeError(`Courses must be an array for student ID: ${studentData.id}`);
    }

    const processedCourses = studentData.courses.map(course => {
      if (!course.code) {
        throw new Error(`Missing course code in record for student ID: ${studentData.id}`);
      }

      if (typeof course.marks !== 'number' || course.marks < 0 || course.marks > 100) {
        throw new RangeError(`Invalid marks for course ${course.code} on student ID: ${studentData.id}`);
      }

      return {
        code: course.code,
        marks: course.marks,
        grade: calculateGrade(course.marks).grade
      };
    });

    const average = calcAvg(processedCourses);
    const gpa = calculateGPA(processedCourses);

    return {
      id: studentData.id,
      name: studentData.name,
      courses: processedCourses,
      average: Number(average.toFixed(2)),
      gpa: Number(gpa.toFixed(2))
    };
  });

  return JSON.stringify(report, null, 2);
}