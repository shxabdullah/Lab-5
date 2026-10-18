async function getJSON(url, fetchImplementation = fetch) {
  const response = await fetchImplementation(url);
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

function fakeFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (options.signal && options.signal.aborted) {
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      return reject(abortErr);
    }

    const timer = setTimeout(() => {
      if (url === '/users') {
        resolve({
          ok: true,
          status: 200,
          json: async () => [
            { id: 1, name: 'Ali', department: 'CS' },
            { id: 2, name: 'Sara', department: 'SE' },
            { id: 3, name: 'Usman', department: 'CS' }
          ]
        });
      } else if (url === '/courses') {
        resolve({
          ok: true,
          status: 200,
          json: async () => [
            { id: 101, name: 'FSWD' },
            { id: 102, name: 'AI Operations' }
          ]
        });
      } else if (url === '/results') {
        resolve({
          ok: true,
          status: 200,
          json: async () => [
            { studentId: 1, marks: 88, department: 'CS' },
            { studentId: 2, marks: 42, department: 'SE' },
            { studentId: 3, marks: 74, department: 'CS' }
          ]
        });
      } else if (url === '/404') {
        resolve({ ok: false, status: 404, statusText: 'Not Found' });
      } else if (url === '/500') {
        resolve({ ok: false, status: 500, statusText: 'Internal Server Error' });
      } else if (url === '/network-error') {
        reject(new Error('Network connectivity loss'));
      } else if (url === '/invalid-json') {
        resolve({
          ok: true,
          status: 200,
          json: async () => { throw new SyntaxError('Unexpected JSON token'); }
        });
      } else if (url === '/slow') {
        resolve({
          ok: true,
          status: 200,
          json: async () => ({ status: 'delayed response' })
        });
      } else {
        reject(new Error('Unknown endpoint'));
      }
    }, url === '/slow' ? 3000 : 100);

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        clearTimeout(timer);
        const abortErr = new Error('The operation was aborted');
        abortErr.name = 'AbortError';
        reject(abortErr);
      });
    }
  });
}

async function loadDashboard(fetchImpl = fakeFetch) {
  try {
    const [users, courses, results] = await Promise.all([
      getJSON('/users', fetchImpl),
      getJSON('/courses', fetchImpl),
      getJSON('/results', fetchImpl)
    ]);

    const totalStudents = users.length;
    const totalCourses = courses.length;

    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const overallAverage = results.length ? Number((totalMarks / results.length).toFixed(2)) : 0;

    const highestResult = results.reduce((max, r) => (r.marks > max.marks ? r : max), results[0]);
    const highestPerformingStudent = users.find(u => u.id === highestResult.studentId);

    const failedCount = results.filter(r => r.marks < 50).length;

    const departmentStats = results.reduce((acc, r) => {
      if (!acc[r.department]) {
        acc[r.department] = { count: 0, totalMarks: 0 };
      }
      acc[r.department].count += 1;
      acc[r.department].totalMarks += r.marks;
      return acc;
    }, {});

    Object.keys(departmentStats).forEach(dept => {
      departmentStats[dept].averageMarks = Number((departmentStats[dept].totalMarks / departmentStats[dept].count).toFixed(2));
      delete departmentStats[dept].totalMarks;
    });

    return {
      totalStudents,
      totalCourses,
      overallAverage,
      highestPerformingStudent,
      failedStudentsCount: failedCount,
      departmentStatistics: departmentStats
    };
  } catch (error) {
    console.error('Dashboard Loading Error:', error.message);
    throw error;
  }
}

async function fetchWithTimeout(url, milliseconds, fetchImpl = fakeFetch) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), milliseconds);

  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP Failure Status ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout exceeded after ${milliseconds} ms`);
    }
    throw error;
  } finally {
    clearTimeout(timerId);
  }
}

async function runAggregatorDemo() {
  const dashboard = await loadDashboard();
  console.log('Dashboard Data:', dashboard);

  try {
    await fetchWithTimeout('/slow', 500);
  } catch (err) {
    console.error('Timeout Test Caught Expected Exception:', err.message);
  }
}

runAggregatorDemo();