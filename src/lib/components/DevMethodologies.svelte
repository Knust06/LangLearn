<script lang="ts">
  import { onMount } from 'svelte';
  import { createHighlighter } from 'shiki';
  import { t, locale } from '$lib/stores/locale';
  import type { Locale } from '$lib/stores/locale';

  // ── Types ──────────────────────────────────────────────────────────────────

  interface Snippet { lang: string; label: string; code: string; }
  interface I18nEntry {
    tagline: string;
    description: string;
    principles: string[];
    cycle: string[];
  }
  interface Methodology {
    id: string;
    acronym: string;
    name: string;
    namePt: string;
    color: string;
    i18n: { en: I18nEntry; pt: I18nEntry };
    snippets: Snippet[];
  }

  // ── Data ───────────────────────────────────────────────────────────────────

  const METHODOLOGIES: Methodology[] = [
    {
      id: 'tdd',
      acronym: 'TDD',
      name: 'Test-Driven Development',
      namePt: 'Desenvolvimento Guiado por Testes',
      color: '#00E599',
      i18n: {
        en: {
          tagline: 'Red → Green → Refactor',
          description: 'Write a failing test first, then write the minimum code to make it pass, then refactor. Tests drive the design.',
          principles: ['Write tests before code', 'Smallest step to green', 'Refactor with confidence', 'Fast feedback loop'],
          cycle: ['🔴 Write a failing test', '🟢 Write minimal code', '🔵 Refactor', '↩ Repeat'],
        },
        pt: {
          tagline: 'Vermelho → Verde → Refatorar',
          description: 'Escreva um teste que falha primeiro, depois o código mínimo para fazê-lo passar e então refatore. Os testes guiam o design.',
          principles: ['Escrever testes antes do código', 'Menor passo para o verde', 'Refatorar com confiança', 'Ciclo de feedback rápido'],
          cycle: ['🔴 Escrever teste falhando', '🟢 Implementar o mínimo', '🔵 Refatorar', '↩ Repetir'],
        },
      },
      snippets: [
        {
          lang: 'typescript', label: 'TypeScript',
          code: `// 1. RED — write failing test
describe('Stack', () => {
  it('should return undefined when popping empty stack', () => {
    const stack = new Stack<number>();
    expect(stack.pop()).toBeUndefined();
  });

  it('should pop the last pushed value', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
  });
});

// 2. GREEN — minimal implementation
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

// 3. REFACTOR — add size limit, improve types...`
        },
        {
          lang: 'csharp', label: 'C#',
          code: `// 1. RED — write failing test (xUnit)
public class StackTests {
    [Fact]
    public void Pop_EmptyStack_ReturnsDefault() {
        var stack = new Stack<int>();
        Assert.Equal(default, stack.Pop());
    }

    [Fact]
    public void Pop_ReturnsLastPushedValue() {
        var stack = new Stack<int>();
        stack.Push(1);
        stack.Push(2);
        Assert.Equal(2, stack.Pop());
    }

    [Fact]
    public void Push_IncreasesSize() {
        var stack = new Stack<int>();
        stack.Push(42);
        Assert.Equal(1, stack.Size);
    }
}

// 2. GREEN — minimal implementation
public class Stack<T> {
    private readonly List<T> _items = new();
    public int Size => _items.Count;
    public void Push(T item) => _items.Add(item);
    public T? Pop() {
        if (_items.Count == 0) return default;
        var item = _items[^1];
        _items.RemoveAt(_items.Count - 1);
        return item;
    }
}

// 3. REFACTOR — add capacity, thread safety...`
        }
      ]
    },
    {
      id: 'bdd',
      acronym: 'BDD',
      name: 'Behavior-Driven Development',
      namePt: 'Desenvolvimento Guiado por Comportamento',
      color: '#00D9FF',
      i18n: {
        en: {
          tagline: 'Given · When · Then',
          description: 'An extension of TDD using natural language specifications. Tests read like business requirements, bridging technical and non-technical stakeholders.',
          principles: ['Business-readable tests', 'Shared ubiquitous language', 'Outside-in development', 'Focus on behavior, not implementation'],
          cycle: ['📋 Write scenario in plain English', '🤝 Share with stakeholders', '🧪 Automate as tests', '✅ Implement to pass'],
        },
        pt: {
          tagline: 'Dado · Quando · Então',
          description: 'Uma extensão do TDD com especificações em linguagem natural. Os testes leem como requisitos de negócio, aproximando técnicos e não-técnicos.',
          principles: ['Testes legíveis pelo negócio', 'Linguagem ubíqua compartilhada', 'Desenvolvimento outside-in', 'Foco em comportamento, não implementação'],
          cycle: ['📋 Escrever cenário em português', '🤝 Validar com stakeholders', '🧪 Automatizar como testes', '✅ Implementar para passar'],
        },
      },
      snippets: [
        {
          lang: 'typescript', label: 'TypeScript',
          code: `// Feature: User authentication
// Scenario: Successful login

describe('User login', () => {
  // GIVEN
  beforeEach(async () => {
    await db.seed({ users: [{ email: 'alice@example.com', password: 'hashed' }] });
  });

  // WHEN + THEN
  it('given valid credentials, when logging in, then returns a JWT token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'secret' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token).toMatch(/^eyJ/); // JWT prefix
  });

  it('given invalid password, when logging in, then returns 401', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});`
        },
        {
          lang: 'csharp', label: 'C#',
          code: `// Feature: User authentication
// Scenario: Successful login (NUnit + FluentAssertions)
[TestFixture]
public class UserLoginTests {
    private WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    [SetUp]
    public async Task GivenAUserExists() {
        _factory = new WebApplicationFactory<Program>();
        _client  = _factory.CreateClient();
        await _factory.Services
            .GetRequiredService<IDatabase>()
            .SeedAsync(new User {
                Email        = "alice@example.com",
                PasswordHash = BCrypt.HashPassword("secret")
            });
    }

    // WHEN + THEN
    [Test]
    public async Task WhenValidCredentials_ThenReturnsJwtToken() {
        var res = await _client.PostAsJsonAsync("/auth/login", new {
            Email    = "alice@example.com",
            Password = "secret"
        });

        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await res.Content.ReadFromJsonAsync<LoginResponse>();
        body!.Token.Should().StartWith("eyJ"); // JWT prefix
    }

    [Test]
    public async Task WhenWrongPassword_ThenReturns401() {
        var res = await _client.PostAsJsonAsync("/auth/login", new {
            Email    = "alice@example.com",
            Password = "wrong"
        });

        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var body = await res.Content.ReadFromJsonAsync<ErrorResponse>();
        body!.Message.Should().Be("Invalid credentials");
    }

    [TearDown]
    public void Cleanup() => _factory.Dispose();
}`
        }
      ]
    },
    {
      id: 'ddd',
      acronym: 'DDD',
      name: 'Domain-Driven Design',
      namePt: 'Design Orientado ao Domínio',
      color: '#A97BFF',
      i18n: {
        en: {
          tagline: 'Model the business, not the database',
          description: 'Structure software around the business domain. The code reflects real-world concepts and rules. Ubiquitous language shared between developers and domain experts.',
          principles: ['Ubiquitous language', 'Bounded contexts', 'Rich domain models', 'Aggregates & entities', 'Domain events'],
          cycle: ['🗺 Model the domain', '🏗 Define bounded contexts', '💎 Build rich aggregates', '📡 Emit domain events'],
        },
        pt: {
          tagline: 'Modele o negócio, não o banco de dados',
          description: 'Estruture o software em torno do domínio de negócio. O código reflete conceitos e regras do mundo real. Linguagem ubíqua compartilhada entre devs e especialistas do domínio.',
          principles: ['Linguagem ubíqua', 'Contextos delimitados', 'Modelos de domínio ricos', 'Agregados e entidades', 'Eventos de domínio'],
          cycle: ['🗺 Modelar o domínio', '🏗 Definir contextos delimitados', '💎 Construir agregados ricos', '📡 Emitir eventos de domínio'],
        },
      },
      snippets: [
        {
          lang: 'typescript', label: 'TypeScript',
          code: `// Domain Entity — rich model, not anemic
class Order {
  private readonly id: OrderId;
  private items: OrderItem[] = [];
  private status: OrderStatus = OrderStatus.Draft;

  constructor(id: OrderId, private readonly customerId: CustomerId) {
    this.id = id;
  }

  addItem(product: Product, quantity: Quantity): void {
    if (this.status !== OrderStatus.Draft)
      throw new DomainError('Cannot modify a submitted order');

    const existing = this.items.find(i => i.productId.equals(product.id));
    if (existing) existing.increaseQuantity(quantity);
    else this.items.push(new OrderItem(product.id, product.price, quantity));
  }

  submit(): DomainEvent[] {
    if (this.items.length === 0)
      throw new DomainError('Order must have at least one item');

    this.status = OrderStatus.Submitted;
    return [new OrderSubmitted(this.id, this.customerId, this.totalAmount())];
  }

  private totalAmount(): Money {
    return this.items.reduce((sum, i) => sum.add(i.subtotal()), Money.zero());
  }
}`
        },
        {
          lang: 'csharp', label: 'C#',
          code: `// Domain Entity — rich model, not anemic
public class Order : AggregateRoot {
    private readonly List<OrderItem> _items = new();
    public OrderId     Id         { get; }
    public CustomerId  CustomerId { get; }
    public OrderStatus Status     { get; private set; } = OrderStatus.Draft;

    public Order(OrderId id, CustomerId customerId) {
        Id = id; CustomerId = customerId;
    }

    public void AddItem(Product product, Quantity quantity) {
        if (Status != OrderStatus.Draft)
            throw new DomainException("Cannot modify a submitted order");

        var existing = _items.FirstOrDefault(i => i.ProductId == product.Id);
        if (existing is not null) existing.IncreaseQuantity(quantity);
        else _items.Add(new OrderItem(product.Id, product.Price, quantity));
    }

    public void Submit() {
        if (!_items.Any())
            throw new DomainException("Order must have at least one item");

        Status = OrderStatus.Submitted;
        AddDomainEvent(new OrderSubmitted(Id, CustomerId, TotalAmount()));
    }

    private Money TotalAmount() =>
        _items.Aggregate(Money.Zero, (sum, i) => sum + i.Subtotal());
}

// Value Object
public record Money(decimal Amount, string Currency) {
    public static Money Zero => new(0, "USD");
    public static Money operator +(Money a, Money b) {
        if (a.Currency != b.Currency) throw new DomainException("Currency mismatch");
        return new(a.Amount + b.Amount, a.Currency);
    }
}`
        }
      ]
    },
    {
      id: 'solid',
      acronym: 'SOLID',
      name: 'SOLID Principles',
      namePt: 'Princípios SOLID',
      color: '#F05138',
      i18n: {
        en: {
          tagline: '5 principles of OOP design',
          description: 'Five foundational principles that make software designs more understandable, flexible, and maintainable. Each letter is a separate rule.',
          principles: [
            'S — Single Responsibility: one reason to change',
            'O — Open/Closed: open for extension, closed for modification',
            'L — Liskov Substitution: subtypes must be substitutable',
            'I — Interface Segregation: no fat interfaces',
            'D — Dependency Inversion: depend on abstractions',
          ],
          cycle: ['📐 Design classes', '🔍 Check each principle', '♻️ Refactor violations', '✅ Verify extensibility'],
        },
        pt: {
          tagline: '5 princípios de design OOP',
          description: 'Cinco princípios fundamentais que tornam os designs de software mais compreensíveis, flexíveis e manuteníveis. Cada letra é uma regra separada.',
          principles: [
            'S — Responsabilidade Única: uma razão para mudar',
            'O — Aberto/Fechado: aberto para extensão, fechado para modificação',
            'L — Substituição de Liskov: subtipos devem ser substituíveis',
            'I — Segregação de Interface: sem interfaces gordas',
            'D — Inversão de Dependência: dependa de abstrações',
          ],
          cycle: ['📐 Projetar classes', '🔍 Verificar cada princípio', '♻️ Refatorar violações', '✅ Validar extensibilidade'],
        },
      },
      snippets: [
        {
          lang: 'typescript', label: 'TypeScript',
          code: `// ❌ Violates SRP — Report knows too much
class Report {
  generate(): string { return 'data'; }
  saveToFile(path: string): void { /* file I/O */ }
  sendEmail(to: string): void { /* SMTP */ }
}

// ✅ Single Responsibility
class ReportGenerator { generate(): string { return 'data'; } }
class ReportExporter  { save(r: string, path: string): void {} }
class ReportMailer    { send(r: string, to: string): void {}  }

// ✅ Open/Closed — add formats without modifying existing code
interface Formatter { format(data: string): string; }
class JsonFormatter implements Formatter {
  format(d: string) { return JSON.stringify({ data: d }); }
}
class CsvFormatter implements Formatter {
  format(d: string) { return \`"data","value"\\n"\${d}"\`; }
}
// Add XmlFormatter without touching JsonFormatter or CsvFormatter

// ✅ Dependency Inversion — depend on abstractions
class ReportService {
  constructor(
    private generator: ReportGenerator,
    private formatter: Formatter,   // ← abstraction, not concrete class
    private mailer: ReportMailer
  ) {}

  sendReport(to: string): void {
    const formatted = this.formatter.format(this.generator.generate());
    this.mailer.send(formatted, to);
  }
}`
        },
        {
          lang: 'csharp', label: 'C#',
          code: `// ❌ Violates SRP — Report knows too much
class Report {
    string Generate()             => "data";
    void   SaveToFile(string path) { /* file I/O */ }
    void   SendEmail(string to)    { /* SMTP */    }
}

// ✅ Single Responsibility
class ReportGenerator { public string Generate() => "data"; }
class ReportExporter  { public void Save(string r, string path) {} }
class ReportMailer    { public void Send(string r, string to)   {} }

// ✅ Open/Closed — add formats without modifying existing code
public interface IFormatter { string Format(string data); }

public class JsonFormatter : IFormatter {
    public string Format(string d) => $$"""{"data":"{{d}}"}""";
}
public class CsvFormatter : IFormatter {
    public string Format(string d) => $"\"data\"\n\"{d}\"";
}
// Add XmlFormatter : IFormatter without touching the others

// ✅ Dependency Inversion — depend on abstractions
public class ReportService(
    ReportGenerator generator,
    IFormatter      formatter,   // ← abstraction
    ReportMailer    mailer)
{
    public void SendReport(string to) {
        var formatted = formatter.Format(generator.Generate());
        mailer.Send(formatted, to);
    }
}

// ✅ Composition root — wire up concrete types once
var service = new ReportService(
    new ReportGenerator(),
    new JsonFormatter(),   // swap to CsvFormatter with zero other changes
    new ReportMailer());`
        }
      ]
    },
    {
      id: 'clean',
      acronym: 'Clean',
      name: 'Clean Architecture',
      namePt: 'Arquitetura Limpa',
      color: '#F1E05A',
      i18n: {
        en: {
          tagline: 'Dependencies point inward',
          description: 'Organize code in concentric layers where outer layers depend on inner ones — never the reverse. Business rules are isolated from frameworks, databases, and UI.',
          principles: [
            'Independent of frameworks',
            'Testable business rules',
            'Independent of UI',
            'Independent of database',
            'Independent of external agencies',
          ],
          cycle: ['🎯 Define entities', '📋 Define use cases', '🔌 Define interfaces', '🏗 Implement adapters'],
        },
        pt: {
          tagline: 'Dependências apontam para dentro',
          description: 'Organize o código em camadas concêntricas onde as externas dependem das internas — nunca o contrário. Regras de negócio isoladas de frameworks, bancos e UI.',
          principles: [
            'Independente de frameworks',
            'Regras de negócio testáveis',
            'Independente da UI',
            'Independente do banco de dados',
            'Independente de agentes externos',
          ],
          cycle: ['🎯 Definir entidades', '📋 Definir casos de uso', '🔌 Definir interfaces', '🏗 Implementar adaptadores'],
        },
      },
      snippets: [
        {
          lang: 'typescript', label: 'TypeScript',
          code: `// ── Entities layer (innermost) ──
class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private passwordHash: string
  ) {}

  verifyPassword(hash: string): boolean {
    return this.passwordHash === hash;
  }
}

// ── Use cases layer ──
interface UserRepository {           // port (abstraction)
  findByEmail(email: string): Promise<User | null>;
}

class LoginUseCase {
  constructor(private users: UserRepository) {}

  async execute(email: string, hash: string): Promise<User> {
    const user = await this.users.findByEmail(email);
    if (!user || !user.verifyPassword(hash))
      throw new Error('Invalid credentials');
    return user;
  }
}

// ── Adapters layer (outermost) ──
class SqlUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const row = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return row ? new User(row.id, row.email, row.password_hash) : null;
  }
}`
        },
        {
          lang: 'csharp', label: 'C#',
          code: `// ── Entities layer (innermost) ──
public class User {
    public string Id    { get; }
    public string Email { get; }
    private readonly string _passwordHash;

    public User(string id, string email, string passwordHash) {
        Id = id; Email = email; _passwordHash = passwordHash;
    }

    public bool VerifyPassword(string hash) => _passwordHash == hash;
}

// ── Use cases layer ──
public interface IUserRepository {        // port (abstraction)
    Task<User?> FindByEmailAsync(string email, CancellationToken ct = default);
}

public class LoginUseCase(IUserRepository users) {
    public async Task<User> ExecuteAsync(string email, string hash,
                                         CancellationToken ct = default) {
        var user = await users.FindByEmailAsync(email, ct);
        if (user is null || !user.VerifyPassword(hash))
            throw new UnauthorizedException("Invalid credentials");
        return user;
    }
}

// ── Adapters layer (outermost) ──
public class SqlUserRepository(AppDbContext db) : IUserRepository {
    public async Task<User?> FindByEmailAsync(string email,
                                               CancellationToken ct = default) {
        var row = await db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
        return row is null ? null : new User(row.Id, row.Email, row.PasswordHash);
    }
}

// ── DI wiring (Program.cs) ──
builder.Services.AddScoped<IUserRepository, SqlUserRepository>();
builder.Services.AddScoped<LoginUseCase>();`
        }
      ]
    },
    {
      id: 'cqrs',
      acronym: 'CQRS',
      name: 'Command Query Responsibility Segregation',
      namePt: 'Segregação de Responsabilidade de Comando e Consulta',
      color: '#DEA584',
      i18n: {
        en: {
          tagline: 'Read models ≠ Write models',
          description: 'Separate the models for reading data (queries) from models that update data (commands). Each side can be independently scaled, optimized, and secured.',
          principles: [
            'Commands mutate state, return nothing',
            'Queries return data, change nothing',
            'Separate read/write models',
            'Event sourcing often used alongside',
          ],
          cycle: ['📝 Define commands', '📖 Define queries', '🔀 Route to handlers', '📊 Optimize read side'],
        },
        pt: {
          tagline: 'Modelos de leitura ≠ Modelos de escrita',
          description: 'Separe os modelos de leitura (queries) dos modelos de atualização (commands). Cada lado pode ser escalado, otimizado e protegido de forma independente.',
          principles: [
            'Commands mutam estado, não retornam nada',
            'Queries retornam dados, não mudam nada',
            'Modelos de leitura/escrita separados',
            'Event sourcing frequentemente usado junto',
          ],
          cycle: ['📝 Definir commands', '📖 Definir queries', '🔀 Rotear para handlers', '📊 Otimizar o lado de leitura'],
        },
      },
      snippets: [
        {
          lang: 'typescript', label: 'TypeScript',
          code: `// ── Command side (write) ──
interface Command {}

class CreateProductCommand implements Command {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number
  ) {}
}

class CreateProductHandler {
  async handle(cmd: CreateProductCommand): Promise<void> {
    await db.products.insert({ name: cmd.name, price: cmd.price, stock: cmd.stock });
    await eventBus.publish(new ProductCreated(cmd.name));
  }
}

// ── Query side (read) — denormalized for speed ──
interface Query<TResult> {}

class GetProductCatalogQuery implements Query<ProductSummary[]> {
  constructor(public readonly category?: string) {}
}

class GetProductCatalogHandler {
  async handle(q: GetProductCatalogQuery): Promise<ProductSummary[]> {
    return readDb.catalog.findAll({ category: q.category });
  }
}

commandBus.register(CreateProductCommand, new CreateProductHandler());
queryBus.register(GetProductCatalogQuery, new GetProductCatalogHandler());`
        },
        {
          lang: 'csharp', label: 'C#',
          code: `// ── Command side (write) — MediatR ──
public record CreateProductCommand(string Name, decimal Price, int Stock)
    : IRequest;

public class CreateProductHandler(AppDbContext db, IEventBus bus)
    : IRequestHandler<CreateProductCommand>
{
    public async Task Handle(CreateProductCommand cmd, CancellationToken ct) {
        db.Products.Add(new Product {
            Name = cmd.Name, Price = cmd.Price, Stock = cmd.Stock
        });
        await db.SaveChangesAsync(ct);
        await bus.PublishAsync(new ProductCreated(cmd.Name), ct);
    }
}

// ── Query side (read) — denormalized for speed ──
public record GetCatalogQuery(string? Category)
    : IRequest<IReadOnlyList<ProductSummary>>;

public class GetCatalogHandler(IReadDbContext readDb)
    : IRequestHandler<GetCatalogQuery, IReadOnlyList<ProductSummary>>
{
    public async Task<IReadOnlyList<ProductSummary>> Handle(
        GetCatalogQuery q, CancellationToken ct)
        // Read from pre-computed view: Redis, Elasticsearch, etc.
        => await readDb.Catalog.GetAllAsync(q.Category, ct);
}

// ── Usage (controller / minimal API) ──
app.MapPost("/products", async (CreateProductCommand cmd, IMediator m)
    => await m.Send(cmd));

app.MapGet("/catalog", async (string? category, IMediator m)
    => await m.Send(new GetCatalogQuery(category)));`
        }
      ]
    },
  ];

  // ── State ──────────────────────────────────────────────────────────────────

  let htmlCache: Record<string, string> = {};
  let expandedCode: Record<string, boolean> = {};
  let activeSnippet: Record<string, string> = Object.fromEntries(
    METHODOLOGIES.map(m => [m.id, m.snippets[0].lang])
  );

  function toggleCode(id: string) {
    expandedCode = { ...expandedCode, [id]: !expandedCode[id] };
  }

  function setSnippet(id: string, lang: string) {
    activeSnippet = { ...activeSnippet, [id]: lang };
  }

  function cacheKey(id: string, lang: string) {
    return `${id}-${lang}`;
  }

  onMount(async () => {
    const hl = await createHighlighter({
      themes: ['dark-plus'],
      langs: ['typescript', 'csharp'],
    });
    const cache: Record<string, string> = {};
    for (const m of METHODOLOGIES) {
      for (const s of m.snippets) {
        cache[cacheKey(m.id, s.lang)] = hl.codeToHtml(s.code, {
          lang: s.lang,
          theme: 'dark-plus',
        });
      }
    }
    htmlCache = cache;
  });

  // Language colors for snippet tabs
  const SNIPPET_COLORS: Record<string, string> = {
    typescript: '#3178C6',
    csharp:     '#178600',
  };
</script>

<section class="methodologies">

  <!-- Section header -->
  <header class="section-header">
    <div class="header-top">
      <div class="header-rule">
        <span class="rule-label">{$t.methodologies.sectionTitle}</span>
        <div class="rule-line"></div>
      </div>
      <!-- Locale switcher -->
      <div class="locale-switcher">
        {#each (['en', 'pt'] as Locale[]) as l}
          <button
            class="locale-btn"
            class:active={$locale === l}
            on:click={() => locale.set(l)}
          >{l.toUpperCase()}</button>
        {/each}
      </div>
    </div>
    <p class="header-sub">{$t.methodologies.sectionSub}</p>
  </header>

  <!-- Cards grid -->
  <div class="cards-grid">
    {#each METHODOLOGIES as m, i (m.id)}
      {@const entry = m.i18n[$locale]}
      {@const activeLang = activeSnippet[m.id]}
      {@const key = cacheKey(m.id, activeLang)}
      <article
        class="card"
        style="--lc: {m.color}; animation-delay: {i * 80}ms"
      >
        <!-- Left accent strip -->
        <div class="card-accent"></div>

        <!-- Card body -->
        <div class="card-inner">

          <!-- Top: badge + name + tagline -->
          <div class="card-top">
            <div class="badge-row">
              <span class="acronym-badge">{m.acronym}</span>
            </div>
            <div class="card-title-group">
              <h3 class="card-name">{$locale === 'pt' ? m.namePt : m.name}</h3>
              <span class="card-tagline">{entry.tagline}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="card-description">{entry.description}</p>

          <!-- Principles -->
          <div class="principles-section">
            <span class="section-label">{$t.methodologies.principles}</span>
            <ul class="principles-list">
              {#each entry.principles as p}
                <li class="principle-item" style="--lc: {m.color}">{p}</li>
              {/each}
            </ul>
          </div>

          <!-- Cycle -->
          <div class="cycle-section">
            <span class="section-label">{$t.methodologies.cycle}</span>
            <div class="cycle-steps">
              {#each entry.cycle as step, si}
                <div class="cycle-step">
                  <span class="cycle-dot" style="background: {m.color}; box-shadow: 0 0 6px color-mix(in srgb, {m.color} 50%, transparent)"></span>
                  <span class="cycle-text">{step}</span>
                  {#if si < entry.cycle.length - 1}
                    <span class="cycle-arrow">›</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>

          <!-- Code toggle -->
          <div class="code-toggle-row">
            <button
              class="code-toggle"
              on:click={() => toggleCode(m.id)}
              aria-expanded={!!expandedCode[m.id]}
            >
              <span class="toggle-icon">{expandedCode[m.id] ? '▼' : '▶'}</span>
              <span>{expandedCode[m.id] ? $t.methodologies.hideExample : $t.methodologies.showExample}</span>
            </button>
          </div>

          <!-- Collapsible code section -->
          <div class="code-section" class:open={expandedCode[m.id]}>
            <div class="code-inner">

              <!-- Snippet language tabs -->
              <div class="snippet-tabs">
                {#each m.snippets as s}
                  {@const sc = SNIPPET_COLORS[s.lang] ?? 'var(--cyan)'}
                  <button
                    class="snippet-tab"
                    class:active={activeLang === s.lang}
                    style="--sc: {sc}"
                    on:click={() => setSnippet(m.id, s.lang)}
                  >{s.label}</button>
                {/each}
              </div>

              <!-- Code block -->
              {#if htmlCache[key]}
                <div class="shiki-wrap">{@html htmlCache[key]}</div>
              {:else}
                <div class="code-loading">
                  <span class="loading-bar"></span>
                  <span class="loading-bar" style="width: 72%"></span>
                  <span class="loading-bar" style="width: 88%"></span>
                  <span class="loading-bar" style="width: 60%"></span>
                </div>
              {/if}

            </div>
          </div>

        </div>
      </article>
    {/each}
  </div>

</section>

<style>
  /* ── Section shell ── */
  .methodologies {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  /* ── Section header ── */
  .section-header {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    animation: fadeUp 0.3s var(--t) both;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .header-rule {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex: 1;
    min-width: 0;
  }

  .rule-label {
    font-family: var(--font);
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .rule-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
      to right,
      var(--border-2) 0%,
      var(--border) 60%,
      transparent 100%
    );
  }

  .header-sub {
    font-family: var(--font);
    font-size: 0.875rem;
    color: var(--text-dim);
    margin: 0;
    line-height: 1.6;
  }

  /* ── Locale switcher ── */
  .locale-switcher {
    display: flex;
    align-items: center;
    gap: 2px;
    background: var(--surface-2);
    border: 1px solid var(--border-2);
    border-radius: var(--radius);
    padding: 2px;
    flex-shrink: 0;
  }

  .locale-btn {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.55rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    background: transparent;
    transition: background 0.15s var(--t), color 0.15s var(--t);
  }

  .locale-btn:hover {
    color: var(--text);
    background: var(--surface-3);
  }

  .locale-btn.active {
    background: var(--cyan-soft);
    border: 1px solid var(--cyan-border);
    color: var(--cyan);
  }

  /* ── Cards grid ── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
    gap: 1.25rem;
    align-items: start;
  }

  /* ── Individual card ── */
  .card {
    display: flex;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    animation: fadeUp 0.4s var(--t) both;
    transition:
      border-color 0.22s var(--t),
      box-shadow   0.22s var(--t);
  }

  .card:hover {
    border-color: color-mix(in srgb, var(--lc) 25%, var(--border));
    box-shadow:
      0 4px 24px color-mix(in srgb, var(--lc) 6%, transparent),
      0 1px 4px rgba(0, 0, 0, 0.35);
  }

  .card-accent {
    width: 3px;
    flex-shrink: 0;
    border-radius: var(--radius-lg) 0 0 var(--radius-lg);
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--lc) 90%, white) 0%,
      var(--lc) 40%,
      color-mix(in srgb, var(--lc) 60%, transparent) 100%
    );
  }

  .card-inner {
    flex: 1;
    padding: 1.25rem 1.25rem 1.35rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    min-width: 0;
  }

  /* ── Top: badge + title ── */
  .card-top {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
  }

  .badge-row { flex-shrink: 0; padding-top: 1px; }

  .acronym-badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--lc);
    background: color-mix(in srgb, var(--lc) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--lc) 35%, transparent);
    border-radius: var(--radius);
    padding: 0.3em 0.55em;
    line-height: 1;
    white-space: nowrap;
  }

  .card-title-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  .card-name {
    font-family: var(--font);
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text-bright);
    margin: 0;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  .card-tagline {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--lc);
    opacity: 0.8;
    letter-spacing: 0.01em;
  }

  /* ── Description ── */
  .card-description {
    font-family: var(--font);
    font-size: 0.855rem;
    color: var(--text-dim);
    line-height: 1.65;
    margin: 0;
  }

  /* ── Principles ── */
  .principles-section,
  .cycle-section {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .section-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .principles-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .principle-item {
    font-family: var(--font-mono);
    font-size: 0.765rem;
    color: var(--text-dim);
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .principle-item::before {
    content: '■';
    color: var(--lc);
    opacity: 0.7;
    font-size: 0.5em;
    flex-shrink: 0;
    margin-top: 0.3em;
  }

  /* ── Cycle steps ── */
  .cycle-steps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .cycle-step {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .cycle-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cycle-text {
    font-family: var(--font-mono);
    font-size: 0.73rem;
    color: var(--text-dim);
    white-space: nowrap;
  }

  .cycle-arrow {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: 0.15rem;
    line-height: 1;
  }

  /* ── Code toggle ── */
  .code-toggle-row { margin-top: 0.1rem; }

  .code-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.75rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 0.765rem;
    cursor: pointer;
    transition:
      background 0.18s var(--t),
      border-color 0.18s var(--t),
      color 0.18s var(--t),
      transform 0.12s var(--t);
    user-select: none;
    letter-spacing: 0.02em;
  }

  .code-toggle:hover {
    background: var(--surface-3);
    border-color: color-mix(in srgb, var(--lc) 35%, var(--border));
    color: var(--lc);
    transform: translateY(-1px);
  }

  .toggle-icon {
    font-size: 0.6rem;
    line-height: 1;
    opacity: 0.85;
  }

  /* ── Collapsible code (grid-rows trick) ── */
  .code-section {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .code-section.open { grid-template-rows: 1fr; }

  .code-inner { overflow: hidden; }

  /* ── Snippet language tabs ── */
  .snippet-tabs {
    display: flex;
    gap: 0.35rem;
    margin-top: 0.65rem;
    margin-bottom: 0;
  }

  .snippet-tab {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 0.28rem 0.65rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text-muted);
    cursor: pointer;
    transition:
      background 0.15s var(--t),
      border-color 0.15s var(--t),
      color 0.15s var(--t);
  }

  .snippet-tab:hover {
    background: var(--surface-3);
    color: var(--text-dim);
  }

  .snippet-tab.active {
    background: color-mix(in srgb, var(--sc) 12%, transparent);
    border-color: color-mix(in srgb, var(--sc) 40%, transparent);
    color: var(--sc);
  }

  /* ── Shiki wrapper ── */
  .shiki-wrap {
    margin-top: 0.5rem;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border-2);
  }

  .shiki-wrap :global(pre.shiki) {
    margin: 0;
    padding: 1rem 1.1rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.6;
    overflow-x: auto;
    background: var(--surface-2) !important;
  }

  .shiki-wrap :global(pre.shiki code) {
    font-family: var(--font-mono);
    font-size: inherit;
    line-height: inherit;
    background: transparent !important;
  }

  .shiki-wrap :global(pre.shiki::-webkit-scrollbar) { height: 4px; }
  .shiki-wrap :global(pre.shiki::-webkit-scrollbar-track) { background: var(--surface-2); }
  .shiki-wrap :global(pre.shiki::-webkit-scrollbar-thumb) {
    background: var(--border-2);
    border-radius: 2px;
  }

  /* ── Loading skeleton ── */
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .code-loading {
    margin-top: 0.6rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.9rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    background: var(--surface-2);
  }

  .loading-bar {
    display: block;
    height: 0.65rem;
    width: 100%;
    border-radius: 3px;
    background: linear-gradient(
      90deg,
      var(--surface-2) 25%,
      var(--surface-3) 50%,
      var(--surface-2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cards-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 560px) {
    .principles-list { grid-template-columns: 1fr; }
    .card-inner { padding: 1rem 1rem 1.15rem; }
    .cycle-steps { flex-wrap: nowrap; overflow-x: auto; }
    .header-top { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
  }
</style>
