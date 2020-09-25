---
type: blog
title: "Alternatives to Proof of Work: Part 1"
slug: alternatives-to-proof-of-work-1
date: 2017-06-11
tag:
- cryptography
- cryptocurrencies
author: matthewroseman
description: Are there any useful alternatives to just pure Proof of Work in blockchain consensus
---

## Table of Contents

- [What is Blockchain Consensus](#what-is-blockchain-consensus)
- [Proof of Work](#proof-of-work)

## What is Blockchain Consensus

A blockchain can be thought of as a community driven ledger for a cryptocurrency. It logs every transaction and keeps
track of who has how many "coins". These ledgers are broken into blocks, each block pointing back to the previous one.
As of March 29, 2017 [the average number of transactions per block is about
2000](https://blockchain.info/charts/n-transactions-per-block).

![blockchain](./bitcoin-block-chain-small.png)

Now these blocks, before being commited to the chain, must be approved. Since there is no central authority, this must
be done through a group consensus. Obviously there must be some way to hold people accountable to checking transactions
honostly, and not trying to approve bad or perhaps malicious transactions.

As an example scenario without some checks and balances:
- Alice has 1 btc
- Alice buys something from Bob and gives him that 1 btc
- Quickly Alice also buys something from Eve and gives her that 1 btc
- Alice then approves the block that these transactions are both a part of, and she successfully spends her 1btc 2
times

The above is an example of what's called [Double Spending](https://en.wikipedia.org/wiki/Double-spending).

A naive solution to this problem is to require a certain number of people to approve blocks. Although an easy attack
would be to create many false identities, all of whom approve the block your transaction is in. This is called the
[Sybil Attack](https://en.wikipedia.org/wiki/Sybil_attack).

Many of the following consensus protocols are based off of this naive solution, but they add on a cost to approving
blocks, so that a single person can't freely create new identities. With this cost there must be some kind of award, in
order to incentivize people to approve blocks. This reward is usually some of the networks cryptocurrencies, either
taken from transaction fees, or created from scratch.

---

## Proof of Work

### Overview

One method to prevent users from using multiple fake identities on the network in order to approve their bad
transactions is to include some sort of cost to approving. The basic idea of proof of work is to force users to do
some amount of computational work before they can sign off on a block. A malicious user can easily fake multiple
identities, but they cannot fake computational work.

The basic proof of work algorithm bitcoin uses is based off of a similar algorithm called
[hashcash](ftp://sunsite.icm.edu.pl/site/replay.old/programs/hashcash/hashcash.pdf). Some key elements of both bitcoins
algorithm and the hashcash algorithm is that they are:
1. **publicly auditable** - anyone can check the result of the proof of work to see that it is correct
2. **non-interactive** - the server doesn't need to issue some challenge to the user. The user picks the challenge
   themselves
3. **trapdoor free** - there is no known solution to the challenge beforehand
4. **unbounded probabalistic cost** - It could theoretically take forever to solve the challenge

Bitcoin's proof of work algorithm is based on the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hashing algorithm. You
are given a block of transactions, and after making sure that every transaction is possible given the previous blocks,
you create a header for this block. This header consists of...
1. **Version**
2. **Hash of previous block's header**
3. **Hash of all transactions in current block**
4. **Current timestamp**
5. **Current target** (explained later)
5. **Nonce** (explained later)

Now your goal is to find a hash of this header, that is less than a certain target number. The only values that you can
change is the 32 bit nonce at the end. Normally you would start with a nonce of 0 and increment every try, but it
doesn't really matter.

Since SHA-256 is a one way function, meaning you can't work backwards from a hash to a particular starting number, and
there is no way to predict what you are going to get until you calculate it, the only way to try and find a nonce that
produces a hash below the target is by brute force. Once you do find a correct nonce that produces a hash below the
target number, you can broadcast the block with the correct header, and receive your payment. 

There must be some way to incetivize people to confirm that transactions are valid, and this is done by paying them in
bitcoin every time they successfuly confirm a block. These bitcoins come from transaction fees, and are created out of
thin air. This is how the network of bitcoin grows.

The target value is a result of an algorithm based on previous blocks time to mine, and the goal is to mine a block
every 10 minutes. So as computers get more powerful the target number can get smaller and smaller, making a successful
hash harder and harder to find.

### Pros
- So far proof of work has been the best method for preventing attacks on the blockchain, and many other algorithms
   build off of proof of work, keeping the core details.
- Proof of work is easily paralleled, meaning many people can work together at solving the hashing problems. This means
   someone with not as many resources is able to participate.

### Cons
- With ASIC's (Application Specific Integrated Circuits) the cost of mining bitcoin is only viable with special
   machines specifically designed to perform SHA256 hash calculations and nothing else. This increases the barrier of
   entry into mining bitcoins.
- Bitcoin mining has a very large energy footprint. There is a debate on whether the amount of
   computational power going into mining bitcoin is a waste, some say there is nothing useful created from these hash
   computations, while others say that the defence against Sybil attacks is something useful.
