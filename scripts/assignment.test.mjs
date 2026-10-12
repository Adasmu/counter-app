import test from 'node:test';
import assert from 'node:assert/strict';
import { createStudentConfig, renderStudentConfig, variantFromHash } from './assignment.mjs';

test('all 16 first hexadecimal digits have the required variant', () => {
  for (const [digits, variant] of [
    ['0123', 'A'],
    ['4567', 'B'],
    ['89ab', 'C'],
    ['cdef', 'D'],
  ]) {
    for (const digit of digits) assert.equal(variantFromHash(digit + '0'.repeat(63)), variant);
  }
});
test('hashes the exact UTF-8 email with no trailing newline', () => {
  const result = createStudentConfig('student@example.edu', ' Test Student ');
  assert.equal(result.authorName, 'Test Student');
  assert.equal(
    result.emailSha256,
    '3ba43c4927c41495293b7c4a35e075548d8c1dfc9ee602905671418f7c55de60',
  );
  assert.equal(result.variant, variantFromHash(result.emailSha256));
});
test('preserves case rather than silently changing the input', () => {
  assert.notEqual(
    createStudentConfig('Student@example.edu', 'Test').emailSha256,
    createStudentConfig('student@example.edu', 'Test').emailSha256,
  );
});
test('does not store the email address in generated code', () => {
  const source = renderStudentConfig(createStudentConfig('student@example.edu', 'Test'));
  assert.ok(!source.includes('student@example.edu'));
  assert.ok(source.includes('emailSha256'));
});
test('rejects missing names, invalid hashes and malformed or padded emails', () => {
  assert.throws(() => variantFromHash('abc'));
  assert.throws(() => createStudentConfig('student@example.edu', ' '));
  for (const email of ['', 'example.edu', ' student@example.edu', 'student@example.edu\n']) {
    assert.throws(() => createStudentConfig(email, 'Test'));
  }
});
