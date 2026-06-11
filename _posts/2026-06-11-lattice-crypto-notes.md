---
layout: post
title: "Lattice Crypto Notes"
description: "Notes on lattices, LLL, the shortest vector problem and CTF-style lattice attacks."
date: 2026-06-11
tags: [crypto, lattices, ctf, math]
---

Lattices are the backbone of modern cryptography and of many crypto challenges in CTFs.
These are the definitions I keep as a quick reference.

## Lattices

Given a basis $B = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ of linearly independent
vectors, the lattice they generate is the set of all **integer** combinations:

$$
\mathcal{L}(B) = \left\{ \sum_{i=1}^{n} a_i\, \mathbf{b}_i \;:\; a_i \in \mathbb{Z} \right\}
$$

The same lattice has infinitely many bases, related by unimodular matrices.

## Hard problems

Security rests on problems believed to be hard:

- **SVP** (Shortest Vector Problem): find the shortest non-zero vector, of norm
  $\lambda_1(\mathcal{L})$.
- **CVP** (Closest Vector Problem): given a target $\mathbf{t}$, find the lattice point
  closest to it.

$$
\lambda_1(\mathcal{L}) = \min_{\mathbf{v} \in \mathcal{L} \setminus \{\mathbf{0}\}} \|\mathbf{v}\|
$$

## LLL in one line

The **LLL** algorithm reduces a basis to a nearly orthogonal one in polynomial time,
returning a vector at most $2^{(n-1)/2}$ times longer than the optimum. It does not solve
exact SVP, but in CTF practice it is surprisingly often enough.

```python
# SageMath: reduce a basis and read the shortest vector
from sage.all import Matrix, ZZ

B = Matrix(ZZ, [
    [1, 0, 0, 9001],
    [0, 1, 0, 4242],
    [0, 0, 1, 1337],
])
print(B.LLL()[0])   # candidate short vector / solution
```

Many challenges (knapsack, RSA with known bits via Coppersmith, the hidden number
problem) reduce to building a lattice where the solution is an unusually short vector,
then letting LLL find it. Recognizing that pattern is half the work.
