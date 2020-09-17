---
title: "Reed-Solomon Codes"
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

### Contents
- [Overview](#overview)
- [Galois Fields](#galois-fields)
- [Encoding](#encoding)
- [Decoding](#decoding)

---

## Overview

The basic structure of these codes involves taking a message and splitting it up into **Code Words**

![Code Word]({{ site.url }}/assets/images/reed_solomon_code_word.gif)

A code word includes the original message you want to send and the parity bits added on at the end of it.

The data in the code word is broken up further into what are called **symbols** or **characters**. These are *s* bits
long, usually 8 bits.

The entire code word is *n* symbols long, while the original data is *k* symbols, and the pairity is *2t* symbols

The Reed-Solomon algorithm can correct up to *2t* erasures in the data, or up to *t* errors. **Erasures** are like
errors, but where the location is known. Think of a QR code where part of the code is covered by something; you know
that the data isn't correct there before you send it. **Errors** are just mistakes in the data by some unknown
maginitude and at an unkown location.

## Galois Fields

Galois Field arithmetic is very important to the Reed-Solomon algorithms. All operations done are done in a Galois
field. 

The reason this is done is we can do addition, subtraction, multiplication, and division on binary numbers of length *s* and
always get back binary numbers of length *s*. In other words the numbers won't ever be larger than *s* bits in length.

To create a Galois Field with integers we can just do normal addition and multiplication operations and just mod by some prime
number to wrap them around.

Say x and y are integers and p is some prime number...
* x + y mod p is an integer
* x - y mod p is an integer
* x * y mod p is an integer
* x / y mod p is an integer

The division point is the interesting one. By using a prime number as the modulus, we ensure that for every pair of
integers x and y, there is some integer z such that y * z = x, so x / y = z will always have an answer.

So what we want to do is take this Galois Field and apply it to binary numbers. Lets say our goal is to have 8 bit
binary numbers, and to create a Galois Field so any operation will give us 8 bit binary numbers. This type of Galois
Field is represented as GF(2^8), where 2 is the **characteristic** of the field and 8 is the **exponent**.

For all the operations it may be benefitial to represent the binary number as a polynomial. This is done by treating
each bit as a coefficient in a polynomial.

![Galois Field Polynomial]({{ site.url }}/assets/images/galois_field_polynomial_01.png)

### Addition

say we want to add 5 + 6, or 0101 + 0110

![Galois Field Addition]({{ site.url }}/assets/images/galois_field_addition_01.png)

Since we are dealing with binary numbers, the coefficients of the polynomials are always modulo 2, so the 2 becomes a 0

An efficient way to do this in binary is to just XOR the two numbers

{% highlight raw %}
    0101
XOR 0110
--------
    0011
{% endhighlight %}

### Subtraction

Because we mod the coefficients by 2, -1 = 1, and subtractions is the same as addition.

![Galois Field Subtraction]({{ site.url }}/assets/images/galois_field_subtraction_01.png)

### Multiplication

For multiplication, we can continue converting to polynomials do the operation then convert back.

![Galois Field Multiplication]({{ site.url }}/assets/images/galois_field_multiplication_01.png)

Or we can use binary multiplication, replacing the addition with XOR's

{% highlight raw %}
          10001001
        x 00101010
        ----------
         10001001
       10001001
XOR  10001001
------------------
     1010001111010

1010001111010 = x^12 + x^10 + x^6 + x^5 + x^4 + x^3 + x
{% endhighlight %}

Now we have a problem because this binary number is larger than 8 bits.

With the integers we modded the numbers by some prime, so we will have to find the equivalent for polynomials.
We need an **irreducible polynomial** or **primitive polynomial** to serve as our mod number.

We will use 100011101 as this number. So we need to divide the polynomial by this number and find the remainder

An easy way to do this division is to line up the primitive polynomial with the number being reduced so the msb's line
up, and XOR. Then repeat until the number is less than 9 bits.

{% highlight raw %}
    1010001111010
XOR 100011101
-----------------
    0010110101010
  XOR 100011101
  ---------------
      00111011110
    XOR 100011101
    -------------
        011000011

1010001111010 mod 100011101 = 011000011
{% endhighlight %}

There is actually a more efficient way to multiplication in Galois Fields. 

The simplest operation is to multiply by 2, since the numbers are in binary, you just shift the bits left by 1, and
for any power of 2 you shift the bits left by that power. 
    
We can create some **generator number** (α = 00000010) that is equal to 2 in the Galois Field, and find all the powers
of it still in the field.

![Galois Field Alpha Powers]({{ site.url }}/assets/images/galois_field_multiplication_02.png)

If we find all the powers of this generator number from 0 to 255, or whatever the maximum power for the field is, we
will get all the numbers in the field.

In other words, every number in the Galois Field can be represented as some power of the generator number.

Then, if we convert the numbers before multiplying, it becomes much simpler.

![Galois Field Alpha Power Substitution]({{ site.url }}/assets/images/galois_field_multiplication_03.png)

So if we just keep a table of these α powers, we can do a quick lookup, some simple addition of the logarithm of the
numbers with α as a base, and easy multiplication.

### Division

Using the α trick explained in multiplication, division is as simple as subtracting the logarithms base α instead of
adding.

![Galois Field Division]({{ site.url }}/assets/images/galois_field_division_01.png)

## Encoding

Reed-Solomon encoding is very simple.

We take some message M, and break it into symbols, where if we use the Galois Field GF(2^8), the symbols are 8 bits
long. So M becomes M = (M1, M2, M3, ..., Mk) and Mi is a symbol. Then we can create a polynomial from these symbols.

![Message to Polynomial Form]({{ site.url }}/assets/images/rs_encoding_01.png)

It is important to realize that this polynomial is not the same as the previous ones. Each coefficient, Mi, of this
polynomial is some element of the Galois Field. From this point on we will be working with these polynomials where the
coefficients are elements of the Galois Field, so don't confuse them with the ones used in Galois Field arithmetic.

Now we need a **Generator Polynomial**. Again this is different from the generator number mentioned previously, but it is
built from that number. The generator polynomial is a irreducible polynomial, with roots that are powers of α.

![Generator Polynomial]({{ site.url }}/assets/images/rs_encoding_02.png)

2t is the number of parity symbols you want.

Now we take our message represented as a polynomial, and mod it by the generator polynomial, and we get our parity
bits. We just simply tack them on at the end of the message.

Usually you may want to add some buffer bits to the message so that it is a certain length. You can either just add on
0's, and either leave them when you send the message, or remove them and the receiver can tack them on before working
with the message.

## Decoding

There are some terms I need to define before going into the math of decoding the message.

* R(x) the received message polynomial (including parity bits)
* T(x) the uncorrupted sent message polynomial (including parity bits)
* E(x) the errors in the received message polynomial

These polynomials are just like the ones described in encryption, where the data is split up and each symbol is a
coefficient of the polynomial.

These polynomials relate such that...

![Decoding Polynomials]({{ site.url }}/assets/images/rs_decoding_01.png)

Ei is an *s* bit error value, and the power of the x determines the position this error happened at.

### Syndromes

We know that T(x) is divisible by the generator polynomial g(x), since we added the remainder of M(x) / g(x) to it.

This makes checking for errors very simple, just evaluate R(x) at each zero of g(x) and see if it is also a zero of
R(x). Because R(x) is divisible by g(x) the zeros of g(x) must be zeros of R(x).

The zeros of g(x) are also very easy to find since it is constructed so that the zeros are α^i for 1<=i<=2t

When we evaluate R(x) at each power of α, we get what is called a **Syndrome**.

![Syndrome Value]({{ site.url }}/assets/images/syndromes_01.png)

We also know that T(x) will evaluate 0 for every zero of g(x) so we can simplify the equation...

![Syndrome Value Simplified]({{ site.url }}/assets/images/syndromes_02.png)

So syndrome values are only dependent on the Error polynomial E(x)

Let's say that errors occur only at locations (e1, e2,...,ev) were ei corresponds to the power of x where the error is.
Then we can rewrite E(x) to only include these locations.

![Error Polynomial]({{ site.url }}/assets/images/syndromes_03.png)

Where Y1, Y2,..., Yv represent the error values at these locations.

If we evaluate α^i in this new E(x) we get

![Error Polynomial evaluating alpha]({{ site.url }}/assets/images/syndromes_04.png)

And to simplify we can define 

![Error Polynomial evaluating alpha simplified]({{ site.url }}/assets/images/syndromes_05.png)

We can take these functions and create a matrix defining each Syndrome based on the error locations and error values

![Syndrome Matrix]({{ site.url }}/assets/images/syndrome_matrix_01.png)

So we already know the values of the syndromes (S1, S2,...,S2t), and if we find the values of the error locations 
(X1, X2,...,Xv), we can solve for the error weights, which are (Y1, Y2,...,Yv).

### Error Locator Polynomial

The **Error Locator Polynomial** is a polynomial where the roots are the location of the errors in R(x).

![Error Locator Polynomial]({{ site.url }}/assets/images/error_locator_polynomial_04.png)

The goal then is to find the coefficients Λ1, Λ2,..., Λv.

We know that Xj^-1 is a zero of Λ(x). So we plug in Xj^-1 and get this function.

![Error Locator Polynomial zero]({{ site.url }}/assets/images/error_locator_polynomial_01.png)

Then we multiply both sides by YjXj^i+v. We can also find the summation of this function for all j's, which will still
be zero.

The point of doing this is, we can substitute the syndromes into the equation, which we already know.

![Error Locator Polynomial syndrome substitution]({{ site.url }}/assets/images/error_locator_polynomial_02.png)

Now we can convert this whole thing into matrix representation.

![Error Locator Polynomial matrix equation]({{ site.url }}/assets/images/error_locator_polynomial_03.png)

There is one problem with this, which is we may not know the number of errors that are in the message. In other words,
we don't know v.

We can find by with **Berlekamp's Algorithm**.

This algorithm starts with Λ(x) = 1, and at each stage an error value is calculated by substituting the approximate
coefficients for that value of v.

To start we have two functions, the syndromes, and two parameters.
* Λ(x) is the error locator polynomial
* C(x) is the correction polynomial
* S1, S2, ... S2t are the syndromes
* K is the step parameter
* L is the parameter used to track the order of equations

We initialize with
K = 1 L = 0 Λ(x) = 1 C(x) = x

then we calculate the error value e

![Berlekamp's Algorithm]({{ site.url }}/assets/images/berlekamp_algorithm_01.png)

What this algorithm does is it starts with a potential Λ(x) which is C(x) and L as the order of C(x), and over time
increases L so that

![Berlekamp's Algorithm Goal]({{ site.url }}/assets/images/berlekamp_algorithm_02.png)

And it tries to find the smallest L possible.

So if we have error's instead of erasures (meaning we don't know how many or where they are) we can use Berlekamp's
Algorithm to find v, and then construct the matrix equation shown above in order to solve for Λ1, Λ2,..., Λv.

Then once we have the error locator polynomial coefficients, we can solve for it's roots, X1^-1, X2^-2,..., Xv^-1.

Then going all the way back to the first matrix equation that looked like this.

![Syndrome Matrix]({{ site.url }}/assets/images/syndrome_matrix_01.png)

We have everything but Y1, Y2,..., Yv. We can simply use  matrix inverse to solve for these though.

Plugging every thing together, we can solve for E(x)

![E(x) polynomial]({{ site.url }}/assets/images/error_polynomial_01.png)

Then we simply subtract E(x) from R(x) and get T(x), the original message.

### Farney's Algorithm

The **Farney Algorithm** is a more efficient way to solve for Y1, Y2,..., Yv. It does not require calculating the matrix
inverse.

To do it we need an additional polynomial called the **Error Magnitude Polynomial** Ω(x).

![Error Magnitude Polynomial]({{ site.url }}/assets/images/farney_algorithm_01.png)

We mod by x^2t in order to truncate the magnitude polynomial to the last 2t elements. S(x) is the **Syndrome
Polynomial** where the coefficients are the Syndromes for R(x).

The derivative of the Error Locator Polynomial evaluated at Xj^-1 is different than the normal derivative, because we are working with
Galois Field polynomials.

![Error Locator Polynomial Derivative]({{ site.url }}/assets/images/farney_algorithm_02.png)

We can simply set even powered terms to 0 and divide through by Xj^-1.

With this derivative and the error magnitude polynomial, we can solve for the error values Y1, Y2,..., Yv, with this
equation.

![Farneys Algorithm]({{ site.url }}/assets/images/farney_algorithm_03.png)

This equation won't work for position's that don't have errors, so we need to still find these positions first, but this
equation is faster than the matrix inverse we would have to do otherwise.
