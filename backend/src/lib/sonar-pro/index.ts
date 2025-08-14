export type SonarFinding = {
  type: 'syntax_errors' | 'security_vulnerabilities' | 'best_practices' | 'code_smells';
  message: string;
  line?: number;
  severity: 'low' | 'medium' | 'high';
};

export async function analyzeCode(language: string, code: string): Promise<Record<string, SonarFinding[]>> {
  const findings: Record<string, SonarFinding[]> = {
    syntax_errors: [],
    security_vulnerabilities: [],
    best_practices: [],
    code_smells: []
  };

  if (!code.trim()) {
    findings.syntax_errors.push({ type: 'syntax_errors', message: 'Empty code input', severity: 'low' });
    return findings;
  }

  if (/eval\(/.test(code)) {
    findings.security_vulnerabilities.push({ type: 'security_vulnerabilities', message: 'Avoid using eval()', severity: 'high' });
  }

  if (language.toLowerCase() === 'javascript' && !/;\s*$/.test(code.trim())) {
    findings.best_practices.push({ type: 'best_practices', message: 'Consider consistent semicolons', severity: 'low' });
  }

  if (code.length > 5000) {
    findings.code_smells.push({ type: 'code_smells', message: 'Large file, consider refactoring', severity: 'medium' });
  }

  return findings;
}