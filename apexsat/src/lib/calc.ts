/**
 * Small, safe expression engine for the in-test calculator and grapher.
 * Recursive-descent parser → AST → evaluator. No `eval`, no globals.
 *
 * Supports: + − × ÷ ^ ! %, parentheses, implicit multiplication (2x, 3(4), 2π),
 * constants π/pi, e, ans, the variable x, and the functions
 * sin cos tan asin acos atan sqrt √ ln log abs.
 */

type Node =
  | { k: 'num'; v: number }
  | { k: 'var'; name: 'x' | 'ans' }
  | { k: 'neg'; a: Node }
  | { k: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
  | { k: 'post'; op: '!' | '%'; a: Node }
  | { k: 'fn'; name: Fn; a: Node }

type Fn = 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' | 'sqrt' | 'ln' | 'log' | 'abs'

type Tok = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: string }

const FUNCS: Fn[] = ['asin', 'acos', 'atan', 'sqrt', 'sin', 'cos', 'tan', 'abs', 'log', 'ln']
const WORDS = [...FUNCS, 'ans', 'pi', 'x', 'e']

export class CalcError extends Error {}

function tokenize(src: string): Tok[] {
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/²/g, '^2').replace(/\s+/g, '')
  const out: Tok[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/[0-9.]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      // scientific notation like 1e5 is intentionally not supported (e is a constant)
      const v = Number(s.slice(i, j))
      if (Number.isNaN(v)) throw new CalcError('number')
      out.push({ t: 'num', v })
      i = j
    } else if (/[a-z]/i.test(c)) {
      const rest = s.slice(i).toLowerCase()
      const word = WORDS.find((w) => rest.startsWith(w))
      if (!word) throw new CalcError('identifier')
      out.push({ t: 'id', v: word })
      i += word.length
    } else if ('+-*/^()!%'.includes(c)) {
      out.push({ t: 'op', v: c })
      i++
    } else throw new CalcError('character')
  }
  return out
}

function parse(tokens: Tok[]): Node {
  let pos = 0
  const peek = () => tokens[pos]
  const isOp = (v: string) => peek()?.t === 'op' && peek()!.v === v
  const eat = (v: string) => {
    if (!isOp(v)) throw new CalcError(`expected ${v}`)
    pos++
  }
  const startsPrimary = () => {
    const tk = peek()
    return tk !== undefined && (tk.t === 'num' || tk.t === 'id' || (tk.t === 'op' && tk.v === '('))
  }

  function expr(): Node {
    let a = term()
    while (isOp('+') || isOp('-')) {
      const op = (tokens[pos++] as { v: '+' | '-' }).v
      a = { k: 'bin', op, a, b: term() }
    }
    return a
  }
  function term(): Node {
    let a = unary()
    for (;;) {
      if (isOp('*') || isOp('/')) {
        const op = (tokens[pos++] as { v: '*' | '/' }).v
        a = { k: 'bin', op, a, b: unary() }
      } else if (startsPrimary()) {
        // implicit multiplication: 2x, 3(4), (1)(2), 2pi
        a = { k: 'bin', op: '*', a, b: power() }
      } else return a
    }
  }
  function unary(): Node {
    if (isOp('-')) {
      pos++
      return { k: 'neg', a: unary() }
    }
    if (isOp('+')) {
      pos++
      return unary()
    }
    return power()
  }
  function power(): Node {
    const base = postfix()
    if (isOp('^')) {
      pos++
      return { k: 'bin', op: '^', a: base, b: unary() }
    }
    return base
  }
  function postfix(): Node {
    let a = primary()
    while (isOp('!') || isOp('%')) a = { k: 'post', op: (tokens[pos++] as { v: '!' | '%' }).v, a }
    return a
  }
  function primary(): Node {
    const tk = peek()
    if (!tk) throw new CalcError('unexpected end')
    if (tk.t === 'num') {
      pos++
      return { k: 'num', v: tk.v }
    }
    if (tk.t === 'op' && tk.v === '(') {
      pos++
      const inner = expr()
      // Forgive a missing closing paren at the very end
      if (pos < tokens.length) eat(')')
      return inner
    }
    if (tk.t === 'id') {
      pos++
      if (tk.v === 'pi') return { k: 'num', v: Math.PI }
      if (tk.v === 'e') return { k: 'num', v: Math.E }
      if (tk.v === 'x' || tk.v === 'ans') return { k: 'var', name: tk.v }
      const name = tk.v as Fn
      return { k: 'fn', name, a: isOp('(') ? primary() : power() }
    }
    throw new CalcError(`unexpected ${tk.v}`)
  }

  const ast = expr()
  if (pos !== tokens.length) throw new CalcError('trailing input')
  return ast
}

function factorial(n: number) {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n > 170) return Infinity
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export interface Env {
  x?: number
  ans?: number
  degrees?: boolean
}

function evaluate(n: Node, env: Env): number {
  switch (n.k) {
    case 'num':
      return n.v
    case 'var':
      return n.name === 'x' ? (env.x ?? NaN) : (env.ans ?? 0)
    case 'neg':
      return -evaluate(n.a, env)
    case 'post': {
      const v = evaluate(n.a, env)
      return n.op === '!' ? factorial(v) : v / 100
    }
    case 'bin': {
      const a = evaluate(n.a, env)
      const b = evaluate(n.b, env)
      switch (n.op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          return a / b
        case '^':
          return Math.pow(a, b)
      }
    }
    // falls through (exhaustive above)
    case 'fn': {
      const v = evaluate(n.a, env)
      const toRad = env.degrees ? Math.PI / 180 : 1
      const fromRad = env.degrees ? 180 / Math.PI : 1
      switch (n.name) {
        case 'sin':
          return Math.sin(v * toRad)
        case 'cos':
          return Math.cos(v * toRad)
        case 'tan':
          return Math.tan(v * toRad)
        case 'asin':
          return Math.asin(v) * fromRad
        case 'acos':
          return Math.acos(v) * fromRad
        case 'atan':
          return Math.atan(v) * fromRad
        case 'sqrt':
          return Math.sqrt(v)
        case 'ln':
          return Math.log(v)
        case 'log':
          return Math.log10(v)
        case 'abs':
          return Math.abs(v)
      }
    }
  }
}

/** Parses once and returns a fast evaluator (used by the grapher) */
export function compile(src: string): (env: Env) => number {
  const ast = parse(tokenize(src))
  return (env) => evaluate(ast, env)
}

export function calculate(src: string, env: Env = {}): number {
  return compile(src)(env)
}

/** Pretty result: trims float noise, keeps big/small numbers readable */
export function formatResult(v: number): string {
  if (Number.isNaN(v)) return 'Error'
  if (!Number.isFinite(v)) return v > 0 ? '∞' : '−∞'
  if (Math.abs(v) >= 1e12 || (Math.abs(v) < 1e-9 && v !== 0)) return v.toExponential(6).replace('-', '−')
  const r = Number.parseFloat(v.toPrecision(12))
  return String(r).replace('-', '−')
}
