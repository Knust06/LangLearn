export type Locale = 'en' | 'pt';

export interface PatternItem {
  intent: string;
  when: string;
  caveats: string;
}

export interface Translation {
  nav: {
    home: string;
    compare: string;
    exercises: string;
    progress: string;
  };
  home: {
    badge: string;
    eyebrow: string;
    heroLine1: string;
    heroAccent: string;
    sub: string;
    features: Array<{ label: string; desc: string }>;
    langSection: string;
    langCount: string;
  };
  compare: {
    badge: string;
    title: string;
    subtitle: string;
  };
  comparator: {
    hint: string;
    topics: {
      functions: string;
      classes: string;
      errors: string;
      async: string;
      generics: string;
      collections: string;
    };
  };
  exercises: {
    title: string;
    subtitle: string;
    back: string;
    filterLang: string;
    filterTopic: string;
    allLangs: string;
    allTopics: string;
    empty: string;
  };
  progress: {
    title: string;
    back: string;
    allTopics: string;
    empty: string;
    startExercise: string;
    correct: string;
    evolution: string;
    recentErrors: string;
  };
  patterns: {
    sectionTitle: string;
    sectionSub: string;
    filterAll: string;
    intentLabel: string;
    whenLabel: string;
    caveatsLabel: string;
    categories: Record<string, string>;
    items: Record<string, PatternItem>;
  };
  methodologies: {
    sectionTitle: string;
    sectionSub: string;
    principles: string;
    cycle: string;
    showExample: string;
    hideExample: string;
  };
}

export const translations: Record<Locale, Translation> = {
  en: {
    nav: {
      home:      'Home',
      compare:   'Compare',
      exercises: 'Exercises',
      progress:  'Progress',
    },
    home: {
      badge:      'v1.0',
      eyebrow:    '8 languages · syntax · exercises',
      heroLine1:  'Learn every language.',
      heroAccent: 'Side by side.',
      sub: 'A precision reference for intermediate developers. Compare syntax, explore frameworks, drill exercises — all in one place.',
      features: [
        { label: 'Compare',   desc: 'Side-by-side syntax'    },
        { label: 'Exercises', desc: 'Test your knowledge'    },
        { label: 'Progress',  desc: 'Track accuracy'         },
      ],
      langSection: 'Languages',
      langCount:   '8 covered',
    },
    compare: {
      badge:    'compare',
      title:    'Language Comparator',
      subtitle: 'Select 2–3 languages · pick a topic · see the same concept side by side with real examples',
    },
    comparator: {
      hint: '/3 selected',
      topics: {
        functions:   'Functions',
        classes:     'Classes',
        errors:      'Error Handling',
        async:       'Async',
        generics:    'Generics',
        collections: 'Collections',
      },
    },
    exercises: {
      title:      'Exercises',
      subtitle:   'Practice your skills across languages and topics',
      back:       '← Home',
      filterLang: 'Language',
      filterTopic:'Topic',
      allLangs:   'All languages',
      allTopics:  'All topics',
      empty:      'No exercises found for these filters.',
    },
    progress: {
      title:          'Progress',
      back:           '← Home',
      allTopics:      'All topics',
      empty:          'No attempts recorded yet.',
      startExercise:  'Start an exercise →',
      correct:        'correct',
      evolution:      'Evolution',
      recentErrors:   'Recent Errors',
    },
    patterns: {
      sectionTitle: 'Design Patterns',
      sectionSub:   'A catalog of reusable solutions to common software design problems.',
      filterAll:    'All',
      intentLabel:  'Intent',
      whenLabel:    'When to use',
      caveatsLabel: 'Caveats',
      categories: {
        Creational: 'Creational',
        Behavioral: 'Behavioral',
        Structural: 'Structural',
      },
      items: {
        singleton: {
          intent:  'Ensure a class has only one instance and provide a global access point.',
          when:    'Shared resource (DB connection, config, logger) that should be created once.',
          caveats: 'Makes testing harder (global state). Use dependency injection where possible.',
        },
        factory: {
          intent:  'Define an interface for creating an object, but let subclasses decide which class to instantiate.',
          when:    'You need to create objects without specifying the exact class, or when creation logic should be extensible.',
          caveats: 'Can lead to many subclasses. Consider Abstract Factory for families of related objects.',
        },
        observer: {
          intent:  'Define a one-to-many dependency so that when one object changes state, all dependents are notified.',
          when:    'Event systems, reactive UIs, pub/sub messaging, live data updates.',
          caveats: 'Memory leaks if observers are not unsubscribed. Can cause unexpected update cascades.',
        },
        strategy: {
          intent:  'Define a family of algorithms, encapsulate each one, and make them interchangeable.',
          when:    'Sorting algorithms, payment methods, compression codecs — swapping logic at runtime.',
          caveats: 'Overkill for simple if/else. In dynamic languages, plain functions often suffice.',
        },
        decorator: {
          intent:  'Attach additional responsibilities to an object dynamically without subclassing.',
          when:    'Logging, caching, auth wrappers, rate limiting — adding cross-cutting concerns.',
          caveats: 'Many small objects. Decorator order matters. Can be hard to debug.',
        },
        builder: {
          intent:  'Separate the construction of a complex object from its representation.',
          when:    'Objects with many optional fields (query builders, HTTP request configs, UI components).',
          caveats: 'More boilerplate than simple constructors. Use when params exceed 4–5.',
        },
      },
    },
    methodologies: {
      sectionTitle: 'Dev Methodologies',
      sectionSub:   'Approaches and principles for building software with intention and quality.',
      principles:   'Principles',
      cycle:        'Cycle',
      showExample:  'Show example',
      hideExample:  'Hide example',
    },
  },

  pt: {
    nav: {
      home:      'Início',
      compare:   'Comparar',
      exercises: 'Exercícios',
      progress:  'Progresso',
    },
    home: {
      badge:      'v1.0',
      eyebrow:    '8 linguagens · sintaxe · exercícios',
      heroLine1:  'Aprenda cada linguagem.',
      heroAccent: 'Lado a lado.',
      sub: 'Uma referência de precisão para desenvolvedores intermediários. Compare sintaxes, explore frameworks, pratique exercícios — tudo em um só lugar.',
      features: [
        { label: 'Comparar',   desc: 'Sintaxe lado a lado'         },
        { label: 'Exercícios', desc: 'Teste seus conhecimentos'    },
        { label: 'Progresso',  desc: 'Acompanhe sua precisão'      },
      ],
      langSection: 'Linguagens',
      langCount:   '8 cobertas',
    },
    compare: {
      badge:    'comparar',
      title:    'Comparador de Linguagens',
      subtitle: 'Selecione 2–3 linguagens · escolha um tópico · veja o mesmo conceito lado a lado com exemplos reais',
    },
    comparator: {
      hint: '/3 selecionadas',
      topics: {
        functions:   'Funções',
        classes:     'Classes',
        errors:      'Tratamento de Erros',
        async:       'Assíncrono',
        generics:    'Genéricos',
        collections: 'Coleções',
      },
    },
    exercises: {
      title:       'Exercícios',
      subtitle:    'Pratique suas habilidades em diferentes linguagens e tópicos',
      back:        '← Início',
      filterLang:  'Linguagem',
      filterTopic: 'Tópico',
      allLangs:    'Todas as linguagens',
      allTopics:   'Todos os tópicos',
      empty:       'Nenhum exercício encontrado para esses filtros.',
    },
    progress: {
      title:         'Progresso',
      back:          '← Início',
      allTopics:     'Todos os tópicos',
      empty:         'Nenhuma tentativa registrada ainda.',
      startExercise: 'Iniciar um exercício →',
      correct:       'corretas',
      evolution:     'Evolução',
      recentErrors:  'Erros Recentes',
    },
    patterns: {
      sectionTitle: 'Padrões de Projeto',
      sectionSub:   'Um catálogo de soluções reutilizáveis para problemas comuns de design de software.',
      filterAll:    'Todos',
      intentLabel:  'Intenção',
      whenLabel:    'Quando usar',
      caveatsLabel: 'Cuidados',
      categories: {
        Creational: 'Criacional',
        Behavioral: 'Comportamental',
        Structural: 'Estrutural',
      },
      items: {
        singleton: {
          intent:  'Garantir que uma classe tenha apenas uma instância e fornecer um ponto de acesso global.',
          when:    'Recurso compartilhado (conexão de BD, configuração, logger) que deve ser criado uma única vez.',
          caveats: 'Dificulta testes (estado global). Use injeção de dependência sempre que possível.',
        },
        factory: {
          intent:  'Definir uma interface para criar um objeto, mas deixar as subclasses decidirem qual classe instanciar.',
          when:    'Quando você precisa criar objetos sem especificar a classe exata, ou quando a lógica de criação deve ser extensível.',
          caveats: 'Pode levar a muitas subclasses. Considere Abstract Factory para famílias de objetos relacionados.',
        },
        observer: {
          intent:  'Definir uma dependência um-para-muitos de modo que, quando um objeto muda de estado, todos os dependentes são notificados.',
          when:    'Sistemas de eventos, UIs reativas, mensageria pub/sub, atualizações em tempo real.',
          caveats: 'Vazamento de memória se os observers não forem cancelados. Pode causar cascatas inesperadas de atualizações.',
        },
        strategy: {
          intent:  'Definir uma família de algoritmos, encapsular cada um e torná-los intercambiáveis.',
          when:    'Algoritmos de ordenação, métodos de pagamento, codecs de compressão — troca de lógica em tempo de execução.',
          caveats: 'Exagero para um simples if/else. Em linguagens dinâmicas, funções simples costumam ser suficientes.',
        },
        decorator: {
          intent:  'Anexar responsabilidades adicionais a um objeto dinamicamente, sem subclassing.',
          when:    'Logging, cache, wrappers de autenticação, rate limiting — adicionando preocupações transversais.',
          caveats: 'Muitos objetos pequenos. A ordem dos decoradores importa. Pode ser difícil de depurar.',
        },
        builder: {
          intent:  'Separar a construção de um objeto complexo de sua representação.',
          when:    'Objetos com muitos campos opcionais (query builders, configurações HTTP, componentes de UI).',
          caveats: 'Mais boilerplate que construtores simples. Use quando os parâmetros passam de 4–5.',
        },
      },
    },
    methodologies: {
      sectionTitle: 'Metodologias de Desenvolvimento',
      sectionSub:   'Abordagens e princípios para construir software com intenção e qualidade.',
      principles:   'Princípios',
      cycle:        'Ciclo',
      showExample:  'Ver exemplo',
      hideExample:  'Ocultar exemplo',
    },
  },
};
