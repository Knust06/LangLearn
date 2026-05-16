<script lang="ts">
  import { onMount } from 'svelte';
  import { createHighlighter } from 'shiki';
  import { t } from '$lib/stores/locale';

  // ── Constants ──────────────────────────────────────────────────────────────

  const SLUGS = ['python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'csharp'];

  const LANG_COLORS: Record<string, string> = {
    python:     '#3572A5',
    javascript: '#F1E05A',
    typescript: '#3178C6',
    go:         '#00ADD8',
    rust:       '#DEA584',
    kotlin:     '#A97BFF',
    swift:      '#F05138',
    csharp:     '#178600',
  };

  const LANG_META: Record<string, { typing: string; paradigm: string }> = {
    python:     { typing: 'dynamic',  paradigm: 'multi-paradigm' },
    javascript: { typing: 'dynamic',  paradigm: 'multi-paradigm' },
    typescript: { typing: 'static',   paradigm: 'multi-paradigm' },
    go:         { typing: 'static',   paradigm: 'concurrent'     },
    rust:       { typing: 'static',   paradigm: 'systems'        },
    kotlin:     { typing: 'static',   paradigm: 'multi-paradigm' },
    swift:      { typing: 'static',   paradigm: 'protocol-based' },
    csharp:     { typing: 'static',   paradigm: 'multi-paradigm' },
  };

  const TOPICS = [
    {
      id: 'functions',
      label: 'Functions',
      examples: {
        python: `def greet(name: str) -> str:
    return f"Hello, {name}"

# Higher-order function
def apply(fn, value):
    return fn(value)

square = lambda x: x ** 2
result = apply(square, 5)  # → 25

# Default + keyword args
def connect(host: str, port: int = 5432, *, ssl: bool = False) -> str:
    return f"{host}:{port} ssl={ssl}"`,

        javascript: `// Named function
function greet(name) {
  return \`Hello, \${name}\`;
}

// Arrow function
const square = (x) => x * x;

// Higher-order
const apply = (fn, value) => fn(value);
const result = apply(square, 5); // → 25

// Default params
function connect(host, port = 5432, { ssl = false } = {}) {
  return \`\${host}:\${port} ssl=\${ssl}\`;
}`,

        typescript: `function greet(name: string): string {
  return \`Hello, \${name}\`;
}

// Generic function
function identity<T>(value: T): T {
  return value;
}

// Higher-order
type Transform<T, U> = (value: T) => U;
const apply = <T, U>(fn: Transform<T, U>, value: T): U => fn(value);

const square = (x: number): number => x * x;
const result = apply(square, 5); // → 25`,

        go: `func greet(name string) string {
    return "Hello, " + name
}

// Multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Variadic
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}`,

        rust: `fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}

// Generic function
fn identity<T>(value: T) -> T {
    value
}

// Closures & higher-order
fn apply<T, U, F: Fn(T) -> U>(f: F, value: T) -> U {
    f(value)
}

let square = |x: i32| x * x;
let result = apply(square, 5); // → 25`,

        kotlin: `fun greet(name: String): String = "Hello, \$name"

// Extension function
fun String.shout(): String = this.uppercase() + "!"

// Higher-order
fun <T, R> apply(fn: (T) -> R, value: T): R = fn(value)

val square: (Int) -> Int = { x -> x * x }
val result = apply(square, 5) // → 25

// Default params
fun connect(host: String, port: Int = 5432, ssl: Boolean = false) =
    "\$host:\$port ssl=\$ssl"`,

        swift: `func greet(name: String) -> String {
    return "Hello, \\(name)"
}

// Generic function
func identity<T>(_ value: T) -> T { value }

// Higher-order / closures
func apply<T, U>(_ fn: (T) -> U, _ value: T) -> U {
    fn(value)
}

let square: (Int) -> Int = { $0 * $0 }
let result = apply(square, 5) // → 25

// Default params
func connect(host: String, port: Int = 5432, ssl: Bool = false) -> String {
    "\\(host):\\(port) ssl=\\(ssl)"
}`,

        csharp: `string Greet(string name) => $"Hello, {name}";

// Generic method
T Identity<T>(T value) => value;

// Higher-order
TResult Apply<T, TResult>(Func<T, TResult> fn, T value) => fn(value);

Func<int, int> square = x => x * x;
var result = Apply(square, 5); // → 25

// Optional params
string Connect(string host, int port = 5432, bool ssl = false) =>
    $"{host}:{port} ssl={ssl}";`
      }
    },
    {
      id: 'classes',
      label: 'Classes',
      examples: {
        python: `from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Animal:
    name: str
    sound: str = "..."
    _count: int = field(default=0, repr=False)

    def speak(self) -> str:
        self._count += 1
        return f"{self.name} says {self.sound}"

    @classmethod
    def from_dict(cls, d: dict) -> "Animal":
        return cls(name=d["name"], sound=d.get("sound", "..."))

class Dog(Animal):
    sound: str = "Woof"

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}"`,

        javascript: `class Animal {
  #count = 0; // private field

  constructor(name, sound = '...') {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    this.#count++;
    return \`\${this.name} says \${this.sound}\`;
  }

  static fromObject({ name, sound = '...' }) {
    return new Animal(name, sound);
  }

  get callCount() { return this.#count; }
}

class Dog extends Animal {
  constructor(name) { super(name, 'Woof'); }
  fetch(item) { return \`\${this.name} fetches the \${item}\`; }
}`,

        typescript: `class Animal {
  readonly name: string;
  protected sound: string;
  #count = 0;

  constructor(name: string, sound = '...') {
    this.name = name;
    this.sound = sound;
  }

  speak(): string {
    this.#count++;
    return \`\${this.name} says \${this.sound}\`;
  }

  static fromObject({ name, sound = '...' }: { name: string; sound?: string }): Animal {
    return new Animal(name, sound);
  }
}

class Dog extends Animal {
  constructor(name: string) { super(name, 'Woof'); }
  fetch(item: string): string { return \`\${this.name} fetches the \${item}\`; }
}`,

        go: `type Animal struct {
    Name  string
    Sound string
    count int // unexported = private
}

func NewAnimal(name, sound string) *Animal {
    return &Animal{Name: name, Sound: sound}
}

func (a *Animal) Speak() string {
    a.count++
    return a.Name + " says " + a.Sound
}

// Go uses embedding instead of inheritance
type Dog struct {
    *Animal
}

func NewDog(name string) *Dog {
    return &Dog{Animal: NewAnimal(name, "Woof")}
}

func (d *Dog) Fetch(item string) string {
    return d.Name + " fetches the " + item
}`,

        rust: `struct Animal {
    name: String,
    sound: String,
    count: u32,
}

impl Animal {
    fn new(name: &str, sound: &str) -> Self {
        Animal { name: name.to_owned(), sound: sound.to_owned(), count: 0 }
    }

    fn speak(&mut self) -> String {
        self.count += 1;
        format!("{} says {}", self.name, self.sound)
    }
}

// Traits = interfaces
trait Fetch {
    fn fetch(&self, item: &str) -> String;
}

struct Dog { animal: Animal }

impl Fetch for Dog {
    fn fetch(&self, item: &str) -> String {
        format!("{} fetches the {}", self.animal.name, item)
    }
}`,

        kotlin: `data class Animal(
    val name: String,
    val sound: String = "...",
    private var count: Int = 0
) {
    fun speak(): String {
        count++
        return "\$name says \$sound"
    }

    companion object {
        fun fromMap(m: Map<String, String>) =
            Animal(name = m["name"]!!, sound = m["sound"] ?: "...")
    }
}

class Dog(name: String) : Animal(name = name, sound = "Woof") {
    fun fetch(item: String) = "\$name fetches the \$item"
}`,

        swift: `class Animal {
    let name: String
    var sound: String
    private var count = 0

    init(name: String, sound: String = "...") {
        self.name = name
        self.sound = sound
    }

    func speak() -> String {
        count += 1
        return "\\(name) says \\(sound)"
    }
}

class Dog: Animal {
    init(name: String) { super.init(name: name, sound: "Woof") }

    func fetch(_ item: String) -> String {
        "\\(name) fetches the \\(item)"
    }
}`,

        csharp: `public class Animal {
    public string Name { get; }
    protected string Sound { get; set; }
    private int _count;

    public Animal(string name, string sound = "...") {
        Name = name; Sound = sound;
    }

    public string Speak() {
        _count++;
        return $"{Name} says {Sound}";
    }

    public static Animal FromDict(Dictionary<string, string> d) =>
        new(d["name"], d.GetValueOrDefault("sound", "..."));
}

public class Dog : Animal {
    public Dog(string name) : base(name, "Woof") {}
    public string Fetch(string item) => $"{Name} fetches the {item}";
}`
      }
    },
    {
      id: 'errors',
      label: 'Error Handling',
      examples: {
        python: `# Exceptions
class NotFoundError(ValueError):
    def __init__(self, resource: str):
        super().__init__(f"{resource} not found")
        self.resource = resource

def find_user(id: int) -> dict:
    users = {1: {"name": "Alice"}}
    if id not in users:
        raise NotFoundError(f"User#{id}")
    return users[id]

# Try / except / finally
try:
    user = find_user(42)
except NotFoundError as e:
    print(f"404: {e}")
except Exception as e:
    print(f"Unexpected: {e}")
finally:
    print("cleanup")

# Context manager
with open("file.txt") as f:
    data = f.read()`,

        javascript: `// Custom error
class NotFoundError extends Error {
  constructor(resource) {
    super(\`\${resource} not found\`);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

// Throwing
function findUser(id) {
  const users = { 1: { name: 'Alice' } };
  if (!users[id]) throw new NotFoundError(\`User#\${id}\`);
  return users[id];
}

// Try / catch / finally
try {
  const user = findUser(42);
} catch (e) {
  if (e instanceof NotFoundError) console.error('404:', e.message);
  else throw e; // re-throw unexpected
} finally {
  console.log('cleanup');
}`,

        typescript: `class NotFoundError extends Error {
  constructor(public readonly resource: string) {
    super(\`\${resource} not found\`);
    this.name = 'NotFoundError';
  }
}

// Result type pattern
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function findUser(id: number): Result<{ name: string }, NotFoundError> {
  const users: Record<number, { name: string }> = { 1: { name: 'Alice' } };
  if (!users[id]) return { ok: false, error: new NotFoundError(\`User#\${id}\`) };
  return { ok: true, value: users[id] };
}

const result = findUser(42);
if (!result.ok) console.error(result.error.message);
else console.log(result.value.name);`,

        go: `// Go: errors are values
import "errors"

type NotFoundError struct {
    Resource string
}

func (e *NotFoundError) Error() string {
    return e.Resource + " not found"
}

func findUser(id int) (map[string]string, error) {
    users := map[int]map[string]string{1: {"name": "Alice"}}
    user, ok := users[id]
    if !ok {
        return nil, &NotFoundError{Resource: fmt.Sprintf("User#%d", id)}
    }
    return user, nil
}

// Check errors explicitly
user, err := findUser(42)
if err != nil {
    var nfe *NotFoundError
    if errors.As(err, &nfe) {
        log.Printf("404: %v", nfe)
    }
}`,

        rust: `use std::fmt;

#[derive(Debug)]
struct NotFoundError { resource: String }

impl fmt::Display for NotFoundError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} not found", self.resource)
    }
}

// Result<T, E> — no exceptions
fn find_user(id: u32) -> Result<String, NotFoundError> {
    match id {
        1 => Ok("Alice".to_owned()),
        _ => Err(NotFoundError { resource: format!("User#{}", id) }),
    }
}

// Pattern-match the result
match find_user(42) {
    Ok(name) => println!("Found: {}", name),
    Err(e) => eprintln!("Error: {}", e),
}

// Propagate with ?
fn get_name(id: u32) -> Result<String, NotFoundError> {
    let name = find_user(id)?; // early-returns Err
    Ok(name.to_uppercase())
}`,

        kotlin: `class NotFoundError(val resource: String) :
    Exception("\$resource not found")

fun findUser(id: Int): Map<String, String> {
    val users = mapOf(1 to mapOf("name" to "Alice"))
    return users[id] ?: throw NotFoundError("User#\$id")
}

// Try/catch
try {
    val user = findUser(42)
    println(user["name"])
} catch (e: NotFoundError) {
    println("404: \${e.message}")
} finally {
    println("cleanup")
}

// Sealed class Result
sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Failure(val error: Exception) : Result<Nothing>()
}`,

        swift: `struct NotFoundError: Error {
    let resource: String
    var localizedDescription: String { "\\(resource) not found" }
}

// throws / try
func findUser(_ id: Int) throws -> [String: String] {
    let users = [1: ["name": "Alice"]]
    guard let user = users[id] else {
        throw NotFoundError(resource: "User#\\(id)")
    }
    return user
}

// do/catch
do {
    let user = try findUser(42)
    print(user["name"] ?? "")
} catch let e as NotFoundError {
    print("404: \\(e.localizedDescription)")
} catch {
    print("Unexpected: \\(error)")
}

// Result type
let result: Result<[String: String], NotFoundError> =
    Result { try findUser(1) }`,

        csharp: `public class NotFoundException : Exception {
    public string Resource { get; }
    public NotFoundException(string resource)
        : base($"{resource} not found") => Resource = resource;
}

// Throwing
Dictionary<string, string> FindUser(int id) {
    var users = new Dictionary<int, Dictionary<string, string>> {
        { 1, new() { ["name"] = "Alice" } }
    };
    return users.TryGetValue(id, out var user)
        ? user
        : throw new NotFoundException($"User#{id}");
}

// Try/catch/finally
try {
    var user = FindUser(42);
    Console.WriteLine(user["name"]);
} catch (NotFoundException e) {
    Console.WriteLine($"404: {e.Message}");
} finally {
    Console.WriteLine("cleanup");
}`
      }
    },
    {
      id: 'async',
      label: 'Async',
      examples: {
        python: `import asyncio
import aiohttp

async def fetch(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()

# Parallel execution
async def main():
    urls = [
        "https://api.example.com/users/1",
        "https://api.example.com/users/2",
    ]
    # Run concurrently
    results = await asyncio.gather(
        *[fetch(u) for u in urls]
    )
    return results

asyncio.run(main())

# Async generator
async def paginate(base_url: str):
    page = 1
    while True:
        data = await fetch(f"{base_url}?page={page}")
        if not data: break
        yield data
        page += 1`,

        javascript: `// async/await
async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Parallel with Promise.all
async function fetchMany(ids) {
  const results = await Promise.all(ids.map(fetchUser));
  return results;
}

// Promise chaining
fetchUser(1)
  .then(user => console.log(user.name))
  .catch(err => console.error(err));

// Async generator
async function* paginate(baseUrl) {
  let page = 1;
  while (true) {
    const data = await fetch(\`\${baseUrl}?page=\${page}\`).then(r => r.json());
    if (!data.length) return;
    yield data;
    page++;
  }
}`,

        typescript: `// Typed async
async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise<User>;
}

// Promise.all with tuple types
async function fetchPair(a: number, b: number): Promise<[User, User]> {
  return Promise.all([fetchUser(a), fetchUser(b)]);
}

// AbortController
async function fetchWithTimeout(id: number, ms = 5000): Promise<User> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(\`/api/users/\${id}\`, { signal: controller.signal });
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}`,

        go: `package main

import (
    "context"
    "encoding/json"
    "net/http"
    "golang.org/x/sync/errgroup"
)

// Goroutines + channels
func fetchUser(ctx context.Context, id int) (User, error) {
    req, _ := http.NewRequestWithContext(ctx, "GET",
        fmt.Sprintf("/api/users/%d", id), nil)
    resp, err := http.DefaultClient.Do(req)
    if err != nil { return User{}, err }
    defer resp.Body.Close()
    var u User
    return u, json.NewDecoder(resp.Body).Decode(&u)
}

// Parallel with errgroup
func fetchMany(ctx context.Context, ids []int) ([]User, error) {
    g, ctx := errgroup.WithContext(ctx)
    users := make([]User, len(ids))
    for i, id := range ids {
        i, id := i, id // capture loop vars
        g.Go(func() error {
            u, err := fetchUser(ctx, id)
            users[i] = u
            return err
        })
    }
    return users, g.Wait()
}`,

        rust: `use tokio;
use reqwest::Client;

// async fn returns impl Future
async fn fetch_user(client: &Client, id: u32) -> anyhow::Result<User> {
    let user: User = client
        .get(format!("https://api.example.com/users/{}", id))
        .send().await?
        .error_for_status()?
        .json().await?;
    Ok(user)
}

// Concurrent with join!
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = Client::new();

    // Run two requests in parallel
    let (a, b) = tokio::try_join!(
        fetch_user(&client, 1),
        fetch_user(&client, 2)
    )?;

    println!("{} {}", a.name, b.name);
    Ok(())
}`,

        kotlin: `import kotlinx.coroutines.*

suspend fun fetchUser(id: Int): User {
    return withContext(Dispatchers.IO) {
        // HTTP call
        httpClient.get("/api/users/\$id")
    }
}

// Parallel with async/await
suspend fun fetchMany(ids: List<Int>): List<User> = coroutineScope {
    ids.map { id -> async { fetchUser(id) } }
       .awaitAll()
}

// Flow — reactive async streams
fun userStream(ids: List<Int>): Flow<User> = flow {
    for (id in ids) {
        emit(fetchUser(id))
    }
}.flowOn(Dispatchers.IO)

// Launch fire-and-forget
fun main() = runBlocking {
    launch { println(fetchUser(1).name) }
    launch { println(fetchUser(2).name) }
}`,

        swift: `import Foundation

// async/await (Swift 5.5+)
func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, response) = try await URLSession.shared.data(from: url)
    guard (response as? HTTPURLResponse)?.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }
    return try JSONDecoder().decode(User.self, from: data)
}

// Parallel with async let
func fetchPair(a: Int, b: Int) async throws -> (User, User) {
    async let userA = fetchUser(id: a)
    async let userB = fetchUser(id: b)
    return try await (userA, userB)
}

// Task groups
func fetchAll(ids: [Int]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids { group.addTask { try await fetchUser(id: id) } }
        return try await group.reduce(into: []) { $0.append($1) }
    }
}`,

        csharp: `using System.Net.Http.Json;

// async/await
async Task<User> FetchUserAsync(int id, CancellationToken ct = default) {
    var user = await _http.GetFromJsonAsync<User>($"/api/users/{id}", ct);
    return user ?? throw new InvalidOperationException("null response");
}

// Parallel with Task.WhenAll
async Task<User[]> FetchManyAsync(IEnumerable<int> ids) {
    var tasks = ids.Select(id => FetchUserAsync(id));
    return await Task.WhenAll(tasks);
}

// Async stream (IAsyncEnumerable)
async IAsyncEnumerable<User> PaginateAsync(string baseUrl) {
    int page = 1;
    while (true) {
        var users = await _http.GetFromJsonAsync<User[]>($"{baseUrl}?page={page}");
        if (users is null || users.Length == 0) yield break;
        foreach (var u in users) yield return u;
        page++;
    }
}`
      }
    },
    {
      id: 'generics',
      label: 'Generics',
      examples: {
        python: `from typing import TypeVar, Generic, Callable, Iterable

T = TypeVar("T")
U = TypeVar("U")

# Generic class
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

    def peek(self) -> T:
        return self._items[-1]

# Generic functions
def map_list(fn: Callable[[T], U], items: Iterable[T]) -> list[U]:
    return [fn(x) for x in items]

def filter_list(pred: Callable[[T], bool], items: Iterable[T]) -> list[T]:
    return [x for x in items if pred(x)]

nums = [1, 2, 3, 4]
doubled = map_list(lambda x: x * 2, nums)  # [2, 4, 6, 8]`,

        javascript: `// JS is dynamically typed — generics are just comments/docs
// Use JSDoc for type hints

/**
 * @template T
 * @param {T[]} items
 * @returns {T | undefined}
 */
function last(items) {
  return items[items.length - 1];
}

// Generic-like higher-order functions (built-in)
const doubled = [1, 2, 3].map(x => x * 2);     // [2, 4, 6]
const evens   = [1, 2, 3, 4].filter(x => x % 2 === 0); // [2, 4]
const sum     = [1, 2, 3].reduce((acc, x) => acc + x, 0); // 6

// Class "generic" via composition
class Stack {
  #items = [];
  push(item) { this.#items.push(item); }
  pop()  { return this.#items.pop(); }
  peek() { return this.#items.at(-1); }
  get size() { return this.#items.length; }
}`,

        typescript: `// Generic class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items.at(-1); }
  get size(): number { return this.items.length; }
}

// Constrained generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Partial<T>  = { [K in keyof T]?: T[K] };

// Utility usage
type User = { id: number; name: string };
const draft: Partial<User> = { name: 'Alice' }; // id is optional`,

        go: `// Go generics (1.18+)

// Generic Stack
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, true
}

// Generic function with constraint
type Number interface { ~int | ~float64 }

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

total := Sum([]int{1, 2, 3, 4}) // 10`,

        rust: `// Rust generics with traits as constraints

struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self { Stack { items: Vec::new() } }
    fn push(&mut self, item: T) { self.items.push(item); }
    fn pop(&mut self) -> Option<T> { self.items.pop() }
    fn peek(&self) -> Option<&T> { self.items.last() }
}

// Trait bounds
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list { if item > largest { largest = item; } }
    largest
}

// Where clauses
fn print_pair<T, U>(a: T, b: U)
where T: std::fmt::Display, U: std::fmt::Debug
{
    println!("{} {:?}", a, b);
}`,

        kotlin: `// Generic class
class Stack<T> {
    private val items = mutableListOf<T>()

    fun push(item: T) = items.add(item)
    fun pop(): T? = if (items.isEmpty()) null else items.removeLast()
    fun peek(): T? = items.lastOrNull()
    val size get() = items.size
}

// Constrained generics (upper bound)
fun <T : Comparable<T>> largest(list: List<T>): T =
    list.reduce { max, item -> if (item > max) item else max }

// Reified type params (inline functions)
inline fun <reified T> Iterable<*>.filterIsInstance(): List<T> =
    filterIsInstance(T::class.java)

// Variance: out (covariant), in (contravariant)
interface Producer<out T> { fun produce(): T }
interface Consumer<in T> { fun consume(item: T) }`,

        swift: `// Generic struct
struct Stack<T> {
    private var items: [T] = []

    mutating func push(_ item: T) { items.append(item) }
    mutating func pop() -> T? { items.popLast() }
    func peek() -> T? { items.last }
    var isEmpty: Bool { items.isEmpty }
}

// Constrained generics (where clause)
func largest<T: Comparable>(_ list: [T]) -> T? {
    list.max()
}

// Protocol with associated type
protocol Container {
    associatedtype Item
    var count: Int { get }
    func item(at index: Int) -> Item
}

// Generic where for multiple constraints
extension Array where Element: Equatable & Hashable {
    var unique: [Element] {
        Array(Set(self))
    }
}`,

        csharp: `// Generic class
public class Stack<T> {
    private readonly List<T> _items = new();

    public void Push(T item) => _items.Add(item);
    public T? Pop() {
        if (_items.Count == 0) return default;
        var item = _items[^1]; _items.RemoveAt(_items.Count - 1);
        return item;
    }
    public T? Peek() => _items.Count > 0 ? _items[^1] : default;
}

// Constrained generics
T Largest<T>(IEnumerable<T> items) where T : IComparable<T>
    => items.Aggregate((max, x) => x.CompareTo(max) > 0 ? x : max);

// Covariance / contravariance
IEnumerable<string> strings = new List<string>(); // covariant
Action<object> action = (object o) => {};          // contravariant

// Delegate generics
Func<int, string> toStr = x => x.ToString();
Action<string> print = Console.WriteLine;`
      }
    },
    {
      id: 'collections',
      label: 'Collections',
      examples: {
        python: `# List, dict, set, tuple

# List comprehension
squares = [x**2 for x in range(10) if x % 2 == 0]

# Dict comprehension
word_len = {word: len(word) for word in ["hello", "world"]}

# Set operations
a, b = {1, 2, 3}, {2, 3, 4}
print(a & b)  # {2, 3}
print(a | b)  # {1, 2, 3, 4}
print(a - b)  # {1}

# Useful patterns
from collections import defaultdict, Counter
freq = Counter("hello world")  # {'l': 3, 'o': 2, ...}
graph = defaultdict(list)

# Sort with key
users = [{"name": "Bob", "age": 30}, {"name": "Alice", "age": 25}]
sorted_users = sorted(users, key=lambda u: u["age"])

# Unpack / spread
first, *rest = [1, 2, 3, 4]  # first=1, rest=[2,3,4]`,

        javascript: `// Array methods
const nums = [1, 2, 3, 4, 5];

const doubled  = nums.map(x => x * 2);        // [2,4,6,8,10]
const evens    = nums.filter(x => x % 2 === 0);// [2,4]
const sum      = nums.reduce((a, x) => a + x, 0); // 15
const hasThree = nums.some(x => x === 3);       // true

// Object as map
const freq = {};
for (const ch of 'hello') freq[ch] = (freq[ch] ?? 0) + 1;

// Map / Set
const map = new Map([['a', 1], ['b', 2]]);
const set = new Set([1, 2, 2, 3]); // {1,2,3}

// Spread / destructuring
const [first, ...rest] = nums;
const merged = [...nums, 6, 7];
const { a, b, ...remaining } = { a: 1, b: 2, c: 3, d: 4 };`,

        typescript: `// Typed collections
const nums: number[] = [1, 2, 3, 4, 5];

// Readonly arrays
const frozen: ReadonlyArray<number> = [1, 2, 3];

// Map and Set with types
const freq = new Map<string, number>();
'hello'.split('').forEach(ch =>
  freq.set(ch, (freq.get(ch) ?? 0) + 1)
);

// Record<K, V> utility type
const routes: Record<string, () => void> = {
  '/home': () => renderHome(),
  '/about': () => renderAbout(),
};

// Tuple types
type RGB = [number, number, number];
const red: RGB = [255, 0, 0];
const [r, g, b] = red;

// Discriminated union + array
type Shape = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number };
const shapes: Shape[] = [{ kind: 'circle', r: 5 }];`,

        go: `// Slices (dynamic arrays)
nums := []int{1, 2, 3, 4, 5}
nums = append(nums, 6)

// Slice operations
first := nums[0]
last  := nums[len(nums)-1]
sub   := nums[1:3] // [2, 3] — shares memory

// Maps
freq := make(map[string]int)
for _, ch := range "hello" {
    freq[string(ch)]++
}

// Check existence
val, ok := freq["l"]
if ok { fmt.Println(val) }

// Delete
delete(freq, "l")

// Sort
import "sort"
sort.Slice(nums, func(i, j int) bool { return nums[i] < nums[j] })

// Struct slice + sort by field
sort.Slice(users, func(i, j int) bool {
    return users[i].Age < users[j].Age
})`,

        rust: `use std::collections::{HashMap, HashSet, BTreeMap};

// Vec (dynamic array)
let mut nums: Vec<i32> = vec![1, 2, 3, 4, 5];
nums.push(6);

// Iterators (lazy)
let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();
let evens: Vec<&i32> = nums.iter().filter(|&&x| x % 2 == 0).collect();
let sum: i32 = nums.iter().sum();

// HashMap
let mut freq: HashMap<char, u32> = HashMap::new();
for ch in "hello".chars() {
    *freq.entry(ch).or_insert(0) += 1;
}

// HashSet
let a: HashSet<i32> = [1, 2, 3].iter().cloned().collect();
let b: HashSet<i32> = [2, 3, 4].iter().cloned().collect();
let intersection: HashSet<&i32> = a.intersection(&b).collect();`,

        kotlin: `// List, Map, Set (immutable by default)

val nums = listOf(1, 2, 3, 4, 5)

// Functional operations
val doubled = nums.map { it * 2 }         // [2,4,6,8,10]
val evens   = nums.filter { it % 2 == 0 } // [2,4]
val sum     = nums.sum()                   // 15

// groupBy
val byParity = nums.groupBy { if (it % 2 == 0) "even" else "odd" }

// Mutable collections
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)

val freq = mutableMapOf<Char, Int>()
for (ch in "hello") freq[ch] = (freq[ch] ?: 0) + 1

// Destructuring
val (first, second) = listOf(1, 2, 3)

// Sequence (lazy evaluation, like Rust iterators)
val result = generateSequence(1) { it + 1 }
    .filter { it % 2 == 0 }
    .take(5)
    .toList() // [2, 4, 6, 8, 10]`,

        swift: `// Array, Dictionary, Set

var nums = [1, 2, 3, 4, 5]
nums.append(6)

// Functional operations
let doubled = nums.map { $0 * 2 }
let evens   = nums.filter { $0 % 2 == 0 }
let sum     = nums.reduce(0, +)

// Dictionary
var freq: [Character: Int] = [:]
for ch in "hello" { freq[ch, default: 0] += 1 }

// Set operations
let a: Set = [1, 2, 3]
let b: Set = [2, 3, 4]
let inter   = a.intersection(b)   // {2,3}
let union   = a.union(b)          // {1,2,3,4}
let diff    = a.subtracting(b)    // {1}

// Sort
let sorted = nums.sorted { $0 < $1 }
let sortedUsers = users.sorted { $0.age < $1.age }

// Zip
let zipped = zip(["a", "b"], [1, 2]).map { ($0, $1) }`,

        csharp: `using System.Linq;

var nums = new List<int> { 1, 2, 3, 4, 5 };

// LINQ operations
var doubled = nums.Select(x => x * 2).ToList();
var evens   = nums.Where(x => x % 2 == 0).ToList();
var sum     = nums.Sum();
var any3    = nums.Any(x => x == 3);

// Dictionary
var freq = new Dictionary<char, int>();
foreach (var ch in "hello")
    freq[ch] = freq.GetValueOrDefault(ch) + 1;

// HashSet
var setA = new HashSet<int> { 1, 2, 3 };
var setB = new HashSet<int> { 2, 3, 4 };
setA.IntersectWith(setB); // mutates: {2,3}

// LINQ groupBy
var byParity = nums
    .GroupBy(x => x % 2 == 0 ? "even" : "odd")
    .ToDictionary(g => g.Key, g => g.ToList());

// Deconstruct tuple
var (first, second) = (nums[0], nums[1]);`
      }
    }
  ];

  // ── State ──────────────────────────────────────────────────────────────────

  let selected: string[] = ['python', 'javascript', 'typescript'];
  let selectedTopic: string = 'functions';
  let highlighter: any = null;
  let htmlMap: Record<string, string> = {};

  // ── Shiki ─────────────────────────────────────────────────────────────────

  onMount(async () => {
    highlighter = await createHighlighter({
      themes: ['dark-plus'],
      langs: ['python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'csharp'],
    });
    renderAll();
  });

  function renderAll() {
    if (!highlighter) return;
    const newMap: Record<string, string> = {};
    for (const slug of selected) {
      const topic = TOPICS.find(t => t.id === selectedTopic);
      const code = (topic?.examples as any)?.[slug] ?? '';
      const lang = slug === 'csharp' ? 'csharp' : slug;
      newMap[slug] = highlighter.codeToHtml(code, { lang, theme: 'dark-plus' });
    }
    htmlMap = newMap;
  }

  $: if (highlighter) { selected; selectedTopic; renderAll(); }

  $: topicLabels = {
    functions:   $t.comparator.topics.functions,
    classes:     $t.comparator.topics.classes,
    errors:      $t.comparator.topics.errors,
    async:       $t.comparator.topics.async,
    generics:    $t.comparator.topics.generics,
    collections: $t.comparator.topics.collections,
  } as Record<string, string>;

  // ── Interaction ────────────────────────────────────────────────────────────

  function toggle(slug: string) {
    if (selected.includes(slug)) {
      if (selected.length > 2) selected = selected.filter(s => s !== slug);
    } else if (selected.length < 3) {
      selected = [...selected, slug];
    }
  }

  function selectTopic(id: string) {
    selectedTopic = id;
  }
</script>

<div class="comparator">

  <!-- ── Language selector ── -->
  <div class="selector" role="group" aria-label="Select languages to compare">
    <div class="selector-pills">
      {#each SLUGS as slug}
        {@const lc = LANG_COLORS[slug] ?? 'var(--cyan)'}
        {@const isActive = selected.includes(slug)}
        {@const isDisabled = !isActive && selected.length >= 3}
        <button
          class="pill"
          class:active={isActive}
          class:disabled={isDisabled}
          on:click={() => toggle(slug)}
          aria-pressed={isActive}
          disabled={isDisabled}
          style="--lc:{lc}"
        >
          <span class="pill-dot" style="background:{lc}"></span>
          <span class="pill-name">{slug}</span>
        </button>
      {/each}
    </div>
    <span class="selector-hint">
      <span class="hint-count">{selected.length}</span>{$t.comparator.hint}
    </span>
  </div>

  <!-- ── Topic tabs ── -->
  <div class="tabs-wrapper" role="tablist" aria-label="Code topics">
    <div class="tabs-scroll">
      {#each TOPICS as topic}
        <button
          class="tab"
          class:active={selectedTopic === topic.id}
          role="tab"
          aria-selected={selectedTopic === topic.id}
          on:click={() => selectTopic(topic.id)}
        >
          {topicLabels[topic.id] ?? topic.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- ── Code columns ── -->
  <div class="columns" style="--cols:{selected.length}">
    {#each selected as slug, i (slug)}
      {@const lc = LANG_COLORS[slug] ?? '#00D9FF'}
      {@const meta = LANG_META[slug]}
      {@const html = htmlMap[slug]}
      <div
        class="column"
        style="--lc:{lc}; animation-delay:{i * 70}ms"
        role="tabpanel"
      >
        <!-- Column header -->
        <div class="col-header">
          <div class="col-accent-bar" style="background:{lc}"></div>
          <div class="col-header-content">
            <div class="col-title-row">
              <h2 class="col-title" style="color:{lc}">{slug}</h2>
              {#if meta}
                <span class="badge badge-typing" class:static={meta.typing === 'static'} class:dynamic={meta.typing === 'dynamic'}>
                  {meta.typing}
                </span>
              {/if}
            </div>
            {#if meta}
              <span class="col-paradigm">{meta.paradigm}</span>
            {/if}
          </div>
        </div>

        <!-- Code area -->
        <div class="code-area">
          {#if html}
            {@html html}
          {:else}
            <div class="skeleton-code">
              <div class="sk-line" style="width:60%"></div>
              <div class="sk-line" style="width:82%"></div>
              <div class="sk-line" style="width:45%"></div>
              <div class="sk-gap"></div>
              <div class="sk-line" style="width:72%"></div>
              <div class="sk-line" style="width:90%"></div>
              <div class="sk-line" style="width:55%"></div>
              <div class="sk-gap"></div>
              <div class="sk-line" style="width:68%"></div>
              <div class="sk-line" style="width:78%"></div>
              <div class="sk-line" style="width:40%"></div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

</div>

<style>
  /* ── Shell ── */
  .comparator {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Selector ── */
  .selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
    animation: fadeUp 0.3s var(--t) both;
  }

  .selector-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .pill {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.38rem 0.8rem 0.38rem 0.6rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 0.78rem;
    cursor: pointer;
    transition:
      background var(--t),
      border-color var(--t),
      color var(--t),
      box-shadow var(--t),
      transform 0.12s var(--t),
      opacity var(--t);
    user-select: none;
    letter-spacing: 0.02em;
  }

  .pill:hover:not(.disabled):not(:disabled) {
    background: var(--surface-3);
    border-color: var(--border-2);
    color: var(--text);
    transform: translateY(-1px);
  }

  .pill.active {
    background: color-mix(in srgb, var(--lc) 12%, transparent);
    border-color: color-mix(in srgb, var(--lc) 40%, transparent);
    color: var(--lc);
    box-shadow: 0 0 12px color-mix(in srgb, var(--lc) 16%, transparent);
  }

  .pill.active:hover {
    box-shadow: 0 0 20px color-mix(in srgb, var(--lc) 26%, transparent);
    transform: translateY(-1px);
  }

  .pill.disabled,
  .pill:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  .pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 0.85;
    transition: opacity var(--t);
  }

  .pill.active .pill-dot {
    opacity: 1;
    box-shadow: 0 0 6px var(--lc);
  }

  .pill-name {
    line-height: 1;
  }

  .selector-hint {
    font-family: var(--font);
    font-size: 0.73rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
    white-space: nowrap;
  }

  .hint-count {
    color: var(--cyan);
    font-weight: 700;
  }

  /* ── Topic tabs ── */
  .tabs-wrapper {
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
    animation: fadeUp 0.35s 0.05s var(--t) both;
  }

  .tabs-scroll {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0;
  }

  .tabs-scroll::-webkit-scrollbar {
    display: none;
  }

  .tab {
    flex-shrink: 0;
    padding: 0.65rem 1.1rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    color: var(--text-dim);
    font-family: var(--font);
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition:
      color var(--t),
      background var(--t),
      border-color var(--t),
      transform 0.12s var(--t);
    white-space: nowrap;
  }

  .tab:hover:not(.active) {
    color: var(--text);
    background: var(--surface-2);
    transform: translateY(-1px);
  }

  .tab.active {
    color: var(--text-bright);
    background: var(--surface-2);
    border-bottom-color: var(--cyan);
    font-weight: 600;
  }

  /* ── Columns grid ── */
  .columns {
    display: grid;
    grid-template-columns: repeat(var(--cols, 2), 1fr);
    gap: 1.25rem;
    align-items: start;
  }

  /* ── Single column card ── */
  .column {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    animation: fadeUp 0.42s var(--t) both;
    display: flex;
    flex-direction: column;
  }

  .col-header {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--border);
  }

  .col-accent-bar {
    width: 3px;
    flex-shrink: 0;
  }

  .col-header-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.15rem;
    padding: 0.75rem 1rem 0.75rem 0.9rem;
    flex: 1;
    min-width: 0;
  }

  .col-title-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .col-title {
    font-family: var(--font);
    font-size: 0.95rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.2;
    text-transform: capitalize;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.12em 0.45em;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1.5;
    text-transform: uppercase;
  }

  .badge.static {
    background: rgba(0, 229, 153, 0.1);
    color: var(--green);
    border: 1px solid rgba(0, 229, 153, 0.25);
  }

  .badge.dynamic {
    background: rgba(241, 224, 90, 0.1);
    color: #F1E05A;
    border: 1px solid rgba(241, 224, 90, 0.25);
  }

  .col-paradigm {
    font-family: var(--font);
    font-size: 0.7rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Code area ── */
  .code-area {
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    overflow: hidden;
    flex: 1;
  }

  /* Shiki injects a <pre> with inline background — strip its margin and enforce radius */
  .code-area :global(pre) {
    margin: 0 !important;
    border-radius: 0 !important;
    padding: 1.1rem 1.25rem !important;
    font-family: var(--font-mono) !important;
    font-size: 0.78rem !important;
    line-height: 1.65 !important;
    tab-size: 2 !important;
    overflow-x: auto;
  }

  .code-area :global(pre code) {
    font-family: inherit !important;
    font-size: inherit !important;
    background: none !important;
  }

  /* ── Skeleton shimmer ── */
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .skeleton-code {
    padding: 1.1rem 1.25rem;
    background: #1e1e1e; /* match dark-plus bg */
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .sk-line {
    height: 0.72rem;
    border-radius: 3px;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.09) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    margin-bottom: 0.55rem;
  }

  .sk-gap {
    height: 0.9rem;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .columns {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 600px) {
    .columns {
      grid-template-columns: 1fr !important;
    }

    .selector {
      gap: 0.5rem;
    }

    .tab {
      padding: 0.55rem 0.8rem;
      font-size: 0.78rem;
    }
  }
</style>
