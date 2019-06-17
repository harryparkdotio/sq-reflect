import * as ts from 'typescript';

import { astWriter } from '../writer';

describe('astWriter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call ts.createPrinter', () => {
    const printerMock: ts.Printer = {
      printBundle: jest.fn(),
      printFile: jest.fn(),
      printList: jest.fn(),
      printNode: jest.fn(),
    };

    jest.spyOn(ts, 'createPrinter').mockReturnValue(printerMock);
    const createSourceFileSpy = jest.spyOn(ts, 'createSourceFile');

    const statements = [
      ts.createStatement(ts.createStringLiteral('abc')),
      ts.createStatement(
        ts.createFunctionExpression(
          undefined,
          undefined,
          'def',
          undefined,
          undefined,
          ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
          ts.createBlock([])
        )
      ),
    ];

    astWriter(statements);

    const sourceFile = createSourceFileSpy.mock.results[0].value;

    expect(ts.createPrinter).toHaveBeenCalled();
    expect(ts.createSourceFile).toHaveBeenCalled();

    expect(printerMock.printNode).toHaveBeenCalledTimes(statements.length);

    statements.forEach((statement, idx) => {
      expect(printerMock.printNode).toHaveBeenNthCalledWith(
        // 1 indexed
        idx + 1,
        ts.EmitHint.Unspecified,
        statement,
        sourceFile
      );
    });
  });
});
