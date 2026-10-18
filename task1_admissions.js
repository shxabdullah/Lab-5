function processAdmission(applicants, validPrograms = ['BSCS', 'BSSE', 'BSAI']) {
  const processed = applicants.map(applicant => {
    const age = Number(applicant.age);
    const matric = Number(applicant.matricMarks);
    const inter = Number(applicant.intermediateMarks);
    const entry = Number(applicant.entryTest);
    const feePaid = applicant.feePaid === 'true' || applicant.feePaid === true;

    const isAgeValid = !isNaN(age) && age >= 17 && age <= 30;
    const isMatricValid = !isNaN(matric) && matric >= 0 && matric <= 100;
    const isInterValid = !isNaN(inter) && inter >= 0 && inter <= 100;
    const isEntryValid = !isNaN(entry) && entry >= 0 && entry <= 100;
    const isProgramValid = validPrograms.includes(applicant.program);

    const isValid = isAgeValid && isMatricValid && isInterValid && isEntryValid && isProgramValid && feePaid;

    if (!isValid) {
      return {
        ...applicant,
        status: 'INVALID DATA',
        merit: null
      };
    }

    const merit = Number((matric * 0.20 + inter * 0.30 + entry * 0.50).toFixed(2));
    const isEligible = merit >= 70 && entry >= 60 && inter >= 60;

    let status = 'REJECTED';
    if (isEligible) {
      status = merit >= 80 ? 'SELECTED' : 'WAITING';
    }

    return {
      ...applicant,
      age,
      matricMarks: matric,
      intermediateMarks: inter,
      entryTest: entry,
      merit,
      status
    };
  });

  const validApplicants = processed.filter(app => app.status !== 'INVALID DATA');
  const invalidApplicants = processed.filter(app => app.status === 'INVALID DATA');

  const totalMerit = validApplicants.reduce((sum, app) => sum + app.merit, 0);
  const averageMerit = validApplicants.length ? Number((totalMerit / validApplicants.length).toFixed(2)) : 0;

  let highestMeritApplicant = null;
  let lowestMerit = null;

  if (validApplicants.length > 0) {
    highestMeritApplicant = validApplicants.reduce((max, app) => (app.merit > max.merit ? app : max), validApplicants[0]);
    lowestMerit = validApplicants.reduce((min, app) => (app.merit < min.merit ? app : min), validApplicants[0]).merit;
  }

  const programCounts = processed.reduce((acc, app) => {
    acc[app.program] = (acc[app.program] || 0) + 1;
    return acc;
  }, {});

  const summary = {
    validCount: validApplicants.length,
    invalidCount: invalidApplicants.length,
    highestMeritApplicant,
    lowestMeritAmongValid: lowestMerit,
    averageMerit,
    programCounts
  };

  return { applicants: processed, summary };
}

const testApplicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  { id: 'A104', name: 'Zainab', age: '22', matricMarks: '95', intermediateMarks: '92', entryTest: '88', program: 'BSCS', feePaid: 'true' },
  { id: 'A105', name: 'Bilal', age: '16', matricMarks: '80', intermediateMarks: '75', entryTest: '70', program: 'BSSE', feePaid: 'true' },
  { id: 'A106', name: 'Tariq', age: '21', matricMarks: '60', intermediateMarks: '55', entryTest: '50', program: 'BSCS', feePaid: 'true' }
];

console.log(processAdmission(testApplicants));