---
title: Reed-Solomon Codes
slug: reed-solomon-codes
date: 2017-08-07
tag:
- mathematics
- cryptography
- reed-solomon
- coding-theory
author: Matthew Roseman
description: Overview of Reed-Solomon Codes and how they work
---

## Intro

Reed-Solomon Codes are a form of error correcting codes created by Irving Reed and Gustave Solomon at MIT Lincoln Lab.

Reed-Solomon Codes are in a family of BCH algorithms that use finite fields and polynomial structures to process message data and
detect errors.

### Table of Contents
- [Overview](#overview)
- [Galois Fields](#galois-fields)
- [Encoding](#encoding)
- [Decoding](#decoding)


## Overview

The basic structure of these codes involves taking a message and splitting it up into **Code Words**

![Code Word](./reed_solomon_code_word.png)

A code word includes the original message you want to send and the parity bits added on at the end of it.

The data in the code word is broken up further into what are called **symbols** or **characters**. These are $s$ bits
long, usually 8 bits.

The entire code word is $n$ symbols long, while the original data is $k$ symbols, and the pairity is $2t$ symbols

The Reed-Solomon algorithm can correct up to $2t$ erasures in the data, or up to $t$ errors. **Erasures** are like
errors, but where the location is known. Think of a QR code, where part of the code is covered by something; you know
that the data isn't correct there before you send it. **Errors** are just mistakes in the data by some unknown
maginitude and at an unkown location.

## Galois Fields

Galois Field arithmetic is very important to the Reed-Solomon algorithms. All operations done are done in a Galois
field. 

The reason this is done is we can do addition, subtraction, multiplication, and division on binary numbers of length $s$ and
always get back binary numbers of length $s$. In other words the numbers won't ever be larger than $s$ bits in length.

To create a Galois Field with integers we can just do normal addition and multiplication operations and just mod by some prime
number to wrap them around.

Say x and y are integers and p is some prime number...
* $x + y \pmod p$ is an integer
* $x - y \pmod p$ is an integer
* $x * y \pmod p$ is an integer
* $x / y \pmod p$ is an integer

The division point is the interesting one. By using a prime number as the modulus, we ensure that for every pair of
integers $x$ and $y$, there is some integer $z$ such that $y * z = x$, so $x / y = z$ will always have an answer.

So what we want to do is take this Galois Field and apply it to binary numbers. Lets say our goal is to have 8 bit
binary numbers, and to create a Galois Field so any operation will give us 8 bit binary numbers. This type of Galois
Field is represented as $GF(2^8)$, where 2 is the **characteristic** of the field and 8 is the **exponent**.

For all the operations it may be benefitial to represent the binary number as a polynomial. This is done by treating
each bit as a coefficient in a polynomial.

$$
10101010\\
= 1 * x^7 + 0 * x^6 + 1 * x^5 + 0 * x^4 + 1 * x^3 + 0 * x^2 + 1 * x + 0\\
= x^7 + x^5 + x^3 + x
$$

### Addition

say we want to add $5 + 6$ or $0101 + 0110$

$$
0101 = x^2 + 1\\
0110 = x^2 + x
$$

$$
\begin{aligned}
(x^2 + 1) + (x^2 + x) &= 2 * x^2 + x + 1\\
&= 0 * x^2 + x + 1\\
&= x + 1\\
&= 0011
\end{aligned}
$$

$$
0101 + 0110 = 0011\\
5 + 6 = 3
$$

The reason the 2 coefficient changed to 0 is because we are dealing with binary numbers, so the coefficients of the polynomials are always modulo 2, so the 2 becomes a 0

An efficient way to do this in binary is to just XOR the two numbers

$$
\begin{aligned}
0101\\
\scriptsize XOR \normalsize \enspace 0110\\ \hline
0011
\end{aligned}
$$

### Subtraction

Because we mod the coefficients by 2, -1 will become 1, otherwise subtractions are the same as additions.

$$
\begin{aligned}
0101 - 0110 &= (x^2 + 1) - (x^2 + x)\\
&= x^2 + 1 - x^2 - x\\
&= 0 * x^2 - x + 1\\
&= x + 1\\
&= 0011
\end{aligned}
$$

### Multiplication

For multiplication, we can continue converting to polynomials do the operation then convert back.

$$
10001001 * 00101010\\
\begin{aligned}
&= (x^7 + x^3 + 1) * (x^5 + x^3 + x)\\
&= x^7(x^5 + x^3 + x) + x^3(x^5 + x^3 + x) + (x^5 + x^3 + x)\\
&= x^{12} + x^{10} + x^8 + x^8 + x^6 + x^4 + x^5 + x^3 + x\\
&= x^{12} + x^{10} + 2 * x^8 + x^6 + x^5 + x^4 + x^3 + x\\
&= x^{12} + x^{10} + 0 * x^8 + x^6 + x^5 + x^4 + x^3 + x\\
&= 1010001111010
\end{aligned}
$$


Or we can use binary multiplication, replacing the addition with XOR's

$$
\begin{aligned}
&10001001\\
\times \enspace &00101010\\ \hline
1&0001001\\
100&01001\\
\scriptsize XOR \normalsize \enspace 10001&001\\ \hline
10100&01111010\\
\end{aligned}
$$
$$
1010001111010 = x^{12} + x^{10} + x^6 + x^5 + x^4 + x^3 + x
$$

Now we have a problem because this binary number is larger than 8 bits.

With the integers we modded the numbers by some prime, so we will have to find the equivalent for polynomials.
We need an **irreducible polynomial** or **primitive polynomial** to serve as our mod number.

We will use 100011101 as this number. So we need to divide the polynomial by this number and find the remainder

An easy way to do this division is to line up the primitive polynomial with the number being reduced so the Most Significant Bits (msb's) line
up, and XOR. Then repeat until the number is less than 9 bits.

$$
\begin{aligned}
1010&001111010\\
\scriptsize XOR \normalsize \enspace 1000&11101\\ \hline
0010&110101010\\
\scriptsize XOR \normalsize \enspace 10&0011101\\ \hline
00&111011110\\
\scriptsize XOR \normalsize \enspace &100011101\\ \hline
&011000011
\end{aligned}
$$

$$
1010001111010 \pmod {100011101} = 011000011
$$

There is actually a more efficient way to multiplication in Galois Fields. 

The simplest operation is to multiply by 2, since the numbers are in binary, you just shift the bits left by 1, and
for any power of 2 you shift the bits left by that power. 
    
We can create some **generator number** (α = 00000010) that is equal to 2 in the Galois Field, and find all the powers
of it still in the field.

$$
\alpha ^ 0 = 00000001\\
\alpha ^ 1 = 00000010\\
\mathellipsis\\
\alpha ^ 7 = 10000000\\
\alpha ^ 8 = 00011101\\
\alpha ^ 9 = 00111010\\
\mathellipsis\\
\alpha ^ {11} = 11101000\\
\mathellipsis\\
$$

If we find all the powers of this generator number from 0 to 255, or whatever the maximum power for the field is, we
will get all the numbers in the field.

In other words, every number in the Galois Field can be represented as some power of the generator number.

Then, if we convert the numbers before multiplying, it becomes much simpler.

$$
\begin{aligned}
10001001 * 00101010 = \alpha ^ {74} * \alpha ^ {142} &= \alpha ^ {74 + 142}\\
&= \alpha ^ {216}\\
&= 11000011
\end{aligned}
$$

So if we just keep a table of these α powers, we can do a quick lookup, some simple addition of the logarithm of the
numbers with α as a base, and easy multiplication.

### Division

Using the α trick explained in multiplication, division is as simple as subtracting the logarithms base α instead of
adding.

$$
{x \over y} = log_\alpha (x) - log_\alpha (y)
$$

## Encoding

We take some message $M$, and break it into symbols, where if we use the Galois Field $GF(2^8)$, the symbols are 8 bits
long. So $M$ becomes $M_1, M_2, M_3, \mathellipsis M_k$ and $M_i$ is a symbol. Then we can create a polynomial from these symbols.

$$
M = (M_1, M_2, M_3, \mathellipsis M_k)\\
M(x) = M_1 + M_2x + M_3x^2 + \mathellipsis + M_kx^{k-1}
$$

It is important to realize that this polynomial is not the same as the previous ones. Each coefficient, $M_i$, of this
polynomial is some element of the Galois Field. From this point on we will be working with these polynomials where the
coefficients are elements of the Galois Field, so don't confuse them with the ones used in Galois Field arithmetic.

Now we need a **Generator Polynomial**. Again this is different from the generator number mentioned previously, but it is
built from that number. The generator polynomial is a irreducible polynomial, with roots that are powers of α.

$$
g(x) = (x - \alpha ^ 1)(x - \alpha ^ 2) \mathellipsis (x - \alpha ^ {2t})
$$

2t is the number of parity symbols you want.

Now we take our message represented as a polynomial, and mod it by the generator polynomial, and we get our parity
bits. We just simply tack them on at the end of the message.

Usually you may want to add some buffer bits to the message so that it is a certain length. You can either just add on
0's, and either leave them when you send the message, or remove them and the receiver can tack them on before working
with the message.

## Decoding

There are some terms I need to define before going into the math of decoding the message.

* $R(x)$ the received message polynomial (including parity bits)
* $T(x)$ the uncorrupted sent message polynomial (including parity bits)
* $E(x)$ the errors in the received message polynomial

These polynomials are just like the ones described in encryption, where the data is split up and each symbol is a
coefficient of the polynomial.

These polynomials relate such that...

$$
\begin{aligned}
R(x) &= T(x) + E(x)\\
T(x) &= M(x) + (M(x) \mod g(x))\\
E(x) &= E_{n-1}x^{n-1} + \mathellipsis + E_1x + E_0
\end{aligned}
$$

$E_i$ is an $s$ bit error value, and the power of the $x$ determines the position this error happened at.

### Syndromes

We know that $T(x)$ is divisible by the generator polynomial $g(x)$, since we added the remainder of $M(x) / g(x)$ to it.

This makes checking for errors very simple, just evaluate $R(x)$ at each zero of $g(x)$ and see if it is also a zero of
$R(x)$. Because $R(x)$ is divisible by $g(x)$ the zeros of $g(x)$ must be zeros of $R(x)$.

The zeros of $g(x)$ are also very easy to find since it is constructed so that the zeros are $\alpha^i$ for $1 <= i <= 2t$

When we evaluate $R(x)$ at each power of $\alpha$, we get what is called a **Syndrome**.

$$
S_i = R(\alpha ^ i) = R_{n-1}\alpha ^ {i(n-1)} + R_{n-2}\alpha ^ {i(n-2)} + \mathellipsis + R_1\alpha^i + R_0
$$

We also know that $T(x)$ will evaluate 0 for every zero of $g(x)$ so we can simplify the equation...

$$
\begin{aligned}
R(\alpha ^ i) &= T(\alpha ^ i) + E(\alpha ^ i)\\
T(\alpha ^ i) &= 0\\
R(\alpha ^ i) &= E(\alpha ^ i) = S_i
\end{aligned}
$$

So syndrome values are only dependent on the Error polynomial E(x)

Let's say that errors occur only at locations $(e_1, e_2, \mathellipsis e_v)$ were $e_i$ corresponds to the power of $x$ where the error is.
Then we can rewrite $E(x)$ to only include these locations.

$$
E(x) = Y_1x^{e_1} + Y_2x^{e_2} + \mathellipsis + Y_vx^{e_v}
$$

Where $Y_1, Y_2, \mathellipsis Y_v$ represent the error values at these locations.

If we evaluate $\alpha^i$ in this new $E(x)$ we get

$$
E(\alpha ^ i) = Y_1\alpha ^ {ie_1} + Y_2\alpha ^ {ie_2} + \mathellipsis + Y_v\alpha ^ {ie_v}
$$

And to simplify we can define 

$$
X_1 = \alpha ^ {e_1}, \mathellipsis , X_v = \alpha ^ {e_v}\\
E(\alpha ^ i) = Y_1X_1^i + Y_2X_2^i + \mathellipsis + Y_vX_v^i
$$

We can take these functions and create a matrix defining each Syndrome based on the error locations and error values

$$
\begin{bmatrix}
S_1\\
S_2\\
\vdots\\
S_2^t
\end{bmatrix}

=

\begin{bmatrix}
X_1^1 & X_2^1 & \cdots & X_v^1\\
X_1^2 & X_2^2 & \cdots & X_v^2\\
\vdots & \vdots & \ddots & \vdots\\
X_1^{2t} & X_2^{2t} & \cdots & X_v^{2t}
\end{bmatrix}

\times

\begin{bmatrix}
Y_1\\
Y_2\\
\vdots\\
Y_v
\end{bmatrix}
$$

So we already know the values of the syndromes $(S_1, S_2, \mathellipsis S_{2t})$, and if we find the values of the error locations 
$(X_1, X_2, \mathellipsis X_v)$, we can solve for the error weights, which are $(Y_1, Y_2, \mathellipsis Y_v)$.

### Error Locator Polynomial

The **Error Locator Polynomial** is a polynomial where the roots are the location of the errors in $R(x)$.

$$
\begin{aligned}
\Lambda(x) &= (1 + x_1x)(1 + X_2x) \mathellipsis (1 + X_vx)\\
&= 1 + \Lambda_1x + \mathellipsis + \Lambda_{v-1}x^{v-1} + \Lambda_vx^v
\end{aligned}
$$

The goal then is to find the coefficients $\Lambda_1, \Lambda_2, \mathellipsis \Lambda_v$.

We know that $X_j^{-1}$ is a zero of $\Lambda(x)$. So we plug in $X_j^{-1}$ and get this function.

$$
1 + \Lambda_1X_j^{-1} + \mathellipsis + \Lambda_{v-1}X_j^{-v+1} + \Lambda_vX_j^{-v} = 0
$$
multiply both sides by $Y_jX_j^{i+v}$
$$
Y_jX_j^{i+v} + \Lambda_1Y_jX_j^{i+v-1} + \mathellipsis + \Lambda_{v-1}Y_jX_j^{i+1} + \Lambda_vY_jX_j^i = 0
$$

Then we multiply both sides by $Y_j X_j^{i+v}$. We can also find the summation of this function for all $j$'s, which will still
be zero.

The point of doing this is, we can substitute the syndromes into the equation, which we already know.

$$
\def\foo{\displaystyle\sum_{j=1}^v}
\foo Y_j X_j^{i+v} + \Lambda_1 \foo Y_j X_j^{i+v-1} + \mathellipsis + \Lambda_{v-1} \foo Y_j X_j^{i+1} + \Lambda_v \foo Y_j X_j^i = 0\\
S_k = \foo Y_j X_j^k\\
S_{i+v} + \Lambda_1 S_{i+v-1} + \mathellipsis + \Lambda_{v-1} S_{i+1} + \Lambda_v S_i = 0
$$

Now we can convert this whole thing into matrix representation.

$$
\begin{bmatrix}
S_v\\
S_{v+1}\\
\vdots\\
S_{2v-1}
\end{bmatrix}

=

\begin{bmatrix}
S_{v-1} & S_{v-2} & \cdots & S_0\\
S_v & S_{v-1} & \cdots & S_1\\
\vdots & \vdots & \ddots & \vdots\\
S_{2v-2} & S_{2v-3} & \cdots & S_{v-1}
\end{bmatrix}

\times

\begin{bmatrix}
\Lambda_1\\
\Lambda_2\\
\vdots\\
\Lambda_v
\end{bmatrix}
$$

There is one problem with this, which is we may not know the number of errors that are in the message. In other words,
we don't know $v$.

We can find by with **Berlekamp's Algorithm**.

This algorithm starts with $\Lambda(x) = 1$, and at each stage an error value is calculated by substituting the approximate
coefficients for that value of $v$.

To start we have two functions, the syndromes, and two parameters.
* $\Lambda(x)$ is the error locator polynomial
* $C(x)$ is the correction polynomial
* $S_1, S_2, \mathellipsis S_{2t}$ are the syndromes
* $K$ is the step parameter
* $L$ is the parameter used to track the order of equations

We initialize with
$K = 1 ,\space L = 0 ,\space \Lambda(x) = 1 ,\space C(x) = x$

then we calculate the error value $e$

$$
e = S_1 + \displaystyle\sum_{i=1}^L \Lambda_i S_{i-1-i}\\
if \space e \ne 0\\
\Lambda * (x) = \Lambda(x) + e \times C(x)\\
$$

If $2L$ greater than K then set $L=K=L$ and $C(x) = (\Lambda(x)/e) \times x$

$$
\Lambda(x) = \Lambda * (x) \space and \space K = K+1
$$

repeat until $K$ greater than $2_t$


What this algorithm does is it starts with a potential $\Lambda(x)$ which is $C(x)$ and $L$ as the order of $C(x)$, and over time
increases $L$ so that

$$
S_{i+v} + C_1 S_{i+v-1} + \mathellipsis + C_{v-1} S_{i + 1} + C_v S_i = 0
$$

And it tries to find the smallest $L$ possible.

So if we have error's instead of erasures (meaning we don't know how many or where they are) we can use Berlekamp's
Algorithm to find $v$, and then construct the matrix equation shown above in order to solve for $\Lambda_1, \Lambda_2, \mathellipsis \Lambda_v$.

Then once we have the error locator polynomial coefficients, we can solve for it's roots, $X_1^{-1}, X_2^{-2}, \mathellipsis X_v^{-1}$.

Then going all the way back to the first matrix equation that looked like this.

$$
\begin{bmatrix}
S_1\\
S_2\\
\vdots\\
S_{2t}
\end{bmatrix}

=

\begin{bmatrix}
X_1^1 & X_2^1 & \cdots & X_v^1\\
X_1^2 & X_2^2 & \cdots & X_v^2\\
\vdots & \vdots & \ddots & \vdots\\
X_1^{2t} & X_2^{2t} & \cdots & X_v^{2t}
\end{bmatrix}

\times

\begin{bmatrix}
Y_1\\
Y_2\\
\vdots\\
Y_v
\end{bmatrix}
$$

We have everything but $Y_1, Y_2, \mathellipsis ,Y_v$. We can simply use  matrix inverse to solve for these though.

Plugging every thing together, we can solve for $E(x)$

$$
E(x) = Y_1 x^{e_1} + Y_2 x^{e_2} + \mathellipsis + Y_v x^{e_v}
$$

Then we simply subtract $E(x)$ from $R(x)$ and get $T(x)$, the original message.

### Farney's Algorithm

The **Farney Algorithm** is a more efficient way to solve for $Y_1, Y_2, \mathellipsis Y_v$. It does not require calculating the matrix
inverse.

To do it we need an additional polynomial called the **Error Magnitude Polynomial** $\Omega(x)$.

$$
\Omega(x) = \Omega_{v-1} x^{v-1} + \mathellipsis + \Omega_1 x + \Omega_0\\
\Omega(x) = [S(x) \Lambda(x)] \pmod {x^{2t}}\\
where\\
S(x) = S_{2t} x^{2t} + \mathellipsis + S_2x + S_1\\
\begin{aligned}
&\Omega_0 = S_1\\
&\Omega_1 = S_2 + S_1 \Lambda_1\\
&\vdots\\
&\Omega_{v-1} = S_v + S_{v-1} \Lambda_1 + \mathellipsis + S_v \Lambda_{v-1}
\end{aligned}
$$

We mod by $x^{2t}$ in order to truncate the magnitude polynomial to the last $2t$ elements. $S(x)$ is the **Syndrome
Polynomial** where the coefficients are the Syndromes for $R(x)$.

The derivative of the Error Locator Polynomial evaluated at $X_j^{-1}$ is different than the normal derivative, because we are working with
Galois Field polynomials.

$$
\Lambda'(X_i^{-1}) = \Lambda_1 + \Lambda_3 X_j^{-2} + \Lambda_5 X_j^{-4} + \mathellipsis
$$

We can simply set even powered terms to 0 and divide through by $X_j^{-1}$.

With this derivative and the error magnitude polynomial, we can solve for the error values $Y_1, Y_2,\mathellipsis Y_v$, with this
equation.

$$
Y_j = \Omega(X_j^{-1}) / \Lambda'(X_j^{-1})
$$

This equation won't work for position's that don't have errors, so we need to still find these positions first, but this
equation is faster than the matrix inverse we would have to do otherwise.
