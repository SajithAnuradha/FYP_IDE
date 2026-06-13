// Judge0 Community Edition — free, no API key required
// Java language_id = 62, entry class must be named "Main"
const JUDGE0_URL = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true';

function buildSource(studentCode, runnerMain) {
  // Strip `public` from the student's top-level class so it can coexist with Main
  const normalized = studentCode.replace(/^public\s+class\s+/m, 'class ');
  return [
    normalized,
    '',
    'class Main {',
    '  public static void main(String[] args) throws Exception {',
    runnerMain,
    '  }',
    '}',
  ].join('\n');
}

export async function runJavaTestCase(studentCode, runnerMain) {
  const source = buildSource(studentCode, runnerMain);

  let res;
  try {
    res = await fetch(JUDGE0_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language_id: 62, source_code: source, stdin: '' }),
    });
  } catch (err) {
    throw new Error(`Cannot reach Judge0: ${err.message}`);
  }

  if (!res.ok) {
    throw new Error(`Judge0 ${res.status}`);
  }

  const data = await res.json();

  // status.id 3 = Accepted, 5 = Time Limit Exceeded, 6 = Compilation Error
  const timedOut     = data.status?.id === 5;
  const compileError = data.compile_output?.trim() ?? '';
  const stdout       = data.stdout?.trim() ?? '';
  const stderr       = compileError || data.stderr?.trim() || '';
  const exitCode     = data.status?.id === 3 ? 0 : 1;

  return { stdout, stderr, exitCode, timedOut };
}
