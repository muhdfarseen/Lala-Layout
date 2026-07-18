# @muhdfarseen/lala-layout

> Lightweight, zero-dependency React layout components.
> Build beautiful layouts with ease.

## Why?

Need a consistent set of layout primitives (`Center`, `Stack`, `Group`, `Grid`, `Flex`, etc.)? `@muhdfarseen/lala-layout` gives you 8 powerful layout components with responsive props, zero dependencies, and full TypeScript support.

-  **Zero runtime dependencies** — only `react` as a peer dep
-  **Tree-shakeable** — import only what you use
-  **Intuitive API** — clean, consistent props across all components
-  **Responsive** — all layout props support responsive values
-  **Configurable** — customize spacing scale via `LayoutProvider`
-  **TypeScript-first** — full type definitions included

## Installation

```bash
npm install @muhdfarseen/lala-layout
# or
yarn add @muhdfarseen/lala-layout
# or
pnpm add @muhdfarseen/lala-layout
```

**Peer dependencies:** `react >= 17`

## Quick Start

```tsx
import { Stack, Group, Grid, Container, Center, Flex, SimpleGrid, Space } from '@muhdfarseen/lala-layout';

function App() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        <h1>My App</h1>
        
        <Group justify="space-between">
          <span>Left</span>
          <span>Right</span>
        </Group>

        <Grid>
          <Grid.Col span={6}>Half</Grid.Col>
          <Grid.Col span={6}>Half</Grid.Col>
        </Grid>

        <SimpleGrid cols={3}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
```

## Components

### Center

Centers content vertically and horizontally.

```tsx
<Center style={{ height: 200 }}>
  <span>I'm centered!</span>
</Center>

<Center inline>
  <span>Inline centered</span>
</Center>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inline` | `boolean` | `false` | Use `inline-flex` instead of `flex` |
| `component` | `ElementType` | `'div'` | Polymorphic element type |

---

### Container

Centers content horizontally with `max-width`.

```tsx
<Container size="md">Content</Container>
<Container fluid>Full width</Container>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs'\|'sm'\|'md'\|'lg'\|'xl'\|number\|string` | `'md'` | Container max-width |
| `fluid` | `boolean` | `false` | 100% width |
| `strategy` | `'block'\|'grid'` | `'block'` | Centering strategy |

**Size defaults:** `xs=540px`, `sm=720px`, `md=960px`, `lg=1140px`, `xl=1320px`

---

### Flex

Flexbox container with shorthand props. **All props support responsive values.**

```tsx
<Flex gap="md" align="center" direction="row">
  <div>A</div>
  <div>B</div>
</Flex>

// Responsive
<Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'sm', md: 'lg' }}>
  <div>A</div>
  <div>B</div>
</Flex>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `StyleProp<LalaSpacing>` | — | `gap` |
| `rowGap` | `StyleProp<LalaSpacing>` | — | `row-gap` |
| `columnGap` | `StyleProp<LalaSpacing>` | — | `column-gap` |
| `align` | `StyleProp<AlignItems>` | — | `align-items` |
| `justify` | `StyleProp<JustifyContent>` | — | `justify-content` |
| `wrap` | `StyleProp<FlexWrap>` | — | `flex-wrap` |
| `direction` | `StyleProp<FlexDirection>` | — | `flex-direction` |
| `component` | `ElementType` | `'div'` | Polymorphic element |

---

### Grid

12-column responsive grid with `Grid.Col`.

```tsx
<Grid>
  <Grid.Col span={4}>One third</Grid.Col>
  <Grid.Col span={8}>Two thirds</Grid.Col>
</Grid>

<Grid columns={24} gap="lg" grow>
  <Grid.Col span={8}>Grows</Grid.Col>
  <Grid.Col span={8}>Grows</Grid.Col>
</Grid>

// Responsive
<Grid>
  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>Responsive</Grid.Col>
</Grid>
```

**Grid Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number` | `12` | Total columns |
| `gap` | `StyleProp<LalaSpacing>` | `'md'` | Gap |
| `rowGap` | `StyleProp<LalaSpacing>` | — | Vertical gap override |
| `columnGap` | `StyleProp<LalaSpacing>` | — | Horizontal gap override |
| `grow` | `boolean` | `false` | Last row fills space |
| `justify` | `JustifyContent` | `'flex-start'` | `justify-content` |
| `align` | `AlignItems` | `'stretch'` | `align-items` |
| `overflow` | `'visible'\|'hidden'` | `'visible'` | Overflow |

**Grid.Col Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `span` | `StyleProp<ColSpan>` | `12` | Column span |
| `offset` | `StyleProp<number>` | — | Offset columns |
| `order` | `StyleProp<number>` | — | Display order |

---

### Group

Horizontal flex group.

```tsx
<Group gap="lg" justify="space-between">
  <button>Left</button>
  <button>Right</button>
</Group>

<Group grow>
  <button>Equal</button>
  <button>Width</button>
</Group>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `justify` | `JustifyContent` | `'flex-start'` | `justify-content` |
| `align` | `AlignItems` | `'center'` | `align-items` |
| `wrap` | `FlexWrap` | `'wrap'` | `flex-wrap` |
| `gap` | `LalaSpacing` | `'md'` | Gap |
| `grow` | `boolean` | `false` | Children grow equally |
| `preventGrowOverflow` | `boolean` | `true` | Prevent overflow when growing |

---

### SimpleGrid

Equal-width columns using CSS Grid. **All props support responsive values.**

```tsx
<SimpleGrid cols={3} spacing="lg">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</SimpleGrid>

// Responsive
<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</SimpleGrid>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `StyleProp<number>` | `1` | Number of columns |
| `spacing` | `StyleProp<LalaSpacing>` | `'md'` | Column gap |
| `verticalSpacing` | `StyleProp<LalaSpacing>` | — | Row gap (falls back to `spacing`) |

---

### Space

Adds blank space.

```tsx
<div>Above</div>
<Space h="md" />
<div>Below</div>

<span>Left</span>
<Space w="xl" />
<span>Right</span>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `w` | `LalaSpacing` | — | Width |
| `h` | `LalaSpacing` | — | Height |

---

### Stack

Vertical flex column.

```tsx
<Stack gap="lg">
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</Stack>

<Stack align="center" gap="xl">
  <h1>Title</h1>
  <p>Subtitle</p>
</Stack>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `LalaSpacing` | `'md'` | Gap |
| `align` | `AlignItems` | `'stretch'` | `align-items` |
| `justify` | `JustifyContent` | `'flex-start'` | `justify-content` |

---

## Responsive Values

Components with `StyleProp` props support responsive values using breakpoint objects:

```tsx
<SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
  {items}
</SimpleGrid>
```

**Default breakpoints:**

| Breakpoint | Min-width |
|------------|-----------|
| `xs` | `36em` (576px) |
| `sm` | `48em` (768px) |
| `md` | `62em` (992px) |
| `lg` | `75em` (1200px) |
| `xl` | `88em` (1408px) |

## Spacing Scale

**Default spacing:**

| Name | Value |
|------|-------|
| `xs` | `0.625rem` (10px) |
| `sm` | `0.75rem` (12px) |
| `md` | `1rem` (16px) |
| `lg` | `1.25rem` (20px) |
| `xl` | `2rem` (32px) |

Numbers are automatically converted to rem. Strings are passed through as-is.

## Custom Configuration

Use `LayoutProvider` to customize spacing, breakpoints, and container sizes:

```tsx
import { LayoutProvider } from '@muhdfarseen/lala-layout';

function App() {
  return (
    <LayoutProvider
      spacing={{ md: '1.5rem', xl: '3rem' }}
      breakpoints={{ sm: '40em', lg: '80em' }}
      containerSizes={{ lg: '80rem' }}
    >
      <YourApp />
    </LayoutProvider>
  );
}
```

## License

MIT
