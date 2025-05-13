const e=`# Graph\r
\r
A graph is a mathematical structure used to represent pairwise structure between objects.\r
\r
> A graph $ G = (V,E) $ consists of \\( V \\), a non-empty set of vertices (or nodes), and \\( E \\), a set of edges. Each edge has either one or two vertices associated with it called its endpoints. An edge is said to be connected to its endpoints.\r
\r
[Important Terms](GraphTerm.html#one)\r
\r
**Infinite graph** → A graph with an infinite set of vertices and edges.  \r
**Finite graph** → A graph with a finite set of vertices and edges.\r
\r
## Isomorphic Graph\r
\r
> Two graphs are isomorphic if they have the same "structure" even though they might appear different at first glance. Think of isomorphic graphs as twins wearing different clothes — they look different superficially but are fundamentally identical.\r
\r
#### Requirements:\r
- They must have the same number of vertices  \r
- They must have the same number of edges  \r
- Their degree sequences must match and there must be mapping of degree  \r
- If vertices form a cycle of certain length in one graph, the corresponding vertices must form a cycle of the same length in the other graph  \r
- Their adjacency matrices must match  \r
\r
> **Note:** These conditions are necessary but not sufficient — meeting all these conditions doesn't guarantee the graphs are isomorphic, but failing any condition proves they are definitely not isomorphic.\r
\r
## Simple Graph\r
| a | b |\r
| - | - |\r
|hello|hi\r
|bye|bye|\r
<br>\r
\r
:::res-ques\r
What is the capital of France?\r
:::\r
\r
:::ans\r
Paris.\r
:::\r
\r
:::res-ques\r
 What is 2 + 2?\r
 :::\r
\r
:::ans \r
Four\r
:::\r
`;export{e as default};
