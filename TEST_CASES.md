# Prescription Input Validator - Test Cases Specification & Guide

This file contains the complete test suite and execution instructions for the **Prescription Input Validator**.

---

## 1. Quick Test Execution

You can run all automated test cases at any time from the terminal:

```bash
npm test
```

This runs `tsx test_suite.mjs`, which reads [test_cases.json](./test_cases.json), validates all 11 test scenarios against the pure validation engine, and verifies assertions with zero errors.

---

## 2. Analysis of the User's Scenario

When you entered:
```text
SPH +1.50, CYL -1.00, Axis 105
```
into the **SPH** input box, the application produced:
* `Right Eye (OD) SPH must be a valid number (e.g. -2.25).`
* `Right Eye (OD) CYL is required. Please enter a value.`
* `Right Eye (OD) Axis is required. Please enter a value.`

### Why This Happened & How to Pass It:
* Each prescription parameter has its **own dedicated input box** in the form:
  * **SPH input**: Enter `+1.50` (or `1.50`)
  * **CYL input**: Enter `-1.00`
  * **Axis input**: Enter `105`
* When the combined sentence `"SPH +1.50, CYL -1.00, Axis 105"` was pasted into the SPH input alone:
  1. The validator correctly detected alphabetical characters and symbols, rejecting it as non-numeric (Rule 3).
  2. The remaining required inputs (CYL and Axis) were left empty, so the validator flagged them as required (Rules 1 & 2).
* **To Pass Instantly in the UI:** Click the button **`User Case (+1.50 / -1.00 / 105°)`** in the top test scenarios toolbar! It automatically distributes each parameter into its dedicated box and displays the green **"Prescription Successfully Validated!"** banner.

---

## 3. Complete Test Matrix

| ID | Test Case Name | Right Eye (OD) Inputs | Left Eye (OS) Inputs | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Standard Valid Prescription** | SPH: `-2.25`<br>CYL: `-0.75`<br>Axis: `90` | SPH: `+1.50`<br>CYL: `-1.00`<br>Axis: `105` | ✅ **PASS** (0 errors)<br>Green Success Banner + Optical receipt card. |
| **TC-02** | **User Prescription (Valid Individual Fields)** | SPH: `+1.50`<br>CYL: `-1.00`<br>Axis: `105` | SPH: `+1.50`<br>CYL: `-1.00`<br>Axis: `105` | ✅ **PASS** (0 errors)<br>All 6 inputs validated within clinical range. |
| **TC-03** | **User Pasted String Into SPH** | SPH: `"SPH +1.50, CYL -1.00, Axis 105"`<br>CYL: `""`<br>Axis: `""` | SPH: `"SPH +1.50, CYL -1.00, Axis 105"`<br>CYL: `""`<br>Axis: `""` | ❌ **6 Errors** (as observed)<br>SPH flagged as non-numeric; CYL & Axis flagged as required. |
| **TC-04** | **Boundary Limits (-20/+20, -8/+8, 0/180)** | SPH: `-20.00`<br>CYL: `-8.00`<br>Axis: `0` | SPH: `+20.00`<br>CYL: `+8.00`<br>Axis: `180` | ✅ **PASS** (0 errors)<br>Tests min/max boundaries; Axis `0` is accepted and not missing. |
| **TC-05** | **SPH Below Minimum (-25.00)** | SPH: `-25.00`<br>CYL: `0.00`<br>Axis: `90` | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `90` | ❌ **1 Error**<br>`Right Eye (OD) SPH must be between -20.00 and +20.00 D`. |
| **TC-06** | **CYL Above Maximum (+10.00)** | SPH: `0.00`<br>CYL: `+10.00`<br>Axis: `90` | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `90` | ❌ **1 Error**<br>`Right Eye (OD) CYL must be between -8.00 and +8.00 D`. |
| **TC-07** | **Axis Above Maximum (190)** | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `190` | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `90` | ❌ **1 Error**<br>`Right Eye (OD) Axis must be between 0 and 180°`. |
| **TC-08** | **Negative Axis (-10)** | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `-10` | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `90` | ❌ **1 Error**<br>`Right Eye (OD) Axis must be a non-negative whole number between 0 and 180°`. |
| **TC-09** | **Decimal Axis (45.5)** | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `45.5` | SPH: `0.00`<br>CYL: `0.00`<br>Axis: `90` | ❌ **1 Error**<br>`Right Eye (OD) Axis must be a whole number (0 to 180°). Decimal values like "45.5" are not permitted.` |
| **TC-10** | **Empty Form Submission** | SPH: `""`<br>CYL: `""`<br>Axis: `""` | SPH: `""`<br>CYL: `""`<br>Axis: `""` | ❌ **6 Errors**<br>All 6 fields required; application stays responsive without crashing. |
| **TC-11** | **Non-Numeric Input ("abc")** | SPH: `-2.00`<br>CYL: `-0.50`<br>Axis: `90` | SPH: `"abc"`<br>CYL: `-0.50`<br>Axis: `90` | ❌ **1 Error**<br>`Left Eye (OS) SPH must be a valid number`. |

---

## 4. Verification in Live Browser

1. Ensure the development server is active at `http://127.0.0.1:5173/`.
2. To test **TC-02 (Your exact prescription values)**:
   - Click the button **"User Case (+1.50 / -1.00 / 105°)"** at the top.
   - The form will populate:
     - Right Eye: SPH = `+1.50`, CYL = `-1.00`, Axis = `105`
     - Left Eye: SPH = `+1.50`, CYL = `-1.00`, Axis = `105`
   - Notice that the **green success receipt** appears immediately with valid status.
3. To test **TC-03**:
   - Click **"Clear Form"**.
   - Paste `"SPH +1.50, CYL -1.00, Axis 105"` into SPH, leaving CYL and Axis empty.
   - Click **"Validate Prescription"**.
   - Notice the exact 6 errors you encountered are reproduced cleanly without application crash.
