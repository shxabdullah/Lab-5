import Student from './Student.js';
import { processTranscriptJSON } from './transcriptService.js';

const validJSON = JSON.stringify([
  {
    id: 101,
    name: 'Ali',
    courses: [
      { code: 'CS301', marks: 81 },
      { code: 'CS302', marks: 74 }
    ]
  },
  {
    id: 102,
    name: 'Sara',
    courses: [
      { code: 'CS301', marks: 95 },
      { code: 'CS302', marks: 88 }
    ]
  }
]);

const invalidJSON = JSON.stringify([
  {
    id: 103,
    name: 'Tariq',
    courses: [
      { code: 'CS301', marks: 150 }
    ]
  }
]);

try {
  console.log('Processing Valid JSON...');
  const report = processTranscriptJSON(validJSON);
  console.log('Output Report:\n', report);
} catch (error) {
  console.error('Handled Error:', error.name, '-', error.message);
} finally {
  console.log('Completed transcript processing attempt 1.\n');
}

try {
  console.log('Processing Invalid JSON...');
  const report = processTranscriptJSON(invalidJSON);
  console.log(report);
} catch (error) {
  console.error('Handled Error:', error.name, '-', error.message);
} finally {
  console.log('Completed transcript processing attempt 2.');
}