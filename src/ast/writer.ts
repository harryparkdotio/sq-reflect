import * as ts from 'typescript';

export const astWriter = (statements: ts.Statement[]): string[] => {
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });

  const sourceFile = ts.createSourceFile(
    '',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );

  return statements.map(statement =>
    printer.printNode(ts.EmitHint.Unspecified, statement, sourceFile)
  );
};
