---
type: blog
title: Post Quantum Cryptography
slug: post-quantum-cryptography
date: 2017-11-21
tag:
- mathematics
- cryptography
- quantum
author: Matthew Roseman
description: How will cryptography work in a world with quantum computers
---

### Contents
- [Overview](#overview)
- [Shor's Algorithm](#shors-algorithm)
- [Hash Based Signature Algorithms](#hash-based-signature-algorithms)
- [Code Based Algorithms](#code-based-algorithms)
- [Lattice Based Algorithms](#lattice-based-algorithms)
- [Further Reading](#further-reading)

## Overview

First of all, not all cryptographic algorithms are broken by quantum computing.

**AES**, and most symmetric key algorithms, are safe to quantum computing attack.

For hashing **Merkles Hash Tree** isn't broken.

And for classic public key cryptography **Lattice based algorithms** are safe.

But, there are a lot of important algorithms that don't work. **RSA**, **DSA**, and 
**ECDSA** are all broken with quantum computing.

## Shor's Algorithm

So what does quantum computing do that breaks algorithms like **RSA**?

Well there is an algorithm called **Shor's Algorithm** created by a man named
Peter Shor. This algorithm simply finds the prime factors of integers. So 
given some integer N, it figures out which prime numbers multiply to equal N.

Cryptographic algorithms usually boil down to some difficult mathematical problem.
And **RSA**, **DSA**, and **ECDSA** boil down to the fact that it is difficult to factorize
large integers.

So it is clear that if there is an algorithm that can factorize these large numbers
fast, the cryptographic algorithms built on this being difficult break down.

One other quantum algorithm that can act on those cryptographic algorithms not effected
by Shor's, is Grover's algorithm. But this algorithm is not as fast as Shor's and can be
defended against by increasing key size.

## Hash Based Signature Algorithms

These types of algorithms are signature algorithms built upon hash function.

A hash function takes some data and maps it to some data of a fixed size. The most popular
algorithm is SHA-256.

These hash functions are generally regarded as safe to quantum attack, and will likely
not undergo large changes to make them secure. Most common defence is to increase the key
size, which basically means you use the same algorithm, but increase the computation time
required to find the key.

If you map data to a string of bits of length **n**, doubling the key size would mean you
map to a string of bits of length **2n**, meaning the chances of working backwards if much
harder, because there are much more possible mappings.

## Code Based Algorithms

A common code based algorithm is **McEliece cryptosystem**. This algorithm is based on the 
difficulty of decoding a general linear code. A linear code is a error-correcting code, and
is used for forward error correction when transmitting data.

So the same algorithms that are used to correct errors that are introduced into data, can be
used to "scramble"/encrypt that data, and "decode"/decrypt that message.

These algorithms aren't used that often, but they actually have faster encryption/decryption
times than RSA, and are considered secure to quantum attack, so they may become quite popular
in the near future.

## Lattice Based Algorithms

Lattice based cryptography is currently the leading candidate for post quantum cryptography.
These algorithms are based on the lattice problem.

A lattice is a set of points in n-dimensional space with periodic structure. These are
constructed with some basis vectors, and every point is some combination of addition of
these basis vectors.

The **shortest vector problem (SVP)** involves finding the shortest vector between two points 
in the lattice.

Currently there are no known quantum algorithms that can solve the SVP in polynomial time,
so lattice based cryptography is considered safe to quantum attack.

## Further Reading

- [Beginning Paper on Post Quantum Cryptography](https://pqcrypto.org/www.springer.com/cda/content/document/cda_downloaddocument/9783540887010-c1.pdf)
- [NIST report on Post Quantum Cryptography](http://nvlpubs.nist.gov/nistpubs/ir/2016/NIST.IR.8105.pdf)
- [Lattic Based Cryptography](https://cims.nyu.edu/~regev/papers/pqc.pdf)
