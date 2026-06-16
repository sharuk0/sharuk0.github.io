---
layout: post
title: "ICC 2026 - Kaleidoscope"
description: "A writeup for the Kaleidoscope crypto challenge from ICC 2026"
date: 2026-06-15
tags: [crypto, math, LLL, lattices, sage, cool-shit]
---

> This problem was somewhat a pain in the ass.
> Not because the final idea was impossible to understand, but because before reaching the nice part, you first had to reverse a weird Sage script, understand what was actually being leaked, recover hidden subset sums, invert trigonometric compositions, and then solve a precision-sensitive lattice problem.
```text
So yeah.
Very normal crypto challenge behavior.
```
The challenge description was:

$$
\textbf{Kaleidoscope}
$$

> Beauty is in the eyes of the beholder.
> Recover the secret and wrap the inner content as `flag{...}`.

The source code looked innocent at first. Suspiciously innocent.

```python
from sage.all import random_prime, shuffle, sin, cos, tan
from secrets import randbits
from itertools import permutations

flag = b'flag{REDACTED}'
assert len(flag) == 26
# Normal stuff in crypto ctfs
f_x = int.from_bytes(flag, "big")
BITS = 1024
M = random_prime(2**(BITS+2), lbound=2**(BITS+1))

#This part was the one that particularly made me lockin because I knew it was about to get real

def compose(foo_l):
    x = f_x
    for fun in foo_l:
        match fun:
            case 's': x = sin(x)
            case 'c': x = cos(x)
            case 't': x = tan(x)
    return x.n(BITS)
# Just a permutation of tsc
def kaledioscope():
    ll = list(permutations('tsc', 3))
    n = len(ll)
    shuffle(ll)

    funsies = []
    for foo_l in ll:
        funsies.append(int(compose(foo_l) * 2**BITS))

    importance = [randbits(1) for _ in range(n)]
    S = sum([x*w for x,w in zip(funsies, importance)])

    return S % M
# This part had a commentary that said that n=8*3 was a reference (I didnt got it)
def fraud(n=8*3):
    S_i = []
    for _ in range(n):
        S_i.append(kaledioscope())
    return S_i, M
```

At the start I thought:

> Maybe I just need to reverse the trig functions.

This was wrong. Painfully wrong.

Trying to apply inverse trig functions directly to the public outputs is like trying to decrypt AES by staring at the ciphertext with enough emotional intensity. It feels productive for about 15 minutes and then Sage gives you binary soup.

## Initial Inspection

The flag has length 26 bytes, so if we write:

$$
x = \text{bytes_to_long}(\text{flag}),
$$

then (x) is a 208-bit integer.

The function `compose` applies one of the six permutations of:

$$
\sin,\quad \cos,\quad \tan.
$$

For example, depending on the permutation, it may compute things like:

$$
\sin(\cos(\tan(x))),
$$

or:

$$
\tan(\cos(\sin(x))).
$$

Then each result is scaled by (2^{1024}) and converted into an integer.

Let the six hidden values be:

$$
a_0,a_1,\ldots,a_5.
$$

Each one is:

$$
a_j = \left\lfloor 2^{1024} F_j(x) \right\rfloor,
$$

where (F_j) is one of the six trigonometric compositions.

These are the `funsies`.

Nice name.

Horrible object.

## What `kaledioscope()` really leaks

The important part is this:

```python
importance = [randbits(1) for _ in range(n)]
S = sum([x*w for x,w in zip(funsies, importance)])
return S % M
```

So each output is not one of the six trigonometric values.

Each output is a random subset sum of the six hidden values.

For every sample (S_i), we have:

$$
S_i \equiv \sum_{j=0}^{5} b_{i,j} a_j \pmod M,
$$

where:

$$
b_{i,j} \in {0,1}.
$$

We are given 24 such samples.

In matrix form:

$$
S \equiv B a \pmod M,
$$

where:

$$
B \in {0,1}^{24 \times 6}.
$$

Both (B) and (a) are unknown.

At this point the challenge becomes two problems glued together:

1. Recover the six hidden subset-sum atoms (a_j).
2. Use them to recover the original integer (x).

So the problem starts with trigonometry, but the first real attack is lattice-based.

Classic.

## Why the direct inverse idea fails

My first mental model was:

$$
S_i \approx F_j(x).
$$

But that is simply false.

The public values (S_i) are not direct outputs of `compose`.

They are modular subset sums:

$$
S_i \equiv b_{i,0}a_0 + b_{i,1}a_1 + \cdots + b_{i,5}a_5 \pmod M.
$$

So trying to invert `sin`, `cos`, or `tan` directly from (S_i) makes no sense.

The right target is not:

$$
S_i \mapsto x.
$$

The right target is:

$$
S_i \mapsto a_0,\ldots,a_5 \mapsto x.
$$

That was the first important unlock.

## Step 1: Orthogonal lattice attack

Since:

$$
S \equiv B a \pmod M,
$$

any vector (c \in \mathbb{Z}^{24}) satisfying:

$$
c^T B = 0
$$

also satisfies:

$$
c^T S \equiv 0 \pmod M.
$$

So we want short integer relations:

$$
c_1S_1 + c_2S_2 + \cdots + c_{24}S_{24} \equiv 0 \pmod M.
$$

Because (B) has only 6 columns, the left kernel has dimension:

$$
24 - 6 = 18.
$$

So we expect 18 short relations.

To find them, I used an orthogonal lattice attack. The lattice basis is built so that vectors look like:

$$
(c_1,\ldots,c_{24}, W(c\cdot S + tM)).
$$

With a huge weight (W), LLL strongly prefers vectors where the last coordinate is zero, meaning:

$$
c\cdot S + tM = 0.
$$

In code, the basis was:

```python
W = 1 << 2048

A = IntegerMatrix(n + 1, n + 1)

for i in range(n):
    A[i, i] = 1
    A[i, n] = W * S_i[i]

A[n, n] = W * M

LLL.reduction(A)
```

After reduction, the short vectors with last coordinate zero give the expected relations.

And indeed, LLL found 18 short relations.

That confirmed the structure:

$$
\text{rank}(B) = 6,
$$

so the outputs really live in a 6-dimensional hidden subset-sum space.

## Step 2: Recovering the hidden bit matrix

Once we have the 18 relations, we compute the lattice orthogonal to them.

This orthogonal complement has rank 6 and contains the columns of (B).

The annoying part is that LLL gives us a reduced basis, not directly the nice (0/1) columns of (B).

So we enumerate small combinations of the reduced basis vectors and look for vectors whose entries are all in:

$$
{0,1}.
$$

The search space is tiny:

```python
for combo in product(range(-2, 3), repeat=6):
    ...
```

That is only:

$$
5^6 = 15625
$$

candidates.

This recovers exactly six independent (0/1) vectors, which are the columns of (B).

So now the hidden matrix is known.

At this point we have successfully transformed the problem from:

> “What the hell is this Sage trig subset-sum thing?”

into:

> “Solve a 6-variable linear system modulo (M).”

Much better.

## Step 3: Recovering the six `funsies`

Now that (B) is known, we solve:

$$
B a \equiv S \pmod M.
$$

Since (B) is (24 \times 6), we only need six independent rows.

I used modular Gaussian elimination over (\mathbb{Z}/M\mathbb{Z}).

After solving, I verified the result against all 24 samples:

```python
assert all(
    sum(int(B[i, j]) * f_vec[j] for j in range(6)) % M == S_i[i]
    for i in range(n)
)
```

This gives us the six scaled trigonometric values.

Since some of the real trig outputs can be negative, we lift them from modulo (M) into signed integers:

```python
funsies = [v if v < M // 2 else v - M for v in f_vec]
```

Then we divide by (2^{1024}):

$$
y_j = \frac{a_j}{2^{1024}}.
$$

Now we finally have approximations of the actual six composed trigonometric values.

Now the trig part begins.

## Step 4: Inverting the trigonometric layer

We know the multiset:

$$
{F_0(x),F_1(x),\ldots,F_5(x)}.
$$

But we do not initially know which recovered value corresponds to which permutation.

So the idea is:

1. Try each permutation.
2. Invert it branch by branch.
3. Get candidates for:

$$
\theta = x \bmod 2\pi.
$$

4. Recompute all six compositions at (\theta).
5. Check if the resulting multiset matches the recovered values.

The inverse trig part must handle branches.

For example:

$$
\sin(u) = y
$$

does not imply only:

$$
u = \arcsin(y).
$$

It also has the branch:

$$
u = \pi - \arcsin(y).
$$

Similarly, for cosine:

$$
u = \pm \arccos(y),
$$

and for tangent:

$$
u = \arctan(y) \pmod \pi.
$$

So the inversion code keeps a list of candidates:

```python
def invert(value, perm):
    cands = [value]

    for f in reversed(perm):
        new = []

        for y in cands:
            if f == 's' and fabs(y) <= 1:
                a = asin(y)
                new += [a, pi - a]

            elif f == 'c' and fabs(y) <= 1:
                a = acos(y)
                new += [a, -a]

            elif f == 't':
                a = atan(y)
                new += [a, a + pi]

        cands = new

    return cands
```

After enumerating branches and checking all six compositions, we recover:

$$
\theta = x \bmod 2\pi.
$$

In this instance, the recovered value was approximately:

$$
\theta \approx 2.39027843\ldots
$$

So now we know:

$$
x = 2\pi k + \theta
$$

for some huge integer (k).

The flag is hiding inside the periodicity.

Very rude.

## Step 5: Recovering the integer from its phase

We know:

$$
x = 2\pi k + \theta.
$$

But (x) is a 26-byte integer, so it is about 208 bits.

This means:

$$
k \approx 2^{206}.
$$

The equation can be rewritten as:

$$
x - 2\pi k \approx \theta.
$$

To solve this, I used a CVP/SVP embedding.

Pick a scaling parameter (P), and define:

$$
\alpha = \left\lfloor 2\pi \cdot 2^P \right\rceil,
$$

$$
\tau = \left\lfloor \theta \cdot 2^P \right\rceil,
$$

$$
q = 2^P.
$$

Then the relation becomes:

$$
k\alpha - xq + \tau \approx 0.
$$

So we build a 3-dimensional lattice with basis vectors:

$$
v_1 = (\alpha, 1, 0),
$$

$$
v_2 = (-q, 0, 0),
$$

$$
v_3 = (\tau, 0, 1).
$$

The hidden short vector is:

$$
k v_1 + x v_2 + v_3
===================

(k\alpha - xq + \tau,\ k,\ 1).
$$

The first coordinate is small because of the phase relation, while the second coordinate is about (2^{206}).

So the vector has norm roughly (2^{206}), which is short enough for LLL to recover in dimension 3.

The code:

```python
P = 900

alpha = int(mp.floor(2 * pi * mpf(2)**P + mpf("0.5")))
tau   = int(mp.floor(theta  * mpf(2)**P + mpf("0.5")))
pp    = 1 << P

Mlat = IntegerMatrix(3, 3)

Mlat[0, 0] = alpha
Mlat[0, 1] = 1
Mlat[0, 2] = 0

Mlat[1, 0] = -pp
Mlat[1, 1] = 0
Mlat[1, 2] = 0

Mlat[2, 0] = tau
Mlat[2, 1] = 0
Mlat[2, 2] = 1

LLL.reduction(Mlat)
```

Then we look for a reduced vector with last coordinate (\pm 1). Its second coordinate gives (k).

Finally:

```python
f_x_int = int(mp.floor(mpf(k_rec) * 2 * pi + theta + mpf("0.5")))
flag = f_x_int.to_bytes(26, "big")
```

And the flag appears.

## The annoying precision bug

This part deserves its own section because it was the kind of bug that makes you question your life choices.

At first, I used a much larger scaling factor, around:

$$
P = 2200.
$$

This seemed natural because more precision should be better, right?

Nope.

Sage evaluates trig functions at 1024-bit precision, but the input (x) is a huge 208-bit integer. Argument reduction for functions like (\sin(x)) loses about:

$$
\log_2(x) \approx 208
$$

bits of precision.

So even though the code uses 1024-bit precision, the recovered phase has only around:

$$
1024 - 208 = 816
$$

useful bits.

If we choose (P = 2200), the noise in:

$$
\tau = \theta 2^P
$$

gets amplified way too much.

The noise dominates the short vector, and LLL does not recover the solution.

With:

$$
P = 900,
$$

the precision is still enough, but the noise does not destroy the signal.

This was the key practical fix.

So the lesson is:

> More scaling is not always better if your input precision is already cooked.

## Final attack summary

The full attack chain was:

```text
1. Model every output as a subset sum:

       S_i = Σ b_{i,j} · funsies[j] mod M

2. Use an orthogonal lattice attack to recover 18 short relations:

       c · S = 0 mod M

3. Compute the rank-6 kernel orthogonal to those relations.

4. Enumerate small combinations of the LLL basis to recover the 0/1 columns of B.

5. Solve:

       B · funsies = S mod M

6. Lift funsies to signed integers and divide by 2^1024.

7. Enumerate trig permutations and inverse branches.

8. Recover:

       θ = f_x mod 2π

9. Use a 3D CVP/SVP embedding to recover the integer f_x.

10. Convert f_x back to 26 bytes.
```

In other words:

```text
subset sums  →  orthogonal lattice
             →  hidden bit matrix
             →  modular linear algebra
             →  inverse trig branches
             →  CVP modulo 2π
             →  flag
```

Very elegant. Very cursed. (The perfect formula for a mathemathitians nirvana)

## Final implementation notes

The important parts of the solver were:

```python
# Orthogonal lattice
W = 1 << 2048

A = IntegerMatrix(n + 1, n + 1)
for i in range(n):
    A[i, i] = 1
    A[i, n] = W * S_i[i]
A[n, n] = W * M

LLL.reduction(A)
```

Then:

```python
# Recover B from the kernel by enumerating small combinations
for combo in product(range(-2, 3), repeat=6):
    v = sum(c * kernel[i] for i, c in enumerate(combo))

    if all(x in (0, 1) for x in v) and any(v):
        found.add(tuple(int(x) for x in v))
```

Then:

```python
# Solve B · f = S mod M
f_vec = solve_mod(B, S_i, M)

assert all(
    sum(int(B[i, j]) * f_vec[j] for j in range(6)) % M == S_i[i]
    for i in range(n)
)
```

Then:

```python
# Recover θ = f_x mod 2π
for p in perms:
    for cand in invert(vals[0], p):
        cand %= 2 * pi

        if multiset_close(vals, [compose(cand, q) for q in perms]):
            theta = cand
            break
```

And finally:

```python
# CVP/SVP embedding
P = 900

alpha = int(mp.floor(2 * pi * mpf(2)**P + mpf("0.5")))
tau   = int(mp.floor(theta  * mpf(2)**P + mpf("0.5")))
pp    = 1 << P

Mlat = IntegerMatrix(3, 3)

Mlat[0, 0] = alpha
Mlat[0, 1] = 1
Mlat[0, 2] = 0

Mlat[1, 0] = -pp
Mlat[1, 1] = 0
Mlat[1, 2] = 0

Mlat[2, 0] = tau
Mlat[2, 1] = 0
Mlat[2, 2] = 1

LLL.reduction(Mlat)
```

After extracting (k), we reconstruct:

$$
x = \left\lfloor 2\pi k + \theta \right\rceil.
$$

Then:

```python
flag = x.to_bytes(26, "big")
```

## The flag

```text
flag{m4pl3_is_g0473d_b7w!}
```

> The final flag is a joke about Maple being gated. Which is funny, because this challenge made me use Sage, LLL, trigonometric branch enumeration, and precision debugging just to recover a string. At the end, the challenge name was actually pretty accurate.

A kaleidoscope: six trig functions, shuffled subset sums, periodic ambiguity, and lattices reflecting the same secret from different angles.

```text
Beauty is in the eyes of the beholder.

But the flag is in the kernel.
```
