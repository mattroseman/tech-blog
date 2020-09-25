---
type: blog
title: Bitcoin Scripts
slug: bitcoin-scripts
date: 2018-01-10
tag:
- cryptography
- cryptocurrencies
author: matthewroseman
description: How bitcoin uses scripts and what an unspendable account is
---

### Table of Contents 
- [Overview](#overview)
- [Opcodes](#opcodes)
- [Standard Transaction](#standard-transaction)
- [Burning Coins](#burning-coins)
- [Puzzles](#puzzles)

## Overview

In this post, I wish to describe a feature of bitcoin I wasn't immediately aware of until I started reading about
Ethereum. Bitcoin comes with the feature of adding scripts that determine if some amount of coins are spendible.

Lets say Alice gives Bob 1 btc. In the transaction there is a script that must be executed and return True before Bob
can spend that bitcoin. Normally the script will simply ask that bob sign the previous transaction (the one from Alice
to Bob), and provide his public key. This ensures that the person Alice gives the bitcoin to is the one spending it. But
there is a lot more you can do with these spending requirements.

Alice could perform a transaction to Bob and require Bob's signature and a third parties signature before Bob spends the
bitcoin. Or there could be no requirement, and anyone could spend the bitcoin.

In a previous post I talked about proof of burn, and how that involves sending some cryptocurrency to an **unspendable**
account. These scripts would be used to "burn" some bitcoin. You could have a script just automatically return false, or
maybe it adds 2 + 2 and only allows the coins to be spent if the result is 8. Once a transaction is executed with an
impossible script attached the coins are considered burned or stuck forever in the receiving account.

Etherum has built on this idea, and created a more built out language than the primitive scripting operators bitcoin
provides. This allows for more complicated tasks to be performed for Ether to be spent, and also allows the scripts to
access some outside data, leading to more uses.

## Opcodes

The building blocks of these scripts are the opcodes bitcoin provides. Under the hood these exist as bytes assigned
specific meanings, and perform simple tasks like loading data onto the stack, comparing values, and returning True or
False.

A full list of the opcodes can be found on the [bitcoin wiki](https://en.bitcoin.it/wiki/Script) (as well as a more
indepth description of how scripting works). 

A simple example is **OP_0** or **OP_FALSE**. These opcodes do the same thing and simply push an empty array of bytes to
the stack. The stack is where data is manipulated in this environment. A lot of opcodes will look at the top of the
stack and perform some function based on what is there.

Constants can be added to the stack through **OP_PUSHDATA1**, **OP_PUSHDATA2**, and **OP_PUSHDATA4**. These look to the
next 1, 2, or 4 bytes to get the length of the constant in bytes, and then adds the next specified length of bytes to the
stack. So if you had a script that said 

```
OP_PUSHDATA1 <0x01> <0x2A>`
```

it would see **OP_PUSHDATA1**, look to the next byte constant to see how much data it's going to push to the stack and see
0x01 or one byte, then it would push 0x2A to the stack, which is **00101010** in binary.

## Standard Transaction

If you want to transfer some amount of bitcoin from your account to another and only want to allow the receiver to
spend the bitcoin, then you would use this standard script.

First some opcodes that need explaining.

- **OP_DUP** - duplicates the top stack item, and adds both to the stack.
- **OP_HASH160** - the top stack value is hashed twice, first with *SHA-256* then with *RIPEMD_160*, then readded to the
stack
- **OP_EQUAL** - adds true to the stack if the two top stack items are equal, false if they aren't
- **OP_VERIFY** - if top stack item is not true, then the script fails. Also removes the top stack item
- **OP_EQUALVERIFY** - performs **OP_EQUAL** and then **OP_VERIFY** in succession. So if the two top stack values are
equal, it continues the script. Otherwise the script fails.
- **OP_CHECKSIG** - Takes a signature of all the transaction data, and the public key used for that signature, and
confirms the public key matches the private key used to sign the data.

So the standard transaction looks like the following. 

(On the bitcoin wiki, and here, some opcodes that push constants to
the stack are omitted. So any point that has \<data\> implies there is an appropriate **OP_PUSHDATA1** before it.)

```
scriptPubKey: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
```
```
scriptSig: <sig> <pubkey>
```

**scriptPubKey** is the part of the script the sender adds, and **scriptSig** is what the receiver adds.
The script always executes the **scriptSig** part first, and then **scriptPubKey** second.

So if Alice sends Bob some bitcoin, the transaction will include the **scriptPubKey** data, and Bob will add the
**scriptSig** parts, and they will be combined and executed.

For \<sig\>, Bob would take all the transaction data, hash it, and then sign it using his private key.

For \<pubkey\>, Bob would just use his public key.

For \<pubKeyHash\>, Alice would use the hash of Bob's public key.

The combined script looks like this.

```
<sig> <pubkey> OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OPCHECKSIG
```

Here is a breakdown of what the stack looks like while this script executes

- First two constants are pushed to the stack.

```
<pubkey>
<sig>
```

- **OP_DUP** duplicates the top stack item

```
<pubkey>
<pubkey>
<sig>
```

- **OP_HASH160** hashes the top stack item.

```
<pubHashA>
<pubkey>
<sig>
```

- \<pubKeyHash\> is pushed to the stack.

```
<pubKeyHash>
<pubHashA>
<pubkey>
<sig>
```

- **OP_EQUALVERIFY** checks to see if the public key given matches the destination of the transaction. Fails if they
   don't match. (At this point, we know that the public key used to create \<sig\> is the same public key the bitcoins
   were sent to)

```
<pubkey>
<sig>
```

- **OP_CHECKSIG** checks to see if the given signature was made using the correct transaction data, and with the given
   public key. (Now we know that the person spending these bitcoins has the corresponding private key to the public key
   of this address)

```
true
```

## Burning Coins

So what if you wanted to send some coins to an address and make them unspendable. This is useful if you want to burn the
coins, maybe for a proof-of-burn protocol to convert the coins into another cryptocurrency.

You would just make the **scriptPubKey** this.

```
OP_RETUR
```

The bitcoin wiki points to this
[transaction](https://blockexplorer.com/tx/eb31ca1a4cbd97c2770983164d7560d2d03276ae1aee26f12d7c2c6424252f29) as an
example of unspendable coins.

When someone mines this transaction, the coins are not added to the UTXO set. This is a set of all unspent transaction
outputs. These coins don't have the potential to be spent, so they aren't considered "unspent".

By making sure the **scriptPubKey** is executed last, no matter what the **scriptSig** is, it will always end with
**OP_RETURN** ensuring the scirpt fails.

## Puzzles

One potential use of these scripts is to hold some coins in an account, and only allow them to be spent if some puzzle
is solved. The **scriptPubKey** would specify the puzzle, and the **scriptSig** would have to put some data on the
stack, that causes the **scriptPubKey** to succeed by leaving true on the stack.

There are some limitations with what you can do with the given opcodes, but a simple example would be to find the source
of a hash. Again the bitcoin wiki points to an example of this
[transaction](https://blockexplorer.com/tx/a4bfa8ab6435ae5f25dae9d89e4eb67dfa94283ca751f393c1ddc5a837bbc31b).

The **scriptPubKey** looks like this

```
OP_HASH256 <6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000> OP_EQUAL
```

So to spend these coins, you must create a **scriptSig** that puts some number on the stack, that when hashed with
SHA-256, results in the given constant. Anyone is able to try this puzzle, and if they come up with a **scirptSig** that
causes the **scriptPubKey** to succeed, then they get the bitcoins at this address.
