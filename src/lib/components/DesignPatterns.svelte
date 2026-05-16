<script lang="ts">
  import { onMount } from 'svelte';
  import { createHighlighter } from 'shiki';
  import { t } from '$lib/stores/locale';

  // ─── Data ───────────────────────────────────────────────────────────────────

  const PATTERNS = [
    {
      id: 'singleton',
      name: 'Singleton',
      category: 'Creational',
      categoryColor: '#A97BFF',
      examples: {
        python: `class Database:
    _instance: "Database | None" = None

    def __new__(cls) -> "Database":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._connected = False
        return cls._instance

    def connect(self, url: str) -> None:
        if not self._connected:
            print(f"Connecting to {url}")
            self._connected = True

# Both variables point to same object
db1 = Database()
db2 = Database()
assert db1 is db2  # True`,
        typescript: `class Database {
  private static instance: Database | null = null;
  private connected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect(url: string): void {
    if (!this.connected) {
      console.log(\`Connecting to \${url}\`);
      this.connected = true;
    }
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true`
      }
    },
    {
      id: 'factory',
      name: 'Factory Method',
      category: 'Creational',
      categoryColor: '#A97BFF',
      examples: {
        python: `from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...

class EmailNotifier(Notifier):
    def send(self, message: str) -> None:
        print(f"Email: {message}")

class SlackNotifier(Notifier):
    def send(self, message: str) -> None:
        print(f"Slack: {message}")

class SMSNotifier(Notifier):
    def send(self, message: str) -> None:
        print(f"SMS: {message}")

def create_notifier(channel: str) -> Notifier:
    match channel:
        case "email": return EmailNotifier()
        case "slack": return SlackNotifier()
        case "sms":   return SMSNotifier()
        case _:       raise ValueError(f"Unknown: {channel}")

notifier = create_notifier("slack")
notifier.send("Deploy complete!")`,
        typescript: `interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string) { console.log(\`Email: \${message}\`); }
}

class SlackNotifier implements Notifier {
  send(message: string) { console.log(\`Slack: \${message}\`); }
}

class SMSNotifier implements Notifier {
  send(message: string) { console.log(\`SMS: \${message}\`); }
}

type Channel = 'email' | 'slack' | 'sms';

function createNotifier(channel: Channel): Notifier {
  const map: Record<Channel, new () => Notifier> = {
    email: EmailNotifier,
    slack: SlackNotifier,
    sms: SMSNotifier,
  };
  return new map[channel]();
}

const notifier = createNotifier('slack');
notifier.send('Deploy complete!');`
      }
    },
    {
      id: 'observer',
      name: 'Observer',
      category: 'Behavioral',
      categoryColor: '#00D9FF',
      examples: {
        python: `from typing import Callable

class EventEmitter:
    def __init__(self):
        self._listeners: dict[str, list[Callable]] = {}

    def on(self, event: str, listener: Callable) -> None:
        self._listeners.setdefault(event, []).append(listener)

    def off(self, event: str, listener: Callable) -> None:
        self._listeners.get(event, []).remove(listener)

    def emit(self, event: str, *args) -> None:
        for listener in self._listeners.get(event, []):
            listener(*args)

# Usage
store = EventEmitter()
store.on("change", lambda val: print(f"A: {val}"))
store.on("change", lambda val: print(f"B: {val}"))
store.emit("change", 42)  # both handlers fire`,
        typescript: `type Listener<T> = (value: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<string, Set<Listener<unknown>>>();

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>): () => void {
    const set = this.listeners.get(event as string) ?? new Set();
    set.add(fn as Listener<unknown>);
    this.listeners.set(event as string, set);
    return () => set.delete(fn as Listener<unknown>); // unsubscribe
  }

  emit<K extends keyof Events>(event: K, value: Events[K]): void {
    this.listeners.get(event as string)?.forEach(fn => fn(value));
  }
}

// Usage
type StoreEvents = { change: number; reset: void };
const store = new EventEmitter<StoreEvents>();

const unsub = store.on('change', val => console.log(\`Got: \${val}\`));
store.emit('change', 42); // → Got: 42
unsub(); // clean up`
      }
    },
    {
      id: 'strategy',
      name: 'Strategy',
      category: 'Behavioral',
      categoryColor: '#00D9FF',
      examples: {
        python: `from typing import Protocol

class SortStrategy(Protocol):
    def sort(self, data: list[int]) -> list[int]: ...

class BubbleSort:
    def sort(self, data: list[int]) -> list[int]:
        arr = data[:]
        for i in range(len(arr)):
            for j in range(len(arr) - i - 1):
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]
        return arr

class QuickSort:
    def sort(self, data: list[int]) -> list[int]:
        if len(data) <= 1: return data
        pivot = data[len(data) // 2]
        left  = [x for x in data if x < pivot]
        mid   = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + mid + self.sort(right)

class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def sort(self, data: list[int]) -> list[int]:
        return self._strategy.sort(data)

    def set_strategy(self, strategy: SortStrategy) -> None:
        self._strategy = strategy

sorter = Sorter(QuickSort())
print(sorter.sort([3, 1, 4, 1, 5]))`,
        typescript: `interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length - i - 1; j++)
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort([...arr]: number[]): number[] {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    return [
      ...this.sort(arr.filter(x => x < pivot)),
      ...arr.filter(x => x === pivot),
      ...this.sort(arr.filter(x => x > pivot)),
    ];
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}
  setStrategy(s: SortStrategy) { this.strategy = s; }
  sort(data: number[]) { return this.strategy.sort(data); }
}

const sorter = new Sorter(new QuickSort());
console.log(sorter.sort([3, 1, 4, 1, 5]));`
      }
    },
    {
      id: 'decorator',
      name: 'Decorator',
      category: 'Structural',
      categoryColor: '#00E599',
      examples: {
        python: `import functools
import time

def timer(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = fn(*args, **kwargs)
        ms = (time.perf_counter() - t0) * 1000
        print(f"{fn.__name__} took {ms:.1f}ms")
        return result
    return wrapper

def cache(fn):
    memo = {}
    @functools.wraps(fn)
    def wrapper(*args):
        if args not in memo:
            memo[args] = fn(*args)
        return memo[args]
    return wrapper

@timer
@cache
def fib(n: int) -> int:
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)

print(fib(30))  # cached + timed`,
        typescript: `interface Service {
  call(endpoint: string): Promise<string>;
}

class ApiService implements Service {
  async call(endpoint: string): Promise<string> {
    const res = await fetch(endpoint);
    return res.text();
  }
}

class LoggingDecorator implements Service {
  constructor(private wrapped: Service) {}

  async call(endpoint: string): Promise<string> {
    console.log(\`[LOG] → \${endpoint}\`);
    const result = await this.wrapped.call(endpoint);
    console.log(\`[LOG] ← \${result.length} bytes\`);
    return result;
  }
}

class CachingDecorator implements Service {
  private cache = new Map<string, string>();
  constructor(private wrapped: Service) {}

  async call(endpoint: string): Promise<string> {
    if (!this.cache.has(endpoint)) {
      this.cache.set(endpoint, await this.wrapped.call(endpoint));
    }
    return this.cache.get(endpoint)!;
  }
}

// Stack decorators
const api = new CachingDecorator(new LoggingDecorator(new ApiService()));`
      }
    },
    {
      id: 'builder',
      name: 'Builder',
      category: 'Creational',
      categoryColor: '#A97BFF',
      examples: {
        python: `from dataclasses import dataclass, field
from typing import Self

@dataclass
class QueryBuilder:
    _table: str = ""
    _conditions: list[str] = field(default_factory=list)
    _columns: list[str] = field(default_factory=list)
    _limit: int | None = None
    _order: str | None = None

    def from_table(self, table: str) -> Self:
        self._table = table
        return self

    def select(self, *cols: str) -> Self:
        self._columns.extend(cols)
        return self

    def where(self, condition: str) -> Self:
        self._conditions.append(condition)
        return self

    def limit(self, n: int) -> Self:
        self._limit = n
        return self

    def order_by(self, col: str) -> Self:
        self._order = col
        return self

    def build(self) -> str:
        cols = ", ".join(self._columns) or "*"
        sql  = f"SELECT {cols} FROM {self._table}"
        if self._conditions:
            sql += " WHERE " + " AND ".join(self._conditions)
        if self._order:  sql += f" ORDER BY {self._order}"
        if self._limit:  sql += f" LIMIT {self._limit}"
        return sql

query = (
    QueryBuilder()
    .from_table("users")
    .select("id", "name", "email")
    .where("active = true")
    .where("age > 18")
    .order_by("name")
    .limit(10)
    .build()
)`,
        typescript: `class QueryBuilder {
  private table = '';
  private conditions: string[] = [];
  private columns: string[] = [];
  private limitVal?: number;
  private orderCol?: string;

  from(table: string): this { this.table = table; return this; }

  select(...cols: string[]): this {
    this.columns.push(...cols); return this;
  }

  where(condition: string): this {
    this.conditions.push(condition); return this;
  }

  limit(n: number): this { this.limitVal = n; return this; }
  orderBy(col: string): this { this.orderCol = col; return this; }

  build(): string {
    const cols = this.columns.join(', ') || '*';
    let sql = \`SELECT \${cols} FROM \${this.table}\`;
    if (this.conditions.length)
      sql += \` WHERE \${this.conditions.join(' AND ')}\`;
    if (this.orderCol) sql += \` ORDER BY \${this.orderCol}\`;
    if (this.limitVal) sql += \` LIMIT \${this.limitVal}\`;
    return sql;
  }
}

const query = new QueryBuilder()
  .from('users')
  .select('id', 'name', 'email')
  .where('active = true')
  .where('age > 18')
  .orderBy('name')
  .limit(10)
  .build();`
      }
    }
  ] as const;

  // ─── Category filter ─────────────────────────────────────────────────────────

  type Category = 'All' | 'Creational' | 'Behavioral' | 'Structural';
  const CATEGORIES: Category[] = ['All', 'Creational', 'Behavioral', 'Structural'];

  const CATEGORY_COLORS: Record<string, string> = {
    Creational: '#A97BFF',
    Behavioral: '#00D9FF',
    Structural: '#00E599',
  };

  let activeCategory: Category = 'All';

  $: filteredPatterns = activeCategory === 'All'
    ? PATTERNS
    : PATTERNS.filter(p => p.category === activeCategory);

  function categoryCounts(cat: string): number {
    return PATTERNS.filter(p => p.category === cat).length;
  }

  // ─── Per-card state ───────────────────────────────────────────────────────────

  let activeLangs: Record<string, string> = Object.fromEntries(
    PATTERNS.map(p => [p.id, Object.keys(p.examples)[0]])
  );

  let expanded: Record<string, boolean> = {};

  function toggleCaveat(id: string) {
    expanded[id] = !expanded[id];
    expanded = expanded; // trigger reactivity
  }

  function setLang(id: string, lang: string) {
    activeLangs[id] = lang;
    activeLangs = activeLangs;
  }

  // ─── Shiki ───────────────────────────────────────────────────────────────────

  let htmlCache: Record<string, string> = {};
  let highlighterReady = false;

  onMount(async () => {
    const hl = await createHighlighter({
      themes: ['dark-plus'],
      langs: ['python', 'typescript'],
    });

    const cache: Record<string, string> = {};
    for (const p of PATTERNS) {
      for (const [lang, code] of Object.entries(p.examples)) {
        cache[`${p.id}-${lang}`] = hl.codeToHtml(code, { lang, theme: 'dark-plus' });
      }
    }
    htmlCache = cache;
    highlighterReady = true;
  });

  // Language display names + colors
  const LANG_META: Record<string, { label: string; color: string }> = {
    python:     { label: 'Python',     color: '#3572A5' },
    typescript: { label: 'TypeScript', color: '#3178C6' },
  };
</script>

<!-- ─── Markup ──────────────────────────────────────────────────────────────── -->

<section class="dp-section">

  <!-- Header -->
  <header class="dp-header">
    <div class="dp-title-row">
      <div class="dp-title-line" aria-hidden="true"></div>
      <h2 class="dp-title">{$t.patterns.sectionTitle}</h2>
      <div class="dp-title-line" aria-hidden="true"></div>
    </div>
    <p class="dp-subtitle">
      {$t.patterns.sectionSub}
    </p>

    <!-- Filter pills -->
    <div class="dp-filters" role="tablist" aria-label="Filter by category">
      {#each CATEGORIES as cat}
        {@const color = cat === 'All' ? 'var(--text-dim)' : CATEGORY_COLORS[cat]}
        <button
          class="dp-filter-pill"
          class:active={activeCategory === cat}
          role="tab"
          aria-selected={activeCategory === cat}
          on:click={() => (activeCategory = cat)}
          style="--cat-color: {color}"
        >
          {cat === 'All' ? $t.patterns.filterAll : $t.patterns.categories[cat]}
          {#if cat !== 'All'}
            <span class="dp-filter-count">×{categoryCounts(cat)}</span>
          {/if}
        </button>
      {/each}
    </div>
  </header>

  <!-- Cards grid -->
  <div class="dp-grid">
    {#each filteredPatterns as pattern, i (pattern.id)}
      {@const langs = Object.keys(pattern.examples)}
      {@const activeLang = activeLangs[pattern.id]}
      {@const cacheKey = `${pattern.id}-${activeLang}`}
      {@const isExpanded = !!expanded[pattern.id]}

      <article
        class="dp-card"
        style="
          --accent: {pattern.categoryColor};
          --accent-soft: {pattern.categoryColor}16;
          animation-delay: {i * 60}ms;
        "
      >
        <!-- Left accent stripe -->
        <div class="dp-card-stripe" aria-hidden="true"></div>

        <!-- Card body -->
        <div class="dp-card-inner">

          <!-- Card header -->
          <div class="dp-card-header">
            <h3 class="dp-pattern-name">{pattern.name}</h3>
            <span
              class="dp-category-badge"
              style="color: {pattern.categoryColor}; border-color: {pattern.categoryColor}40; background: {pattern.categoryColor}0f"
            >
              {$t.patterns.categories[pattern.category]}
            </span>
          </div>

          <!-- Intent -->
          <p class="dp-intent">{$t.patterns.items[pattern.id].intent}</p>

          <!-- When to use -->
          <div class="dp-when">
            <svg class="dp-when-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            <span>{$t.patterns.items[pattern.id].when}</span>
          </div>

          <!-- Language tabs -->
          <div class="dp-lang-tabs" role="tablist" aria-label="Language examples">
            {#each langs as lang}
              {@const meta = LANG_META[lang]}
              <button
                class="dp-lang-tab"
                class:active={activeLang === lang}
                role="tab"
                aria-selected={activeLang === lang}
                on:click={() => setLang(pattern.id, lang)}
                style="--lang-color: {meta.color}"
              >
                {meta.label}
              </button>
            {/each}
          </div>

          <!-- Code block -->
          <div class="dp-code-wrap">
            {#if highlighterReady && htmlCache[cacheKey]}
              {@html htmlCache[cacheKey]}
            {:else}
              <pre class="dp-code-skeleton"><code>{(pattern.examples as Record<string, string>)[activeLang]}</code></pre>
            {/if}
          </div>

          <!-- Caveats collapsible -->
          <div class="dp-caveats" class:open={isExpanded}>
            <button
              class="dp-caveats-toggle"
              on:click={() => toggleCaveat(pattern.id)}
              aria-expanded={isExpanded}
            >
              <span class="dp-caveats-label">{$t.patterns.caveatsLabel}</span>
              <svg
                class="dp-chevron"
                class:rotated={isExpanded}
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            {#if isExpanded}
              <p class="dp-caveats-text">{$t.patterns.items[pattern.id].caveats}</p>
            {/if}
          </div>

        </div>
      </article>
    {/each}
  </div>

</section>

<!-- ─── Styles ──────────────────────────────────────────────────────────────── -->

<style>
  /* ── Section ──────────────────────────────────────────────────────────────── */

  .dp-section {
    width: 100%;
    padding: 2.5rem 0 3rem;
  }

  /* ── Header ───────────────────────────────────────────────────────────────── */

  .dp-header {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .dp-title-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .dp-title-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .dp-title {
    font-family: var(--font);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-bright);
    white-space: nowrap;
    margin: 0;
  }

  .dp-subtitle {
    font-family: var(--font);
    font-size: 0.82rem;
    color: var(--text-dim);
    margin: 0;
    text-align: center;
    letter-spacing: 0.01em;
  }

  /* ── Filter pills ─────────────────────────────────────────────────────────── */

  .dp-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.25rem;
  }

  .dp-filter-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.85rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--text-dim);
    cursor: pointer;
    transition:
      color var(--t),
      border-color var(--t),
      background var(--t);
  }

  .dp-filter-pill:hover {
    color: var(--cat-color);
    border-color: color-mix(in srgb, var(--cat-color) 40%, transparent);
  }

  .dp-filter-pill.active {
    color: var(--cat-color);
    border-color: color-mix(in srgb, var(--cat-color) 50%, transparent);
    background: color-mix(in srgb, var(--cat-color) 10%, transparent);
  }

  .dp-filter-count {
    font-size: 0.67rem;
    opacity: 0.7;
  }

  /* ── Grid ─────────────────────────────────────────────────────────────────── */

  .dp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1rem;
  }

  /* ── Card ─────────────────────────────────────────────────────────────────── */

  .dp-card {
    position: relative;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    animation: fadeUp 0.38s ease both;
    transition:
      transform var(--t),
      border-color var(--t),
      box-shadow var(--t);
  }

  .dp-card:hover {
    transform: translateY(-1px);
    border-color: var(--border-3);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  }

  /* Left accent stripe */
  .dp-card-stripe {
    width: 3px;
    flex-shrink: 0;
    background: var(--accent);
    opacity: 0.85;
    transition: opacity var(--t);
  }

  .dp-card:hover .dp-card-stripe {
    opacity: 1;
  }

  /* Card inner content */
  .dp-card-inner {
    flex: 1;
    min-width: 0;
    padding: 1.125rem 1.125rem 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* ── Card header ──────────────────────────────────────────────────────────── */

  .dp-card-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .dp-pattern-name {
    font-family: var(--font);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-bright);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .dp-category-badge {
    font-family: var(--font-mono);
    font-size: 0.67rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    border: 1px solid;
    white-space: nowrap;
    flex-shrink: 0;
    transition: opacity var(--t);
  }

  /* ── Intent ───────────────────────────────────────────────────────────────── */

  .dp-intent {
    font-family: var(--font);
    font-size: 0.8rem;
    line-height: 1.55;
    color: var(--text-dim);
    font-style: italic;
    margin: 0;
  }

  /* ── When to use ──────────────────────────────────────────────────────────── */

  .dp-when {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-family: var(--font);
    font-size: 0.78rem;
    line-height: 1.5;
    color: var(--text);
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.55rem 0.7rem;
  }

  .dp-when-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--accent);
    opacity: 0.8;
  }

  /* ── Language tabs ────────────────────────────────────────────────────────── */

  .dp-lang-tabs {
    display: flex;
    gap: 0.375rem;
  }

  .dp-lang-tab {
    padding: 0.22rem 0.65rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: transparent;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.03em;
    color: var(--text-dim);
    cursor: pointer;
    transition:
      color var(--t),
      border-color var(--t),
      background var(--t);
  }

  .dp-lang-tab:hover {
    color: var(--lang-color);
    border-color: color-mix(in srgb, var(--lang-color) 45%, transparent);
  }

  .dp-lang-tab.active {
    color: var(--lang-color);
    border-color: color-mix(in srgb, var(--lang-color) 60%, transparent);
    background: color-mix(in srgb, var(--lang-color) 12%, transparent);
  }

  /* ── Code block ───────────────────────────────────────────────────────────── */

  .dp-code-wrap {
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    /* Shiki outputs a <pre> with inline background; we just clip it */
  }

  /* Override Shiki's default pre styles to blend with design */
  .dp-code-wrap :global(pre) {
    margin: 0;
    padding: 0.85rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.73rem;
    line-height: 1.65;
    overflow-x: auto;
    /* Keep shiki's background but ensure border-radius is handled by wrapper */
    border-radius: 0;
  }

  .dp-code-wrap :global(pre code) {
    font-family: inherit;
    font-size: inherit;
  }

  /* Skeleton while highlighter loads */
  .dp-code-skeleton {
    margin: 0;
    padding: 0.85rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.73rem;
    line-height: 1.65;
    color: var(--text-dim);
    background: #1e1e1e; /* match dark-plus */
    white-space: pre;
    overflow-x: auto;
  }

  /* ── Caveats collapsible ──────────────────────────────────────────────────── */

  .dp-caveats {
    border-top: 1px solid var(--border);
    margin: 0 -1.125rem;
    padding: 0 1.125rem;
  }

  .dp-caveats-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: color var(--t);
  }

  .dp-caveats-toggle:hover {
    color: var(--text);
  }

  .dp-chevron {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
    color: currentColor;
  }

  .dp-chevron.rotated {
    transform: rotate(180deg);
  }

  .dp-caveats-text {
    font-family: var(--font);
    font-size: 0.78rem;
    line-height: 1.55;
    color: var(--text-dim);
    margin: 0;
    padding-bottom: 0.75rem;
    /* Subtle red tint for warning feel */
    padding-left: 0.75rem;
    border-left: 2px solid rgba(255, 64, 96, 0.35);
  }
</style>
