---
layout: post
title: "Caesar Cipher (ROT-n)"
description: "Introduction to the Caesar cipher, modular arithmetic and basic encryption."
date: 2026-06-11
tags: [crypto, classical-crypto, math]
---

The Caesar cipher is one of the oldest substitution schemes. It shifts every symbol
of the message by a fixed key $k$, working modulo the size of the alphabet.

## Definition

Let $m_i$ be the $i$-th symbol of the message and $k$ the key (the shift). Encryption
and decryption are:

$$
c_i \equiv m_i + k \pmod{n}, \qquad m_i \equiv c_i - k \pmod{n}
$$

where $n = 26$ for the English alphabet. The operation is just a rotation, hence the
name **ROT-n** (ROT-13 is the case $k = 13$, which is its own inverse).

## Implementation

A minimal version over raw bytes (mod 256 instead of 26):

```python
def encrypt(message, key):
    encrypted = b""
    for char in message:
        encrypted += bytes([(char + key) % 256])
    return encrypted


def decrypt(ciphertext, key):
    return encrypt(ciphertext, -key)
```

## Why it is weak

Breaking it is trivial. There are only 25 useful keys for the English alphabet, so
brute force is instant. Without knowing the key, frequency analysis recovers the shift
from any reasonably long text.

| Attack             | Cost              | Requirement              |
| ------------------ | ----------------- | ------------------------ |
| Brute force        | $O(n)$            | None                     |
| Frequency analysis | $O(\text{text})$  | Long enough ciphertext   |

The value of the Caesar cipher is pedagogical: it introduces modular arithmetic, key
spaces, and the idea that **security through obscurity is not security**.
