---
layout: post
title: "Kerberoasting Notes"
description: "Conceptual notes on Kerberoasting in Active Directory, with detection and defense."
date: 2026-06-11
tags: [active-directory, kerberos, pentesting]
---

Kerberoasting is a well-known technique against Active Directory that abuses a legitimate
feature of the Kerberos protocol. These notes are **conceptual and defensive**: they
explain the mechanism and, above all, how to detect and mitigate it.

## The protocol, briefly

In Kerberos, when a user wants to access a service it requests a **Service Ticket (TGS)**
from the KDC. Part of that ticket is encrypted with the key derived from the password of
the service account tied to the **SPN** (Service Principal Name).

The key point: any authenticated domain user can request a TGS for any SPN. The KDC does
not check whether that user should use the service — that authorization happens later, at
the service itself.

## Why it matters for defense

Because part of the ticket is encrypted with a key derived from the service account
password, a **weak password** becomes exposed to an offline dictionary attack. The whole
risk surface depends on password strength and the configured encryption type.

## Detection

Useful signals for the blue team, without any offensive steps:

- **Event ID 4769** (TGS request) with encryption type `0x17` (RC4-HMAC), which is weak
  and often indicative when most of the domain uses AES.
- A single principal requesting TGS for **many distinct SPNs** in a short window.
- TGS requests for service accounts that are rarely used interactively.

```text
# Conceptual SIEM query (not attack code)
EventID = 4769
  AND TicketEncryptionType = 0x17     # RC4
  AND ServiceName != "krbtgt"
GROUP BY AccountName HAVING distinct(ServiceName) > threshold
```

## Mitigations

| Control                         | Effect                                          |
| ------------------------------- | ----------------------------------------------- |
| **gMSA** accounts               | Long, random, automatically rotated passwords   |
| Disable RC4, enforce AES        | Removes the weak encryption type                |
| Long (25+) service passwords    | Makes offline cracking impractical              |
| Monitor anomalous 4769          | Early detection                                 |

The best defense is structural: use **Group Managed Service Accounts**. They take the
password out of human hands and rotate it automatically, neutralizing the premise of the
attack. MITRE ATT&CK tracks this technique as **T1558.003**.
