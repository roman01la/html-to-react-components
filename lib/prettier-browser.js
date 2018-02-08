import parse from "prettier/src/parser-babylon"
import { printAstToDoc } from "prettier/src/printer"
import { printDocToString } from "prettier/src/doc-printer"

export const format = (code, opts) => {
  const ast = parse(code)
  const doc = printAstToDoc(ast, opts)
  const result = printDocToString(doc, opts)
  return result.formatted
}
