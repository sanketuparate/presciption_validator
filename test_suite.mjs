// Automated Test Runner reading directly from test_cases.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePrescription } from './src/utils/validation.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'test_cases.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const testSuite = JSON.parse(rawData);

console.log('================================================================');
console.log('PRESCRIPTION INPUT VALIDATOR - AUTOMATED TEST SUITE');
console.log(`Source File: test_cases.json (${testSuite.testCases.length} Test Cases)`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const tc of testSuite.testCases) {
  totalTests++;
  console.log(`[${tc.id}] ${tc.name}`);
  console.log(`  Description: ${tc.description}`);

  const result = validatePrescription(tc.inputs);

  let tcPassed = true;

  // 1. Check isValid
  if (result.isValid !== tc.expected.isValid) {
    console.error(`  ❌ Failed isValid: expected ${tc.expected.isValid}, got ${result.isValid}`);
    tcPassed = false;
  }

  // 2. Check errorCount
  if (result.errorCount !== tc.expected.errorCount) {
    console.error(`  ❌ Failed errorCount: expected ${tc.expected.errorCount}, got ${result.errorCount}`);
    tcPassed = false;
  }

  // 3. Check expected parsedData (if valid)
  if (tc.expected.parsedData) {
    const expectedOd = tc.expected.parsedData.od;
    const expectedOs = tc.expected.parsedData.os;
    const actualOd = result.parsedData?.od;
    const actualOs = result.parsedData?.os;

    if (
      actualOd?.sph !== expectedOd.sph ||
      actualOd?.cyl !== expectedOd.cyl ||
      actualOd?.axis !== expectedOd.axis ||
      actualOs?.sph !== expectedOs.sph ||
      actualOs?.cyl !== expectedOs.cyl ||
      actualOs?.axis !== expectedOs.axis
    ) {
      console.error(`  ❌ Failed parsedData matching!`);
      console.error(`     Expected:`, JSON.stringify(tc.expected.parsedData));
      console.error(`     Received:`, JSON.stringify(result.parsedData));
      tcPassed = false;
    }
  }

  // 4. Check expected error messages (if invalid)
  if (tc.expected.expectedErrors) {
    for (const [fieldKey, snippet] of Object.entries(tc.expected.expectedErrors)) {
      const actualMsg = result.errors[fieldKey];
      if (!actualMsg || !actualMsg.includes(snippet)) {
        console.error(`  ❌ Missing or mismatched error on [${fieldKey}]`);
        console.error(`     Expected snippet: "${snippet}"`);
        console.error(`     Actual message:   "${actualMsg}"`);
        tcPassed = false;
      }
    }
  }

  if (tcPassed) {
    console.log(`  ✅ PASSED (isValid: ${result.isValid}, errors: ${result.errorCount})`);
    passedTests++;
  } else {
    failedTests++;
  }

  console.log('');
}

console.log('================================================================');
console.log(`FINAL RESULT: ${passedTests}/${totalTests} Test Cases Passed (${failedTests} Failed)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
