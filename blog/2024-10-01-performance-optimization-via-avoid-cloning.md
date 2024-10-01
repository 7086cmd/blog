---
title: Performance Optimization via Avoid Cloning
date: 2024-10-01
outline: deep
authors:
  - 7086cmd
categories: [Rust, Software Infrastructure, Technical Writing, English]
---
<AppBlogPostHeader />

Tags: <Badge text="Rust" type="warning" /><Badge text="Software Infrastructure" type="info" /><Badge text="Technical Writing" type="tip" /><Badge text="English" type="danger" />

The ownership design of Rust is a great tool to prevent data from cloning, ~~especially when we do not `#[derive(Clone)]` :D~~.

> [!INFO]
> However, in [oxc](https://github.com/oxc-project/oxc), we do not `#[derive(Clone)]` at all! Instead, oxc's allocator design and the `CloneIn` trait can help for performance in cloning, _but still have performance regression as a clone trait_.

## `Take`: The alternative method if you don't want to duplicate data

The steps of the take is, in general, to replace the original data with a default value, and return the original data. This is a common pattern in Rust, and it is used in many libraries, such as `std::mem::take`.

### General Scenario: `std::mem::take`

The `std::mem::take` function is a common pattern in Rust.

```rs{3}
fn take<T>(t: &mut T) -> T
where
    T: Default
{
    std::mem::replace(t, Default::default())
}
```

So that is, if there's a type that we can't implement a `Default` trait, we can't use `std::mem::take`.

### For `Option<T>`, we can use `Option::take`

```rs{3}
fn take(&mut self) -> Option<T> {
    // FIXME replace `mem::replace` by `mem::take` when the latter is const ready
    mem::replace(self, None)
}
```

So it just like a grammar sugar, but actually it is widely used in Rust.

> [!WARNING]
> The `Iterator::take` is not the same as `Option::take`!
> 
> The `Iterator::take` is to take the first `n` elements from the iterator, and `Option::take` is to take the value out of the `Option` and replace it with `None`.

### Oxc Featured - `AstBuilder`'s moves

`Oxc`'s `AstBuilder` implemented these move traits:

- `move_vec` function. It moves the target vector to the result, and replace the target vector with a new empty vector.
   ```rs
   pub fn move_vec<T>(self, vec: &mut Vec<'a, T>) -> Vec<'a, T> {
      mem::replace(vec, self.vec())
   }
   ```
- `move_expression` function. It moves the target expression to the result, and replace the target expression with a `null` expression.
   ```rs
   pub fn move_expression(self, expr: &mut Expression<'a>) -> Expression<'a> {
      let null_expr = self.expression_null_literal(expr.span());
      mem::replace(expr, null_expr)
   }
   ```
- `move_statement` function. It moves the target statement to the result, and replace the target statement with an empty statement.
   ```rs
   pub fn move_statement(self, stmt: &mut Statement<'a>) -> Statement<'a> {
      let empty_stmt = self.empty_statement(stmt.span());
      mem::replace(stmt, Statement::EmptyStatement(self.alloc(empty_stmt)))
   }
   ```
- ...

So it is easy to figure out that the `move` is actually replacement of memory, which does not clone the data.

For other specific statements, we can manually implement the move. Taking the `await` to `yield` as an example, where `AwaitStatement` is a structure with `span` and `argument` (which is an `Expression`). The `YieldExpression` is similar, but the `argument` is optional.

It is easy, right? That's because we already have a `move_expression`! So let's start, assume you have an `await` expression ast named `await_expr`:

```rs
let argument = ctx.ast.move_expression(&mut await_expr.argument);
let yield_expr = ctx.ast.yield_expression(SPAN, Some(argument));
```

But sometimes this situation is not so friendly, especially when we need to manually handle a lot of things, taking the `function` as an example.

When we traverse to the `FunctionDeclaration`, for example, we need to wrap an outer function in some cases. Here is the declaration of `Function<'a>` (removed some derives and comments):

```rs{10}
pub struct Function<'a> {
    pub r#type: FunctionType, // [!code focus:11]
    pub span: Span,
    pub id: Option<BindingIdentifier<'a>>,
    pub generator: bool,
    pub r#async: bool,
    pub declare: bool,
    pub type_parameters: Option<Box<'a, TSTypeParameterDeclaration<'a>>>,
    pub this_param: Option<Box<'a, TSThisParameter<'a>>>,
    pub params: Box<'a, FormalParameters<'a>>,
    pub return_type: Option<Box<'a, TSTypeAnnotation<'a>>>,
    pub body: Option<Box<'a, FunctionBody<'a>>>,
    pub scope_id: Cell<Option<ScopeId>>,
}
```

It just like a doom, but it is quite easy enough. For these Options, we can simply use the `Option::take()`, but as the highlighted line `params`, we can only head to the inner.

::: details Full Code

```rs
let params = ctx.ast.alloc_formal_parameters(
    SPAN,
    func.params.kind,
    ctx.ast.move_vec(&mut func.params.items),
    func.params.rest.take()
);
let function = ctx.ast.function(
    SPAN,
    func.r#type,
    func.id.take(),
    func.generator,
    func.r#async,
    func.declare,
    func.type_parameters.take(),
    func.this_param.take(),
    params,
    func.return_type.take(),
    func.body.take()
);
```
:::

So let's use AstBuilder now.

And if you want to only keep some of the fields, you can just use `NONE` instead of take.

## Conclusion

If you don't want to keep two ownerships, you should not clone the data. The `take` can satisfy this requirement, or you can manually use `std::mem::replace`.

I used this approach, and made a PR from -70% performance regression to about **-1%**.