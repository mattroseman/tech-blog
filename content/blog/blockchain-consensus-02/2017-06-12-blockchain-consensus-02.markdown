---
type: blog
title: "Alternatives to Proof of Work: Part 2"
slug: alternatives-to-proof-of-work-2
date: 2017-06-12
tag:
- cryptography
- cryptocurrencies
author: matthewroseman
description: Are there any useful alternatives to just pure Proof of Work in blockchain consensus
---

## Table of Contents

- [Proof of Statke](#proof-of-stake)
- [Proof of Burn](#proof-of-burn)

## Proof of Stake

### Overview

Unlike proof of work where users must compete each other for the chance to approve a block, proof of stake pseudo
randomly chooses the validators. Each member of the network has some measure of stake in the network, and then ideally
that person is chosen to validate a proportionate amount to their stake. So if you own 10 percent of a networks
currency, you should validate 10 percent of its transactions.

Usually in proof of stake systems there is a set number of coins in existance, and the validators that forge (called
forged or minted instead of mined in proof of stake systems) blocks only get the transaction fees. There is a much lower
cost to validating blocks, so the lower payoff is not a detriment to the system.

The measure of a validators stake in the network isn't always as simple as how much value they hold. In order to prevent
the richest member from having all the power some other factors are considered. One factor is age of the coins held, so
the longer a validator holds on to coins the more stake they have in the system. Usually coin age would be reset after
the validator is chosen to validate a block.

One downside to proof of stake, is that validators don't really lose anything by confirming blocks. There is no
computational energy consumed, so there is no reason not to try and validate every current fork. This is called the
**nothing at stake** problem.

![nothing at stake](./nothing-at-stake.png "Left fork has probability of 0.9 of becoming the main fork, and right has 0.1")

This can prevent a blockchain from ever theoretically reaching consensus. In proof of work, a validator has incentive to
put their energy towards the fork that is has the most blocks and is most likely to become the true fork and give them a
reward. If they split their energy they have a lot less likely chance of finding the correct hash and earning the
bitcoins.

One solution is to penalize validators for validating conflicting blocks by taking away some money. This then makes it
economicaly sensible to only work on one chain, and the chain with the highest probability makes the most sense.

Another solution is to penalize validators for validating on the wrong chain. So like proof of work, it only makes sense
to validate blocks on the chain with highest probability of succeeding.

### Pros

- Does not consume large amounts of electricity to operate.
- Because of lower energy cost to validate, reward can be much lower.
- Reduced centralization risk. If you have 20x the amount of currency then you should get 20x the amount of revenue from
validating blocks. In proof of work you could exponentially scale up by buying new ASIC machines and growing your mining
farm.
- Those validating transactions are also those who own coins, so they may have more incentive to be honest.

### Cons

- While nothing at stake has some proposed solutions, there are still arguments that attacks are possible, and that
security is lower in proof of stake systems.
- There are greater barrier of entries to forging in proof of stake systems, since you must buy some amount of coins in
order to participate.

## Proof of Burn

### Overview

This system's cost to verify is to *"burn"* coins. Some amount of coins must be sent to some account confirmed to not be
spendeble from, and then they are able to verify a block. Like proof of work some asset is being consumed, but in this
system there is no cost of electricity.

Proof of Burn is designed to burn a cryptocurrency of another system, usually a proof of work system. This can be used
as a way to incentivize a transition from one cryptosystem to another. Although this means that the ultimate source of
the burned assets is still electricity.

It makes sense to require the burning of some cryptocurrency to occur some time before the transaction validation time.
Since blockchains can fork and aren't always set in stone right away, it makes sense to require a validator to have
their burning transaction set in stone before they get the right to validate transactions.

The idea of verifiably unspendable addresses is interesting though. A bitcoin address is a representation of a public
key gotten through a hashing algorithm. There are valid and invalid addresses, and it is likely that an unspendable
address is still valid, as it may be difficult to send coins to an invalid address. So the main idea is to take an
invalid public key and convert it into the valid address. Now money can be sent to this address no problem, since no
client can determine that it was created with an invalid public key, however, no coins can be transfered out of this
address because doing so requires a signature with a private key. This is impossible because the public and private keys
are invalid.

A validator must also publish the public key number they used, in order for others to find the cooresponding bitcoin
address and confirm that it is indead invalid.

Usually people will use a [*nothing up my sleeve number*](https://en.wikipedia.org/wiki/Nothing_up_my_sleeve_number) as
their invalid public key. These numbers are something like all 0's or the first n digits of pi. They are special in that
they are publicly recognizable, and their purpose is to assure the public that you aren't trying to game the system with
some special number with some property that allows you to cheat.

### Pros
- This system can be used to jumpstart a new cryptocurrency off of another.
- There is no imediate consumption of energy to validate blocks, and theoretically it could burn coins from a non
proof of work system, although this has not been done.

### Cons
- One could argue that this system is just proof of work with extra steps. It burns a proof of work cryptocurrency, wich
means that the work going into mining this currency still occurs.

