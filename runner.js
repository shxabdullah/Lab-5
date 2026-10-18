/**
 * Master Test Runner for Lab 5: Advanced JavaScript
 * Runs all 8 tasks sequentially and reports results.
 */

const { execSync } = require('child_process');
const path = require('path');

const tasks = [
  { name: 'Task 1: Admission Decision Engine', script: 'task1_admissions.js' },
  { name: 'Task 2: Academic Analytics Engine', script: 'task2_analytics.js' },
  { name: 'Task 3: Safe Profile Update Service', script: 'task3_profile_update.js' },
  { name: 'Task 4: University Hierarchy & Dynamic this', script: 'task4_user_hierarchy.js' },
  { name: 'Task 5: Modular Transcript (ES Modules)', script: path.join('task5_modular_transcript', 'main.js') },
  { name: 'Task 6: Legacy Callback Registration', script: 'task6_callbacks.js' },
  { name: 'Task 7: Promise-Based Engine', script: 'task7_promises.js' },
  { name: 'Task 8: Async/Await API Aggregator & Timeout', script: 'task8_async_await.js' }
];

console.log('############################################################');
console.log('   AIR UNIVERSITY - LAB 5: ADVANCED JAVASCRIPT TEST RUNNER   ');
console.log('############################################################\n');

let passedCount = 0;

for (let i = 0; i < tasks.length; i++) {
  const task = tasks[i];
  console.log(`\n============================================================`);
  console.log(`[${i + 1}/${tasks.length}] EXECUTING: ${task.name}`);
  console.log(`============================================================\n`);

  try {
    const output = execSync(`node "${task.script}"`, {
      cwd: __dirname,
      encoding: 'utf-8'
    });
    console.log(output);
    passedCount++;
  } catch (error) {
    console.error(`ERROR running ${task.name}:`);
    console.error(error.stdout || error.message);
  }
}

console.log('\n############################################################');
console.log(`SUMMARY: ${passedCount} / ${tasks.length} TASKS COMPLETED SUCCESSFULLY`);
console.log('############################################################\n');
