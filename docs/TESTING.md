# Brighte Eats - Testing Guide

This guide covers running tests, understanding test coverage, and writing tests for the Brighte Eats project.

## Table of Contents

1. [Running Tests](#running-tests)
2. [Test Coverage](#test-coverage)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Test Best Practices](#test-best-practices)

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

Automatically re-runs tests when files change:

```bash
npm run test:watch
```

### Run Tests with Coverage Report

Generate a detailed coverage report:

```bash
npm run test:coverage
```

This will:
- Run all tests
- Generate coverage reports in the `coverage/` directory
- Display coverage summary in the terminal
- Create an HTML report at `coverage/lcov-report/index.html`

### View Coverage Report

After running `npm run test:coverage`, open the HTML report:

```bash
# Open in browser (path may vary by OS)
open coverage/lcov-report/index.html  # Mac
start coverage/lcov-report/index.html  # Windows
xdg-open coverage/lcov-report/index.html  # Linux
```

---

## Test Coverage

### Current Coverage Status

The project maintains **100% test coverage** across all modules:

- ✅ **All files**: 100% statements, branches, functions, and lines
- ✅ **lib/prisma.ts**: 100% coverage
- ✅ **modules/leads/errors.ts**: 100% coverage
- ✅ **modules/leads/repository.ts**: 100% coverage
- ✅ **modules/leads/resolvers.ts**: 100% coverage
- ✅ **modules/leads/service.ts**: 100% coverage
- ✅ **modules/leads/typeDefs.ts**: 100% coverage
- ✅ **modules/leads/validator.ts**: 100% coverage

### Coverage Report

```
Test Suites: 6 passed, 6 total
Tests:       81 passed, 81 total
Snapshots:   0 total
Time:        2.416 s
```

---

## Test Structure

### Test File Organization

Tests are located alongside the source code in `__tests__` directories:

```
src/
├── modules/
│   └── leads/
│       ├── __tests__/
│       │   ├── errors.test.ts
│       │   ├── repository.test.ts
│       │   ├── resolvers.test.ts
│       │   ├── service.test.ts
│       │   ├── typeDefs.test.ts
│       │   └── validator.test.ts
│       ├── errors.ts
│       ├── repository.ts
│       ├── resolvers.ts
│       ├── service.ts
│       ├── typeDefs.ts
│       └── validator.ts
```

### Test File Naming Convention

- Test files use the pattern: `<module-name>.test.ts`
- Each test file corresponds to a source file
- Example: `service.ts` → `service.test.ts`


## Running Specific Tests

### Run Tests for a Specific File

```bash
npm test -- service.test.ts
```

### Run Tests Matching a Pattern

```bash
npm test -- --testNamePattern="should create a lead"
```

### Run Tests in a Specific Directory

```bash
npm test -- modules/leads/__tests__
```

## Quick Reference

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- service.test.ts

# Run with verbose output
npm test -- --verbose
```

