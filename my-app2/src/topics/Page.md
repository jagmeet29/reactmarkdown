# Graph

A graph is a mathematical structure used to represent pairwise structure between objects.

> A graph $ G = (V,E) $ consists of \( V \), a non-empty set of vertices (or nodes), and \( E \), a set of edges. Each edge has either one or two vertices associated with it called its endpoints. An edge is said to be connected to its endpoints.

[Important Terms](GraphTerm.html#one)

**Infinite graph** → A graph with an infinite set of vertices and edges.  
**Finite graph** → A graph with a finite set of vertices and edges.

## Isomorphic Graph

> Two graphs are isomorphic if they have the same "structure" even though they might appear different at first glance. Think of isomorphic graphs as twins wearing different clothes — they look different superficially but are fundamentally identical.

#### Requirements:
- They must have the same number of vertices  
- They must have the same number of edges  
- Their degree sequences must match and there must be mapping of degree  
- If vertices form a cycle of certain length in one graph, the corresponding vertices must form a cycle of the same length in the other graph  
- Their adjacency matrices must match  

> **Note:** These conditions are necessary but not sufficient — meeting all these conditions doesn't guarantee the graphs are isomorphic, but failing any condition proves they are definitely not isomorphic.

## Simple Graph
| a | b |
| - | - |
|hello|hi
|bye|bye|
<br>

:::res-ques
What is the capital of France?
:::

:::ans
Paris.
:::

:::res-ques
 What is 2 + 2?
 :::

:::ans 
Four
:::
